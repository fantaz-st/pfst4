"use client";

import { useState, useTransition } from "react";
import Button from "@/components/ui/Button";
import { loadMoreNews, loadMoreSearch } from "@/lib/actions";
import { getNewsCopy } from "@/lib/newsCopy";
import NewsRow from "./NewsRow";
import styles from "./NewsList.module.css";

/**
 * News rows in the white r28 panel, with "Prikaži još obavijesti" (cursor
 * pagination through a server action). `filters` are passed back to the
 * action unchanged; mode="search" pages through site search instead.
 */
export default function NewsList({
  initialPosts = [],
  initialPageInfo = {},
  language = "hr",
  mode = "news",
  query = "",
  filters = {},
  emptyLabel,
}) {
  const copy = getNewsCopy(language);
  const [posts, setPosts] = useState(initialPosts);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const [isPending, startTransition] = useTransition();

  function loadMore() {
    startTransition(async () => {
      const page =
        mode === "search"
          ? await loadMoreSearch({ after: pageInfo.endCursor, query, type: "posts", language })
          : await loadMoreNews({ after: pageInfo.endCursor, ...filters, language });
      setPosts((current) => [...current, ...page.nodes]);
      setPageInfo(page.pageInfo);
    });
  }

  if (posts.length === 0) {
    return <p className={styles.empty}>{emptyLabel ?? copy.emptyList}</p>;
  }

  return (
    <div>
      <ul className={styles.panel} role="list" data-fade>
        {posts.map((post) => (
          <li key={post.id}>
            <NewsRow post={post} language={language} />
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
