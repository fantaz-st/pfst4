import { renderWpHtml } from "@/lib/html";

const TAGS = { 1: "h1", 2: "h2", 3: "h3", 4: "h4", 5: "h5", 6: "h6" };

// `anchorId` is assigned by features/pages/headings.js (top-level h2s, for the
// "Na ovoj stranici" links); otherwise the editor's own HTML anchor.
export default function Heading({ block }) {
  const { level = 2, content, anchorId, anchor } = block.attributes ?? {};
  if (!content) return null;

  const Tag = TAGS[level] ?? "h2";
  const id = anchorId ?? anchor ?? undefined;
  return <Tag id={id}>{renderWpHtml(content)}</Tag>;
}
