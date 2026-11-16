import Link from "next/link";
import Icon from "@/components/ui/Icon";
import CompassRose from "./CompassRose";
import styles from "./AdmissionsCard.module.css";

/**
 * Upisi CTA card (homepage, next to the Trening centar card): modra card,
 * label, title, lead and a white "go" button, and a compass rose in the
 * top-right corner that turns as the page scrolls (CompassRose, off under
 * reduced motion). data-home-clip gives it
 * the homepage's clip reveal (PageMotion).
 *
 * @param {{ href: string, label: string, title: string, lead: string, cta: string }} props
 */
export default function AdmissionsCard({ href, label, title, lead, cta }) {
  return (
    <Link href={href} className={styles.card} data-home-clip>
      <CompassRose className={styles.compass} />
      <span className={styles.label}>{label}</span>
      <span className={styles.body}>
        <span className={styles.title}>{title}</span>
        <span className={styles.lead}>{lead}</span>
        <span className={styles.button}>
          {cta}
          <span className={styles.buttonIcon} aria-hidden="true">
            <Icon name="arrow" size={15} />
          </span>
        </span>
      </span>
    </Link>
  );
}
