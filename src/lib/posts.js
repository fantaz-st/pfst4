// Pure post helpers, safe in client components (no data fetching here —
// that lives in lib/news.js).

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
