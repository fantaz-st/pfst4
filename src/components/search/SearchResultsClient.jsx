"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { loadMoreSearch } from "@/lib/actions";
import { renderWpHtml } from "@/lib/html";
import homeStyles from "@/components/home/HomePage.module.css";
import styles from "./SearchResults.module.css";

function ArticleResults({ items, language }) {
  return (
    <ul className={`${homeStyles.novostiList} ${styles.articleList}`}>
      {items.map((post) => {
        const category = post.categories?.nodes?.find(
          (item) => item.slug !== "istaknuto",
        );
        const dateLabel = new Intl.DateTimeFormat(
          language === "en" ? "en-GB" : "hr-HR",
          { day: "2-digit", month: "2-digit" },
        ).format(new Date(post.date));

        return (
          <li key={post.id}>
            <Link
              href={post.uri}
              className={`${homeStyles.novostiRow} ${styles.articleRow}`}
            >
              <span className={homeStyles.novostiMeta}>
                {dateLabel} -{" "}
                {category?.name ??
                  (language === "en" ? "Uncategorized" : "Bez kategorije")}
              </span>
              <span className={homeStyles.novostiTitle}>{post.title}</span>
              <span className={homeStyles.novostiArrow} aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function ResultList({ items }) {
  return (
    <ul>
      {items.map((result) => (
        <li key={result.id}>
          <Link href={result.uri}>{result.title}</Link>
          {result.excerpt && <div>{renderWpHtml(result.excerpt)}</div>}
        </li>
      ))}
    </ul>
  );
}

export default function SearchResultsClient({ query, language, data, copy }) {
  const [pages, setPages] = useState(
    data?.pages ?? { nodes: [], pageInfo: {} },
  );
  const [posts, setPosts] = useState(
    data?.posts ?? { nodes: [], pageInfo: {} },
  );
  const [isPending, startTransition] = useTransition();

  function load(type) {
    const source = type === "pages" ? pages : posts;
    startTransition(async () => {
      const next = await loadMoreSearch({
        after: source.pageInfo.endCursor,
        query,
        type,
        language,
      });
      if (type === "pages")
        setPages((current) => ({
          nodes: [...current.nodes, ...next.nodes],
          pageInfo: next.pageInfo,
        }));
      else
        setPosts((current) => ({
          nodes: [...current.nodes, ...next.nodes],
          pageInfo: next.pageInfo,
        }));
    });
  }

  return (
    <main className={styles.results}>
      <h1>{copy.results}</h1>
      <section aria-labelledby="article-results-heading">
        <h2 id="article-results-heading">
          {language === "en" ? "Articles" : "Članci"}
        </h2>
        {posts.nodes.length ? (
          <ArticleResults items={posts.nodes} language={language} />
        ) : (
          <p>{copy.empty}</p>
        )}
        {posts.pageInfo.hasNextPage && (
          <button
            type="button"
            onClick={() => load("posts")}
            disabled={isPending}
          >
            {isPending
              ? "..."
              : language === "en"
                ? "Load more articles"
                : "Učitaj još članaka"}
          </button>
        )}
      </section>
      <section aria-labelledby="page-results-heading">
        <h2 id="page-results-heading">
          {language === "en" ? "Pages" : "Stranice"}
        </h2>
        {pages.nodes.length ? (
          <ResultList items={pages.nodes} />
        ) : (
          <p>{copy.empty}</p>
        )}
        {pages.pageInfo.hasNextPage && (
          <button
            type="button"
            onClick={() => load("pages")}
            disabled={isPending}
          >
            {isPending
              ? "..."
              : language === "en"
                ? "Load more pages"
                : "Učitaj još stranica"}
          </button>
        )}
      </section>
    </main>
  );
}
