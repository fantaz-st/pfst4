"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { loadMoreNews, loadMoreSearch } from "@/lib/actions";
import { getDisplayCategories } from "@/lib/news";
import CategoryBadge from "./CategoryBadge";
import styles from "./ArticleList.module.css";

export default function ArticleList({
  initialPosts = [],
  initialPageInfo = {},
  language = "hr",
  mode = "news",
  query = "",
  categorySlug,
  ciljeviSlugs = [],
  dateFrom,
  dateTo,
  variant = "default",
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const [isPending, startTransition] = useTransition();

  function loadMore() {
    startTransition(async () => {
      const page =
        mode === "search"
          ? await loadMoreSearch({
              after: pageInfo.endCursor,
              query,
              type: "posts",
              language,
            })
          : await loadMoreNews({
              after: pageInfo.endCursor,
              categorySlug,
              ciljeviSlugs,
              dateFrom,
              dateTo,
              language,
            });
      setPosts((current) => [...current, ...page.nodes]);
      setPageInfo(page.pageInfo);
    });
  }

  if (posts.length === 0) return null;

  return (
    <div>
      <ul
        className={`${styles.list} ${variant === "home" ? styles.homeList : ""}`}
      >
        {posts.map((post) => {
          const categories = getDisplayCategories(post);
          const dateLabel = new Intl.DateTimeFormat(
            language === "en" ? "en-GB" : "hr-HR",
            { day: "2-digit", month: "2-digit" },
          ).format(new Date(post.date));
          return (
            <li key={post.id}>
              <Link
                href={post.uri}
                className={`${styles.row} ${variant === "home" ? styles.homeRow : ""}`}
              >
                <span className={styles.meta}>
                  <span>{dateLabel}</span>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <CategoryBadge
                        key={category.slug}
                        category={category}
                        language={language}
                      />
                    ))
                  ) : (
                    <CategoryBadge category={null} language={language} />
                  )}
                </span>
                <span className={styles.title}>{post.title}</span>
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      {pageInfo.hasNextPage && (
        <button
          type="button"
          className={styles.loadMore}
          onClick={loadMore}
          disabled={isPending}
        >
          {isPending
            ? language === "en"
              ? "Loading..."
              : "Učitavanje..."
            : language === "en"
              ? "Load more articles"
              : "Učitaj još članaka"}
        </button>
      )}
    </div>
  );
}
