"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Icon from "@/components/ui/Icon";
import { getLenis } from "@/components/motion/lenisStore";
import { OPEN_CONSENT_EVENT, saveConsent, useConsent } from "@/lib/personal";
import styles from "./CookieConsent.module.css";

// TODO: link the privacy policy page once it exists (the link is hidden until then).
const PRIVACY_HREF = { hr: null, en: null };

const COPY = {
  hr: {
    title: "Kolačići",
    text: "Nužni kolačići potrebni su za rad stranice. Uz vaše dopuštenje koristili bismo i anonimnu analitiku posjeta te pamtili vaše nedavne pretrage i stranice — samo u vašem pregledniku.",
    privacy: "Pravila privatnosti",
    necessaryOnly: "Samo nužni",
    acceptAll: "Prihvati sve",
    customize: "Prilagodi postavke",
    settingsTitle: "Postavke kolačića",
    settingsText: "Odaberite što smijemo koristiti. Odabir možete promijeniti bilo kada preko poveznice „Kolačići” u podnožju stranice.",
    save: "Spremi odabir",
    close: "Zatvori",
    always: "Uvijek uključeno",
    categories: [
      {
        key: "necessary",
        title: "Nužni",
        text: "Potrebni za rad stranice: pamte ovaj odabir, vaš odabrani raspored i označene nastavnike. Ništa se ne šalje trećim stranama.",
      },
      {
        key: "analytics",
        title: "Analitika",
        text: "Anonimna statistika posjeta bez kolačića, da vidimo što studenti i budući studenti najviše traže.",
        example: "Vercel Web Analytics",
      },
      {
        key: "history",
        title: "Povijest pregledavanja",
        text: "Nedavne pretrage i posjećene stranice za brži povratak. Spremaju se samo u vašem pregledniku.",
      },
    ],
  },
  en: {
    title: "Cookies",
    text: "Essential cookies keep the site working. With your permission we'd also use anonymous visit statistics and remember your recent searches and pages — only in your browser.",
    privacy: "Privacy policy",
    necessaryOnly: "Essential only",
    acceptAll: "Accept all",
    customize: "Customise settings",
    settingsTitle: "Cookie settings",
    settingsText: "Choose what we may use. You can change this any time with the “Cookies” link in the footer.",
    save: "Save choice",
    close: "Close",
    always: "Always on",
    categories: [
      {
        key: "necessary",
        title: "Essential",
        text: "Needed for the site to work: they remember this choice, your chosen timetable and starred lecturers. Nothing is sent to third parties.",
      },
      {
        key: "analytics",
        title: "Analytics",
        text: "Anonymous visit statistics without cookies, so we can see what visitors look for most.",
        example: "Vercel Web Analytics",
      },
      {
        key: "history",
        title: "Browsing history",
        text: "Recent searches and visited pages, for getting back quickly. Stored only in your browser.",
      },
    ],
  },
};

const DEFAULTS = { analytics: false, history: false };
const noop = () => () => {};

/**
 * Cookie consent (design: "PFST — Kolačići" canvas). The notice shows until
 * the visitor chooses; "Samo nužni" is exactly as easy as "Prihvati sve".
 * The settings dialog opens from the notice or from the footer's "Kolačići"
 * link (openConsentSettings). Choices live in lib/personal.js: analytics
 * loads only with consent (SiteAnalytics), history is only recorded with it.
 */
