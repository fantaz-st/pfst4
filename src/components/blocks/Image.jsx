import Image from "next/image";
import { renderWpHtml } from "@/lib/html";

export default function ImageBlock({ block }) {
  const { url, width, height, alt = "", caption } = block.attributes ?? {};
  if (!url || !width || !height) return null;

  return (
    <figure>
      <Image src={url} width={width} height={height} alt={alt} />
      {caption && <figcaption>{renderWpHtml(caption)}</figcaption>}
    </figure>
  );
}
