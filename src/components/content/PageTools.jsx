"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { getChromeCopy } from "@/lib/chromeCopy";
import styles from "./PageTools.module.css";

// Print and share (design/reference/page.html). Share uses the system share
// sheet where there is one, otherwise copies the link.
export default function PageTools({ title, language = "hr" }) {
  const copy = getChromeCopy(language);
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // dismissed
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard blocked: nothing sensible to fall back to
    }
  }

  return (
    <span className={styles.tools}>
      <button
        type="button"
        className={styles.tool}
        aria-label={copy.printPage}
        onClick={() => window.print()}
      >
        <Icon name="print" size={18} />
      </button>
      <button type="button" className={styles.tool} aria-label={copy.sharePage} onClick={share}>
        <Icon name="share" size={18} />
      </button>
      <span className={styles.status} role="status">
        {copied ? copy.linkCopied : ""}
      </span>
    </span>
  );
}
