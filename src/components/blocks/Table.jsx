import { renderWpHtml } from "@/lib/html";

export default function Table({ block }) {
  const { headers = [], rows = [], caption, fixed } = block.attributes ?? {};
  if (rows.length === 0) return null;

  return (
    <table style={fixed ? { tableLayout: "fixed" } : undefined}>
      {caption && <caption>{renderWpHtml(caption)}</caption>}
      {headers.length > 0 && (
        <thead>
          <tr>
            {headers.map((cell, index) => (
              <th key={index}>{renderWpHtml(cell)}</th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{renderWpHtml(cell)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
