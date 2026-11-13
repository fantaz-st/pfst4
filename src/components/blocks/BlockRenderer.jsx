import Paragraph from "./Paragraph";
import Heading from "./Heading";
import List from "./List";
import Table from "./Table";
import Details from "./Details";
import ImageBlock from "./Image";
import File from "./File";
import Columns from "./Columns";
import Column from "./Column";
import Group from "./Group";
import Gallery from "./Gallery";

const ELEMENTS = {
  "core/paragraph": Paragraph,
  "core/heading": Heading,
  "core/list": List,
  "core/table": Table,
  "core/details": Details,
  "core/image": ImageBlock,
  "core/file": File,
  "core/columns": Columns,
  "core/column": Column,
  "core/group": Group,
  "core/gallery": Gallery,
};

// `language` is threaded through every container block so leaf blocks can
// localize their own UI text (e.g. the table's accessible name).
export default function BlockRenderer({ blocks, language = "hr" }) {
  if (!blocks) return null;

  return blocks.map((block, index) => {
    const Element = ELEMENTS[block.name];
    if (!Element) return null;
    return <Element key={index} block={block} language={language} />;
  });
}
