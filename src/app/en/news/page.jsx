import NewsArchive, { getNewsArchiveMetadata } from "@/features/news/NewsArchive";

const LANGUAGE = "en";

export const metadata = getNewsArchiveMetadata(LANGUAGE);

export default function EnglishNewsArchivePage({ searchParams }) {
  return <NewsArchive language={LANGUAGE} searchParams={searchParams} />;
}
