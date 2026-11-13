import styles from "./Eyebrow.module.css";

/**
 * Eyebrow (STYLEGUIDE §6) — 32px pill with a 7px plava dot and a Label.
 * tone="light" (white pill, on --color-bg) or "dark" (white 10%, on modra
 * or over a photo).
 */
export default function Eyebrow({ tone = "light", as: Tag = "span", className, children }) {
  return (
    <Tag
      className={[styles.eyebrow, styles[tone === "dark" ? "dark" : "light"], className]
        .filter(Boolean)
        .join(" ")}
    >
      <span className={styles.dot} aria-hidden="true" />
      {children}
    </Tag>
  );
}
