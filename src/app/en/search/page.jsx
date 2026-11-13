import SearchResults from "@/components/search/SearchResults";

export const metadata = {
  title: "Search — Faculty of Maritime Studies, University of Split",
  // See app/(hr)/pretraga/page.jsx.
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  return <SearchResults query={query} language="en" />;
}
