"use server";

import { wpFetch } from "./wp";
import { NEWS_POSTS, SITE_SEARCH } from "./queries";
import { buildNewsWhere } from "./news";
import { toLanguageCodeEnum } from "./language";

const EMPTY_PAGE = {
  nodes: [],
  pageInfo: { hasNextPage: false, endCursor: null },
};

export async function loadMoreNews({
  after,
  categorySlug,
  ciljeviSlugs,
  language,
  first = 20,
}) {
  const data = await wpFetch(
    NEWS_POSTS,
    {
      first,
      after,
      where: buildNewsWhere({ categorySlug, ciljeviSlugs, language }),
    },
    { tags: ["wp"] },
  );
  return data?.posts ?? EMPTY_PAGE;
}

export async function loadMoreFeatured({
  after,
  language,
  featuredCategorySlug,
  first = 6,
}) {
  const data = await wpFetch(
    NEWS_POSTS,
    {
      first,
      after,
      where: {
        categoryName: featuredCategorySlug,
        language: toLanguageCodeEnum(language),
      },
    },
    { tags: ["wp"] },
  );
  return data?.posts ?? EMPTY_PAGE;
}

export async function loadMoreSearch({
  after,
  query,
  type,
  language,
  first = 10,
}) {
  const data = await wpFetch(
    SITE_SEARCH,
    {
      pageFirst: type === "pages" ? first : 0,
      pageAfter: type === "pages" ? after : null,
      postFirst: type === "posts" ? first : 0,
      postAfter: type === "posts" ? after : null,
      pageWhere:
        type === "pages"
          ? { search: query, language: toLanguageCodeEnum(language) }
          : null,
      postWhere:
        type === "posts"
          ? { search: query, language: toLanguageCodeEnum(language) }
          : null,
    },
    { tags: ["wp"] },
  );
  return data?.[type] ?? EMPTY_PAGE;
}
