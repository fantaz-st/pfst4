import { Suspense } from "react";
import { wpFetch } from "@/lib/wp";
import { NEWS_POSTS } from "@/lib/queries";
import { buildNewsWhere, getFeaturedCategorySlug, getNewsTaxonomies } from "@/lib/news";
import { getNewsCopy } from "@/lib/newsCopy";
import PageHero from "@/components/content/PageHero";
import NewsList from "./NewsList";
import NewsFilters from "./NewsFilters";
import { NEWS_ARCHIVE_URI } from "@/lib/posts";
import styles from "./NewsArchive.module.css";

const LIST_FIRST = 20;
const EMPTY_PAGE = { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } };

// Shared by app/(hr)/novosti and app/en/news, which differ only in language.
export function getNewsArchiveMetadata(language) {
  const copy = getNewsCopy(language);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  return {
    title: copy.archiveMetaTitle,
    description: copy.archiveMetaDescription,
    alternates: {
      // Filtered views (?kategorija=, ?q=, …) all canonicalize to the
      // unfiltered archive.
      canonical: `${siteUrl}${NEWS_ARCHIVE_URI[language] ?? NEWS_ARCHIVE_URI.hr}`,
      languages: {
        hr: `${siteUrl}${NEWS_ARCHIVE_URI.hr}`,
        en: `${siteUrl}${NEWS_ARCHIVE_URI.en}`,
        "x-default": `${siteUrl}${NEWS_ARCHIVE_URI.hr}`,
      },
    },
  };
}

function readFilters(params) {
  const single = (value) => (typeof value === "string" && value ? value : undefined);
  const cilj = params.cilj;
  return {
    categorySlug: single(params.kategorija),
    ciljeviSlugs: (Array.isArray(cilj) ? cilj : cilj ? [cilj] : []).filter(Boolean),
    search: single(params.q),
    dateFrom: single(params.od),
    dateTo: single(params.do),
  };
}

/**
 * The news archive: hero, then the filters beside the news rows (the
 * layout of "Ostale novosti" in design/reference/home.html). Filters stack
 * above the list below 1080px.
 */
export default async function NewsArchive({ language, searchParams }) {
  const copy = getNewsCopy(language);
  const filters = readFilters(await searchParams);

  const [{ categories, ciljevi }, featuredSlug, listData] = await Promise.all([
    getNewsTaxonomies(language),
    getFeaturedCategorySlug(language),
    wpFetch(
      NEWS_POSTS,
      { first: LIST_FIRST, after: null, where: buildNewsWhere({ ...filters, language }) },
      { tags: ["wp"] },
    ),
  ]);
  const list = listData?.posts ?? EMPTY_PAGE;

  // Remount the list (resetting "load more") whenever the filters change.
  const listKey = JSON.stringify(filters);

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
                language={language}
              />
            </Suspense>
          </aside>
          <NewsList
            key={listKey}
            initialPosts={list.nodes}
            initialPageInfo={list.pageInfo}
            filters={filters}
            language={language}
          />
        </div>
      </div>
    </>
  );
}
