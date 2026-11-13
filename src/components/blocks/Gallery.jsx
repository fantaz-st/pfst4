import styles from "./Gallery.module.css";
import ImageBlock from "./Image";

// Gallery tiles are minmax(12rem, 1fr) inside a ~45rem column, so each image
// renders at roughly a third of the column on desktop, half on phones.
const GALLERY_IMAGE_SIZES = "(min-width: 48rem) 15rem, 50vw";

export default function Gallery({ block }) {
  const images = block.innerBlocks ?? [];
  if (images.length === 0) return null;

  return (
    <div className={styles.gallery}>
      {images.map((image, index) => (
        <ImageBlock key={index} block={image} sizes={GALLERY_IMAGE_SIZES} />
      ))}
    </div>
  );
}
