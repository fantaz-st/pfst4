import BlockRenderer from "./BlockRenderer";

export default function Group({ block, language }) {
  return (
    <div>
      <BlockRenderer blocks={block.innerBlocks} language={language} />
    </div>
  );
}
