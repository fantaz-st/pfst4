import Link from "next/link";
import { getChromeCopy } from "@/lib/chromeCopy";
import MobileNav from "./MobileNav";
import LanguageSwitcher from "./LanguageSwitcher";
import styles from "./Header.module.css";

export default function Header({ menu, currentLanguage, translations }) {
  const copy = getChromeCopy(currentLanguage);

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link href="/" className={styles.brand}>
          {copy.siteName}
        </Link>

        <nav className={styles.nav} aria-label={copy.mainNavLabel}>
          <ul className={styles.menu}>
            {menu.map((item) => (
              <li key={item.databaseId} className={styles.menuItem}>
                <Link href={item.uri}>{item.label}</Link>
                {item.children.length > 0 && (
                  <ul className={styles.submenu}>
                    {item.children.map((child) => (
                      <li key={child.databaseId}>
                        <Link href={child.uri}>{child.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <LanguageSwitcher currentLanguage={currentLanguage} translations={translations} />

        <MobileNav menu={menu} language={currentLanguage} />
      </div>
    </header>
  );
}
