import Link from "next/link";
import styles from "./SectionRail.module.css";

export default function SectionRail({ page }) {
  const siblings = page.parent?.node?.children?.nodes ?? [];
  const children = page.children?.nodes ?? [];

  if (siblings.length === 0 && children.length === 0) return null;

  const items = siblings.length > 0 ? siblings : [page];

  return (
    <nav className={styles.rail} aria-label="Sadržaj sekcije">
      <ul className={styles.list}>
        {items.map((item) => {
          const isCurrent = item.uri === page.uri;
          return (
            <li key={item.id}>
              <Link
                href={item.uri}
                aria-current={isCurrent ? "page" : undefined}
                className={isCurrent ? styles.active : undefined}
              >
                {item.title}
              </Link>
              {isCurrent && children.length > 0 && (
                <ul className={styles.children}>
                  {children.map((child) => (
                    <li key={child.id}>
                      <Link href={child.uri}>{child.title}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
