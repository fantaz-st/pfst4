import Image from "next/image";
import Link from "next/link";
import { getPrimaryCategory } from "@/lib/news";
import CategoryBadge from "./CategoryBadge";
import styles from "./NewsCard.module.css";

export default function NewsCard({ post, language = "hr" }) {
  const image = post.featuredImage?.node;

  return (
    <article className={styles.card}>
      {image && (
        <Link href={post.uri} className={styles.imageLink} tabIndex={-1} aria-hidden="true">
          <Image
            src={image.sourceUrl}
            alt=""
            width={480}
            height={320}
            className={styles.image}
          />
        </Link>
      )}
      <div className={styles.body}>
        <CategoryBadge category={getPrimaryCategory(post)} language={language} />
        <h3 className={styles.title}>
          <Link href={post.uri}>{post.title}</Link>
        </h3>
      </div>
    </article>
  );
}
