import styles from "./PhotoTag.module.css";

/**
 * Photo tag (STYLEGUIDE §6) — says what photo belongs in a placeholder.
 * Only ever rendered by <Photo> while it has no real image; it disappears
 * as soon as a `src` is set.
 *
 * @param {{ position?: "top-left" | "bottom-left" | "right", hideOnMobile?: boolean, children: React.ReactNode }} props
 */
export default function PhotoTag({
  position = "bottom-left",
  hideOnMobile = false,
  children,
}) {
  return (
    <span
      className={[
        styles.tag,
        styles[position] ?? styles["bottom-left"],
        hideOnMobile ? styles.hideOnMobile : null,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
