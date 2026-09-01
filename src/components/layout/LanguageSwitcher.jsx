import Link from "next/link";
import { localizedHomeUri } from "@/lib/language";
import { getChromeCopy } from "@/lib/chromeCopy";
import styles from "./LanguageSwitcher.module.css";

const LANGUAGES = [
  { code: "hr", label: "HR" },
  { code: "en", label: "EN" },
];

export default function LanguageSwitcher({ currentLanguage, translations }) {
  const copy = getChromeCopy(currentLanguage);

  return (
    <ul className={styles.list} aria-label={copy.languageSwitcherLabel}>
      {LANGUAGES.map(({ code, label }) => {
        if (code === currentLanguage) {
          return (
            <li key={code}>
              <span className={styles.current} aria-current="true">
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
  );
}
