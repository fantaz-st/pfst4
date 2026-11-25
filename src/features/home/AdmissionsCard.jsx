import Link from "next/link";
import Icon from "@/components/ui/Icon";
import CompassRose from "./CompassRose";
import styles from "./AdmissionsCard.module.css";

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
