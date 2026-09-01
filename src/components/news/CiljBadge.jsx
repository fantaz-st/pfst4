import Link from "next/link";
import { getCiljMeta } from "@/lib/ciljevi";
import styles from "./CiljBadge.module.css";

export default function CiljBadge({ cilj }) {
  const meta = getCiljMeta(cilj.slug);

  return (
    <Link
      href={`/novosti/ciljevi/${cilj.slug}`}
      className={styles.badge}
      style={{ "--cilj-color": meta?.color ?? "var(--color-gray-500)" }}
    >
      {meta?.number && <span className={styles.number}>{meta.number}</span>}
      {cilj.name}
    </Link>
  );
}
