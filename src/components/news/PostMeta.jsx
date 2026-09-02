import { getPostCategories, formatDayLabel } from "@/lib/news";
import CategoryBadge from "./CategoryBadge";
import styles from "./PostMeta.module.css";

export default function PostMeta({ post }) {
  const categories = getPostCategories(post);
  const language = post.language?.slug ?? "hr";

  return (
    <div className={styles.meta}>
      <time dateTime={post.date} className={styles.date}>
        {formatDayLabel(new Date(post.date), language)}
      </time>

      <ul className={styles.badges}>
        {categories.length > 0 ? (
          categories.map((category) => (
            <li key={category.slug}>
              <CategoryBadge category={category} language={language} />
            </li>
          ))
        ) : (
          <li>
            <CategoryBadge category={null} language={language} />
          </li>
        )}
      </ul>
    </div>
  );
}
