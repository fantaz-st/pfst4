"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { getLenis } from "@/components/motion/lenisStore";
import { getGoalIcon, sortByGoalNumber } from "@/lib/ciljevi";
import { NEWS_ARCHIVE_URI } from "@/lib/posts";
import { getNewsCopy } from "@/lib/newsCopy";
import styles from "./NewsFilters.module.css";

// Below this the panel becomes a drawer behind the "Filtriraj novosti" button.
const DRAWER_QUERY = "(max-width: 1080px)";

function localDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getPeriodRange(period, now = new Date()) {
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (period === "week") {
    const start = new Date(end);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    return { from: localDate(start), to: localDate(end) };
  }
  if (period === "month") {
    return {
      from: localDate(new Date(end.getFullYear(), end.getMonth(), 1)),
      to: localDate(end),
    };
  }
  const year = Number(period);
  return {
    from: `${year}-01-01`,
    to: `${year}-12-31`,
  };
}

function getSelectedPeriod(dateFrom, dateTo) {
  if (!dateFrom && !dateTo) return "all";
  const now = new Date();
  const year = String(now.getFullYear());
  const lastYear = String(now.getFullYear() - 1);
  return [year, lastYear, "week", "month"].find((period) => {
    const range = getPeriodRange(period, now);
    return dateFrom === range.from && dateTo === range.to;
  }) ?? "";
}

