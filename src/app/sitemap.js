import { getAllContentNodes } from "@/lib/wp/content";
import { toAbsoluteUrl } from "@/lib/seo";

export default async function sitemap() {
  const nodes = await getAllContentNodes();

  const contentEntries = nodes.map((node) => ({
    url: toAbsoluteUrl(node.uri),
    lastModified: node.modifiedGmt ? new Date(`${node.modifiedGmt}Z`) : undefined,
  }));

  return [
    { url: toAbsoluteUrl("/"), priority: 1, alternates: { languages: { hr: toAbsoluteUrl("/"), en: toAbsoluteUrl("/en/") } } },
    { url: toAbsoluteUrl("/en/"), priority: 1, alternates: { languages: { hr: toAbsoluteUrl("/"), en: toAbsoluteUrl("/en/") } } },
    { url: toAbsoluteUrl("/novosti/"), changeFrequency: "daily" },
    { url: toAbsoluteUrl("/en/news/"), changeFrequency: "daily" },
    ...contentEntries,
  ];
}
