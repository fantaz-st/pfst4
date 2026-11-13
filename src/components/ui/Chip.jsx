import Link from "next/link";
import styles from "./Chip.module.css";

/**
 * Chip (STYLEGUIDE §6) — 28px pill, the one neutral style used for every
 * label (news categories included; categories are not colour-coded).
 * tone="white" for chips sitting on --color-bg. With `href` it's a link,
 * and its hit area grows to the 44px touch target.
 */
export default function Chip({ href, tone = "default", className, children }) {
  const classes = [styles.chip, tone === "white" ? styles.white : null, className]
    .filter(Boolean)
    .join(" ");

  return href ? (
    <Link href={href} className={`${classes} ${styles.link}`}>
      {children}
    </Link>
  ) : (
    <span className={classes}>{children}</span>
  );
}
