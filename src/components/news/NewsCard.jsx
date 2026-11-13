import Link from "next/link";
import Chip from "@/components/ui/Chip";
import Photo from "@/components/ui/Photo";
import { formatDate } from "@/lib/format";
import { getPostCategories } from "@/lib/posts";
import styles from "./NewsCard.module.css";

/**
 * News card (STYLEGUIDE §6): 4:3 image r24, date + chip row, Title M.
 * Posts without an image get the light contour placeholder, no tag.
 */
export default function NewsCard({ post, language = "hr", sizes, chipTone = "white" }) {
  const image = post.featuredImage?.node;
  const category = getPostCategories(post)[0];

  return (
    <Link href={post.uri} className={styles.card}>
      <Photo
        src={image?.sourceUrl}
        alt={image?.altText ?? ""}
        ratio="4/3"
        radius="card"
        tone="light"
        sizes={sizes ?? "(max-width: 720px) 100vw, 420px"}
        zoom
      />
      <span className={styles.meta}>
        <time dateTime={post.date} className={`${styles.date} num`}>
          {formatDate(post.date, language)}
        </time>
        {category && <Chip tone={chipTone}>{category.name}</Chip>}
      </span>
      <span className={styles.title}>{post.title}</span>
    </Link>
  );
}
