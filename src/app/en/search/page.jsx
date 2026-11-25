import SearchResults from "@/features/search/SearchResults";
import { buildPageMetadata } from "@/lib/seo";

// Result pages are thin, infinite (one per query) and duplicate content
// that is indexed elsewhere: noindex, but links are still followed.
export const metadata = buildPageMetadata({
  language: "en",
  uri: "/en/search/",
  title: "Search",
  noindex: true,
});

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  return <SearchResults query={query} language="en" />;
}
