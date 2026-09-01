import Link from "next/link";
import styles from "./Breadcrumbs.module.css";

export default function Breadcrumbs({ page }) {
  // WPGraphQL orders ancestors nearest-first (parent, grandparent, ...);
  // breadcrumbs need root-first.
  const ancestors = [...(page.ancestors?.nodes ?? [])].reverse();

  return (
    <nav className={styles.breadcrumbs} aria-label="Navigacijski put">
      <ol className={styles.list}>
        <li>
          <Link href="/">Početna</Link>
        </li>
        {ancestors.map((ancestor) => (
          <li key={ancestor.id}>
            <Link href={ancestor.uri}>{ancestor.title}</Link>
          </li>
        ))}
        <li aria-current="page">{page.title}</li>
      </ol>
    </nav>
  );
}
