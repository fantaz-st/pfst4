import styles from "./Column.module.css";
import BlockRenderer from "./BlockRenderer";

export default function Column({ block, language }) {
  return (
    <div className={styles.column}>
      <BlockRenderer blocks={block.innerBlocks} language={language} />
    </div>
  );
}
