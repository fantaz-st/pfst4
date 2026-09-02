import { Suspense } from "react";
import { wpFetch } from "@/lib/wp";
import { NEWS_POSTS } from "@/lib/queries";
import { buildNewsWhere, getNewsTaxonomies } from "@/lib/news";
import ArticleList from "@/components/news/ArticleList";
import NewsFilters from "@/components/news/NewsFilters";
import MobileNewsFilters from "@/components/news/MobileNewsFilters";
import styles from "./page.module.css";

export const metadata = {
  title: "News — Faculty of Maritime Studies, University of Split",
  description:
    "Announcements, calls and news from the Faculty of Maritime Studies, University of Split.",
};

const LANGUAGE = "en";
const LIST_FIRST = 20;

const EMPTY_PAGE = {
  nodes: [],
  pageInfo: { hasNextPage: false, endCursor: null },
};

export default async function EnglishNewsArchivePage({ searchParams }) {
  const params = await searchParams;
  const categorySlug =
    typeof params.kategorija === "string" ? params.kategorija : undefined;
  const ciljeviSlugs = Array.isArray(params.cilj)
    ? params.cilj
    : params.cilj
      ? [params.cilj]
      : [];
  const search = typeof params.q === "string" ? params.q : undefined;
  const dateFrom = typeof params.od === "string" ? params.od : undefined;
  const dateTo = typeof params.do === "string" ? params.do : undefined;

  const { categories, ciljevi } = await getNewsTaxonomies(LANGUAGE);

  const listData = await wpFetch(
    NEWS_POSTS,
    {
      first: LIST_FIRST,
      after: null,
      where: buildNewsWhere({
        categorySlug,
        ciljeviSlugs,
        search,
        dateFrom,
        dateTo,
        language: LANGUAGE,
      }),
    },
    { tags: ["wp"] },
  );

  const list = listData?.posts ?? EMPTY_PAGE;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeading}>
        <h1>News</h1>
        <MobileNewsFilters language={LANGUAGE}>
          <Suspense>
            <NewsFilters
              categories={categories}
              ciljevi={ciljevi}
              selectedCategory={categorySlug}
              selectedCiljevi={ciljeviSlugs}
              language={LANGUAGE}
            />
          </Suspense>
        </MobileNewsFilters>
      </div>

      <section
        aria-labelledby="announcements-heading"
        className={styles.section}
      >
        <div className={styles.sectionHeading}>
          <h2 id="announcements-heading">Announcements</h2>
        </div>
        <div className={styles.newsLayout}>
          <Suspense>
            <NewsFilters
              categories={categories}
              ciljevi={ciljevi}
              selectedCategory={categorySlug}
              selectedCiljevi={ciljeviSlugs}
              language={LANGUAGE}
            />
          </Suspense>
          <ArticleList
            key={`${categorySlug ?? ""}:${ciljeviSlugs.join(",")}:${search ?? ""}:${dateFrom ?? ""}:${dateTo ?? ""}`}
            initialPosts={list.nodes}
            initialPageInfo={list.pageInfo}
            categorySlug={categorySlug}
            ciljeviSlugs={ciljeviSlugs}
            search={search}
            dateFrom={dateFrom}
            dateTo={dateTo}
            language={LANGUAGE}
          />
        </div>
      </section>
    </div>
  );
}
