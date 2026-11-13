import Icon from "@/components/ui/Icon";
import { getChromeCopy } from "@/lib/chromeCopy";
import styles from "./Toc.module.css";

/**
 * "Na ovoj stranici" (design/reference/page.html): links to the page's h2
 * sections, under the sidebar. Only shown when there are at least two.
 */
export default function Toc({ items, language = "hr" }) {
  if (!items || items.length < 2) return null;
  const copy = getChromeCopy(language);

  return (
    <nav className={styles.toc} aria-label={copy.onThisPage} data-fade>
      <div className={styles.header}>{copy.onThisPage}</div>
      <ul className={styles.list} role="list">
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className={styles.link}>
              <Icon name="arrow" size={14} />
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
