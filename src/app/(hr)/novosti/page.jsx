import NewsArchive, { getNewsArchiveMetadata } from "@/components/news/NewsArchive";

const LANGUAGE = "hr";

export const metadata = getNewsArchiveMetadata(LANGUAGE);

export default function NewsArchivePage({ searchParams }) {
  return <NewsArchive language={LANGUAGE} searchParams={searchParams} />;
}
