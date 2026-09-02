import Link from "next/link";
import { localizedHomeUri } from "@/lib/language";
import { getChromeCopy } from "@/lib/chromeCopy";
import styles from "./LanguageSwitcher.module.css";

const LANGUAGES = [
  { code: "hr", label: "HR" },
  { code: "en", label: "EN" },
];

export default function LanguageSwitcher({
  currentLanguage,
  translations,
  className,
}) {
  const copy = getChromeCopy(currentLanguage);

  return (
    <details className={`${styles.dropdown} ${className ?? ""}`}>
      <summary
        className={styles.current}
        aria-label={copy.languageSwitcherLabel}
      >
        {LANGUAGES.find(({ code }) => code === currentLanguage)?.label}
      </summary>
      <ul className={styles.list} aria-label={copy.languageSwitcherLabel}>
        {LANGUAGES.map(({ code, label }) => {
          if (code === currentLanguage) {
            return (
              <li key={code}>
                <span className={styles.selected} aria-current="true">
                  {label}
                </span>
              </li>
            );
          }

          const translation = translations?.find(
            (item) => item.language?.code?.toLowerCase() === code,
          );
          const href = translation?.uri ?? localizedHomeUri(code);

          return (
            <li key={code}>
              <Link href={href} hrefLang={code} title={translation?.title}>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
