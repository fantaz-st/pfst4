"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import ArrowCircle from "@/components/ui/ArrowCircle";
import Button from "@/components/ui/Button";
import { loadMoreSearch } from "@/lib/actions";
import { getChromeCopy } from "@/lib/chromeCopy";
import styles from "./PageResults.module.css";

// Matching pages: title + arrow rows in a white r28 panel, with "load more".
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
      <ul className={styles.panel} role="list">
        {pages.map((page) => (
          <li key={page.id}>
            <Link href={page.uri} className={styles.row}>
              <span className={styles.title}>{page.title}</span>
              <ArrowCircle />
            </Link>
          </li>
        ))}
      </ul>
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
