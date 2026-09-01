import BlockRenderer from "./BlockRenderer";

export default function Group({ block }) {
  return (
    <div>
      <BlockRenderer blocks={block.innerBlocks} />
    </div>
  );
}
