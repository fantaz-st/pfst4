import Link from "next/link";
import Icon from "./Icon";
import Magnetic from "./Magnetic";
import styles from "./Button.module.css";

const VARIANTS = new Set(["primary", "white", "accent", "outline", "glass"]);
const SIZES = new Set(["l", "m", "s"]);

/**
 * Pill button (STYLEGUIDE §6). Renders a Next <Link> for internal hrefs,
 * <a> for external ones and <button> otherwise.
 *
 * - variant: primary (modra) · white (on photo/dark) · accent (plava,
 *   modra text) · outline (1px line) · glass (only over photo/dark)
 * - size: l 52px · m 48px · s 44px
 * - arrow: the circle on the right that turns −45° on hover. On by default
 *   for primary / white / accent; a button without it is a secondary
 *   action, which is how outline and glass are used.
 * - magnetic: follows the pointer on hover devices (§8).
 */
export default function Button({
  href,
  variant = "primary",
  size = "l",
  arrow = variant !== "outline" && variant !== "glass",
  magnetic = false,
  className,
  children,
  ...rest
}) {
  const classes = [
    styles.button,
    styles[VARIANTS.has(variant) ? variant : "primary"],
    styles[SIZES.has(size) ? size : "l"],
    arrow ? styles.withArrow : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <span>{children}</span>
      {arrow && (
        <span className={styles.arrow} aria-hidden="true">
          <Icon name="arrow" size={size === "s" ? 14 : 15} />
        </span>
      )}
    </>
  );

  let element;
  if (href) {
    const external = /^(https?:)?\/\//.test(href) || href.startsWith("mailto:");
    element = external ? (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    ) : (
      <Link href={href} className={classes} {...rest}>
        {content}
      </Link>
    );
  } else {
    element = (
      <button type="button" className={classes} {...rest}>
        {content}
      </button>
    );
  }

  return magnetic ? <Magnetic>{element}</Magnetic> : element;
}
