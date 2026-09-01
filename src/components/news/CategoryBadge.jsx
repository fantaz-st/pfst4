import { getFallbackCategoryLabel } from "@/lib/news";
import styles from "./CategoryBadge.module.css";

const COLORED_SLUGS = new Set(["natjecaji", "najave", "sluzbeno", "erasmus"]);

export default function CategoryBadge({ category, language = "hr" }) {
  const label = category?.name ?? getFallbackCategoryLabel(language);
  const variant = category && COLORED_SLUGS.has(category.slug) ? category.slug : "neutral";

  return (
    <span className={styles.badge} data-variant={variant}>
      {label}
    </span>
  );
}
