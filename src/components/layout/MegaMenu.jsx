import Link from "next/link";
import styles from "./MegaMenu.module.css";

export default function MegaMenu({ menu, label }) {
  return (
    <nav className={styles.nav} aria-label={label}>
      <ul className={styles.menu}>
        {menu.map((item) => (
          <li key={item.databaseId} className={styles.menuItem}>
            <Link className={styles.topLink} href={item.uri}>
              {item.label}
            </Link>
            {item.children.length > 0 && (
              <div className={styles.panel}>
                <div className={styles.columns}>
                  {item.children.map((child, index) => (
                    <div
                      key={child.databaseId}
                      className={styles.column}
                      style={{ "--i": index }}
                    >
                      <Link className={styles.columnTitle} href={child.uri}>
                        {child.label}
                      </Link>
                      {child.children.length > 0 && (
                        <ul className={styles.grandchildren}>
                          {child.children.map((grandchild) => (
                            <li key={grandchild.databaseId}>
                              <Link href={grandchild.uri}>
                                {grandchild.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
