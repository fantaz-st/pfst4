import { wpFetch } from "./wp";
import {
  NEWS_TAXONOMIES,
  FEATURED_CATEGORY_TRANSLATION,
  RELATED_POSTS,
} from "./queries";
import { DEFAULT_LANGUAGE, toLanguageCodeEnum } from "./language";

import { FEATURED_CATEGORY_SLUG, getPostCategories } from "./posts";

// Re-exported for server code that already imports them from here.
export { FEATURED_CATEGORY_SLUG, getPostCategories, getFallbackCategoryLabel } from "./posts";

export async function getNewsTaxonomies(
  language = DEFAULT_LANGUAGE,
  featuredSlug = FEATURED_CATEGORY_SLUG,
) {
  const data = await wpFetch(
    NEWS_TAXONOMIES,
    { language: toLanguageCodeEnum(language) },
    { tags: ["wp"] },
  );

  const allCategories = data?.categories?.nodes ?? [];
  const featuredCount =
    allCategories.find((category) => category.slug === featuredSlug)?.count ?? null;
  const categories = allCategories.filter(
    (category) =>
      category.slug !== FEATURED_CATEGORY_SLUG && category.slug !== featuredSlug,
  );
  // Terms WPGraphQL reports as count: null carry zero posts.
  const ciljevi = (data?.ciljevi?.nodes ?? []).filter((term) => term.count);

  return { categories, ciljevi, featuredCount };
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

export function toDateInput(value) {
  if (typeof value !== "string") return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() + 1 !== month ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
}

const RELATED_LIMIT = 4;
// Tag matches are re-ranked by rarity, so fetch a wider pool than we show.
const RELATED_TAG_POOL = 20;

// Asks WordPress for posts sharing a tag or a (non-featured) category instead
// of downloading recent posts and filtering here — so matches are found
// across the whole archive, not just the latest page.
export async function getRelatedPosts(post, language = DEFAULT_LANGUAGE) {
  const tagSlugs = (post.tags?.nodes ?? []).map((tag) => tag.slug);
  const categorySlugs = getPostCategories(post).map((category) => category.slug);
  if (tagSlugs.length === 0 && categorySlugs.length === 0) return [];

  const languageCode = toLanguageCodeEnum(language);
  const taxWhere = (taxonomy, terms) => ({
    language: languageCode,
    taxQuery: { taxArray: [{ taxonomy, terms, field: "SLUG" }] },
  });

  const data = await wpFetch(
    RELATED_POSTS,
    {
      first: RELATED_TAG_POOL,
      byTag: taxWhere("TAG", tagSlugs),
      byCategory: taxWhere("CATEGORY", categorySlugs),
      skipTags: tagSlugs.length === 0,
      skipCategories: categorySlugs.length === 0,
    },
    { tags: ["wp"] },
  );

  const notSelf = (candidate) => candidate.id !== post.id;
  const postTags = new Set(tagSlugs);

  // A shared tag used on few posts says more than one used on many.
  const tagMatches = (data?.byTag?.nodes ?? [])
    .filter(notSelf)
    .map((candidate) => ({
      candidate,
      score: (candidate.tags?.nodes ?? [])
        .filter((tag) => postTags.has(tag.slug))
        .reduce((total, tag) => total + 1 / Math.max(tag.count ?? 1, 1), 0),
    }))
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        new Date(b.candidate.date) - new Date(a.candidate.date),
    )
    .map(({ candidate }) => candidate);

  const selected = tagMatches.slice(0, RELATED_LIMIT);
  const selectedIds = new Set(selected.map((item) => item.id));

  // WordPress already returns these newest first.
  for (const candidate of data?.byCategory?.nodes ?? []) {
    if (selected.length >= RELATED_LIMIT) break;
    if (!notSelf(candidate) || selectedIds.has(candidate.id)) continue;
    selected.push(candidate);
    selectedIds.add(candidate.id);
  }

  return selected;
}

export function buildNewsWhere({
  categorySlug,
  ciljeviSlugs,
  search,
  dateFrom,
  dateTo,
  sort,
  language = DEFAULT_LANGUAGE,
} = {}) {
  const where = { language: toLanguageCodeEnum(language) };

  if (sort === "old") {
    where.orderby = [{ field: "DATE", order: "ASC" }];
  }

  if (categorySlug) {
    where.categoryName = categorySlug;
  }

  if (ciljeviSlugs?.length > 0) {
    where.taxQuery = {
      taxArray: [{ taxonomy: "CILJ", terms: ciljeviSlugs, field: "SLUG" }],
    };
  }

  if (search) where.search = search;
  const after = toDateInput(dateFrom);
  const before = toDateInput(dateTo);
  if (after || before) {
    where.dateQuery = {
      ...(after ? { after, inclusive: true } : {}),
      ...(before ? { before, inclusive: true } : {}),
    };
  }

  return where;
}
