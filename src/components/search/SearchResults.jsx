import { wpFetch } from "@/lib/wp";
import { SITE_SEARCH } from "@/lib/queries";
import { toLanguageCodeEnum } from "@/lib/language";
import SearchResultsClient from "./SearchResultsClient";

export default async function SearchResults({ query, language }) {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return null;
  const data = await wpFetch(
    SITE_SEARCH,
    {
      pageFirst: 10,
      pageAfter: null,
      postFirst: 10,
      postAfter: null,
      query: trimmedQuery,
      pageWhere: {
        search: trimmedQuery,
        language: toLanguageCodeEnum(language),
      },
      postWhere: {
        search: trimmedQuery,
        language: toLanguageCodeEnum(language),
      },
    },
    { tags: ["wp"] },
  );
  const copy =
    language === "en"
      ? { results: "Search results", empty: "No results found." }
      : {
          results: "Rezultati pretraživanja",
          empty: "Nema pronađenih rezultata.",
        };

  return (
    <SearchResultsClient
      query={trimmedQuery}
      language={language}
      data={data}
      copy={copy}
    />
  );
}