export default function CookieConsent({ language = "hr" }) {
  const copy = COPY[language] ?? COPY.hr;
  const consent = useConsent();
  // False during hydration, so returning visitors never see a flash of the notice.
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(DEFAULTS);
  const dialogRef = useRef(null);
  const consentRef = useRef(consent);

  useEffect(() => {
    consentRef.current = consent;
  }, [consent]);

  useEffect(() => {
    function onOpen() {
      const current = consentRef.current;
      setDraft(current ? { analytics: current.analytics, history: current.history } : DEFAULTS);
      setOpen(true);
    }
    window.addEventListener(OPEN_CONSENT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, onOpen);
  }, []);

  // Dialog: focus inside, Escape closes, page scroll pauses, focus returns.
  useEffect(() => {
    if (!open) return undefined;
    const opener = document.activeElement;
    const dialog = dialogRef.current;
    const lenis = getLenis();
    lenis?.stop();
    dialog?.querySelector("button")?.focus({ preventScroll: true });

    function onKey(event) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      lenis?.start();
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus({ preventScroll: true });
    };
  }, [open]);

  function choose(value) {
    saveConsent(value);
    setOpen(false);
  }

  if (!hydrated) return null;

  return (
    <>
      {!consent && !open && (
        <section className={styles.notice} aria-labelledby="consent-title">
          <div className={styles.head}>
            <span className={styles.badge} aria-hidden="true">
              <Icon name="shield" size={22} />
            </span>
            <h2 id="consent-title" className={styles.title}>
              {copy.title}
            </h2>
          </div>
          <p className={styles.text}>
            {copy.text}{" "}
            {PRIVACY_HREF[language] && (
              <a href={PRIVACY_HREF[language]} className={styles.link}>
                {copy.privacy}
              </a>
            )}
          </p>
          <div className={styles.actions}>
            <button type="button" className={`${styles.button} ${styles.outline}`} onClick={() => choose(DEFAULTS)}>
              {copy.necessaryOnly}
            </button>
            <button type="button" className={`${styles.button} ${styles.primary}`} onClick={() => choose({ analytics: true, history: true })}>
              {copy.acceptAll}
            </button>
          </div>
          <button
            type="button"
            className={styles.customize}
            onClick={() => {
              setDraft(DEFAULTS);
              setOpen(true);
            }}
          >
            {copy.customize}
            <Icon name="arrow" size={16} />
          </button>
        </section>
      )}

      {open && (
        <div className={styles.layer}>
          <button type="button" className={styles.backdrop} tabIndex={-1} aria-label={copy.close} onClick={() => setOpen(false)} />
          <section ref={dialogRef} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="consent-settings-title" data-lenis-prevent>
            <span className={styles.handle} aria-hidden="true" />
            <div className={styles.dialogHead}>
              <div className={styles.dialogIntro}>
                <h2 id="consent-settings-title" className={styles.dialogTitle}>
                  {copy.settingsTitle}
                </h2>
                <p className={styles.text}>{copy.settingsText}</p>
              </div>
              <button type="button" className={styles.close} aria-label={copy.close} onClick={() => setOpen(false)}>
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className={styles.categories}>
              {copy.categories.map((category) => (
                <div key={category.key} className={styles.category}>
                  <div className={styles.categoryHead}>
                    <span id={`consent-${category.key}`} className={styles.categoryTitle}>
                      {category.title}
                    </span>
                    {category.key === "necessary" ? (
                      <span className={styles.always}>{copy.always}</span>
                    ) : (
                      <button
                        type="button"
                        role="switch"
                        className={styles.switch}
                        aria-checked={draft[category.key]}
                        aria-labelledby={`consent-${category.key}`}
                        onClick={() => setDraft((current) => ({ ...current, [category.key]: !current[category.key] }))}
                      />
                    )}
                  </div>
                  <p className={styles.categoryText}>{category.text}</p>
                  {category.example && <span className={styles.example}>{category.example}</span>}
                </div>
              ))}
            </div>

            <div className={styles.dialogFoot}>
              {PRIVACY_HREF[language] ? (
                <a href={PRIVACY_HREF[language]} className={styles.link}>
                  {copy.privacy}
                </a>
              ) : (
                <span />
              )}
              <div className={styles.dialogActions}>
                <button type="button" className={`${styles.button} ${styles.outline} ${styles.hideMobile}`} onClick={() => choose(DEFAULTS)}>
                  {copy.necessaryOnly}
                </button>
                <button type="button" className={`${styles.button} ${styles.outline}`} onClick={() => choose(draft)}>
                  {copy.save}
                </button>
                <button type="button" className={`${styles.button} ${styles.primary}`} onClick={() => choose({ analytics: true, history: true })}>
                  {copy.acceptAll}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
