import Link from "next/link";
import { getChromeCopy } from "@/lib/chromeCopy";
import styles from "./Footer.module.css";

export default function Footer({ menu, language = "hr" }) {
  const year = new Date().getFullYear();
  const copy = getChromeCopy(language);

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <p className={styles.brand}>{copy.siteName}</p>
          <p className={styles.copy}>&copy; {year} {copy.universityName}</p>
        </div>

        {menu.length > 0 && (
          <nav aria-label={copy.footerNavLabel}>
            <ul className={styles.list}>
              {menu.map((item) => (
                <li key={item.databaseId}>
                  <Link href={item.uri}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </footer>
  );
}
