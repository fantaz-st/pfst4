import Photo from "@/components/ui/Photo";
import styles from "./Hero.module.css";

/**
 * The rounded hero box every page starts with (STYLEGUIDE §4/§7): inset
 * 12px, r28, photo + the one allowed scrim, white text. `solid` omits the
 * photo and scrim for templates such as the single-post hero. The shared
 * header's nav sits over its top; page motion watches the hero and its media.
 *
 * size: "home" (880px) · "page" (520px, inner pages)
 * photo: props for <Photo> (src/alt, or `tag` for a placeholder)
 * solid: render the hero without a photo or scrim
 * Children fill the box below the nav: first child at the top, last at the
 * bottom (components/content/PageHero).
 */
export default function Hero({ size = "page", photo, solid = false, labelledBy, children }) {
  return (
    <section className={styles.hero} aria-labelledby={labelledBy}>
      <div
        className={`${styles.box} ${styles[size]}`}
        data-hero
        data-home-hero={size === "home" ? "true" : undefined}
      >
        {!solid && (
          <>
            <div className={styles.media} data-hero-media>
              <Photo sizes="100vw" priority tagPosition="right" {...photo} />
            </div>
            <div className={styles.scrim} aria-hidden="true" />
          </>
        )}
        <div className={styles.content}>{children}</div>
      </div>
    </section>
  );
}
