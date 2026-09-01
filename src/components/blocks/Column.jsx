import styles from "./Column.module.css";
import BlockRenderer from "./BlockRenderer";

export default function Column({ block }) {
  return (
    <div className={styles.column}>
      <BlockRenderer blocks={block.innerBlocks} />
    </div>
  );
}
