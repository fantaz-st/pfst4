import { getChromeCopy } from "@/lib/chromeCopy";
import styles from "./PreviewBanner.module.css";

// Draft-mode notice: a modra pill fixed at the bottom, above the content.
export default function PreviewBanner({ language = "hr" }) {
  const copy = getChromeCopy(language);
  return (
    <div className={styles.banner} role="status">
      <span>{copy.previewNotice}</span>
      {/* A route handler, not a page: a plain link, not next/link. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/api/preview/disable" className={styles.exit}>
        {copy.previewExit}
      </a>
    </div>
  );
}
