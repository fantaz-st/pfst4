function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text, maxLength = 155) {
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
}

export function buildMetaDescription(node) {
  if (node.seo?.metaDesc) return node.seo.metaDesc;

  if (node.excerpt) {
    const cleaned = stripHtml(node.excerpt);
    if (cleaned) return truncate(cleaned);
  }

  const firstParagraph = node.blocks?.find(
    (block) => block.name === "core/paragraph" && block.attributes?.content?.trim(),
  );
  if (firstParagraph) {
    const cleaned = stripHtml(firstParagraph.attributes.content);
    if (cleaned) return truncate(cleaned);
  }

  return undefined;
}

// Builds the { languages } map for Next's metadata `alternates`, which
// renders <link rel="alternate" hreflang="..."> tags. Undefined when the
// page has no translations, so the catch-all doesn't emit a single-entry
// hreflang set that's meaningless on its own.
export function buildLanguageAlternates(node) {
  if (!node.translations?.length) return undefined;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const languages = {};

  const addEntry = (code, uri) => {
    if (code && uri) languages[code.toLowerCase()] = `${siteUrl}${uri}`;
  };

  addEntry(node.language?.code, node.uri);
  for (const translation of node.translations) {
    addEntry(translation.language?.code, translation.uri);
  }

  const croatianUri =
    node.language?.code === "HR"
      ? node.uri
      : node.translations.find((t) => t.language?.code === "HR")?.uri;
  languages["x-default"] = `${siteUrl}${croatianUri ?? node.uri}`;

  return languages;
}
