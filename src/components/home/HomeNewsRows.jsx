"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ArrowCircle from "@/components/ui/ArrowCircle";
import Chip from "@/components/ui/Chip";
import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/format";
import { getPostCategories } from "@/lib/posts";
import styles from "./HomeNewsRows.module.css";

const INITIAL_COUNT = 7;

export default function HomeNewsRows({ posts, featuredSlug, language, labels }) {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(false);

  const categories = useMemo(() => {
    const seen = new Set();
    return posts.flatMap((post) => getPostCategories(post, featuredSlug))
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
  const hasMore = filtered.length > INITIAL_COUNT;
  const tabs = [
    { value: "all", label: labels.all },
    ...categories.map(({ slug, name }) => ({ value: slug, label: name })),
    { value: "featured", label: labels.featured },
  ];

  function chooseFilter(value) {
    setFilter(value);
    setExpanded(false);
  }

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

      {visible.length ? (
        <ul className={styles.panel} role="list">
          {visible.map((post) => {
            const category = getPostCategories(post, featuredSlug)[0];
            return (
              <li key={post.id}>
                <Link href={post.uri} className={styles.row}>
                  <time dateTime={post.date} className={`${styles.date} num`}>
                    {formatDate(post.date, language)}
                  </time>
                  <span className={styles.title}>{post.title}</span>
                  <span className={styles.category}>
                    <Chip className={styles.chipPill}>{category?.name ?? labels.categoryFallback}</Chip>
                  </span>
                  <ArrowCircle className={styles.arrow} />
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className={styles.empty}>{labels.empty}</p>
      )}

      {hasMore && (
        <div className={styles.more}>
          <Button
            variant="outline"
            arrow={false}
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
          >
            {expanded ? labels.fewer : labels.showMore}
          </Button>
        </div>
      )}
    </div>
  );
}
