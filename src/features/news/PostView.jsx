import Image from "next/image";
import Link from "next/link";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Hero from "@/components/layout/Hero";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import FlagWall from "@/components/ui/FlagWall";
import Icon from "@/components/ui/Icon";
import NewsCard from "@/features/news/NewsCard";
import RecordVisit from "@/features/personal/RecordVisit";
import { getGoalIcon, sortByGoalNumber } from "@/features/news/ciljevi";
import { formatDate } from "@/lib/format";
import { getNodeLanguage } from "@/lib/i18n/language";
import { buildNewsWhere, getFeaturedCategorySlug, getPostCategories, getRelatedPosts } from "@/lib/wp/news";
import { NEWS_POSTS } from "@/lib/wp/queries";
import { wpFetch } from "@/lib/wp/wp";
import { NEWS_ARCHIVE_URI } from "@/lib/posts";
import { getNewsCopy } from "@/lib/i18n/newsCopy";
import { renderWpHtml } from "@/lib/html";
import PageTools from "@/features/pages/PageTools";
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

// Plain text for comparing an excerpt with the post body.
function toPlainText(html = "") {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[#\w]+;/g, " ")
    .replace(/\[\s*(…|\.\.\.)?\s*\]|…/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// The hero shows only an excerpt an editor wrote. WordPress fills `excerpt`
// from the first words of the post when there isn't one, which would just
// repeat the lead paragraph under the title — those are recognised by
// matching the start of the body text and skipped.
function getManualExcerpt(node) {
  const excerpt = toPlainText(node.excerpt);
  if (!excerpt) return null;
  const firstParagraph = (node.blocks ?? []).find((block) => block.name === "core/paragraph" && block.attributes?.content?.trim());
  const body = toPlainText(firstParagraph?.attributes?.content);
  const probe = excerpt.slice(0, 60);
  if (body && body.startsWith(probe)) return null;
  return node.excerpt;
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
    relatedPosts = (data?.posts?.nodes ?? []).filter((post) => post.id !== node.id).slice(0, 3);
  }
  const readingTime = getReadingTime(node.blocks);
  const coverImage = node.featuredImage?.node;
  const hasCover = Boolean(coverImage?.sourceUrl);
  const excerpt = getManualExcerpt(node);

  return (
    <>
      <div className={styles.progress} data-post-progress aria-hidden="true" />
      <RecordVisit uri={node.uri} title={node.title} />
      <Hero size="post" solid>
        <Breadcrumbs items={categories[0] ? [{ label: copy.archiveTitle, uri: archiveUri }] : []} current={categories[0]?.name ?? copy.archiveTitle} language={language} />
      </Hero>

      <div className={styles.main}>
        <header className={styles.header}>
          <div className={styles.meta} data-fade>
            {categories[0] && (
              <Link className={styles.category} href={`${archiveUri}?kategorija=${encodeURIComponent(categories[0].slug)}`}>
                {categories[0].name}
              </Link>
            )}
            <span className="num">
              <time dateTime={node.date}>{formatDate(node.date, language)}</time> · {copy.readingTime(readingTime)}
            </span>
          </div>
          <SplitReveal as="h1" id="post-title" mode="lines" start="top bottom" className={styles.title}>
            {node.title}
          </SplitReveal>
          {excerpt && (
            <div className={styles.excerpt} data-fade>
              {renderWpHtml(excerpt)}
            </div>
          )}
          {hasCover ? (
            <figure className={styles.cover}>
              <div className={styles.coverImage} data-post-cover>
                <Image
                  src={coverImage.sourceUrl}
                  alt={coverImage.altText || node.title}
                  width={coverImage.mediaDetails?.width ?? 1600}
                  height={coverImage.mediaDetails?.height ?? 900}
                  sizes="(max-width: 1080px) 100vw, 996px"
                  priority
                />
              </div>
              {coverImage.caption && <figcaption className={styles.caption}>{renderWpHtml(coverImage.caption)}</figcaption>}
            </figure>
          ) : (
            // No featured image: a banner of the turning flag wall, seeded
            // by the post so each one keeps its own arrangement.
            <div className={styles.coverWall} data-post-cover>
              <FlagWall seed={node.id} />
            </div>
          )}
        </header>

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
                    <Chip key={category.slug} tone="white" href={`${archiveUri}?kategorija=${encodeURIComponent(category.slug)}`}>
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
                      <Link key={goal.slug} href={`${archiveUri}?cilj=${encodeURIComponent(goal.slug)}`} className={styles.goal} aria-label={copy.goalLink(goal.name)}>
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
            <div className={`${styles.prose} prose`}>
              <BlockRenderer blocks={node.blocks} language={language} />
            </div>
          </article>
          <div className={styles.railSpacer} aria-hidden="true" />
        </div>
      </div>

      {relatedPosts.length > 0 && (
        <section className={styles.relatedSection} aria-labelledby="related-heading">
          <div className={styles.relatedHeader}>
            <SplitReveal as="h2" id="related-heading" mode="lines" start="top bottom" className={styles.relatedTitle}>
              {copy.relatedHeading}
            </SplitReveal>
            <Button href={archiveUri} variant="primary" size="m">
              {copy.allNews}
            </Button>
          </div>
          <ul className={styles.related} role="list" data-stagger>
            {relatedPosts.slice(0, 3).map((post) => (
              <li key={post.id}>
                <NewsCard post={post} language={language} featuredSlug={featuredSlug} sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 33vw" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
