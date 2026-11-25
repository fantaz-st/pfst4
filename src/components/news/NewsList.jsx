"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import ArrowCircle from "@/components/ui/ArrowCircle";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Photo from "@/components/ui/Photo";
import { loadMoreNews, loadMoreSearch } from "@/lib/wp/actions";
import {
  excerptText,
  getFallbackCategoryLabel,
  getPostCategories,
} from "@/lib/posts";
import { getNewsCopy } from "@/lib/i18n/newsCopy";
import styles from "./NewsList.module.css";

const MONTHS_SHORT = {
  hr: [
    "SIJ",
    "VELJ",
    "OŽU",
    "TRA",
    "SVI",
    "LIP",
    "SRP",
    "KOL",
    "RUJ",
    "LIS",
    "STU",
    "PRO",
  ],
  en: [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ],
};

const MONTHS_LONG = {
  hr: [
    "Siječanj",
    "Veljača",
    "Ožujak",
    "Travanj",
    "Svibanj",
    "Lipanj",
    "Srpanj",
    "Kolovoz",
    "Rujan",
    "Listopad",
    "Studeni",
    "Prosinac",
  ],
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};

// Consecutive posts from the same month share a group, so "oldest first"
// and "load more" both keep working. Read straight from the ISO string so
// the server's timezone can never shift the day.
function groupByMonth(posts, language) {
  const groups = [];
  posts.forEach((post) => {
    const key = post.date?.slice(0, 7) ?? "";
    const last = groups[groups.length - 1];
    if (last?.key === key) {
      last.posts.push(post);
      return;
    }
    const month = (MONTHS_LONG[language] ?? MONTHS_LONG.hr)[
      Number(key.slice(5, 7)) - 1
    ];
    groups.push({
      key,
      label: `${month} ${key.slice(0, 4)}${language === "hr" ? "." : ""}`,
      posts: [post],
    });
  });
  return groups;
}

function ArchiveRow({ post, language, featuredSlug }) {
  const category = getPostCategories(post, featuredSlug)[0];
  const image = post.featuredImage?.node;
  const excerpt = excerptText(post.excerpt);

  return (
    <Link href={post.uri} className={styles.row}>
      <time dateTime={post.date} className={styles.date}>
        <span className={styles.day}>{Number(post.date.slice(8, 10))}</span>
        <span className={styles.month}>
          {
            (MONTHS_SHORT[language] ?? MONTHS_SHORT.hr)[
              Number(post.date.slice(5, 7)) - 1
            ]
          }
        </span>
      </time>
      <span className={styles.category}>
        {category?.name ?? getFallbackCategoryLabel(language)}
      </span>
      <span className={styles.title}>{post.title}</span>
      {excerpt && <span className={styles.excerpt}>{excerpt}</span>}
      <span className={styles.end}>
        {image?.sourceUrl ? (
          <span className={styles.thumb}>
            <Photo
              src={image.sourceUrl}
              alt=""
              sizes="(max-width: 720px) 84px, 168px"
              zoom
            />
          </span>
        ) : (
          <ArrowCircle tone="white" />
        )}
      </span>
    </Link>
  );
}

/**
 * News archive: rows grouped by month (big date, category, title, one-line
 * excerpt), a thumbnail only when the post has a featured image.
 * Cursor pagination. Site search uses the same rows, ungrouped (results
 * come in relevance order).
 */
export default function NewsList({
  initialPosts = [],
  initialPageInfo = {},
  language = "hr",
  mode = "news",
  query = "",
  filters = {},
  emptyLabel,
  activeChips = [],
  archivePath,
  featuredSlug,
}) {
  const copy = getNewsCopy(language);
  const [posts, setPosts] = useState(initialPosts);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const [sort, setSort] = useState("new");
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
              ...filters,
              sort,
              language,
            });
      setPosts((current) => [...current, ...page.nodes]);
      setPageInfo(page.pageInfo);
    });
  }

  function changeSort(nextSort) {
    if (sort === nextSort) return;
    startTransition(async () => {
      const page = await loadMoreNews({
        after: null,
        ...filters,
        sort: nextSort,
        language,
      });
      setPosts(page.nodes);
      setPageInfo(page.pageInfo);
      setSort(nextSort);
    });
  }

  if (mode === "search") {
    if (posts.length === 0) {
      return (
        <p className={styles.emptySearch}>{emptyLabel ?? copy.emptyList}</p>
      );
    }

    return (
      <div>
        <ul className={styles.rows} role="list">
          {posts.map((post) => (
            <li key={post.id}>
              <ArchiveRow
                post={post}
                language={language}
                featuredSlug={featuredSlug}
              />
            </li>
          ))}
        </ul>
        {pageInfo.hasNextPage && (
          <div className={styles.more}>
            <Button
              variant="outline"
              onClick={loadMore}
              disabled={isPending}
              aria-busy={isPending}
            >
              {isPending ? copy.loading : copy.loadMore}
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <section className={styles.results} aria-label={copy.archiveTitle}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarInfo}>
          <span className={styles.resultCount} aria-live="polite">
            {copy.resultsCount(posts.length)}
          </span>
          {activeChips.length > 0 && (
            <div className={styles.chips} aria-label={copy.activeFilterList}>
              {activeChips.map((chip) => (
                <Link
                  className={styles.activeChip}
                  href={chip.href}
                  key={`${chip.label}-${chip.href}`}
                  aria-label={copy.clearOneFilter(chip.label)}
                >
                  {chip.label}
                  <span className={styles.chipClose} aria-hidden="true">
                    <Icon name="close" size={14} />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className={styles.controls}>
          <div
            className={styles.segment}
            role="group"
            aria-label={copy.sortLabel}
          >
            <button
              type="button"
              aria-pressed={sort === "new"}
              data-active={sort === "new"}
              disabled={isPending}
              onClick={() => changeSort("new")}
            >
              {copy.newest}
            </button>
            <button
              type="button"
              aria-pressed={sort === "old"}
              data-active={sort === "old"}
              disabled={isPending}
              onClick={() => changeSort("old")}
            >
              {copy.oldest}
            </button>
          </div>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className={styles.empty}>
          <h2>{emptyLabel ?? copy.emptyList}</h2>
          <p>{copy.emptyHint}</p>
          {archivePath && (
            <Button href={archivePath} size="s">
              {copy.clearFilters}
            </Button>
          )}
        </div>
      ) : (
        <div aria-busy={isPending}>
          {groupByMonth(posts, language).map((group) => (
            <section className={styles.group} key={group.key}>
              <h2 className={styles.groupTitle}>{group.label}</h2>
              <ul className={styles.rows} role="list">
                {group.posts.map((post) => (
                  <li key={post.id}>
                    <ArchiveRow
                      post={post}
                      language={language}
                      featuredSlug={featuredSlug}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {pageInfo.hasNextPage && (
        <div className={styles.pager}>
          <Button
            variant="primary"
            size="m"
            arrow={false}
            onClick={loadMore}
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? copy.loading : copy.olderPosts}
            <Icon name="chevronDown" size={18} />
          </Button>
          <span>{copy.loadedPosts(posts.length)}</span>
        </div>
      )}
    </section>
  );
}
