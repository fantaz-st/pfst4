"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Photo from "@/components/ui/Photo";
import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/format";
import { excerptText, getPostCategories } from "@/lib/posts";
import styles from "./HomeNewsRows.module.css";

// Lead card + rows shown before "show more".
const INITIAL_COUNT = 7;

const MONTHS = {
  hr: ["SIJ", "VELJ", "OŽU", "TRA", "SVI", "LIP", "SRP", "KOL", "RUJ", "LIS", "STU", "PRO"],
  en: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
};

// Read straight from the ISO string ("2025-10-28T…"), so the server's
// timezone can never shift the day.
function dateTile(iso, language) {
  return {
    day: String(Number(iso.slice(8, 10))),
    month: (MONTHS[language] ?? MONTHS.hr)[Number(iso.slice(5, 7)) - 1],
  };
}

/**
 * "Ostale novosti": category filters, the newest post as a navy lead card,
 * then rows with a date tile, title, one-line excerpt and category. On
 * hover-capable screens the hovered row's photo follows the cursor
 * (lerped in rAF) while the other rows fade back. Scroll reveals live in
 * PageMotion (data-news-lead, data-news-rows); a filter change replays a
 * short CSS entrance instead.
 */
export default function HomeNewsRows({ posts, featuredSlug, language, labels }) {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(false);
  const [changed, setChanged] = useState(false);
  const [hovered, setHovered] = useState(null);
  const wrapRef = useRef(null);
  const floatRef = useRef(null);

  const categories = useMemo(() => {
    const seen = new Set();
    return posts
      .flatMap((post) => getPostCategories(post, featuredSlug))
      .filter((category) => {
        if (seen.has(category.slug)) return false;
        seen.add(category.slug);
        return true;
      })
      .slice(0, 3);
  }, [posts, featuredSlug]);

  const filtered = posts.filter((post) => {
    if (filter === "all") return true;
    if (filter === "featured") {
      return (post.categories?.nodes ?? []).some((category) => category.slug === featuredSlug);
    }
    return getPostCategories(post, featuredSlug).some((category) => category.slug === filter);
  });
  const visible = expanded ? filtered : filtered.slice(0, INITIAL_COUNT);
  const [lead, ...rows] = visible;
  const hasMore = filtered.length > INITIAL_COUNT;
  const tabs = [
    { value: "all", label: labels.all },
    ...categories.map(({ slug, name }) => ({ value: slug, label: name })),
    { value: "featured", label: labels.featured },
  ];
  const categoryOf = (post) => getPostCategories(post, featuredSlug)[0]?.name ?? labels.categoryFallback;
  const hoveredPost = rows.find((post) => post.id === hovered);

  function chooseFilter(value) {
    setFilter(value);
    setExpanded(false);
    setChanged(true);
    setHovered(null);
  }

  // Cursor-following photo: hover + fine pointer + motion allowed only.
  // It sits right of the cursor, or left of it near the panel's right edge.
  useEffect(() => {
    const wrap = wrapRef.current;
    const el = floatRef.current;
    if (!wrap || !el) return undefined;
    const query = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let frame = 0;
    let placed = false;

    const tick = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      el.style.translate = `${x}px ${y}px`;
      frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(tick) : 0;
    };
    const move = (event) => {
      if (!query.matches) return;
      const rect = wrap.getBoundingClientRect();
      const px = event.clientX - rect.left;
      tx = px + (px > rect.width - 320 ? -288 : 48);
      ty = event.clientY - rect.top - 80;
      if (!placed) {
        x = tx;
        y = ty;
        placed = true;
      }
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const leave = () => {
      placed = false;
    };

    wrap.addEventListener("pointermove", move);
    wrap.addEventListener("pointerleave", leave);
    return () => {
      wrap.removeEventListener("pointermove", move);
      wrap.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(frame);
    };
  }, []);

  const enter = changed ? styles.enter : "";

  return (
    <div className={styles.content}>
      <div className={styles.tabs} role="group" aria-label={labels.filterLabel}>
        {tabs.map((tab) => (
          <button
            className={`${styles.tab} ${filter === tab.value ? styles.active : ""}`}
            type="button"
            key={tab.value}
            aria-pressed={filter === tab.value}
            onClick={() => chooseFilter(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {!lead && <p className={styles.empty}>{labels.empty}</p>}

      {lead && (
        <Link href={lead.uri} className={`${styles.lead} ${enter}`} data-news-lead key={`lead-${filter}`}>
          <span className={styles.leadText}>
            <span className={styles.leadMeta}>
              <span className={styles.leadCategory}>{categoryOf(lead)}</span>
              {lead.isNew && <span className={styles.new}>{labels.new}</span>}
              <time dateTime={lead.date} className="num">
                {formatDate(lead.date, language)}
              </time>
            </span>
            <span className={styles.leadTitle}>{lead.title}</span>
            {excerptText(lead.excerpt) && <span className={styles.leadExcerpt}>{excerptText(lead.excerpt)}</span>}
          </span>
          {/* No featured image: the light flag field (on the modra card). */}
          <span className={styles.leadMedia} data-news-lead-media>
            <Photo
              src={lead.featuredImage?.node?.sourceUrl}
              alt={lead.featuredImage?.node?.altText ?? ""}
              sizes="(max-width: 720px) 100vw, 340px"
              tone="light"
              fallback="flags"
              zoom
            />
          </span>
        </Link>
      )}

      {rows.length > 0 && (
        <div className={styles.listWrap} ref={wrapRef}>
          <ul
            className={`${styles.panel} ${enter}`}
            role="list"
            data-news-rows
            key={`rows-${filter}`}
            onPointerLeave={() => setHovered(null)}
          >
            {rows.map((post, index) => {
              const tile = dateTile(post.date, language);
              const excerpt = excerptText(post.excerpt);
              return (
                <li key={post.id} style={{ "--i": index }}>
                  <Link href={post.uri} className={styles.row} onPointerEnter={() => setHovered(post.id)}>
                    <time dateTime={post.date} className={styles.tile} aria-label={formatDate(post.date, language)}>
                      <span className={styles.tileDay} data-news-day>
                        {tile.day}
                      </span>
                      <span className={styles.tileMonth}>{tile.month}</span>
                    </time>
                    <span className={styles.main}>
                      <span className={styles.title}>{post.title}</span>
                      {excerpt && <span className={styles.excerpt}>{excerpt}</span>}
                    </span>
                    <span className={styles.category}>{categoryOf(post)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <span
            className={`${styles.floater} ${hoveredPost?.featuredImage?.node?.sourceUrl ? styles.floaterOn : ""}`}
            ref={floatRef}
            aria-hidden="true"
          >
            {rows.map((post) =>
              post.featuredImage?.node?.sourceUrl ? (
                <span key={post.id} className={`${styles.floatImage} ${post.id === hovered ? styles.floatImageOn : ""}`}>
                  <Image src={post.featuredImage.node.sourceUrl} alt="" fill sizes="260px" />
                </span>
              ) : null,
            )}
          </span>
        </div>
      )}

      <div className={styles.more}>
        {hasMore && (
          <Button variant="outline" arrow={false} onClick={() => setExpanded((value) => !value)} aria-expanded={expanded}>
            {expanded ? labels.fewer : labels.showMore}
          </Button>
        )}
        <Button href={labels.archiveHref} variant="primary">
          {labels.allNews}
        </Button>
      </div>
    </div>
  );
}
