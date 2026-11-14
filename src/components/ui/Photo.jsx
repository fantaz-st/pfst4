import Image from "next/image";
import PhotoTag from "./PhotoTag";
import styles from "./Photo.module.css";

const RATIOS = { "4/3": "r4x3", "5/4": "r5x4", "1/1": "r1x1", "16/9": "r16x9" };
const RADII = new Set(["panel", "card", "feature", "block"]);

/**
 * Image wrapper (STYLEGUIDE §7): next/image (AVIF/WebP, `sizes` required)
 * on a --color-deep box that shows while the image loads.
 *
 * Without `src` it renders the design's placeholder — contour texture on
 * --color-deep (tone="dark") or a plava tint (tone="light") — plus a
 * PhotoTag saying which photo belongs there. The tag disappears as soon as
 * a real `src` is set. Placeholders are TODOs: never ship one.
 *
 * @param {{
 *   src?: string, alt?: string, sizes: string,
 *   ratio?: "4/3" | "5/4" | "1/1" | "16/9",  // omit to fill the parent
 *   radius?: "panel" | "card" | "feature" | "block",
 *   tone?: "dark" | "light",
 *   tag?: string, tagPosition?: "top-left" | "bottom-left" | "right",
 *   hideTagOnMobile?: boolean,
 *   zoom?: boolean,      // scale 1.06 when an ancestor link is hovered
 *   priority?: boolean,
 *   className?: string,
 * }} props
 */
export default function Photo({
  src,
  alt = "",
  sizes,
  ratio,
  radius,
  tone = "dark",
  tag,
  tagPosition,
  hideTagOnMobile = false,
  zoom = false,
  priority = false,
  className,
}) {
  const classes = [
    styles.photo,
    ratio ? styles[RATIOS[ratio]] : styles.fill,
    RADII.has(radius) ? styles[radius] : null,
    !src ? styles[tone === "light" ? "placeholderLight" : "placeholder"] : null,
    zoom ? styles.zoom : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={styles.media}
        />
      ) : (
        <>
          <span className={styles.media} aria-hidden="true" />
          {tag && (
            <PhotoTag
              position={tagPosition}
              hideOnMobile={hideTagOnMobile}
            >
              {tag}
            </PhotoTag>
          )}
        </>
      )}
    </span>
  );
}
