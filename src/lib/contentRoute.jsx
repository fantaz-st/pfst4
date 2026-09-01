import { notFound } from "next/navigation";
import { wpFetch } from "@/lib/wp";
import { NODE_BY_URI } from "@/lib/queries";
import { getAllContentNodes } from "@/lib/content";
import { getLanguageFromUri, getTranslationsForUri } from "@/lib/language";
import { buildMetaDescription, buildLanguageAlternates } from "@/lib/seo";
import ContentView from "@/components/content/ContentView";

function extractSlug(uri, prefix) {
  const segments = uri.split("/").filter(Boolean);
  return prefix ? segments.slice(1) : segments;
}

// Builds the generateStaticParams/generateMetadata/page trio for one
// language's [...slug] catch-all. Shared because app/(hr)/[...slug] and
// app/en/[...slug] are otherwise identical — only the uri prefix and which
// language's content they enumerate differ.
export function createContentRoute({ language, prefix = null }) {
  function toUri(slug) {
    return prefix ? `/${prefix}/${slug.join("/")}/` : `/${slug.join("/")}/`;
  }

  async function getNode(slug) {
    const data = await wpFetch(NODE_BY_URI, { uri: toUri(slug) }, { tags: ["wp"] });
    const node = data?.nodeByUri;
    if (!node || (node.__typename !== "Page" && node.__typename !== "Post")) {
      return null;
    }
    return node;
  }

  async function generateStaticParams() {
    const nodes = await getAllContentNodes();
    return nodes
      .filter((node) => getLanguageFromUri(node.uri) === language)
      .map((node) => ({ slug: extractSlug(node.uri, prefix) }));
  }

  async function generateMetadata({ params }) {
    const { slug } = await params;
    const node = await getNode(slug);
    if (!node) return {};

    return {
      title: node.seo?.title || node.title,
      description: buildMetaDescription(node),
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}${node.uri}`,
        languages: buildLanguageAlternates(node),
      },
      openGraph: node.seo?.opengraphImage?.sourceUrl
        ? { images: [node.seo.opengraphImage.sourceUrl] }
        : undefined,
    };
  }

  async function ContentPage({ params }) {
    const { slug } = await params;
    const node = await getNode(slug);
    if (!node) notFound();
    return <ContentView node={node} />;
  }

  // Used by the route's own layout.jsx to build the Header's language
  // switcher — params are available there without opting into dynamic
  // rendering, unlike the pathname-via-headers() approach.
  async function getTranslationsForSlug(slug) {
    return getTranslationsForUri(toUri(slug));
  }

  return { generateStaticParams, generateMetadata, ContentPage, getTranslationsForSlug };
}
