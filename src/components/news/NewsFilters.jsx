"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { sortByGoalNumber, getCiljMeta } from "@/lib/ciljevi";
import { getNewsCopy } from "@/lib/newsCopy";
import styles from "./NewsFilters.module.css";

export default function NewsFilters({
  categories,
  ciljevi,
  selectedCategory,
  selectedCiljevi,
  language = "hr",
}) {
  const copy = getNewsCopy(language);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function push(mutate) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function selectCategory(slug) {
    push((params) => {
      if (slug) {
        params.set("kategorija", slug);
      } else {
        params.delete("kategorija");
      }
    });
  }

  function toggleCilj(slug) {
    push((params) => {
      const current = params.getAll("cilj");
      params.delete("cilj");
      const next = current.includes(slug)
        ? current.filter((value) => value !== slug)
        : [...current, slug];
      next.forEach((value) => params.append("cilj", value));
    });
  }

  const orderedCiljevi = sortByGoalNumber(ciljevi);
  const selectedSearch = searchParams.get("q") ?? "";
  const selectedFrom = searchParams.get("od") ?? "";
  const selectedTo = searchParams.get("do") ?? "";

  function submit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    push((params) => {
      ["q", "od", "do"].forEach((key) => params.delete(key));
      ["q", "od", "do"].forEach((key) => {
        const value = formData.get(key);
        if (value) params.set(key, value);
      });
    });
  }

  return (
    <aside className={styles.filters}>
      <form className={styles.form} onSubmit={submit}>
        <label htmlFor="news-search">
          {language === "en" ? "Search" : "Pretraži"}
        </label>
        <div className={styles.searchRow}>
          <input
            id="news-search"
            name="q"
            type="search"
            defaultValue={selectedSearch}
          />
          <button type="submit">
            {language === "en" ? "Apply" : "Primijeni"}
          </button>
        </div>
        <div className={styles.dates}>
          <label>
            Od
            <input name="od" type="date" defaultValue={selectedFrom} />
          </label>
          <label>
            Do
            <input name="do" type="date" defaultValue={selectedTo} />
          </label>
        </div>
      </form>
      {categories.length > 0 && (
        <div
          className={styles.categories}
          role="group"
          aria-label={copy.filterByCategoryLabel}
        >
          <button
            type="button"
            className={styles.pill}
            aria-pressed={!selectedCategory}
            onClick={() => selectCategory(null)}
          >
            {copy.allFilter}
          </button>
          {categories.map((category) => (
            <button
              key={category.slug}
              type="button"
              className={styles.pill}
              aria-pressed={selectedCategory === category.slug}
              onClick={() => selectCategory(category.slug)}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      <fieldset className={styles.ciljevi}>
        <legend className={styles.legend}>{copy.filterByCiljeviLegend}</legend>
        <div className={styles.grid}>
          {orderedCiljevi.map((term) => {
            const meta = getCiljMeta(term.slug);
            const checked = selectedCiljevi.includes(term.slug);
            return (
              <label
                key={term.slug}
                className={styles.tile}
                data-checked={checked}
                style={{
                  "--tile-color": meta?.color ?? "var(--color-gray-500)",
                }}
              >
                <input
                  type="checkbox"
                  className={styles.tileInput}
                  checked={checked}
                  onChange={() => toggleCilj(term.slug)}
                />
                <span className={styles.tileNumber}>{meta?.number}</span>
                <span className={styles.tileLabel}>{term.name}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </aside>
  );
}
