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

/**
 * Live results for the header search layer (SearchOverlay):
 * GET /api/search?q=…&lang=hr|en → { pages: [{ title, uri, path }], posts: [{ title, uri, date }] }
 * The full result list stays on /pretraga and /en/search.
 */
export async function GET(request) {
  const params = new URL(request.url).searchParams;
  const query = (params.get("q") ?? "").trim().slice(0, 80);
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
