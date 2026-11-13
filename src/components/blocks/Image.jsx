import Image from "next/image";
import { renderWpHtml } from "@/lib/html";

// .prose is capped at 72ch (~45rem); without `sizes` next/image assumes the
// image's full intrinsic width and phones download desktop-sized files.
const PROSE_IMAGE_SIZES = "(min-width: 48rem) 45rem, 100vw";

export default function ImageBlock({ block, sizes = PROSE_IMAGE_SIZES }) {
  const { url, width, height, alt = "", caption } = block.attributes ?? {};
  if (!url || !width || !height) return null;

  return (
    <figure>
      <Image src={url} width={width} height={height} alt={alt} sizes={sizes} />
      {caption && <figcaption>{renderWpHtml(caption)}</figcaption>}
    </figure>
  );
}
