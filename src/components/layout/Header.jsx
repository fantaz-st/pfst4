import Link from "next/link";
import { getChromeCopy } from "@/lib/chromeCopy";
import MegaMenu from "./MegaMenu";
import { FullLogo, MarkLogo } from "./Logo";
import MobileNav from "./MobileNav";
import LanguageSwitcher from "./LanguageSwitcher";
import SearchOverlay from "./SearchOverlay";
import styles from "./Header.module.css";

export default function Header({ menu, currentLanguage, translations }) {
  const copy = getChromeCopy(currentLanguage);

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link href="/" className={styles.brand} aria-label={copy.siteName}>
          <FullLogo className={styles.fullLogo} />
          <MarkLogo className={styles.signLogo} />
        </Link>

        <MegaMenu menu={menu} label={copy.mainNavLabel} />

        <div className={styles.desktopLanguage}>
          <LanguageSwitcher
            currentLanguage={currentLanguage}
            translations={translations}
          />
        </div>

        <div className={styles.desktopSearch}>
          <SearchOverlay language={currentLanguage} />
        </div>

        <MobileNav
          menu={menu}
          language={currentLanguage}
          translations={translations}
        />
      </div>
    </header>
  );
}
