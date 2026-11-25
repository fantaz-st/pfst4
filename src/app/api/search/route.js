import { wpFetch } from "@/lib/wp";
import { SEARCH_PREVIEW } from "@/lib/queries";
import { toLanguageCodeEnum } from "@/lib/language";

const FIRST = 5;
const EMPTY = { pages: [], posts: [] };

// WPGraphQL returns rendered titles (wptexturize entities like &#8211;).
function decode(value = "") {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

// Per-IP limit so a script can't turn this endpoint into a WordPress search
// flood. The overlay debounces typing (250 ms), so a person stays far below
// it. In memory, so it holds per serverless instance — a brake, not a wall;
// a Vercel Firewall rate-limit rule on /api/search is the hard limit.
const WINDOW_MS = 10_000;
const MAX_PER_WINDOW = 20;
const MAX_TRACKED = 5000;
const hits = new Map();

function limited(request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
  const now = Date.now();
  if (hits.size > MAX_TRACKED) {
    for (const [key, entry] of hits) if (now - entry.start > WINDOW_MS) hits.delete(key);
  }
  const entry = hits.get(ip);
  if (!entry || now - entry.start > WINDOW_MS) {
    hits.set(ip, { start: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

/**
 * Live results for the header search layer (SearchOverlay):
 * GET /api/search?q=…&lang=hr|en → { pages: [{ title, uri, path }], posts: [{ title, uri, date }] }
 * The full result list stays on /pretraga and /en/search.
 */
export async function GET(request) {
  if (limited(request)) {
    return Response.json(EMPTY, { status: 429, headers: { "Retry-After": String(WINDOW_MS / 1000) } });
  }

  const params = new URL(request.url).searchParams;
  // Lowercased and single-spaced (WordPress search ignores both), so
  // "Upisi", "upisi " and "UPISI" share one cache entry.
  const query = (params.get("q") ?? "").toLowerCase().replace(/\s+/g, " ").trim().slice(0, 80);
  const language = params.get("lang") === "en" ? "en" : "hr";
  if (query.length < 2) return Response.json(EMPTY);

  const where = { search: query, language: toLanguageCodeEnum(language) };
  const data = await wpFetch(
    SEARCH_PREVIEW,
    { first: FIRST, pageWhere: where, postWhere: where },
    { tags: ["wp"] },
  );
  if (!data) return Response.json(EMPTY);

  const pages = (data.pages?.nodes ?? []).map((page) => {
    const parent = page.parent?.node;
    const grandparent = parent?.parent?.node;
    return {
      title: decode(page.title),
      uri: page.uri,
      path: [grandparent?.title, parent?.title].filter(Boolean).map(decode).join(" / "),
    };
  });
  const posts = (data.posts?.nodes ?? []).map((post) => ({
    title: decode(post.title),
    uri: post.uri,
    date: post.date,
  }));

  return Response.json({ pages, posts });
}
