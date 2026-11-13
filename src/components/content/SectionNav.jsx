"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { getChromeCopy } from "@/lib/chromeCopy";
import styles from "./SectionNav.module.css";

function withSlash(path) {
  return path.endsWith("/") ? path : `${path}/`;
}

function contains(node, uri) {
  return withSlash(uri).startsWith(withSlash(node.uri));
}

// Ids of every node on the path to the current page: open by default.
function openPath(nodes, uri, out = new Set()) {
  for (const node of nodes) {
    if (contains(node, uri) && node.children.length > 0) {
      out.add(node.id);
      openPath(node.children, uri, out);
    }
  }
  return out;
}

/**
 * Inner-page sidebar (STYLEGUIDE §6, design/reference/page.html): the
 * WordPress page hierarchy of the current section, three levels. The
 * current section is a modra row, the current page a plava-tint row with a
 * plava dot; groups on the path to the current page start expanded. A row
 * with children is a link to that page plus a chevron button that
 * expands/collapses it, so every page stays reachable.
 */
export default function SectionNav({ tree, currentUri, language = "hr" }) {
  const copy = getChromeCopy(language);
  const [open, setOpen] = useState(() => openPath(tree.children, currentUri));

  function toggle(id) {
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function renderRow(node, level) {
    const isCurrentPage = withSlash(node.uri) === withSlash(currentUri);
    const inPath = contains(node, currentUri);
    const hasChildren = level < 3 && node.children.length > 0;
    const expanded = open.has(node.id);
    const panelId = `side-${node.id}`;

    const rowClass = [
      styles.row,
      styles[`l${level}`],
      level === 1 && inPath ? styles.section : null,
      level > 1 && isCurrentPage ? styles.current : null,
      expanded ? styles.open : null,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <li key={node.id}>
        <div className={rowClass}>
          <Link
            href={node.uri}
            className={styles.link}
            aria-current={isCurrentPage ? "page" : undefined}
          >
            {node.title}
          </Link>
          {hasChildren && (
            <button
              type="button"
              className={styles.toggle}
              aria-expanded={expanded}
              aria-controls={panelId}
              aria-label={copy.toggleSubpages(node.title)}
              onClick={() => toggle(node.id)}
            >
              <Icon name="chevronDown" size={16} />
            </button>
          )}
        </div>
        {hasChildren && (
          <ul
            id={panelId}
            className={`${styles.list} ${styles[`kids${level}`]}`}
            role="list"
            hidden={!expanded}
          >
            {node.children.map((child) => renderRow(child, level + 1))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <nav className={styles.side} aria-label={copy.sectionNavLabel} data-fade>
      <div className={styles.header}>
        <Link href={tree.uri} className={styles.rootLink}>
          {tree.title}
        </Link>
        <span className={styles.count}>{copy.sectionCount(tree.children.length)}</span>
      </div>
      <ul className={styles.list} role="list">
        {tree.children.map((node) => renderRow(node, 1))}
      </ul>
    </nav>
  );
}
