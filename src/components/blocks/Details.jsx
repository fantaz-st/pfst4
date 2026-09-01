import { renderWpHtml } from "@/lib/html";
import BlockRenderer from "./BlockRenderer";

export default function Details({ block }) {
  const { summary, showContent } = block.attributes ?? {};

  return (
    <details open={Boolean(showContent)}>
      <summary>{summary ? renderWpHtml(summary) : null}</summary>
      <BlockRenderer blocks={block.innerBlocks} />
    </details>
  );
}
