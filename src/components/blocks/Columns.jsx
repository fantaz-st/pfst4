import styles from "./Columns.module.css";
import BlockRenderer from "./BlockRenderer";

export default function Columns({ block }) {
  const columns = block.innerBlocks ?? [];
  if (columns.length === 0) return null;

  const template = columns.map((column) => column.attributes?.width || "1fr").join(" ");

  return (
    <div className={styles.columns} style={{ "--columns-template": template }}>
      <BlockRenderer blocks={columns} />
    </div>
  );
}
