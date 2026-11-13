import { cache } from "react";
import { notFound } from "next/navigation";
import { wpFetch } from "@/lib/wp";
import { NODE_BY_URI } from "@/lib/queries";
import { getAllContentNodes } from "@/lib/content";
import { getLanguageFromUri } from "@/lib/language";
import { buildMetaDescription, buildLanguageAlternates } from "@/lib/seo";
import ContentView from "@/components/content/ContentView";

export const hrContentRoute = createContentRoute({ language: "hr" });
export const enContentRoute = createContentRoute({
  language: "en",
  prefix: "en",
});

// Keyed by the uri string, not the slug array: layout, generateMetadata and
// the page each receive their own params object, so an array key would
// never hit. Next only dedupes GET fetches, and wpFetch POSTs, so without
// this the same node would be requested three times per render.
const getNodeByUri = cache(async (uri) => {
  const data = await wpFetch(NODE_BY_URI, { uri }, { tags: ["wp"] });
  const node = data?.nodeByUri;
  if (!node || (node.__typename !== "Page" && node.__typename !== "Post")) {
    return null;
  }
  return node;
});

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

  function getNode(slug) {
    return getNodeByUri(toUri(slug));
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
  // rendering, unlike the pathname-via-headers() approach. Reads the same
  // memoized node the page renders, so it costs no extra request.
  async function getTranslationsForSlug(slug) {
    const node = await getNode(slug);
    return node?.translations ?? null;
  }

  return {
    generateStaticParams,
    generateMetadata,
    ContentPage,
    getTranslationsForSlug,
  };
}
