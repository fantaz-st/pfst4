import Photo from "@/components/ui/Photo";
import styles from "./Hero.module.css";

/**
 * The rounded hero box every page starts with (STYLEGUIDE §4/§7): inset
 * 12px, r28, photo + the one allowed scrim, white text. The shared header's
 * nav bar is laid over its top (components/layout/header/SiteHeader), so it
 * must be the first thing in <main>. `data-hero` is what the floating nav
 * and the page motion watch; `data-hero-media` is the parallax layer.
 *
 * size: "home" (880px) · "page" (520px, inner pages)
 * photo: props for <Photo> (src/alt, or `tag` for a placeholder)
 * Children fill the box below the nav: first child at the top, last at the
 * bottom (components/content/PageHero).
 */
export default function Hero({ size = "page", photo, labelledBy, children }) {
  return (
    <section className={styles.hero} aria-labelledby={labelledBy}>
      <div className={`${styles.box} ${styles[size]}`} data-hero>
        <div className={styles.media} data-hero-media>
          <Photo sizes="100vw" priority tagPosition="right" {...photo} />
        </div>
        <div className={styles.scrim} aria-hidden="true" />
        <div className={styles.content}>{children}</div>
      </div>
    </section>
  );
}
