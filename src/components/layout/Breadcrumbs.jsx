import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { getChromeCopy } from "@/lib/i18n/chromeCopy";
import { localizedHomeUri } from "@/lib/i18n/language";
import styles from "./Breadcrumbs.module.css";

/**
 * Breadcrumbs in the page hero (design/reference/page.html): a glass pill,
 * home icon, ancestors, current page.
 *
 * @param {{ items: { label: string, uri: string }[], current: string, language?: string }} props
 */
export default function Breadcrumbs({ items = [], current, language = "hr" }) {
  const copy = getChromeCopy(language);

  return (
    <nav className={styles.crumbs} aria-label={copy.breadcrumbsLabel} data-hero-fade>
      <ol className={styles.list} role="list">
        <li>
          <Link
            href={localizedHomeUri(language)}
            className={styles.link}
            aria-label={copy.breadcrumbsHome}
          >
            <Icon name="home" size={15} />
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.uri}>
            <span className={styles.slash} aria-hidden="true">
              /
            </span>
            <Link href={item.uri} className={styles.link}>
              {item.label}
            </Link>
          </li>
        ))}
        <li>
          <span className={styles.slash} aria-hidden="true">
            /
          </span>
          <span className={styles.current} aria-current="page">
            {current}
          </span>
        </li>
      </ol>
    </nav>
  );
}
