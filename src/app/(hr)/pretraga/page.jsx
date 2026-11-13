import SearchResults from "@/components/search/SearchResults";

export const metadata = {
  title: "Pretraživanje — Pomorski fakultet u Splitu",
  // Result pages are thin, infinite (one per query) and duplicate content
  // that is indexed elsewhere.
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  return <SearchResults query={query} language="hr" />;
}
