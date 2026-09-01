import { wpFetch } from "@/lib/wp";
import { NEWS_POSTS } from "@/lib/queries";
import { buildNewsWhere, FEATURED_CATEGORY_SLUG } from "@/lib/news";
import { toLanguageCodeEnum } from "@/lib/language";
import { getMainMenu } from "@/lib/menu";
import SiteChrome from "@/components/layout/SiteChrome";
import HomePage from "@/components/home/HomePage";

const LANGUAGE = "hr";
const FEATURED_FIRST = 5;
const NEWS_FIRST = 10;
const EMPTY_PAGE = {
  nodes: [],
  pageInfo: { hasNextPage: false, endCursor: null },
};

export const metadata = {
  title: "Pomorski fakultet u Splitu",
  description:
    "Pomorski fakultet Sveučilišta u Splitu — studiji pomorstva, brodostrojarstva, elektrotehničkih tehnologija i pomorskog menadžmenta.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/` },
};

export default async function Home() {
  const [menu, featuredData, newsData] = await Promise.all([
    getMainMenu(LANGUAGE),
    wpFetch(
      NEWS_POSTS,
      {
        first: FEATURED_FIRST,
        after: null,
        where: {
          categoryName: FEATURED_CATEGORY_SLUG,
          language: toLanguageCodeEnum(LANGUAGE),
        },
      },
      { tags: ["wp"] },
    ),
    wpFetch(
      NEWS_POSTS,
      {
        first: NEWS_FIRST,
        after: null,
        where: buildNewsWhere({ language: LANGUAGE }),
      },
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
