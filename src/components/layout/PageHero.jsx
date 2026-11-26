import Hero from "@/components/layout/Hero";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import SplitReveal from "@/components/motion/SplitReveal";
import styles from "./PageHero.module.css";

/**
 * Without a featured image the hero shows the design's contour texture on
 * modra — a valid permanent state, so no "TODO" photo tag unless a
 * `placeholder` label is passed — or, with fallback="wall", the turning
 * signal-flag wall (section pages, 404).
 *
 * Inner-page hero (design/reference/page.html, opcenito.html): breadcrumbs
 * pill at the top; eyebrow + title (chars reveal) bottom-left, an optional
 * lead bottom-right. `titleSize="post"` uses the H2 scale for long news
 * titles.
 *
 * @param {{
 *   language?: string, title: string, eyebrow?: string, lead?: string,
 *   crumbs?: { label: string, uri: string }[], showCrumbs?: boolean,
 *   image?: { sourceUrl: string, altText?: string } | null,
 *   placeholder?: string, fallback?: "wall", titleSize?: "page" | "post",
 *   children?: React.ReactNode,
 * }} props
 */
export default function PageHero({
  language = "hr",
  title,
  eyebrow,
  lead,
  crumbs = [],
  showCrumbs = true,
  image,
  placeholder,
  fallback,
  titleSize = "page",
  children,
}) {
  const photo = image?.sourceUrl
    ? { src: image.sourceUrl, alt: image.altText ?? "" }
    : fallback
      ? { fallback }
      : { tag: placeholder };

  return (
    <Hero photo={photo} labelledBy="page-title">
      {showCrumbs ? (
        <Breadcrumbs items={crumbs} current={title} language={language} />
      ) : (
        <span />
      )}
      <div className={styles.row}>
        <div className={styles.heading}>
          {eyebrow && (
            <span className={styles.eyebrow} data-hero-fade>
              <span className={styles.dot} aria-hidden="true" />
              {eyebrow}
            </span>
          )}
          <SplitReveal
            as="h1"
            id="page-title"
            mode="chars"
            start="top bottom"
            className={`${styles.title} ${styles[titleSize]}`}
          >
            {title}
          </SplitReveal>
        </div>
        {lead && (
          <p className={styles.lead} data-hero-fade>
            {lead}
          </p>
        )}
        {children}
      </div>
    </Hero>
  );
}
