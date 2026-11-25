import Link from "next/link";
import ArrowCircle from "@/components/ui/ArrowCircle";
import { getChromeCopy } from "@/lib/i18n/chromeCopy";
import styles from "./PrevNext.module.css";

function withSlash(path) {
  return path.endsWith("/") ? path : `${path}/`;
}

/**
 * Previous / next sibling page (design/reference/page.html). "Back" goes
 * to the previous sibling, or to the parent on the first page.
 */
export default function PrevNext({ page, language = "hr" }) {
  const copy = getChromeCopy(language);
  const siblings = page.parent?.node?.children?.nodes ?? [];
  const index = siblings.findIndex((item) => withSlash(item.uri) === withSlash(page.uri));
  const parent = page.ancestors?.nodes?.[0] ?? null;

  const previous = index > 0 ? siblings[index - 1] : parent;
  const next = index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null;
  if (!previous && !next) return null;

  return (
    <nav className={styles.grid} aria-label={copy.neighboursLabel}>
      {previous ? (
        <Link href={previous.uri} className={styles.card}>
          <ArrowCircle direction="back" />
          <span className={`${styles.text} ${styles.right}`}>
            <span className={styles.label}>{copy.previous}</span>
            <span className={styles.title}>{previous.title}</span>
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link href={next.uri} className={styles.card}>
          <span className={styles.text}>
            <span className={styles.label}>{copy.next}</span>
            <span className={styles.title}>{next.title}</span>
          </span>
          <ArrowCircle />
        </Link>
      )}
    </nav>
  );
}
