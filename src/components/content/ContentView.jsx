import BlockRenderer from "@/components/blocks/BlockRenderer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import SectionRail from "@/components/layout/SectionRail";
import PostMeta from "@/components/news/PostMeta";
import styles from "./ContentView.module.css";

export default function ContentView({ node }) {
  if (node.__typename !== "Page") {
    return (
      <div className={styles.postWrapper}>
        <article className="prose">
          <h1>{node.title}</h1>
          <PostMeta post={node} />
          <BlockRenderer blocks={node.blocks} />
        </article>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <Breadcrumbs page={node} />
        <article className="prose">
          <h1>{node.title}</h1>
          <BlockRenderer blocks={node.blocks} />
        </article>
      </div>
      <aside className={styles.sidebar}>
        <SectionRail page={node} />
      </aside>
    </div>
  );
}
