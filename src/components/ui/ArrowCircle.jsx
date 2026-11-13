import Icon from "./Icon";
import styles from "./ArrowCircle.module.css";

/**
 * The design's "go" arrow circle (STYLEGUIDE §6). Decorative: it sits inside
 * the link or button that is the real control, and reacts when that
 * ancestor is hovered or focused — rotates −45° and, on light tones,
 * fills modra.
 *
 * @param {{
 *   size?: "m" | "l",                                  // 44 / 52px
 *   tone?: "light" | "white" | "primary" | "accent",   // bg: --color-bg / white / modra / plava
 *   direction?: "next" | "back",
 *   className?: string,
 * }} props
 */
export default function ArrowCircle({
  size = "m",
  tone = "light",
  direction = "next",
  className,
}) {
  return (
    <span
      className={[styles.circle, styles[size], styles[tone], className]
        .filter(Boolean)
        .join(" ")}
      data-direction={direction}
      aria-hidden="true"
    >
      <Icon name="arrow" size={size === "l" ? 20 : 18} />
    </span>
  );
}
