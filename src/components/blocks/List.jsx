import { renderWpHtml } from "@/lib/html";
import BlockRenderer from "./BlockRenderer";

export default function List({ block }) {
  const ordered = block.attributes?.ordered === true;
  const items = block.innerBlocks ?? [];
  if (items.length === 0) return null;

  const Tag = ordered ? "ol" : "ul";

  return (
    <Tag>
      {items.map((item, index) => (
        <ListItem key={index} item={item} />
      ))}
    </Tag>
  );
}

function ListItem({ item }) {
  const content = item.attributes?.content ?? "";

  return (
    <li>
      {renderWpHtml(content)}
      <BlockRenderer blocks={item.innerBlocks} />
    </li>
  );
}
