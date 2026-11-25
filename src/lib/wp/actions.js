"use server";

import { wpFetch } from "./wp";
import { NEWS_POSTS, SITE_SEARCH } from "./queries";
import { buildNewsWhere } from "./news";
import { toLanguageCodeEnum } from "@/lib/i18n/language";

const EMPTY_PAGE = {
  nodes: [],
  pageInfo: { hasNextPage: false, endCursor: null },
};

// Server actions are public POST endpoints: every argument below arrives
// from the browser and can be anything. Page size is fixed server-side so a
// caller can't ask WordPress for thousands of posts in one request.
const NEWS_PAGE_SIZE = 20;
const SEARCH_PAGE_SIZE = 10;
const SEARCH_TYPES = new Set(["pages", "posts"]);
const LANGUAGES = new Set(["hr", "en"]);

function cleanLanguage(language) {
  return LANGUAGES.has(language) ? language : "hr";
}

function cleanString(value) {
  return typeof value === "string" && value ? value : undefined;
}

function cleanCursor(value) {
  return cleanString(value) ?? null;
}

export async function loadMoreNews({
  after,
  categorySlug,
  ciljeviSlugs,
  search,
  dateFrom,
  dateTo,
  sort,
  language,
} = {}) {
  const data = await wpFetch(
    NEWS_POSTS,
    {
      first: NEWS_PAGE_SIZE,
      after: cleanCursor(after),
      where: buildNewsWhere({
        categorySlug: cleanString(categorySlug),
        ciljeviSlugs: Array.isArray(ciljeviSlugs)
          ? ciljeviSlugs.filter((slug) => typeof slug === "string")
          : [],
        search: cleanString(search),
        dateFrom: cleanString(dateFrom),
        dateTo: cleanString(dateTo),
        sort: sort === "old" ? "old" : "new",
        language: cleanLanguage(language),
      }),
    },
    { tags: ["wp"] },
  );
  return data?.posts ?? EMPTY_PAGE;
}

export async function loadMoreSearch({ after, query, type, language } = {}) {
  const search = cleanString(query);
  if (!search || !SEARCH_TYPES.has(type)) return EMPTY_PAGE;

  const where = {
    search,
    language: toLanguageCodeEnum(cleanLanguage(language)),
  };
  const isPages = type === "pages";

  const data = await wpFetch(
    SITE_SEARCH,
    {
      pageFirst: isPages ? SEARCH_PAGE_SIZE : 0,
      pageAfter: isPages ? cleanCursor(after) : null,
      postFirst: isPages ? 0 : SEARCH_PAGE_SIZE,
      postAfter: isPages ? null : cleanCursor(after),
      pageWhere: isPages ? where : null,
      postWhere: isPages ? null : where,
    },
    { tags: ["wp"] },
  );
  return data?.[type] ?? EMPTY_PAGE;
}
