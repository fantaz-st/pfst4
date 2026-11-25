import { Suspense } from "react";
import { wpFetch } from "@/lib/wp/wp";
import { NEWS_POSTS } from "@/lib/wp/queries";
import {
  buildNewsWhere,
  getFeaturedCategorySlug,
  getNewsTaxonomies,
  toDateInput,
} from "@/lib/wp/news";
import { getNewsCopy } from "@/lib/i18n/newsCopy";
import PageHero from "@/components/layout/PageHero";
import NewsList from "@/components/news/NewsList";
import NewsFilters from "./NewsFilters";
import { NEWS_ARCHIVE_URI } from "@/lib/posts";
import { buildPageMetadata, toAbsoluteUrl } from "@/lib/seo";
import styles from "./NewsArchive.module.css";

const LIST_FIRST = 20;
const EMPTY_PAGE = { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } };

// Shared by app/(hr)/novosti and app/en/news, which differ only in language.
export function getNewsArchiveMetadata(language) {
  const copy = getNewsCopy(language);
  return buildPageMetadata({
    language,
    // Filtered views (?kategorija=, ?q=, …) all canonicalize to the
    // unfiltered archive.
    uri: NEWS_ARCHIVE_URI[language] ?? NEWS_ARCHIVE_URI.hr,
    title: copy.archiveMetaTitle,
    description: copy.archiveMetaDescription,
    languages: {
      hr: toAbsoluteUrl(NEWS_ARCHIVE_URI.hr),
      en: toAbsoluteUrl(NEWS_ARCHIVE_URI.en),
      "x-default": toAbsoluteUrl(NEWS_ARCHIVE_URI.hr),
    },
  });
}

function readFilters(params) {
  const single = (value) => (typeof value === "string" && value ? value : undefined);
  const cilj = params.cilj;
  const dateFrom = single(params.od);
  const dateTo = single(params.do);
  return {
    categorySlug: single(params.kategorija),
    ciljeviSlugs: (Array.isArray(cilj) ? cilj : cilj ? [cilj] : []).filter(Boolean),
    search: single(params.q),
    dateFrom: toDateInput(dateFrom) ? dateFrom : undefined,
    dateTo: toDateInput(dateTo) ? dateTo : undefined,
  };
}

function getActiveChips(filters, categories, ciljevi, featuredSlug, copy, archivePath) {
  const params = new URLSearchParams();
  if (filters.categorySlug) params.set("kategorija", filters.categorySlug);
  filters.ciljeviSlugs.forEach((slug) => params.append("cilj", slug));
  if (filters.search) params.set("q", filters.search);
  if (filters.dateFrom) params.set("od", filters.dateFrom);
  if (filters.dateTo) params.set("do", filters.dateTo);

  const makeHref = (mutate) => {
    const next = new URLSearchParams(params);
    mutate(next);
    const query = next.toString();
    return query ? `${archivePath}?${query}` : archivePath;
  };
  const chips = [];

  if (filters.categorySlug) {
    const label =
      filters.categorySlug === featuredSlug
        ? copy.featuredFilter
        : categories.find((category) => category.slug === filters.categorySlug)?.name ??
          filters.categorySlug;
    chips.push({
      label,
      href: makeHref((next) => next.delete("kategorija")),
    });
  }
  filters.ciljeviSlugs.forEach((slug) => {
    chips.push({
      label: ciljevi.find((term) => term.slug === slug)?.name ?? slug,
      href: makeHref((next) => {
        const remaining = next.getAll("cilj").filter((value) => value !== slug);
        next.delete("cilj");
        remaining.forEach((value) => next.append("cilj", value));
      }),
    });
  });
  if (filters.search) {
    chips.push({
      label: filters.search,
      href: makeHref((next) => next.delete("q")),
    });
  }
  if (filters.dateFrom || filters.dateTo) {
    chips.push({
      label: `${copy.dateFilter}: ${filters.dateFrom || "…"} – ${filters.dateTo || "…"}`,
      href: makeHref((next) => {
        next.delete("od");
        next.delete("do");
      }),
    });
  }
  return chips;
}

/**
 * The news archive: hero, filter panel, and the card feed from
 * design/reference/news.html. Filters stack above the feed below 1080px.
 */
export default async function NewsArchive({ language, searchParams }) {
  const copy = getNewsCopy(language);
  const params = await searchParams;
  const filters = readFilters(params);

  const featuredSlug = await getFeaturedCategorySlug(language);
  const [{ categories, ciljevi, featuredCount }, listData] = await Promise.all([
    getNewsTaxonomies(language, featuredSlug),
    wpFetch(
      NEWS_POSTS,
      { first: LIST_FIRST, after: null, where: buildNewsWhere({ ...filters, language }) },
      { tags: ["wp"] },
    ),
  ]);
  const list = listData?.posts ?? EMPTY_PAGE;

  // Remount the list (resetting "load more") whenever the filters change.
  const listKey = JSON.stringify(filters);
  const archivePath = NEWS_ARCHIVE_URI[language] ?? NEWS_ARCHIVE_URI.hr;
  const activeChips = getActiveChips(
    filters,
    categories,
    ciljevi,
    featuredSlug,
    copy,
    archivePath,
  );

  return (
    <>
      <PageHero
        language={language}
        title={copy.archiveTitle}
        eyebrow={copy.archiveEyebrow}
        lead={copy.archiveLead}
      />
      <div className={styles.wrap}>
        <div className={styles.grid}>
          <aside className={styles.aside} data-fade>
            <Suspense>
              <NewsFilters
                categories={categories}
                ciljevi={ciljevi}
                featuredSlug={featuredSlug}
                featuredCount={featuredCount}
                language={language}
              />
            </Suspense>
          </aside>
          <NewsList
            key={listKey}
            initialPosts={list.nodes}
            initialPageInfo={list.pageInfo}
            filters={filters}
            activeChips={activeChips}
            archivePath={archivePath}
            featuredSlug={featuredSlug}
            language={language}
          />
        </div>
      </div>
    </>
  );
}
