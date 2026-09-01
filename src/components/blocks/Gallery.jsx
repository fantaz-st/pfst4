import styles from "./Gallery.module.css";
import ImageBlock from "./Image";

export default function Gallery({ block }) {
  const images = block.innerBlocks ?? [];
  if (images.length === 0) return null;

  return (
    <div className={styles.gallery}>
      {images.map((image, index) => (
        <ImageBlock key={index} block={image} />
      ))}
    </div>
  );
}
