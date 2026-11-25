import { NEWS_ARCHIVE_URI, isRecentPost } from "@/lib/posts";
import HomeNewsRows from "./HomeNewsRows";
import styles from "./HomeNews.module.css";

export default function HomeNews({ copy, language, posts, featuredSlug }) {
  return (
    <section className={styles.other} aria-labelledby="home-other-title">
      <div className={`${styles.wrap} ${styles.otherGrid}`}>
        <div className={styles.otherAside}>
          {/* <span className={styles.eyebrow}>
            <span />
            {copy.otherEyebrow}
          </span> */}
          <h2 id="home-other-title" className={styles.otherTitle}>
            {copy.otherTitle}
          </h2>
          <p className={styles.sectionLead}>{copy.otherLead}</p>
        </div>
        <HomeNewsRows
          posts={posts.map((post) => ({ ...post, isNew: isRecentPost(post.date) }))}
          featuredSlug={featuredSlug}
          language={language}
          labels={{
            all: copy.all,
            featured: copy.featured,
            filterLabel: copy.newsFilters,
            empty: copy.emptyNews,
            showMore: copy.showMore,
            fewer: copy.fewer,
            categoryFallback: copy.categoryFallback,
            new: copy.newLabel,
            allNews: copy.allNews,
            archiveHref: NEWS_ARCHIVE_URI[language],
          }}
        />
      </div>
    </section>
  );
}
