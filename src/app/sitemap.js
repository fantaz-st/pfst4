import { getAllContentNodes } from "@/lib/content";
import { CILJEVI_META } from "@/lib/ciljevi";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export default async function sitemap() {
  const nodes = await getAllContentNodes();

  const contentEntries = nodes.map((node) => ({
    url: `${SITE_URL}${node.uri}`,
    lastModified: node.modifiedGmt ? new Date(`${node.modifiedGmt}Z`) : undefined,
  }));

  const ciljeviEntries = Object.keys(CILJEVI_META).map((slug) => ({
    url: `${SITE_URL}/novosti/ciljevi/${slug}/`,
  }));

  return [
    { url: `${SITE_URL}/`, priority: 1 },
    { url: `${SITE_URL}/novosti/` },
    { url: `${SITE_URL}/en/news/` },
    ...contentEntries,
    ...ciljeviEntries,
  ];
}
