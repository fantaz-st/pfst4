// One-off inventory: tallies every Gutenberg block name in use across
// WordPress, including nested innerBlocks, with example URIs. Read-only.
//
// Usage: node scripts/block-inventory.mjs

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadEnv(path.join(__dirname, "..", ".env"));

const { wpFetch } = await import("../src/lib/wp.js");
const { ALL_CONTENT_URIS, NODE_BY_URI } = await import(
  "../src/lib/queries.js"
);

const CONCURRENCY = 8;

function loadEnv(filePath) {
  const content = readFileSync(filePath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

async function collectUris() {
  const uris = [];
  let after = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const data = await wpFetch(ALL_CONTENT_URIS, { first: 100, after });
    if (!data) break;

    uris.push(...data.contentNodes.nodes.map((node) => node.uri));
    hasNextPage = data.contentNodes.pageInfo.hasNextPage;
    after = data.contentNodes.pageInfo.endCursor;
  }

  return uris;
}

function walk(blocks, uri, tally) {
  if (!blocks) return;

  for (const block of blocks) {
    let entry = tally.get(block.name);
    if (!entry) {
      entry = { count: 0, examples: [] };
      tally.set(block.name, entry);
    }
    entry.count++;
    if (entry.examples.length < 3 && !entry.examples.includes(uri)) {
      entry.examples.push(uri);
    }

    if (block.innerBlocks) {
      walk(block.innerBlocks, uri, tally);
    }
  }
}

async function runPool(items, worker) {
  let index = 0;
  async function next() {
    while (index < items.length) {
      const current = index++;
      await worker(items[current], current);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, next));
}

async function main() {
  process.stderr.write("Paging through ALL_CONTENT_URIS...\n");
  const uris = await collectUris();
  process.stderr.write(`Found ${uris.length} pages/posts.\n`);

  const tally = new Map();
  let done = 0;
  let failed = 0;

  await runPool(uris, async (uri) => {
    const data = await wpFetch(NODE_BY_URI, { uri });
    const node = data?.nodeByUri;
    if (node?.blocks) {
      walk(node.blocks, uri, tally);
    } else {
      failed++;
    }
    done++;
    if (done % 50 === 0 || done === uris.length) {
      process.stderr.write(`  ${done}/${uris.length} fetched\n`);
    }
  });

  if (failed > 0) {
    process.stderr.write(`Warning: ${failed} URIs returned no blocks.\n`);
  }

  const rows = [...tally.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .map(([name, { count, examples }]) => ({
      block: name,
      count,
      examples: examples.join(", "),
    }));

  console.table(rows);
}

main();
