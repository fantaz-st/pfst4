"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import ArrowCircle from "@/components/ui/ArrowCircle";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import Icon from "@/components/ui/Icon";
import Photo from "@/components/ui/Photo";
import { loadMoreNews, loadMoreSearch } from "@/lib/actions";
import { formatDate } from "@/lib/format";
import {
  getFallbackCategoryLabel,
  getPostCategories,
} from "@/lib/posts";
import { getNewsCopy } from "@/lib/newsCopy";
import NewsRow from "./NewsRow";
import styles from "./NewsList.module.css";

function ArchiveCard({ post, language, featuredSlug, featured }) {
  const category = getPostCategories(post, featuredSlug)[0];
  const image = post.featuredImage?.node;

  return (
    <Link
      href={post.uri}
      className={styles.card}
      data-featured={featured}
      data-has-image={Boolean(image?.sourceUrl)}
    >
      {image?.sourceUrl && (
        <span className={styles.imageWrap}>
          <Photo
            src={image.sourceUrl}
            alt=""
            sizes={
              featured
                ? "(max-width: 720px) 100vw, (max-width: 1080px) 100vw, 66vw"
                : "(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 33vw"
            }
            ratio="4/3"
            radius="card"
            zoom
          />
        </span>
      )}
      <span className={styles.body}>
        <span className={styles.meta}>
          <time dateTime={post.date} className={styles.date}>
            {formatDate(post.date, language)}
          </time>
          <Chip>{category?.name ?? getFallbackCategoryLabel(language)}</Chip>
        </span>
        <span className={styles.title}>{post.title}</span>
      </span>
      <ArrowCircle className={styles.cardArrow} />
    </Link>
  );
}

/**
 * News archive cards with grid/list controls and cursor pagination.
 * Site search keeps the compact news-row presentation.
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
  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("new");
  const [isPending, startTransition] = useTransition();

  function loadMore() {
    startTransition(async () => {
      const page =
        mode === "search"
          ? await loadMoreSearch({ after: pageInfo.endCursor, query, type: "posts", language })
            : await loadMoreNews({ after: pageInfo.endCursor, ...filters, sort, language });
      setPosts((current) => [...current, ...page.nodes]);
      setPageInfo(page.pageInfo);
    });
  }

  function changeSort(nextSort) {
    if (sort === nextSort) return;
    startTransition(async () => {
        const page = await loadMoreNews({ after: null, ...filters, sort: nextSort, language });
        setPosts(page.nodes);
        setPageInfo(page.pageInfo);
        setSort(nextSort);
    });
  }

  if (mode === "search") {
    if (posts.length === 0) {
      return <p className={styles.emptySearch}>{emptyLabel ?? copy.emptyList}</p>;
    }

    return (
      <div>
        <ul className={styles.searchPanel} role="list">
          {posts.map((post) => (
            <li key={post.id}>
              <NewsRow post={post} language={language} featuredSlug={featuredSlug} />
            </li>
          ))}
        </ul>
        {pageInfo.hasNextPage && (
          <div className={styles.more}>
            <Button variant="outline" onClick={loadMore} disabled={isPending} aria-busy={isPending}>
              {isPending ? copy.loading : copy.loadMore}
            </Button>
          </div>
        )}
      </div>
    );
  }

  const showFeatured = activeChips.length === 0 && sort === "new";
  const firstPost = posts[0];
  const featureFirst =
    showFeatured && Boolean(firstPost?.featuredImage?.node?.sourceUrl);

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
          <div className={styles.segment} role="group" aria-label={copy.sortLabel}>
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
          <div className={styles.segment} role="group" aria-label={copy.viewLabel}>
            <button
              type="button"
              aria-label={copy.gridView}
              aria-pressed={view === "grid"}
              data-active={view === "grid"}
              onClick={() => setView("grid")}
            >
              <Icon name="grid" size={18} />
            </button>
            <button
              type="button"
              aria-label={copy.listView}
              aria-pressed={view === "list"}
              data-active={view === "list"}
              onClick={() => setView("list")}
            >
              <Icon name="list" size={18} />
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
        <ul className={styles.feed} data-view={view} role="list" aria-busy={isPending}>
          {posts.map((post, index) => (
            <li key={post.id}>
              <ArchiveCard
                post={post}
                language={language}
                featuredSlug={featuredSlug}
                featured={featureFirst && index === 0}
              />
            </li>
          ))}
        </ul>
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
