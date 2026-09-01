// One-off migration helper: diffs old-routes.txt (URLs from the pfst3/legacy
// site) against every URI WPGraphQL currently serves, so we know which old
// paths still need a home. Read-only apart from writing this script.
//
// Usage: node scripts/route-diff.mjs

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadEnv(path.join(__dirname, "..", ".env"));

const { wpFetch } = await import("../src/lib/wp.js");
const { ALL_CONTENT_URIS } = await import("../src/lib/queries.js");

const OLD_ROUTES_FILE = path.join(__dirname, "..", "old-routes.txt");

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

// Strips query/hash and a trailing slash so "/foo/" and "/foo" compare equal.
// The bare root always normalises to "/".
function normalize(rawPath) {
  if (!rawPath) return "/";
  let p = rawPath.trim().split("?")[0].split("#")[0];
  if (!p.startsWith("/")) p = "/" + p;
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p || "/";
}

async function collectNewNodes() {
  const nodes = [];
  let after = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const data = await wpFetch(ALL_CONTENT_URIS, { first: 100, after });
    if (!data) break;

    for (const node of data.contentNodes.nodes) {
      nodes.push({ uri: normalize(node.uri), contentTypeName: node.contentTypeName });
    }
    hasNextPage = data.contentNodes.pageInfo.hasNextPage;
    after = data.contentNodes.pageInfo.endCursor;
  }

  return nodes;
}

function readOldRoutes() {
  const content = readFileSync(OLD_ROUTES_FILE, "utf8");
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map(normalize);
}

// Words from every path segment, further split on hyphens, so
// "/fakultet/opcenito/misija-vizija" -> [fakultet, opcenito, misija, vizija].
function tokenize(uriPath) {
  return uriPath
    .toLowerCase()
    .split(/[/-]/)
    .filter(Boolean);
}

// Dice coefficient over the token multisets: 2 * overlap / (|A| + |B|).
// Cheap, dependency-free, and good enough for a human-reviewed guess.
function similarity(tokensA, tokensB) {
  if (tokensA.length === 0 || tokensB.length === 0) return 0;

  const countsB = new Map();
  for (const t of tokensB) countsB.set(t, (countsB.get(t) || 0) + 1);

  let overlap = 0;
  for (const t of tokensA) {
    const remaining = countsB.get(t) || 0;
    if (remaining > 0) {
      overlap++;
      countsB.set(t, remaining - 1);
    }
  }

  return (2 * overlap) / (tokensA.length + tokensB.length);
}

function bestMatch(oldPath, newUris) {
  const oldTokens = tokenize(oldPath);
  let bestUri = null;
  let bestScore = 0;

  for (const uri of newUris) {
    const score = similarity(oldTokens, tokenize(uri));
    if (score > bestScore) {
      bestScore = score;
      bestUri = uri;
    }
  }

  return { uri: bestUri, score: bestScore };
}

function printList(title, items) {
  console.log(`\n=== ${title} (${items.length}) ===`);
  for (const item of items) console.log(item);
}

async function main() {
  process.stderr.write("Paging through ALL_CONTENT_URIS...\n");
  const newNodes = await collectNewNodes();
  process.stderr.write(`Found ${newNodes.length} live URIs.\n`);

  const allOld = readOldRoutes();

  // Placeholder patterns like /novosti/[slug] describe a route shape, not a
  // concrete old URL — there's nothing to look up or redirect, so they're
  // reported separately instead of polluting the matched/unmatched diff.
  const dynamic = allOld.filter((p) => p.includes("["));
  const staticOld = allOld.filter((p) => !p.includes("["));

  const newUriSet = new Set(newNodes.map((n) => n.uri));
  const matched = staticOld.filter((p) => newUriSet.has(p));
  const unmatched = staticOld.filter((p) => !newUriSet.has(p));

  // Legacy static routes map onto new static Pages, not individual News
  // posts (the /novosti/[slug] pattern is already excluded above) — matching
  // against 150+ post slugs produced noisy, semantically meaningless hits.
  const pageUris = newNodes.filter((n) => n.contentTypeName === "page").map((n) => n.uri);

  if (dynamic.length > 0) {
    console.log(
      `\n=== SKIPPED dynamic route patterns (${dynamic.length}) — per-item routes, not concrete paths ===`,
    );
    for (const p of dynamic) console.log(p);
  }

  printList("UNMATCHED old paths (need a redirect or a new WP page)", unmatched);
  printList("MATCHED exactly", matched);

  console.log(
    `\n=== Suggested next.config.mjs redirects() array (${unmatched.length} entries) ===`,
  );
  console.log("// Guessed by slug/word similarity — review every line before using.");
  console.log("const redirects = [");
  for (const oldPath of unmatched) {
    const { uri, score } = bestMatch(oldPath, pageUris);
    if (uri && score > 0) {
      console.log(
        `  { source: "${oldPath}", destination: "${uri}", permanent: false }, // similarity ${score.toFixed(2)}`,
      );
    } else {
      console.log(
        `  { source: "${oldPath}", destination: null, permanent: false }, // TODO: no close match found`,
      );
    }
  }
  console.log("];");
}

main();
