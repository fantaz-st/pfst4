import styles from "./File.module.css";

// core/file — white r16 panel: file name + type/size, round download icon.
export default function File({ block }) {
  const { href, fileLabel, filesizeHuman, extension } = block.attributes ?? {};
  if (!href) return null;

  const meta = [extension?.toUpperCase(), filesizeHuman].filter(Boolean).join(" · ");

  return (
    <a className={styles.file} href={href} download>
      <span className={styles.text}>
        <span className={styles.label}>{fileLabel}</span>
        {meta && <span className={`${styles.meta} num`}>{meta}</span>}
      </span>
      <span className={styles.icon} aria-hidden="true">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 4v12M6 10l6 6 6-6M5 20h14" />
        </svg>
      </span>
    </a>
  );
}
