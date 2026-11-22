"use client";

import { useState, useTransition } from "react";
import Button from "@/components/ui/Button";
import { loadMoreSearch } from "@/lib/actions";
import { getChromeCopy } from "@/lib/chromeCopy";
import PageCards from "@/components/content/PageCards";
import styles from "./PageResults.module.css";

// Matching pages: the same cards as a section's child pages, with "load more".
export default function PageResults({ initialPages, initialPageInfo, query, language = "hr" }) {
  const copy = getChromeCopy(language);
  const [pages, setPages] = useState(initialPages);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const [isPending, startTransition] = useTransition();

  function loadMore() {
    startTransition(async () => {
      const next = await loadMoreSearch({
        after: pageInfo.endCursor,
        query,
        type: "pages",
        language,
      });
      setPages((current) => [...current, ...next.nodes]);
      setPageInfo(next.pageInfo);
    });
  }

  if (pages.length === 0) {
    return <p className={styles.empty}>{copy.searchEmpty}</p>;
  }

  return (
    <div>
      <PageCards pages={pages} />
      {pageInfo.hasNextPage && (
        <div className={styles.more}>
          <Button variant="outline" onClick={loadMore} disabled={isPending} aria-busy={isPending}>
            {copy.loadMorePages}
          </Button>
        </div>
      )}
    </div>
  );
}
