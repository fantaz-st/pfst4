import GalleryMosaic from "./GalleryMosaic";

const toText = (html) =>
  String(html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

// core/gallery → the mosaic + PhotoSwipe viewer (GalleryMosaic).
export default function Gallery({ block, language = "hr" }) {
  const images = (block.innerBlocks ?? [])
    .map((image) => image.attributes ?? {})
    .filter((image) => image.url && image.width && image.height)
    .map((image) => ({
      src: image.url,
      width: image.width,
      height: image.height,
      alt: image.alt ?? "",
      caption: toText(image.caption),
    }));
  if (images.length === 0) return null;

  return <GalleryMosaic images={images} language={language} />;
}
