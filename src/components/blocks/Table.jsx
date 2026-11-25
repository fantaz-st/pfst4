import { useId } from "react";
import { renderWpHtml } from "@/lib/html";
import { getChromeCopy } from "@/lib/i18n/chromeCopy";
import ConsultationsBlock from "@/features/consultations/ConsultationsBlock";
import styles from "./Table.module.css";

// Staff tables run to five columns, so the table scrolls sideways on narrow
// screens. The scroll lives on a wrapper rather than on the <table> itself:
// giving a table display:block makes Safari/VoiceOver stop announcing it as
// a table. The wrapper is focusable so keyboard users can scroll it, and it
// is a named region so screen readers say what that focus stop is.
export default function Table({ block, language }) {
  const captionId = useId();
  const { headers = [], rows = [], caption, fixed, className = "" } = block.attributes ?? {};
  if (rows.length === 0) return null;

  // The consultations schedule (class "konzultacije" on the block) becomes
  // a searchable list instead of a plain table.
  if (className.split(/\s+/).includes("konzultacije")) {
    return <ConsultationsBlock block={block} language={language} />;
  }

  const labelProps = caption
    ? { "aria-labelledby": captionId }
    : { "aria-label": getChromeCopy(language).tableLabel };

  return (
    <div className={styles.scroll} role="region" tabIndex={0} {...labelProps}>
      <table className={fixed ? styles.fixed : undefined}>
        {caption && <caption id={captionId}>{renderWpHtml(caption)}</caption>}
        {headers.length > 0 && (
          <thead>
            <tr>
              {headers.map((cell, index) => (
                <th key={index} scope="col">
                  {renderWpHtml(cell)}
                </th>
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
    </div>
  );
}
