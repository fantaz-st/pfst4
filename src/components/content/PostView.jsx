import Image from "next/image";
import Link from "next/link";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import Chip from "@/components/ui/Chip";
import NewsCard from "@/components/news/NewsCard";
import { NEWS_ARCHIVE_URI, getPostCategories } from "@/lib/posts";
import { getGoalIcon, sortByGoalNumber } from "@/lib/ciljevi";
import { formatDate } from "@/lib/format";
import { getNodeLanguage } from "@/lib/language";
import { getRelatedPosts } from "@/lib/news";
import { getNewsCopy } from "@/lib/newsCopy";
import PageHero from "./PageHero";
import PageTools from "./PageTools";
import styles from "./PostView.module.css";

/**
 * A news post. The design has no post template, so it is built from the
 * inner-page parts: page hero (category eyebrow, breadcrumbs back to the
 * archive), the article in .prose, and an aside with the post's SDG goals
 * (linking to the archive filter) and related news as news cards.
 */
export default async function PostView({ node }) {
  const language = getNodeLanguage(node);
  const copy = getNewsCopy(language);
  const archiveUri = NEWS_ARCHIVE_URI[language] ?? NEWS_ARCHIVE_URI.hr;
  const categories = getPostCategories(node);
  const goals = sortByGoalNumber(node.ciljevi?.nodes ?? []);
  const relatedPosts = await getRelatedPosts(node, language);

  return (
    <>
      <PageHero
        language={language}
        title={node.title}
        eyebrow={categories[0]?.name}
        crumbs={[{ label: copy.archiveTitle, uri: archiveUri }]}
        image={node.featuredImage?.node}
        titleSize="post"
      />

      <div className={styles.wrap}>
        <div className={styles.layout}>
          <article className={styles.article}>
            <header className={styles.meta} data-fade>
              <span className={styles.metaLeft}>
                <span className={styles.published}>
                  {copy.published}{" "}
                  <time dateTime={node.date} className="num">
                    {formatDate(node.date, language)}
                  </time>
                </span>
                {categories.map((category) => (
                  <Chip
                    key={category.slug}
                    tone="white"
                    href={`${archiveUri}?kategorija=${encodeURIComponent(category.slug)}`}
                  >
                    {category.name}
                  </Chip>
                ))}
              </span>
              <PageTools title={node.title} language={language} />
            </header>
            <div className="prose">
              <BlockRenderer blocks={node.blocks} language={language} />
            </div>
          </article>

          {(goals.length > 0 || relatedPosts.length > 0) && (
            <aside className={styles.aside}>
              {goals.length > 0 && (
                <section className={styles.panel} aria-labelledby="goals-heading" data-fade>
                  <h2 id="goals-heading" className={styles.panelTitle}>
                    {copy.goalsHeading}
                  </h2>
                  <ul className={styles.goals} role="list">
                    {goals.map((goal) => {
                      const icon = getGoalIcon(goal.slug, language);
                      if (!icon) return null;
                      return (
                        <li key={goal.slug}>
                          <Link
                            href={`${archiveUri}?cilj=${encodeURIComponent(goal.slug)}`}
                            className={styles.goal}
                          >
                            <Image src={icon} alt={copy.goalLink(goal.name)} sizes="72px" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}

              {relatedPosts.length > 0 && (
                <section aria-labelledby="related-heading">
                  <h2 id="related-heading" className={styles.relatedTitle}>
                    {copy.relatedHeading}
                  </h2>
                  <ul className={styles.related} role="list" data-stagger>
                    {relatedPosts.map((post) => (
                      <li key={post.id}>
                        <NewsCard
                          post={post}
                          language={language}
                          sizes="(max-width: 1080px) 50vw, 320px"
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </aside>
          )}
        </div>
      </div>
    </>
  );
}
