import SearchResults from "@/components/search/SearchResults";

export const metadata = {
  title: "Pretraživanje — Pomorski fakultet u Splitu",
};

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  return <SearchResults query={query} language="hr" />;
}
