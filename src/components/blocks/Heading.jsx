import { renderWpHtml } from "@/lib/html";

const TAGS = { 1: "h1", 2: "h2", 3: "h3", 4: "h4", 5: "h5", 6: "h6" };

export default function Heading({ block }) {
  const { level = 2, content } = block.attributes ?? {};
  if (!content) return null;

  const Tag = TAGS[level] ?? "h2";
  return <Tag>{renderWpHtml(content)}</Tag>;
}