export default function NewsFilters({
  categories,
  ciljevi,
  featuredSlug,
  featuredCount,
  language = "hr",
}) {
  const copy = getNewsCopy(language);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("kategorija") ?? "";
  const selectedGoals = searchParams.getAll("cilj");
  const search = searchParams.get("q") ?? "";
  const dateFrom = searchParams.get("od") ?? "";
  const dateTo = searchParams.get("do") ?? "";
  const selectedPeriod = getSelectedPeriod(dateFrom, dateTo);
  const activeCount =
    Number(Boolean(selectedCategory)) +
    selectedGoals.length +
    Number(Boolean(search)) +
    Number(Boolean(dateFrom || dateTo));
  const archiveYear = new Date().getFullYear() - 1;
  const archivePath = NEWS_ARCHIVE_URI[language] ?? NEWS_ARCHIVE_URI.hr;

  const [isDrawer, setIsDrawer] = useState(false);
  const [open, setOpen] = useState(false);
  const drawerRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia(DRAWER_QUERY);
    const update = () => {
      setIsDrawer(mq.matches);
      if (!mq.matches) setOpen(false);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Drawer is a modal dialog: focus moves in and is trapped, Escape closes,
  // focus returns to the trigger, page scroll pauses.
  useEffect(() => {
    if (!open) return undefined;
    const opener = document.activeElement;
    const drawer = drawerRef.current;
    const lenis = getLenis();
    lenis?.stop();
    closeRef.current?.focus();

    function onKey(event) {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !drawer) return;
      const focusable = Array.from(
        drawer.querySelectorAll("a[href], button:not([disabled]), input"),
      ).filter((el) => el.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      lenis?.start();
      if (opener instanceof HTMLElement) opener.focus({ preventScroll: true });
    };
  }, [open]);

  const close = () => setOpen(false);

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

  function setPeriod(period) {
    push((params) => {
      params.delete("od");
      params.delete("do");
      if (period !== "all") {
        const range = getPeriodRange(period);
        params.set("od", range.from);
        params.set("do", range.to);
      }
    });
  }

  function submitSearch(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const value = String(formData.get("q") ?? "").trim();
    push((params) => {
      if (value) params.set("q", value);
      else params.delete("q");
    });
  }

  const categoryOptions = [
    { slug: "", label: copy.allFilter },
    ...categories.map((category) => ({
      slug: category.slug,
      label: category.name,
      count: category.count,
    })),
    ...(featuredSlug
      ? [{ slug: featuredSlug, label: copy.featuredFilter, count: featuredCount }]
      : []),
  ];
  const years = [new Date().getFullYear(), new Date().getFullYear() - 1];
  const periodOptions = [
    { value: "all", label: copy.periodAll },
    { value: "week", label: copy.periodWeek },
    { value: "month", label: copy.periodMonth },
    ...years.map((year) => ({ value: String(year), label: `${year}.` })),
  ];

  const layer = (
    <div className={styles.layer} data-open={open}>
      <button
        type="button"
        className={styles.backdrop}
        tabIndex={-1}
        aria-label={copy.closeFilters}
        onClick={close}
      />
      <div
        ref={drawerRef}
        id="news-filters"
        className={styles.drawer}
        inert={isDrawer && !open}
        data-lenis-prevent
        {...(isDrawer
          ? { role: "dialog", "aria-modal": true, "aria-label": copy.filtersHeading }
          : {})}
      >
        <div className={styles.drawerTop}>
          <span className={styles.drawerTitle}>
            {copy.filtersHeading}
            <span className={styles.activeCount}>{copy.activeFilters(activeCount)}</span>
          </span>
          <button
            ref={closeRef}
            type="button"
            className={styles.close}
            aria-label={copy.closeFilters}
            onClick={close}
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className={styles.drawerBody}>
          <form className={styles.panel} role="search" onSubmit={submitSearch}>
            <div className={styles.panelHeading}>
              <span>{copy.filtersHeading}</span>
              <span className={styles.activeCount} aria-live="polite">
                {copy.activeFilters(activeCount)}
              </span>
            </div>

            <label className={styles.search}>
              <Icon name="search" size={18} />
              <span className="visually-hidden">{copy.searchLabel}</span>
              <input
                type="search"
                name="q"
                placeholder={copy.searchPlaceholder}
                defaultValue={search}
                key={`search-${search}`}
              />
            </label>
            <button type="submit" className="visually-hidden">
              {copy.searchLabel}
            </button>

            <fieldset className={styles.group}>
              <legend className={styles.groupTitle}>{copy.categoryHeading}</legend>
              <div className={styles.categoryOptions} role="radiogroup" aria-label={copy.categoryHeading}>
                {categoryOptions.map((option) => (
                  <label className={styles.categoryOption} key={option.slug || "all"}>
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === option.slug}
                      onChange={() => selectCategory(option.slug)}
                    />
                    <span>{option.label}</span>
                    {Number.isFinite(option.count) && (
                      <span className={styles.count}>{option.count}</span>
                    )}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className={styles.group}>
              <legend className={styles.groupTitle}>{copy.periodHeading}</legend>
              <div className={styles.periodOptions} role="group" aria-label={copy.periodHeading}>
                {periodOptions.map((option) => (
                  <button
                    type="button"
                    aria-pressed={selectedPeriod === option.value}
                    className={styles.period}
                    data-active={selectedPeriod === option.value}
                    key={option.value}
                    onClick={() => setPeriod(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            {ciljevi.length > 0 && (
              <fieldset className={styles.group}>
                <legend className={styles.groupTitle}>{copy.filterByGoalsLegend}</legend>
                <div className={styles.goalGrid}>
                  {sortByGoalNumber(ciljevi).map((term) => {
                    const icon = getGoalIcon(term.slug, language);
                    const selected = selectedGoals.includes(term.slug);
                    return (
                      <button
                        type="button"
                        key={term.slug}
                        className={styles.goal}
                        aria-label={term.name}
                        aria-pressed={selected}
                        data-selected={selected}
                        onClick={() => toggleGoal(term.slug)}
                      >
                        {icon ? (
                          <Image src={icon} alt="" sizes="40px" className={styles.goalIcon} />
                        ) : (
                          <span className={styles.goalText}>{term.name}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            <button
              type="button"
              className={styles.clear}
              disabled={activeCount === 0}
              onClick={() => router.push(pathname, { scroll: false })}
            >
              <Icon name="close" size={16} />
              {copy.clearFilters}
            </button>
          </form>

          <Link
            className={styles.archive}
            href={`${archivePath}?do=${archiveYear}-12-31`}
          >
            <span className={styles.archiveText}>
              <span className={styles.archiveTitle}>{copy.archiveLinkTitle}</span>
              <span className={styles.archiveDescription}>{copy.archiveLinkDescription(archiveYear)}</span>
            </span>
            <span className={styles.archiveArrow} aria-hidden="true">
              <Icon name="arrow" size={18} />
            </span>
          </Link>
        </div>

        <div className={styles.drawerFoot}>
          <Button type="button" variant="primary" size="m" className={styles.apply} onClick={close}>
            {copy.showResults}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls="news-filters"
        onClick={() => setOpen(true)}
      >
        <span className={styles.triggerIcon} data-sonar={activeCount === 0}>
          <Icon name="filter" size={20} />
        </span>
        <span className={styles.triggerText}>
          <span className={styles.triggerTitle}>{copy.filterByCategoryLabel}</span>
          <span className={styles.triggerHint}>
            {activeCount > 0 ? copy.activeFilters(activeCount) : copy.filtersHint}
          </span>
        </span>
        {activeCount > 0 ? (
          <span className={styles.triggerBadge} aria-hidden="true">
            {activeCount}
          </span>
        ) : (
          <span className={styles.triggerArrow} aria-hidden="true">
            <Icon name="arrow" size={18} />
          </span>
        )}
      </button>

      {/* In drawer mode the layer is portalled to <body> so no transformed or
          faded ancestor (the sidebar's data-fade reveal) can trap the fixed sheet. */}
      {isDrawer ? createPortal(layer, document.body) : layer}
    </>
  );
}
