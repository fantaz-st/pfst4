import Link from "next/link";
import { NEWS_ARCHIVE_URI, getPostCategories } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import Photo from "@/components/ui/Photo";
import Chip from "@/components/ui/Chip";
import Icon from "@/components/ui/Icon";
import ArrowCircle from "@/components/ui/ArrowCircle";
import styles from "./FeaturedNews.module.css";
import NewsSlider, { NewsSliderControls, NewsSliderViewport } from "./NewsSlider";

export default function FeaturedNews({ copy, language, posts, featuredSlug }) {
  const archive = NEWS_ARCHIVE_URI[language];
  const [lead, ...rest] = posts;

  const head = (controls) => (
    <div className={`${styles.wrap} ${styles.highlightsHead}`}>
      <div className={styles.sectionHeadLeft}>
        <h2 id="home-highlights-title" className={styles.sectionTitle}>
          {copy.highlightsTitle}
        </h2>
      </div>
      <div className={styles.highlightsActions}>
        {controls}
        {/* <Button href={archive} variant="primary">
          {copy.allNews}
        </Button> */}
      </div>
    </div>
  );

  return (
    <section className={styles.highlights} id={language === "en" ? "news" : "novosti"} aria-labelledby="home-highlights-title">
      <div className={styles.highlightsInner}>
        {posts.length ? (
          // Embla slider. The cards below are Server Components passed in as
          // children — only the slider shell (NewsSlider) hydrates.
          <NewsSlider>
            {head(<NewsSliderControls prevLabel={copy.newsPrev} nextLabel={copy.newsNext} className={styles.sliderControls} />)}
            <NewsSliderViewport label={copy.highlightsTitle}>
              {lead && <FeaturedCard post={lead} language={language} featuredSlug={featuredSlug} featured />}
              {rest.map((post) => (
                <FeaturedCard key={post.id} post={post} language={language} featuredSlug={featuredSlug} />
              ))}
              <Link href={archive} className={styles.archiveCard}>
                <span className={styles.archiveLabel}>{copy.allNews}</span>
                <span className={styles.archiveTitle}>{copy.highlightsTitle}</span>
                <ArrowCircle tone="white" size="l" />
              </Link>
            </NewsSliderViewport>
          </NewsSlider>
        ) : (
          <>
            {head(null)}
            <p className={`${styles.wrap} ${styles.emptyHighlights}`}>{copy.noHighlights}</p>
          </>
        )}
      </div>
    </section>
  );
}

function FeaturedCard({ post, language, featuredSlug, featured = false }) {
  const category = getPostCategories(post, featuredSlug)[0];
  const image = post.featuredImage?.node;

  // Same height as the featured card: the photo takes whatever height the
  // date row and the (max three-line) title leave, so every card in the
  // strip lines up top and bottom.
  return (
    <Link href={post.uri} className={featured ? styles.featuredCard : styles.newsCard}>
      {featured ? (
        <Photo src={image?.sourceUrl} alt={image?.altText ?? ""} sizes="(max-width: 720px) 85vw, 680px" className={styles.featuredPhoto} radius="feature" zoom />
      ) : (
        <span className={styles.newsPhoto}>
          <Photo src={image?.sourceUrl} alt={image?.altText ?? ""} sizes="(max-width: 720px) 75vw, 420px" zoom />
        </span>
      )}
      {featured && (
        <span className={styles.featuredPanel}>
          <span className={styles.newsMeta}>
            <time dateTime={post.date} className="num">
              {formatDate(post.date, language)}
            </time>
            {category && <Chip className={styles.newsChip}>{category.name}</Chip>}
          </span>
          <span className={styles.featuredTitle}>
            {post.title}
            <Icon name="arrow" size={24} className={styles.titleArrow} />
          </span>
        </span>
      )}
      {!featured && (
        <>
          <span className={styles.newsMeta}>
            <time dateTime={post.date} className="num">
              {formatDate(post.date, language)}
            </time>
            {category && (
              <Chip tone="white" className={styles.newsChip}>
                {category.name}
              </Chip>
            )}
          </span>
          <span className={styles.newsTitle}>
            {post.title}
            <Icon name="arrow" size={18} className={styles.titleArrow} />
          </span>
        </>
      )}
    </Link>
  );
}
