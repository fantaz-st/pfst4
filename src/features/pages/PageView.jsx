import BlockRenderer from "@/components/blocks/BlockRenderer";
import { getChromeCopy } from "@/lib/i18n/chromeCopy";
import { getNodeLanguage } from "@/lib/i18n/language";
import { formatDate } from "@/lib/format";
import { withHeadingAnchors } from "@/features/pages/headings";
import { getSectionRootUri, getSectionTree } from "@/features/pages/section";
import PageHero from "@/components/layout/PageHero";
import SectionNav from "./SectionNav";
import Toc from "./Toc";
import PageTools from "./PageTools";
import HubGrid from "./HubGrid";
import PrevNext from "./PrevNext";
import RecordVisit from "@/features/personal/RecordVisit";
import styles from "./PageView.module.css";

/**
 * The one WordPress page template (design/reference/page.html). A page with
 * children is also a section overview (opcenito.html): its content, if
 * any, then a card per child page.
 */
export default async function PageView({ node }) {
  const language = getNodeLanguage(node);
  const copy = getChromeCopy(language);
  const tree = await getSectionTree(getSectionRootUri(node));
  const children = node.children?.nodes ?? [];
  const { blocks, toc } = withHeadingAnchors(node.blocks ?? []);
  const hasContent = blocks.length > 0;

  // Root-first ancestors; the nearest one is the hero eyebrow.
  const ancestors = [...(node.ancestors?.nodes ?? [])].reverse();
  const parent = ancestors[ancestors.length - 1];
  const showSidebar = tree && tree.children.length > 0;

  return (
    <>
      <RecordVisit uri={node.uri} title={node.title} />
      <PageHero
        language={language}
        title={node.title}
        eyebrow={parent?.title}
        lead={node.seo?.metaDesc || undefined}
        crumbs={ancestors.map((item) => ({ label: item.title, uri: item.uri }))}
        image={node.featuredImage?.node}
        // Section pages (top level: Fakultet, Nastava…) without a featured
        // image get the flag wall; deeper pages keep the quiet contours.
        fallback={ancestors.length === 0 ? "wall" : undefined}
      />

      <div className={styles.wrap}>
        <div className={styles.layout}>
          {showSidebar && (
            <aside className={styles.side} aria-label={copy.sectionNavLabel}>
              <SectionNav tree={tree} currentUri={node.uri} language={language} />
              <Toc items={toc} language={language} />
            </aside>
          )}

          <div className={styles.main}>
            {hasContent && (
              <article className={styles.article}>
                <header className={styles.meta} data-fade>
                  {node.modified && (
                    <span className={styles.modified}>
                      {copy.lastModified}{" "}
                      <time dateTime={node.modified} className="num">
                        {formatDate(node.modified, language)}
                      </time>
                    </span>
                  )}
                  <PageTools title={node.title} language={language} />
                </header>
                <div className="prose">
                  <BlockRenderer blocks={blocks} language={language} />
                </div>
              </article>
            )}

            {children.length > 0 ? (
              <HubGrid pages={children} language={language} />
            ) : (
              <PrevNext page={node} language={language} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
