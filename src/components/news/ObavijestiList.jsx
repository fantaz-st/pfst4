"use client";

import { useState, useTransition } from "react";
import { loadMoreNews } from "@/lib/actions";
import { groupPostsByDay } from "@/lib/news";
import { getNewsCopy } from "@/lib/newsCopy";
import NewsDayGroup from "./NewsDayGroup";
import styles from "./ObavijestiList.module.css";

export default function ObavijestiList({
  initialPosts,
  initialPageInfo,
  categorySlug,
  ciljeviSlugs,
  language = "hr",
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const [isPending, startTransition] = useTransition();
  const copy = getNewsCopy(language);

  function handleLoadMore() {
    startTransition(async () => {
      const page = await loadMoreNews({
        after: pageInfo.endCursor,
        categorySlug,
        ciljeviSlugs,
        language,
      });
      setPosts((current) => [...current, ...page.nodes]);
      setPageInfo(page.pageInfo);
    });
  }

  if (posts.length === 0) {
    return <p className={styles.empty}>{copy.emptyList}</p>;
  }

  const groups = groupPostsByDay(posts);

  return (
    <div>
      {groups.map((group) => (
        <NewsDayGroup key={group.key} group={group} language={language} />
      ))}

      {pageInfo.hasNextPage && (
        <button
          type="button"
          className={styles.loadMore}
          onClick={handleLoadMore}
          disabled={isPending}
        >
          {isPending ? copy.loading : copy.loadMore}
        </button>
      )}
    </div>
  );
}
