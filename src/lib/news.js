import { wpFetch } from "./wp";
import { NEWS_TAXONOMIES, FEATURED_CATEGORY_TRANSLATION } from "./queries";
import { DEFAULT_LANGUAGE, toLanguageCodeEnum } from "./language";

export const FEATURED_CATEGORY_SLUG = "istaknuto";

const LOCALE_BY_LANGUAGE = { hr: "hr-HR", en: "en-GB" };
const FALLBACK_CATEGORY_LABEL_BY_LANGUAGE = { hr: "Bez kategorije", en: "Uncategorized" };

function getLocale(language) {
  return LOCALE_BY_LANGUAGE[language] ?? LOCALE_BY_LANGUAGE[DEFAULT_LANGUAGE];
}

export function getFallbackCategoryLabel(language = DEFAULT_LANGUAGE) {
  return FALLBACK_CATEGORY_LABEL_BY_LANGUAGE[language] ?? FALLBACK_CATEGORY_LABEL_BY_LANGUAGE[DEFAULT_LANGUAGE];
}

export async function getNewsTaxonomies(language = DEFAULT_LANGUAGE) {
  const data = await wpFetch(
    NEWS_TAXONOMIES,
    { language: toLanguageCodeEnum(language) },
    { tags: ["wp"] },
  );

  const categories = (data?.categories?.nodes ?? []).filter(
    (category) => category.slug !== FEATURED_CATEGORY_SLUG,
  );
  // Terms WPGraphQL reports as count: null carry zero posts.
  const ciljevi = (data?.ciljevi?.nodes ?? []).filter((term) => term.count);

  return { categories, ciljevi };
}

// Returns the slug of the "featured" category for a language, or null when
// that language has no such term yet (true for every language but hr today
// — see the comment on FEATURED_CATEGORY_TRANSLATION).
export async function getFeaturedCategorySlug(language = DEFAULT_LANGUAGE) {
  if (language === DEFAULT_LANGUAGE) return FEATURED_CATEGORY_SLUG;

  const data = await wpFetch(
    FEATURED_CATEGORY_TRANSLATION,
    { language: toLanguageCodeEnum(language) },
    { tags: ["wp"] },
  );
  return data?.category?.translation?.slug ?? null;
}

export function getPostCategories(post) {
  return (post.categories?.nodes ?? []).filter(
    (category) => category.slug !== FEATURED_CATEGORY_SLUG,
  );
}

export function getPrimaryCategory(post) {
  return getPostCategories(post)[0] ?? null;
}

export function buildNewsWhere({ categorySlug, ciljeviSlugs, language = DEFAULT_LANGUAGE } = {}) {
  const where = { language: toLanguageCodeEnum(language) };

  if (categorySlug) {
    where.categoryName = categorySlug;
  }

  if (ciljeviSlugs?.length > 0) {
    where.taxQuery = {
      taxArray: [{ taxonomy: "CILJ", terms: ciljeviSlugs, field: "SLUG" }],
    };
  }

  return where;
}

export function groupPostsByDay(posts) {
  const groups = [];
  const byKey = new Map();

  for (const post of posts) {
    const date = new Date(post.date);
    const key = date.toISOString().slice(0, 10);
    let group = byKey.get(key);
    if (!group) {
      group = { key, date, posts: [] };
      byKey.set(key, group);
      groups.push(group);
    }
    group.posts.push(post);
  }

  return groups;
}

export function formatDayLabel(date, language = DEFAULT_LANGUAGE) {
  return new Intl.DateTimeFormat(getLocale(language), {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatTimeLabel(date, language = DEFAULT_LANGUAGE) {
  return new Intl.DateTimeFormat(getLocale(language), {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
