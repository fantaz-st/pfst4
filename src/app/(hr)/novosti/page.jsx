import NewsArchive, { getNewsArchiveMetadata } from "@/features/news/NewsArchive";

const LANGUAGE = "hr";

export const metadata = getNewsArchiveMetadata(LANGUAGE);

export default function NewsArchivePage({ searchParams }) {
  return <NewsArchive language={LANGUAGE} searchParams={searchParams} />;
}
