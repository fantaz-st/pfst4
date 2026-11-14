import Image from "next/image";
import Link from "next/link";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Hero from "@/components/layout/Hero";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import Icon from "@/components/ui/Icon";
import NewsCard from "@/components/news/NewsCard";
import { getGoalIcon, sortByGoalNumber } from "@/lib/ciljevi";
import { formatDate } from "@/lib/format";
import { getNodeLanguage } from "@/lib/language";
import {
  buildNewsWhere,
  getFeaturedCategorySlug,
  getPostCategories,
  getRelatedPosts,
} from "@/lib/news";
import { NEWS_POSTS } from "@/lib/queries";
import { wpFetch } from "@/lib/wp";
import { NEWS_ARCHIVE_URI } from "@/lib/posts";
import { getNewsCopy } from "@/lib/newsCopy";
import { renderWpHtml } from "@/lib/html";
import PageTools from "./PageTools";
import SplitReveal from "@/components/motion/SplitReveal";
import styles from "./PostView.module.css";

function getReadingTime(blocks) {
  function collect(items) {
    return (items ?? [])
      .map((block) => {
        const content = block.attributes?.content ?? block.attributes?.summary ?? "";
        const text = typeof content === "string" ? content.replace(/<[^>]*>/g, " ") : "";
        return `${text} ${collect(block.innerBlocks)}`;
      })
      .join(" ");
  }

  const words = collect(blocks).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function RailGroup({ label, children }) {
  return (
    <div className={styles.railGroup}>
      <span className={styles.railLabel}>{label}</span>
      {children}
    </div>
  );
}

export default async function PostView({ node }) {
  const language = getNodeLanguage(node);
  const copy = getNewsCopy(language);
  const archiveUri = NEWS_ARCHIVE_URI[language] ?? NEWS_ARCHIVE_URI.hr;
  const featuredSlug = await getFeaturedCategorySlug(language);
  const categories = getPostCategories(node, featuredSlug);
  const tags = node.tags?.nodes ?? [];
  const goals = sortByGoalNumber(node.ciljevi?.nodes ?? []);
  let relatedPosts = await getRelatedPosts(node, language);
  if (relatedPosts.length === 0) {
    const data = await wpFetch(
      NEWS_POSTS,
      {
        first: 5,
        after: null,
        where: buildNewsWhere({ language }),
      },
      { tags: ["wp"] },
    );
    relatedPosts = (data?.posts?.nodes ?? [])
      .filter((post) => post.id !== node.id)
      .slice(0, 3);
  }
  const readingTime = getReadingTime(node.blocks);
  const coverImage = node.featuredImage?.node;

  return (
    <>
      <div className={styles.progress} data-post-progress aria-hidden="true" />
      <Hero
        size="post"
        solid
        labelledBy="post-title"
      >
        <div className={styles.heroInner}>
          <Breadcrumbs
            items={
              categories[0]
                ? [{ label: copy.archiveTitle, uri: archiveUri }]
                : []
            }
            current={categories[0]?.name ?? copy.archiveTitle}
            language={language}
          />
          <div className={styles.heroBottom}>
            <div className={styles.heroMeta} data-hero-fade>
              {categories[0] && (
                <Link
                  className={styles.heroCategory}
                  href={`${archiveUri}?kategorija=${encodeURIComponent(categories[0].slug)}`}
                >
                  {categories[0].name}
                </Link>
              )}
              {tags.slice(0, 1).map((tag) => (
                <span className={styles.heroTag} key={tag.slug}>
                  {tag.name}
                </span>
              ))}
              <span className={styles.heroDate}>
                {formatDate(node.date, language)} · {copy.readingTime(readingTime)}
              </span>
            </div>
            <SplitReveal
              as="h1"
              id="post-title"
              mode="chars"
              start="top bottom"
              className={styles.title}
            >
              {node.title}
            </SplitReveal>
          </div>
        </div>
      </Hero>

      <main className={styles.main}>
        <div className={styles.layout}>
          <aside className={styles.rail} aria-label={copy.postDetails} data-fade>
            <RailGroup label={copy.published}>
              <span className={styles.railValue}>
                <Icon name="calendar" size={17} />
                <time dateTime={node.date} className="num">
                  {formatDate(node.date, language)}
                </time>
              </span>
            </RailGroup>
            {node.author?.node?.name && (
              <RailGroup label={copy.authorLabel}>
                <span className={styles.railValue}>
                  <Icon name="users" size={17} />
                  {node.author.node.name}
                </span>
              </RailGroup>
            )}
            {categories.length > 0 && (
              <RailGroup label={copy.categoriesLabel}>
                <span className={styles.categoryList}>
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
              </RailGroup>
            )}
            {goals.length > 0 && (
              <RailGroup label={copy.goalsHeading}>
                <span className={styles.goalList}>
                  {goals.map((goal) => {
                    const icon = getGoalIcon(goal.slug, language);
                    return icon ? (
                      <Link
                        key={goal.slug}
                        href={`${archiveUri}?cilj=${encodeURIComponent(goal.slug)}`}
                        className={styles.goal}
                        aria-label={copy.goalLink(goal.name)}
                      >
                        <Image src={icon} alt="" sizes="48px" />
                      </Link>
                    ) : null;
                  })}
                </span>
              </RailGroup>
            )}
            <RailGroup label={copy.shareLabel}>
              <PageTools title={node.title} language={language} />
            </RailGroup>
          </aside>

          <article className={styles.article} data-post-article>
            {coverImage?.sourceUrl && (
              <figure className={styles.coverFigure}>
                <div className={styles.coverImage} data-post-cover>
                  <Image
                    src={coverImage.sourceUrl}
                    alt={coverImage.altText || node.title}
                    fill
                    sizes="(min-width: 1080px) 720px, 100vw"
                    priority
                  />
                </div>
                {coverImage.caption && (
                  <figcaption className={styles.coverCaption}>
                    {renderWpHtml(coverImage.caption)}
                  </figcaption>
                )}
              </figure>
            )}
            <div className={`${styles.prose} prose`}>
              <BlockRenderer blocks={node.blocks} language={language} />
            </div>
          </article>
          <div className={styles.railSpacer} aria-hidden="true" />
        </div>
      </main>

      {relatedPosts.length > 0 && (
        <section className={styles.relatedSection} aria-labelledby="related-heading">
          <div className={styles.relatedHeader}>
            <SplitReveal
              as="h2"
              id="related-heading"
              mode="lines"
              start="top bottom"
              className={styles.relatedTitle}
            >
              {copy.relatedHeading}
            </SplitReveal>
            <Button href={archiveUri} variant="primary" size="m">
              {copy.allNews}
            </Button>
          </div>
          <ul className={styles.related} role="list" data-stagger>
            {relatedPosts.slice(0, 3).map((post) => (
              <li key={post.id}>
                <NewsCard
                  post={post}
                  language={language}
                  featuredSlug={featuredSlug}
                  sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 33vw"
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
