import Link from "next/link";
import { formatDayLabel, formatTimeLabel, getPrimaryCategory } from "@/lib/news";
import CategoryBadge from "./CategoryBadge";
import styles from "./NewsDayGroup.module.css";

export default function NewsDayGroup({ group, language = "hr" }) {
  return (
    <section className={styles.day}>
      <h3 className={styles.dayHeading}>{formatDayLabel(group.date, language)}</h3>
      <ul className={styles.list}>
        {group.posts.map((post) => (
          <li key={post.id} className={styles.item}>
            <time className={styles.time} dateTime={post.date}>
              {formatTimeLabel(new Date(post.date), language)}
            </time>
            <Link href={post.uri} className={styles.title}>
              {post.title}
            </Link>
            <CategoryBadge category={getPrimaryCategory(post)} language={language} />
          </li>
        ))}
      </ul>
    </section>
  );
}
