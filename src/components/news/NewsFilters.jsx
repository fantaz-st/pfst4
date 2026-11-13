"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { getGoalIcon, sortByGoalNumber } from "@/lib/ciljevi";
import { getNewsCopy } from "@/lib/newsCopy";
import styles from "./NewsFilters.module.css";

/**
 * News archive filters. Everything lives in the URL (?kategorija=, ?cilj=,
 * ?q=, ?od=, ?do=) so a filtered view can be shared and bookmarked:
 * - category tabs (design/reference/home.html "Ostale novosti"), plus
 *   "Istaknuto" for the featured flag
 * - search + date range (STYLEGUIDE §6 forms)
 * - SDG goals as their official icons, secondary to categories
 */
export default function NewsFilters({ categories, ciljevi, featuredSlug, language = "hr" }) {
  const copy = getNewsCopy(language);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("kategorija") ?? "";
  const selectedGoals = searchParams.getAll("cilj");
  const hasFilters = ["kategorija", "cilj", "q", "od", "do"].some((key) => searchParams.has(key));

  function push(mutate) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function selectCategory(slug) {
    push((params) => {
      if (slug) params.set("kategorija", slug);
      else params.delete("kategorija");
    });
  }

  function toggleGoal(slug) {
    push((params) => {
      const next = selectedGoals.includes(slug)
        ? selectedGoals.filter((value) => value !== slug)
        : [...selectedGoals, slug];
      params.delete("cilj");
      next.forEach((value) => params.append("cilj", value));
    });
  }

  function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    push((params) => {
      for (const key of ["q", "od", "do"]) {
        const value = String(form.get(key) ?? "").trim();
        if (value) params.set(key, value);
        else params.delete(key);
      }
    });
  }

  const tabs = [
    { slug: "", label: copy.allFilter },
    ...categories.map((category) => ({ slug: category.slug, label: category.name })),
    ...(featuredSlug ? [{ slug: featuredSlug, label: copy.featuredFilter }] : []),
  ];

  return (
    <div className={styles.filters}>
      <div className={styles.tabs} role="group" aria-label={copy.filterByCategoryLabel}>
        {tabs.map((tab) => (
          <button
            key={tab.slug || "all"}
            type="button"
            className={styles.tab}
            aria-pressed={selectedCategory === tab.slug}
            onClick={() => selectCategory(tab.slug)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form className={styles.form} onSubmit={submit} role="search">
        <label className={styles.field}>
          <span className={styles.label}>{copy.searchLabel}</span>
          <input
            className={styles.input}
            name="q"
            type="search"
            defaultValue={searchParams.get("q") ?? ""}
            key={`q-${searchParams.get("q") ?? ""}`}
          />
        </label>
        <div className={styles.dates}>
          <label className={styles.field}>
            <span className={styles.label}>{copy.dateFrom}</span>
            <input
              className={styles.input}
              name="od"
              type="date"
              defaultValue={searchParams.get("od") ?? ""}
              key={`od-${searchParams.get("od") ?? ""}`}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>{copy.dateTo}</span>
            <input
              className={styles.input}
              name="do"
              type="date"
              defaultValue={searchParams.get("do") ?? ""}
              key={`do-${searchParams.get("do") ?? ""}`}
            />
          </label>
        </div>
        <div className={styles.actions}>
          <Button type="submit" size="m">
            {copy.applyFilters}
          </Button>
          {hasFilters && (
            <Button variant="outline" size="m" onClick={() => router.push(pathname, { scroll: false })}>
              {copy.clearFilters}
            </Button>
          )}
        </div>
      </form>

      {ciljevi.length > 0 && (
        <fieldset className={styles.goals}>
          <legend className={styles.label}>{copy.filterByGoalsLegend}</legend>
          <div className={styles.goalGrid}>
            {sortByGoalNumber(ciljevi).map((term) => {
              const icon = getGoalIcon(term.slug, language);
              const checked = selectedGoals.includes(term.slug);
              return (
                <label key={term.slug} className={styles.goal} data-checked={checked}>
                  <input
                    type="checkbox"
                    className="visually-hidden"
                    checked={checked}
                    onChange={() => toggleGoal(term.slug)}
                  />
                  {icon ? (
                    <Image src={icon} alt={term.name} sizes="56px" className={styles.goalIcon} />
                  ) : (
                    <span className={styles.goalText}>{term.name}</span>
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>
      )}
    </div>
  );
}
