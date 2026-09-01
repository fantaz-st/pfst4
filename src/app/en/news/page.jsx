import { Suspense } from "react";
import { wpFetch } from "@/lib/wp";
import { NEWS_POSTS } from "@/lib/queries";
import { buildNewsWhere, getNewsTaxonomies, getFeaturedCategorySlug } from "@/lib/news";
import { toLanguageCodeEnum } from "@/lib/language";
import FeaturedGrid from "@/components/news/FeaturedGrid";
import ObavijestiList from "@/components/news/ObavijestiList";
import NewsFilters from "@/components/news/NewsFilters";
import styles from "./page.module.css";

export const metadata = {
  title: "News — Faculty of Maritime Studies, University of Split",
  description: "Announcements, calls and news from the Faculty of Maritime Studies, University of Split.",
};

const LANGUAGE = "en";
const FEATURED_FIRST = 6;
const LIST_FIRST = 20;

const EMPTY_PAGE = { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } };

export default async function EnglishNewsArchivePage({ searchParams }) {
  const params = await searchParams;
  const categorySlug = typeof params.kategorija === "string" ? params.kategorija : undefined;
  const ciljeviSlugs = Array.isArray(params.cilj)
    ? params.cilj
    : params.cilj
      ? [params.cilj]
      : [];

  const [{ categories, ciljevi }, featuredCategorySlug] = await Promise.all([
    getNewsTaxonomies(LANGUAGE),
    getFeaturedCategorySlug(LANGUAGE),
  ]);

  const [featuredData, listData] = await Promise.all([
    featuredCategorySlug
      ? wpFetch(
          NEWS_POSTS,
          {
            first: FEATURED_FIRST,
            after: null,
            where: {
              categoryName: featuredCategorySlug,
              language: toLanguageCodeEnum(LANGUAGE),
            },
          },
          { tags: ["wp"] },
        )
      : null,
    wpFetch(
      NEWS_POSTS,
      {
        first: LIST_FIRST,
        after: null,
        where: buildNewsWhere({ categorySlug, ciljeviSlugs, language: LANGUAGE }),
      },
      { tags: ["wp"] },
    ),
  ]);

  const featured = featuredData?.posts ?? EMPTY_PAGE;
  const list = listData?.posts ?? EMPTY_PAGE;

  return (
    <div className={styles.page}>
      <h1>News</h1>

      {featured.nodes.length > 0 && (
        <section aria-labelledby="featured-heading" className={styles.section}>
          <h2 id="featured-heading">Featured</h2>
          <FeaturedGrid
            initialPosts={featured.nodes}
            initialPageInfo={featured.pageInfo}
            language={LANGUAGE}
            featuredCategorySlug={featuredCategorySlug}
          />
        </section>
      )}

      <section aria-labelledby="announcements-heading" className={styles.section}>
        <h2 id="announcements-heading">Announcements</h2>
        <Suspense>
          <NewsFilters
            categories={categories}
            ciljevi={ciljevi}
            selectedCategory={categorySlug}
            selectedCiljevi={ciljeviSlugs}
            language={LANGUAGE}
          />
        </Suspense>
        <ObavijestiList
          key={`${categorySlug ?? ""}:${ciljeviSlugs.join(",")}`}
          initialPosts={list.nodes}
          initialPageInfo={list.pageInfo}
          categorySlug={categorySlug}
          ciljeviSlugs={ciljeviSlugs}
          language={LANGUAGE}
        />
      </section>
    </div>
  );
}
