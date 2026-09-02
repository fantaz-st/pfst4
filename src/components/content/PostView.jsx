import Image from "next/image";
import Link from "next/link";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import { getCiljMeta, sortByGoalNumber } from "@/lib/ciljevi";
import { getRelatedPosts } from "@/lib/news";
import PostMeta from "@/components/news/PostMeta";
import styles from "./PostView.module.css";

export default async function PostView({ node }) {
  const language = node.language?.slug ?? "hr";
  const relatedPosts = await getRelatedPosts(node, language);
  const ciljevi = sortByGoalNumber(node.ciljevi?.nodes ?? []);
  const image = node.featuredImage?.node;

  return (
    <div className={styles.pageShell}>
      <article className={styles.article}>
        <div
          className={`${styles.hero} ${!image ? styles.heroWithoutImage : ""}`}
        >
          {image && (
            <div className={styles.imageFrame}>
              <Image
                src={image.sourceUrl}
                alt={image.altText || ""}
                width={1200}
                height={800}
                sizes="(min-width: 64rem) 50vw, calc(100vw - 2rem)"
                className={styles.featuredImage}
              />
            </div>
          )}
          <header className={styles.pageHeader}>
            {/* <p className={styles.kicker}>Novosti</p> */}
            <h1 className={styles.title}>{node.title}</h1>
            <PostMeta post={node} />
          </header>
        </div>

        <div className={styles.contentLayout}>
          <div className="prose">
            <BlockRenderer blocks={node.blocks} />
          </div>
          <aside className={styles.sidebar}>
            {ciljevi.length > 0 && (
              <section
                aria-labelledby="goals-heading"
                className={styles.sidebarSection}
              >
                <h2 id="goals-heading">Ciljevi održivog razvoja</h2>
                <div className={styles.goalGrid}>
                  {ciljevi.map((cilj) => {
                    const meta = getCiljMeta(cilj.slug);
                    return meta?.icon ? (
                      <Link
                        key={cilj.slug}
                        href={`/novosti/ciljevi/${cilj.slug}`}
                        className={styles.goalLink}
                        aria-label={cilj.name}
                      >
                        <Image
                          src={meta.icon}
                          alt=""
                          className={styles.goalIcon}
                        />
                      </Link>
                    ) : null;
                  })}
                </div>
              </section>
            )}

            {relatedPosts.length > 0 && (
              <section
                aria-labelledby="related-heading"
                className={styles.sidebarSection}
              >
                <h2 id="related-heading">Vezane vijesti</h2>
                <ul className={styles.relatedList}>
                  {relatedPosts.map((related) => {
                    const relatedImage = related.featuredImage?.node;
                    return (
                      <li key={related.id} className={styles.relatedItem}>
                        <Link
                          href={related.uri}
                          className={`${styles.relatedLink} ${!relatedImage ? styles.relatedLinkWithoutImage : ""}`}
                        >
                          {relatedImage && (
                            <Image
                              src={relatedImage.sourceUrl}
                              alt=""
                              width={160}
                              height={100}
                              sizes="(min-width: 64rem) 6rem, 8rem"
                              className={styles.relatedImage}
                            />
                          )}
                          <span className={styles.relatedBody}>
                            <span className={styles.relatedTitle}>
                              {related.title}
                            </span>
                            <time
                              dateTime={related.date}
                              className={styles.relatedDate}
                            >
                              {new Intl.DateTimeFormat(
                                language === "en" ? "en-GB" : "hr-HR",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              ).format(new Date(related.date))}
                            </time>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </aside>
        </div>
      </article>
    </div>
  );
}
