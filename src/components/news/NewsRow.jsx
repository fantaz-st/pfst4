import Link from "next/link";
import ArrowCircle from "@/components/ui/ArrowCircle";
import Chip from "@/components/ui/Chip";
import { formatDate } from "@/lib/format";
import { getFallbackCategoryLabel, getPostCategories } from "@/lib/posts";
import styles from "./NewsRow.module.css";

/**
 * News row (STYLEGUIDE §6): date (120px) · title · chip · arrow circle.
 * Rows sit inside NewsList's white r28 panel, divided by --color-line.
 * The chip is the post's real category — never "istaknuto", which is a flag.
 */
export default function NewsRow({ post, language = "hr" }) {
  const category = getPostCategories(post)[0];

  return (
    <Link href={post.uri} className={styles.row}>
      <time dateTime={post.date} className={`${styles.date} num`}>
        {formatDate(post.date, language)}
      </time>
      <span className={styles.title}>{post.title}</span>
      <span className={styles.chip}>
        <Chip>{category?.name ?? getFallbackCategoryLabel(language)}</Chip>
      </span>
      <ArrowCircle className={styles.go} />
    </Link>
  );
}
