import Link from "next/link";
import { getChromeCopy } from "@/lib/chromeCopy";
import { localizedHomeUri } from "@/lib/language";
import styles from "./Brand.module.css";

/**
 * The official PFST sign (paths from public/logo-sign-color-hr.svg),
 * inlined so it can follow its surface: band and dot are currentColor
 * (white on modra/photos, modra on light), the wave is always plava.
 */
export function BrandMark({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 150.48 217.98"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M54.38 190.79c0 15.02-12.17 27.19-27.19 27.19S0 205.81 0 190.79s12.17-27.19 27.19-27.19 27.19 12.17 27.19 27.19M150.48 92.05l-.33-.45H4.22l-.56.49v41.84l.46.35h146.23l.13-.14z"
      />
      <path
        className={styles.wave}
        d="M149.91 7.31c-7.42 5.09-19.19 9.4-28.78 9.4C90 16.71 65.39-.02 36.19 0 25.77.01 14.09 3.37 3.66 11.86v43.67l.65.33c9.77-6.99 20.91-10.63 31.35-10.63 27.36 0 53.14 15.64 84.36 15.64 10.88 0 23.81-4.54 30.37-10.19V7.53l-.49-.22Z"
      />
    </svg>
  );
}

/**
 * Logo link: the sign + "POMORSKI / FAKULTET / U SPLITU" (STYLEGUIDE §3).
 * size: "s" (mobile sheet), "m" (header), "l" (footer).
 */
export default function Brand({ language = "hr", size = "m", className }) {
  const copy = getChromeCopy(language);
  return (
    <Link
      href={localizedHomeUri(language)}
      className={[styles.brand, styles[size], className].filter(Boolean).join(" ")}
      aria-label={copy.siteNameHome}
    >
      <BrandMark className={styles.mark} />
      <span className={styles.text} aria-hidden="true">
        {copy.brandLines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </span>
    </Link>
  );
}
