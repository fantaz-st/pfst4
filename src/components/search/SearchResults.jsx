import { wpFetch } from "@/lib/wp";
import { SITE_SEARCH } from "@/lib/queries";
import { toLanguageCodeEnum } from "@/lib/language";
import { getChromeCopy } from "@/lib/chromeCopy";
import PageHero from "@/components/content/PageHero";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import NewsList from "@/components/news/NewsList";
import PageResults from "./PageResults";
import RecordSearch from "@/components/personal/RecordSearch";
import styles from "./SearchResults.module.css";

const FIRST = 10;
const EMPTY_PAGE = { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } };

/**
 * Site search (/pretraga, /en/search): page hero, the search form, then
 * matching pages and news. Built from the inner-page parts and news rows.
 */
export default async function SearchResults({ query, language }) {
  const copy = getChromeCopy(language);
  const term = query.trim();
  const action = language === "en" ? "/en/search" : "/pretraga";

  let pages = EMPTY_PAGE;
  let posts = EMPTY_PAGE;
  if (term) {
    const where = { search: term, language: toLanguageCodeEnum(language) };
    const data = await wpFetch(
      SITE_SEARCH,
      {
        pageFirst: FIRST,
        pageAfter: null,
        postFirst: FIRST,
        postAfter: null,
        pageWhere: where,
        postWhere: where,
      },
      { tags: ["wp"] },
    );
    pages = data?.pages ?? EMPTY_PAGE;
    posts = data?.posts ?? EMPTY_PAGE;
  }

  return (
    <>
      <PageHero
        language={language}
        title={copy.searchTitle}
        eyebrow={copy.searchEyebrow}
        lead={term ? copy.searchResultsFor(term) : undefined}
      />
      <div className={styles.wrap}>
        {term && <RecordSearch term={term} />}
        <form className={styles.form} action={action} role="search" data-fade>
          <label className={styles.field}>
            <span className="visually-hidden">{copy.searchLabel}</span>
            <Icon name="search" size={20} />
            <input
              type="search"
              name="q"
              defaultValue={term}
              placeholder={copy.searchPlaceholder}
              className={styles.input}
            />
          </label>
          <Button type="submit">{copy.searchSubmit}</Button>
        </form>

        {!term ? (
          <p className={styles.prompt}>{copy.searchPrompt}</p>
        ) : (
          <div className={styles.groups}>
            <section aria-labelledby="results-pages">
              <h2 id="results-pages" className={styles.groupTitle}>
                {copy.searchPages}
              </h2>
              <PageResults
                key={`pages-${term}`}
                initialPages={pages.nodes}
                initialPageInfo={pages.pageInfo}
                query={term}
                language={language}
              />
            </section>
            <section aria-labelledby="results-posts">
              <h2 id="results-posts" className={styles.groupTitle}>
                {copy.searchPosts}
              </h2>
              <NewsList
                key={`posts-${term}`}
                initialPosts={posts.nodes}
                initialPageInfo={posts.pageInfo}
                language={language}
                mode="search"
                query={term}
                emptyLabel={copy.searchEmpty}
              />
            </section>
          </div>
        )}
      </div>
    </>
  );
}
