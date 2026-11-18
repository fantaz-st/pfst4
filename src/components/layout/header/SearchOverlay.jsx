"use client";

import { useEffect, useImperativeHandle, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { gsap, MOTION_OK, EASE } from "@/components/motion/gsap";
import { getLenis } from "@/components/motion/lenisStore";
import { getChromeCopy } from "@/lib/chromeCopy";
import { formatDate } from "@/lib/format";
import styles from "./SearchOverlay.module.css";

const MIN_LENGTH = 2;
const DEBOUNCE_MS = 250;

// Diacritic-insensitive and length-preserving (č → c, đ → d), so a match
// index found in the folded title is also valid in the original.
function fold(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d");
}

function Highlight({ text, term }) {
  const index = term ? fold(text).indexOf(fold(term)) : -1;
  if (index < 0) return text;
  return (
    <>
      {text.slice(0, index)}
      <mark className={styles.mark}>{text.slice(index, index + term.length)}</mark>
      {text.slice(index + term.length)}
    </>
  );
}

/**
 * Full-screen search layer opened from the floating nav's search button.
 * Modra sheet under the floating nav (which stays on top and turns its menu
 * button into the close button): a large input, "Često traženo" links while
 * empty, live pages + news from /api/search as you type, and a link to the
 * full results on /pretraga (Enter does the same).
 *
 * Always mounted so the nav can focus the input inside the tap itself
 * (`ref.current.prepare()`) — iOS only opens the keyboard for a focus that
 * happens in the user's gesture. A modal dialog: Tab stays inside, Escape
 * closes, focus returns to the opener, page scroll pauses.
 */
export default function SearchOverlay({ ref, open, onClose, language, frequent }) {
  const copy = getChromeCopy(language);
  const router = useRouter();
  const action = language === "en" ? "/en/search" : "/pretraga";
  const layerRef = useRef(null);
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ term: "", pages: [], posts: [] });
  const term = query.trim();
  const active = term.length >= MIN_LENGTH;
  const loading = active && results.term !== term;

  useImperativeHandle(ref, () => ({
    prepare() {
      const layer = layerRef.current;
      if (!layer) return;
      layer.inert = false;
      layer.dataset.open = "true";
      inputRef.current?.focus({ preventScroll: true });
    },
  }));

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Dialog behaviour while open.
  useEffect(() => {
    if (!open) return undefined;
    const layer = layerRef.current;
    const input = inputRef.current;
    const opener = document.activeElement === input ? null : document.activeElement;
    const lenis = getLenis();
    lenis?.stop();
    if (document.activeElement !== input) input?.focus({ preventScroll: true });

    function onKey(event) {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !layer) return;
      const focusable = Array.from(
        layer.querySelectorAll("a[href], button:not([disabled]), input"),
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
      input?.blur();
      const trigger = document.querySelector('[aria-controls="site-search"]');
      const target = opener instanceof HTMLElement && opener.isConnected ? opener : trigger;
      if (target instanceof HTMLElement) target.focus({ preventScroll: true });
    };
  }, [open]);

  // Entrance: sheet wipes down, then the form and the list rise in.
  useEffect(() => {
    if (!open) return undefined;
    const layer = layerRef.current;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        layer,
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: EASE.out, clearProps: "clipPath" },
      );
      gsap.from(layer.querySelectorAll("[data-search-item]"), {
        y: 18,
        opacity: 0,
        duration: 0.7,
        ease: EASE.out,
        stagger: 0.035,
        delay: 0.12,
        clearProps: "transform,opacity",
      });
    });
    return () => mm.revert();
  }, [open]);

  // Live results: debounced, stale requests aborted.
  useEffect(() => {
    if (!active) return undefined;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ q: term, lang: language });
        const res = await fetch(`/api/search?${params}`, { signal: controller.signal });
        const data = res.ok ? await res.json() : {};
        setResults({ term, pages: data.pages ?? [], posts: data.posts ?? [] });
      } catch (error) {
        if (error.name !== "AbortError") setResults({ term, pages: [], posts: [] });
      }
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [active, term, language]);

  function submit(event) {
    event.preventDefault();
    if (!term) return;
    onClose();
    router.push(`${action}?q=${encodeURIComponent(term)}`);
  }

  const fullHref = `${action}?q=${encodeURIComponent(term)}`;
  const hasResults = results.pages.length > 0 || results.posts.length > 0;

  return (
    <div
      ref={layerRef}
      id="site-search"
      className={styles.layer}
      data-open={open}
      inert={!open}
      role="dialog"
      aria-modal="true"
      aria-label={copy.search}
      data-lenis-prevent
    >
      <div className={styles.inner}>
        <form className={styles.form} action={action} role="search" onSubmit={submit} data-search-item>
          <label htmlFor="site-search-input" className={styles.label}>
            {copy.search}
          </label>
          <div className={styles.field}>
            <input
              ref={inputRef}
              id="site-search-input"
              type="search"
              name="q"
              enterKeyHint="search"
              autoComplete="off"
              spellCheck={false}
              placeholder={copy.searchPlaceholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button
                type="button"
                className={styles.clear}
                aria-label={copy.searchClear}
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
              >
                <Icon name="close" size={16} />
              </button>
            )}
          </div>
        </form>

        <div className={styles.body} aria-live="polite" data-search-item>
          {!active && frequent?.length > 0 && (
            <>
              <span className={styles.group}>{copy.frequent}</span>
              <ul className={styles.list}>
                {frequent.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.quick} onClick={onClose}>
                      <span className={styles.quickIcon} aria-hidden="true">
                        <Icon name="arrow" size={16} />
                      </span>
                      <span className={styles.quickLabel}>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          {loading && !hasResults && <span className={styles.group}>{copy.searching}</span>}

          {active && hasResults && (
            <>
              {results.pages.length > 0 && (
                <>
                  <span className={styles.group}>{copy.searchPages}</span>
                  <ul className={styles.list}>
                    {results.pages.map((page) => (
                      <li key={page.uri}>
                        <Link href={page.uri} className={styles.result} onClick={onClose}>
                          <span className={styles.text}>
                            <span className={styles.title}>
                              <Highlight text={page.title} term={term} />
                            </span>
                            {page.path && <span className={styles.meta}>{page.path}</span>}
                          </span>
                          <span className={styles.chevron} aria-hidden="true">
                            <Icon name="arrow" size={16} />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {results.posts.length > 0 && (
                <>
                  <span className={styles.group}>{copy.searchPosts}</span>
                  <ul className={styles.list}>
                    {results.posts.map((post) => (
                      <li key={post.uri}>
                        <Link href={post.uri} className={styles.result} onClick={onClose}>
                          <span className={styles.text}>
                            <span className={styles.postTitle}>
                              <Highlight text={post.title} term={term} />
                            </span>
                            <span className={`${styles.meta} num`}>{formatDate(post.date, language)}</span>
                          </span>
                          <span className={styles.chevron} aria-hidden="true">
                            <Icon name="arrow" size={16} />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <div className={styles.spacer} />
              <Button href={fullHref} variant="accent" size="l" className={styles.all} onClick={onClose}>
                {copy.searchAll(term)}
              </Button>
            </>
          )}

          {active && !loading && !hasResults && (
            <div className={styles.empty}>
              <span className={styles.emptyTitle}>{copy.searchEmpty}</span>
              <Link href={fullHref} className={styles.emptyLink} onClick={onClose}>
                {copy.searchOpenFull}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
