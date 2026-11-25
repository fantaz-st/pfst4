"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import styles from "./TimetableExport.module.css";

/**
 * "Ispiši / PDF" opens the browser's print dialog — the print stylesheet
 * (TimetablePage.module.css) leaves only the timetable sheet on an A4
 * landscape page, and every browser offers "Save as PDF" there, so the PDF
 * keeps real, selectable text.
 * "Spremi sliku" renders the same sheet to a 2× PNG with html-to-image
 * (loaded on click only). It captures an off-screen copy laid out at a fixed
 * desktop width, so a phone saves the same day-column image as a laptop.
 * The copy carries [data-exporting], which shows the export header
 * (faculty, selection, week) and overrides the ≤900px list layout.
 */
const EXPORT_WIDTH = 1320;
export default function TimetableExport({ targetId, filename }) {
  const [busy, setBusy] = useState(false);

  async function saveImage() {
    const node = document.getElementById(targetId);
    if (!node || busy) return;
    setBusy(true);

    const holder = document.createElement("div");
    holder.setAttribute("aria-hidden", "true");
    Object.assign(holder.style, { position: "fixed", top: "0", left: "-100000px", pointerEvents: "none" });
    const copy = node.cloneNode(true);
    copy.removeAttribute("id");
    copy.dataset.exporting = "true";
    copy.style.width = `${EXPORT_WIDTH}px`;
    holder.append(copy);
    document.body.append(holder);

    try {
      const { toPng } = await import("html-to-image");
      const url = await toPng(copy, {
        pixelRatio: 2,
        width: EXPORT_WIDTH,
        backgroundColor: getComputedStyle(copy).backgroundColor,
      });
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.png`;
      link.click();
    } catch (error) {
      console.error("Timetable image export failed", error);
    } finally {
      holder.remove();
      setBusy(false);
    }
  }

  return (
    <div className={styles.actions}>
      <button type="button" className={styles.action} onClick={() => window.print()}>
        <Icon name="print" size={18} />
        Ispiši / PDF
      </button>
      <button type="button" className={styles.action} onClick={saveImage} disabled={busy} aria-busy={busy}>
        <Icon name="download" size={18} />
        {busy ? "Spremam…" : "Spremi sliku"}
      </button>
    </div>
  );
}
