export default function File({ block }) {
  const { href, fileLabel, filesizeHuman, extension } = block.attributes ?? {};
  if (!href) return null;

  const meta = [extension?.toUpperCase(), filesizeHuman].filter(Boolean).join(" · ");

  return (
    <a className="file-download" href={href} download>
      {fileLabel}
      {meta && <span className="file-meta">{meta}</span>}
    </a>
  );
}
