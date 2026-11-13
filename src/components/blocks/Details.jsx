import { renderWpHtml } from "@/lib/html";
import BlockRenderer from "./BlockRenderer";
import styles from "./Details.module.css";

// The row, panel and spacing are styled in .prose (typography.css); this
// component only adds the chevron circle, which needs real markup.
export default function Details({ block, language }) {
  const { summary, showContent } = block.attributes ?? {};

  return (
    <details open={Boolean(showContent)}>
      <summary>
        <span>{summary ? renderWpHtml(summary) : null}</span>
        <span className={styles.chevron} aria-hidden="true">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </summary>
      <BlockRenderer blocks={block.innerBlocks} language={language} />
    </details>
  );
}
