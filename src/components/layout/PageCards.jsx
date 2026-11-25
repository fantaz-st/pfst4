import Link from "next/link";
import ArrowCircle from "@/components/ui/ArrowCircle";
import Icon from "@/components/ui/Icon";
import styles from "../../features/pages/HubGrid.module.css";

/**
 * Page cards (STYLEGUIDE §6 tile): icon box, arrow circle, title and the
 * page's Yoast meta description when an editor wrote one. Three columns on
 * desktop, one white list on phones. Used for a section's child pages
 * (HubGrid, which adds the help card as `children`) and for page results
 * in site search.
 */
export default function PageCards({ pages, children }) {
  return (
    <div className={styles.grid} data-stagger>
      {pages.map((page) => (
        <Link key={page.id} href={page.uri} className={styles.card}>
          <span className={styles.top}>
            <span className={styles.icon}>
              <Icon name="doc" />
            </span>
            <ArrowCircle />
          </span>
          <span className={styles.text}>
            <span className={styles.cardTitle}>{page.title}</span>
            {page.seo?.metaDesc && (
              <span className={styles.description}>{page.seo.metaDesc}</span>
            )}
          </span>
        </Link>
      ))}
      {children}
    </div>
  );
}
