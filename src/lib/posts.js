// Pure post helpers, safe in client components (no data fetching here —
// that lives in lib/wp/news.js).

// "istaknuto" is a flag, not a topic (CLAUDE.md): it's never shown as a
// post's category label.
export const FEATURED_CATEGORY_SLUG = "istaknuto";

const FALLBACK_CATEGORY_LABEL = { hr: "Bez kategorije", en: "Uncategorized" };

export function getFallbackCategoryLabel(language = "hr") {
  return FALLBACK_CATEGORY_LABEL[language] ?? FALLBACK_CATEGORY_LABEL.hr;
}

// The post's real categories, without the "istaknuto" flag.
export function getPostCategories(post, featuredSlug = FEATURED_CATEGORY_SLUG) {
  const featuredSlugs = new Set([FEATURED_CATEGORY_SLUG, featuredSlug]);
  return (post.categories?.nodes ?? []).filter(
    (category) => !featuredSlugs.has(category.slug),
  );
}

// The news archive per language (static routes, not WordPress pages).
export const NEWS_ARCHIVE_URI = { hr: "/novosti/", en: "/en/news/" };

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", hellip: "…", ndash: "–", mdash: "—" };

// WordPress excerpt (HTML, "[…]" read-more marker) → plain text.
export function excerptText(html) {
  return (html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&([a-z]+);/gi, (match, name) => ENTITIES[name.toLowerCase()] ?? match)
    .replace(/\[\s*…\s*\]|\[\s*\.\.\.\s*\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// "Novo" label: published within the last `days` days.
export function isRecentPost(date, days = 14) {
  return Date.now() - new Date(date).getTime() < days * 24 * 60 * 60 * 1000;
}
