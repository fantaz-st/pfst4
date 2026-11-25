import Link from "next/link";
import Chip from "@/components/ui/Chip";
import Photo from "@/components/ui/Photo";
import Icon from "@/components/ui/Icon";
import { formatDate } from "@/lib/format";
import { getPostCategories } from "@/lib/posts";
import styles from "./NewsCard.module.css";

/**
 * News card (STYLEGUIDE §6): 4:3 image r24, date + chip row, Title M.
 * Posts without an image get the animated flag field (Photo fallback).
 * Hover / focus: the image frame pulls in and zooms, an arrow slides in after
 * the title, and the category chip turns modra.
 */
export default function NewsCard({
  post,
  language = "hr",
  sizes,
  chipTone = "white",
  featuredSlug,
}) {
  const image = post.featuredImage?.node;
  const category = getPostCategories(post, featuredSlug)[0];

  return (
    <Link href={post.uri} className={styles.card}>
      <Photo
        src={image?.sourceUrl}
        alt={image?.altText ?? ""}
        ratio="4/3"
        radius="card"
        tone="dark"
        fallback="flags"
        sizes={sizes ?? "(max-width: 720px) 100vw, 420px"}
        className={styles.photo}
        zoom
      />
      <span className={styles.meta}>
        <time dateTime={post.date} className={`${styles.date} num`}>
          {formatDate(post.date, language)}
        </time>
        {category && (
          <Chip tone={chipTone} className={styles.chip}>
            {category.name}
          </Chip>
        )}
      </span>
      <span className={styles.title}>
        {post.title}
        <Icon name="arrow" size={18} className={styles.titleArrow} />
      </span>
    </Link>
  );
}
