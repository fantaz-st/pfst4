import { Suspense } from "react";
import { wpFetch } from "@/lib/wp";
import { NEWS_POSTS } from "@/lib/queries";
import { buildNewsWhere, getNewsTaxonomies, FEATURED_CATEGORY_SLUG } from "@/lib/news";
import { toLanguageCodeEnum } from "@/lib/language";
import FeaturedGrid from "@/components/news/FeaturedGrid";
import ObavijestiList from "@/components/news/ObavijestiList";
import NewsFilters from "@/components/news/NewsFilters";
import styles from "./page.module.css";

export const metadata = {
  title: "Novosti — Pomorski fakultet u Splitu",
  description: "Obavijesti, natječaji i najave Pomorskog fakulteta u Splitu.",
};

const LANGUAGE = "hr";
const FEATURED_FIRST = 6;
const LIST_FIRST = 20;

const EMPTY_PAGE = { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } };

export default async function NewsArchivePage({ searchParams }) {
  const params = await searchParams;
  const categorySlug = typeof params.kategorija === "string" ? params.kategorija : undefined;
  const ciljeviSlugs = Array.isArray(params.cilj)
    ? params.cilj
    : params.cilj
      ? [params.cilj]
      : [];

  const [{ categories, ciljevi }, featuredData, listData] = await Promise.all([
    getNewsTaxonomies(LANGUAGE),
    wpFetch(
      NEWS_POSTS,
      {
        first: FEATURED_FIRST,
        after: null,
        where: { categoryName: FEATURED_CATEGORY_SLUG, language: toLanguageCodeEnum(LANGUAGE) },
      },
      { tags: ["wp"] },
    ),
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
      <h1>Novosti</h1>

      <section aria-labelledby="istaknuto-heading" className={styles.section}>
        <h2 id="istaknuto-heading">Istaknuto</h2>
        <FeaturedGrid
          initialPosts={featured.nodes}
          initialPageInfo={featured.pageInfo}
          language={LANGUAGE}
          featuredCategorySlug={FEATURED_CATEGORY_SLUG}
        />
      </section>

      <section aria-labelledby="obavijesti-heading" className={styles.section}>
        <h2 id="obavijesti-heading">Obavijesti</h2>
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
