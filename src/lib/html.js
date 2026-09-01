import DOMPurify from "isomorphic-dompurify";
import parse, { domToReact, attributesToProps } from "html-react-parser";
import Link from "next/link";
import Image from "next/image";

const BACKEND_HOST = getBackendHost();

function getBackendHost() {
  try {
    return new URL(process.env.WP_GRAPHQL_ENDPOINT).hostname;
  } catch {
    return null;
  }
}

export function renderWpHtml(html) {
  if (!html) return null;
  const clean = DOMPurify.sanitize(html);
  return parse(clean, { replace });
}

function replace(domNode) {
  if (domNode.type !== "tag") return;

  if (domNode.name === "a") {
    return replaceAnchor(domNode);
  }

  if (domNode.name === "img") {
    return replaceImage(domNode);
  }
}

function replaceAnchor(domNode) {
  const href = domNode.attribs?.href;
  if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return;
  }

  const internalPath = resolveInternalPath(href);
  if (!internalPath) {
    return;
  }

  const { href: _href, ...props } = attributesToProps(domNode.attribs);
  return (
    <Link href={internalPath} {...props}>
      {domToReact(domNode.children, { replace })}
    </Link>
  );
}

function resolveInternalPath(href) {
  if (href.startsWith("/")) {
    return href;
  }

  try {
    const url = new URL(href);
    const isBackendPage =
      BACKEND_HOST &&
      url.hostname === BACKEND_HOST &&
      !url.pathname.startsWith("/wp-content/");
    if (isBackendPage) {
      return `${url.pathname}${url.search}${url.hash}`;
    }
  } catch {
    return null;
  }

  return null;
}

function replaceImage(domNode) {
  const { src, alt, width, height } = domNode.attribs ?? {};
  const w = Number(width);
  const h = Number(height);

  if (!src || !Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
    return;
  }

  return <Image src={src} alt={alt ?? ""} width={w} height={h} />;
}
