import { getFallbackCategoryLabel } from "@/lib/news";
import { getCategoryColorVariant } from "@/lib/categoryColors";
import styles from "./CategoryBadge.module.css";

export default function CategoryBadge({ category, language = "hr", className }) {
  const label = category?.name ?? getFallbackCategoryLabel(language);
  const variant = getCategoryColorVariant(category);

  return (
    <span
      className={`${styles.badge} ${className ?? ""}`}
      data-variant={variant}
    >
      {label}
    </span>
  );
}
