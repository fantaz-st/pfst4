import { wpFetch } from "@/lib/wp";
import { NEWS_POSTS } from "@/lib/queries";
import { buildNewsWhere, getFeaturedCategorySlug } from "@/lib/news";
import { toLanguageCodeEnum } from "@/lib/language";
import { getMainMenu } from "@/lib/menu";
import SiteChrome from "@/components/layout/SiteChrome";
import HomePage from "@/components/home/HomePage";

const LANGUAGE = "en";
const FEATURED_FIRST = 6;
const NEWS_FIRST = 6;
const EMPTY_PAGE = { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } };

export const metadata = {
  title: "Faculty of Maritime Studies, University of Split",
  description:
    "Faculty of Maritime Studies, University of Split — nautical studies, marine engineering, marine electrical technologies and maritime management.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/en/` },
};

export default async function EnglishHome() {
  const [menu, featuredCategorySlug] = await Promise.all([
    getMainMenu(LANGUAGE),
    getFeaturedCategorySlug(LANGUAGE),
  ]);

  const [featuredData, newsData] = await Promise.all([
    featuredCategorySlug
      ? wpFetch(
          NEWS_POSTS,
          {
            first: FEATURED_FIRST,
            after: null,
            where: { categoryName: featuredCategorySlug, language: toLanguageCodeEnum(LANGUAGE) },
          },
          { tags: ["wp"] },
        )
      : null,
    wpFetch(
      NEWS_POSTS,
      { first: NEWS_FIRST, after: null, where: buildNewsWhere({ language: LANGUAGE }) },
      { tags: ["wp"] },
    ),
  ]);

  return (
    <SiteChrome language={LANGUAGE}>
      <HomePage
        language={LANGUAGE}
        menu={menu}
        featured={featuredData?.posts ?? EMPTY_PAGE}
        news={newsData?.posts ?? EMPTY_PAGE}
      />
    </SiteChrome>
  );
}
