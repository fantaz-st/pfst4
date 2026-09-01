import { notFound, redirect } from "next/navigation";
import { draftMode } from "next/headers";
import { wpFetch } from "@/lib/wp";
import { PREVIEW_PAGE, PREVIEW_POST } from "@/lib/queries";
import ContentView from "@/components/content/ContentView";
import PreviewBanner from "@/components/layout/PreviewBanner";

export const metadata = {
  robots: { index: false, follow: false },
};

async function getPreviewNode(id, type) {
  const query = type === "page" ? PREVIEW_PAGE : PREVIEW_POST;
  const data = await wpFetch(query, { id }, { preview: true });
  return type === "page" ? data?.page : data?.post;
}

export default async function PreviewPage({ searchParams }) {
  const { isEnabled: isPreviewing } = await draftMode();
  if (!isPreviewing) redirect("/");

  const { id, type } = await searchParams;
  if (!id || (type !== "page" && type !== "post")) notFound();

  const node = await getPreviewNode(id, type);
  if (!node) notFound();

  return (
    <>
      <PreviewBanner />
      <ContentView node={node} />
    </>
  );
}
