// "Na ovoj stranici" (design/reference/page.html): the page's top-level h2
// headings become anchors. Ids are assigned once, here, and read by both the
// table of contents and blocks/Heading — so they always match.

const DIACRITICS = { č: "c", ć: "c", ž: "z", š: "s", đ: "d" };

function slugify(html) {
  return String(html)
    .replace(/<[^>]+>/g, "")
    .toLowerCase()
    .replace(/[čćžšđ]/g, (char) => DIACRITICS[char])
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripTags(html) {
  return String(html).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

/**
 * Returns the blocks with an `anchorId` on each top-level h2 (the editor's
 * own HTML anchor wins), plus the table of contents built from them.
 */
export function withHeadingAnchors(blocks = []) {
  const used = new Set();
  const toc = [];

  const annotated = blocks.map((block) => {
    const attributes = block.attributes ?? {};
    if (block.name !== "core/heading" || (attributes.level ?? 2) !== 2) return block;
    const text = stripTags(attributes.content ?? "");
    if (!text) return block;

    let id = attributes.anchor || slugify(text) || "odjeljak";
    for (let n = 2; used.has(id); n++) id = `${slugify(text)}-${n}`;
    used.add(id);
    toc.push({ id, text });
    return { ...block, attributes: { ...attributes, anchorId: id } };
  });

  return { blocks: annotated, toc };
}
