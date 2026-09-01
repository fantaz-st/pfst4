"use client";

import { useState, useTransition } from "react";
import { loadMoreFeatured } from "@/lib/actions";
import { getNewsCopy } from "@/lib/newsCopy";
import NewsCard from "./NewsCard";
import styles from "./FeaturedGrid.module.css";

export default function FeaturedGrid({
  initialPosts,
  initialPageInfo,
  language = "hr",
  featuredCategorySlug,
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const [isPending, startTransition] = useTransition();
  const copy = getNewsCopy(language);

  function handleLoadMore() {
    startTransition(async () => {
      const page = await loadMoreFeatured({
        after: pageInfo.endCursor,
        language,
        featuredCategorySlug,
      });
      setPosts((current) => [...current, ...page.nodes]);
      setPageInfo(page.pageInfo);
    });
  }

  if (posts.length === 0) return null;

  return (
    <div>
      <ul className={styles.grid}>
        {posts.map((post) => (
          <li key={post.id}>
            <NewsCard post={post} language={language} />
          </li>
        ))}
      </ul>

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
