import { useMemo, useSyncExternalStore } from "react";

/**
 * Personal storage: things the site remembers for one visitor, kept only in
 * their browser (localStorage) and never sent anywhere.
 *
 * - timetable: the last Raspored selection (programme + year, lecturer or
 *   room) — the visitor's own choice, always kept
 * - starred: lecturers starred in Konzultacije — also an explicit choice
 * - searches, recent: recent searches and visited pages — browsing
 *   history, kept only when the visitor allowed it in the cookie settings
 * - consent: those cookie settings
 *
 * Every read and write is wrapped: storage can be full, blocked (private
 * mode, embedded views) or edited by hand, and none of it may break a page.
 */

const PREFIX = "pfst:";
const CHANGE = "pfst:store";

export const KEYS = {
  consent: "consent",
  timetable: "timetable",
  starred: "starred",
  searches: "searches",
  recent: "recent",
};

export const EMPTY_LIST = [];
const MAX_SEARCHES = 6;
const MAX_RECENT = 6;

function readRaw(key) {
  try {
    return window.localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

function parse(raw, fallback) {
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw) ?? fallback;
  } catch {
    return fallback;
  }
}

export function read(key, fallback) {
  return parse(readRaw(key), fallback);
}

export function write(key, value) {
  try {
    if (value == null) window.localStorage.removeItem(PREFIX + key);
    else window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage blocked or full: the site works, it just doesn't remember.
  }
  window.dispatchEvent(new CustomEvent(CHANGE, { detail: key }));
}

function subscribe(callback) {
  const onStorage = (event) => {
    if (!event.key || event.key.startsWith(PREFIX)) callback();
  };
  window.addEventListener(CHANGE, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE, callback);
    window.removeEventListener("storage", onStorage);
  };
}

/**
 * A stored value that re-renders when it changes (in this tab or another).
 * The server and the first client render see `fallback`, so nothing
 * mismatches on hydration. Pass a constant fallback (e.g. EMPTY_LIST).
 */
export function useStored(key, fallback) {
  const raw = useSyncExternalStore(subscribe, () => readRaw(key), () => null);
  return useMemo(() => parse(raw, fallback), [raw, fallback]);
}

// ---- Consent ---------------------------------------------------------------

export const OPEN_CONSENT_EVENT = "pfst:open-consent";

export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
}

export function useConsent() {
  return useStored(KEYS.consent, null);
}

export function saveConsent({ analytics, history }) {
  write(KEYS.consent, { v: 1, analytics: Boolean(analytics), history: Boolean(history), at: new Date().toISOString() });
  if (!history) clearHistory();
}

const historyAllowed = () => Boolean(read(KEYS.consent, null)?.history);

export function clearHistory() {
  write(KEYS.searches, null);
  write(KEYS.recent, null);
}

// ---- Recent searches -------------------------------------------------------

export function rememberSearch(term) {
  const value = String(term ?? "").trim();
  if (value.length < 2 || !historyAllowed()) return;
  const rest = read(KEYS.searches, []).filter((item) => item.toLowerCase() !== value.toLowerCase());
  write(KEYS.searches, [value, ...rest].slice(0, MAX_SEARCHES));
}

export function forgetSearch(term) {
  const next = read(KEYS.searches, []).filter((item) => item !== term);
  write(KEYS.searches, next.length ? next : null);
}

// ---- Recently visited pages ------------------------------------------------

export function rememberVisit({ uri, title }) {
  if (!uri || !title || !historyAllowed()) return;
  const rest = read(KEYS.recent, []).filter((item) => item.uri !== uri);
  write(KEYS.recent, [{ uri, title }, ...rest].slice(0, MAX_RECENT));
}

// ---- Timetable + starred lecturers (explicit choices) ----------------------

export function rememberTimetable({ query, label }) {
  if (query) write(KEYS.timetable, { query, label });
}

export function toggleStarred(name) {
  const list = read(KEYS.starred, []);
  const next = list.includes(name) ? list.filter((item) => item !== name) : [...list, name];
  write(KEYS.starred, next.length ? next : null);
}
