import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { getChromeCopy } from "@/lib/chromeCopy";
import { getSiteLinks } from "@/lib/siteLinks";
import { getLanguageLinks } from "@/lib/languageLinks";
import styles from "./UtilityRow.module.css";

// The 40px row above the hero (STYLEGUIDE §6): tagline, utility links,
// search and the HR / EN switch.
export default function UtilityRow({ language, translations }) {
  const copy = getChromeCopy(language);
  const links = getSiteLinks(language).utility;
  const languages = getLanguageLinks(language, translations);

  return (
    <div className={styles.row}>
      <span className={styles.tagline}>{copy.utilityTagline}</span>
      <nav className={styles.nav} aria-label={copy.utilityNavLabel}>
        {links.map((link) => (
          <Link key={link.label} href={link.href} className={styles.link}>
            {link.label}
          </Link>
        ))}
        <Link
          href={language === "en" ? "/en/search" : "/pretraga"}
          className={`${styles.link} ${styles.search}`}
          aria-label={copy.search}
        >
          <Icon name="search" size={15} />
        </Link>
        <span className={styles.languages} aria-label={copy.languageLabel} role="group">
          {languages.map((item, index) => (
            <span key={item.code} className={styles.language}>
              {index > 0 && (
                <span className={styles.slash} aria-hidden="true">
                  /
                </span>
              )}
              {item.current ? (
                <span className={styles.currentLanguage} aria-current="true" title={item.label}>
                  {item.code.toUpperCase()}
                </span>
              ) : (
                <Link
                  href={item.href}
                  hrefLang={item.code}
                  lang={item.code}
                  className={styles.link}
                  aria-label={item.label}
                >
                  {item.code.toUpperCase()}
                </Link>
              )}
            </span>
          ))}
        </span>
      </nav>
    </div>
  );
}
