import { renderWpHtml } from "@/lib/html";

export default function Paragraph({ block }) {
  const content = block.attributes?.content;
  if (!content || !content.trim()) return null;

  return <p>{renderWpHtml(content)}</p>;
}
