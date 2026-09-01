"use server";

import { wpFetch } from "./wp";
import { NEWS_POSTS } from "./queries";
import { buildNewsWhere } from "./news";
import { toLanguageCodeEnum } from "./language";

const EMPTY_PAGE = { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } };

export async function loadMoreNews({ after, categorySlug, ciljeviSlugs, language, first = 20 }) {
  const data = await wpFetch(
    NEWS_POSTS,
    { first, after, where: buildNewsWhere({ categorySlug, ciljeviSlugs, language }) },
    { tags: ["wp"] },
  );
  return data?.posts ?? EMPTY_PAGE;
}

export async function loadMoreFeatured({ after, language, featuredCategorySlug, first = 6 }) {
  const data = await wpFetch(
    NEWS_POSTS,
    {
      first,
      after,
      where: { categoryName: featuredCategorySlug, language: toLanguageCodeEnum(language) },
    },
    { tags: ["wp"] },
  );
  return data?.posts ?? EMPTY_PAGE;
}
