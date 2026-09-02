import BlockRenderer from "@/components/blocks/BlockRenderer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import SectionRail from "@/components/layout/SectionRail";
import styles from "./PageView.module.css";

export default function PageView({ node }) {
  const children = node.children?.nodes ?? [];
  const hasContent = Array.isArray(node.blocks) && node.blocks.length > 0;

  const pageHeader = (
    <header className={styles.pageHeader}>
      <Breadcrumbs page={node} />
      <h1 className={styles.title}>{node.title}</h1>
    </header>
  );

  const childPagesList =
    children.length > 0 ? (
      <section
        className={styles.childPages}
        aria-labelledby="child-pages-heading"
      >
        <div className={styles.childPagesHeader}>
          <p className={styles.kicker}>Sadržaj</p>
          <h2 id="child-pages-heading">Povezane stranice</h2>
        </div>
        <ul className={styles.childPagesList}>
          {children.map((child) => (
            <li key={child.id}>
              <a href={child.uri}>{child.title}</a>
            </li>
          ))}
        </ul>
      </section>
    ) : null;

  return (
    <div className={styles.pageShell}>
      <div className={styles.layout}>
        <div className={styles.content}>
          {pageHeader}
          <article className={`${styles.article} prose`}>
            {hasContent ? <BlockRenderer blocks={node.blocks} /> : null}
            {!hasContent && children.length > 0 ? (
              <div className={styles.emptyContentState}>
                <p>
                  Odabrana sekcija sadrži sljedeće stranice i dokumente povezane
                  s ovom temom.
                </p>
              </div>
            ) : null}
          </article>
          {children.length > 0 && !hasContent ? (
            <div className={styles.childrenListWrap}>{childPagesList}</div>
          ) : null}
          {children.length > 0 && hasContent ? childPagesList : null}
        </div>
        <aside className={styles.sidebar}>
          <SectionRail page={node} />
        </aside>
      </div>
    </div>
  );
}