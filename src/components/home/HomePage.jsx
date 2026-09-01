import Link from "next/link";
import IstaknutoScroller from "@/components/home/IstaknutoScroller";
import TestimonialsPinned from "@/components/home/TestimonialsPinned";
import styles from "./HomePage.module.css";

// Homepage-only copy. Scoped to this component rather than newsCopy.js /
// chromeCopy.js because nothing outside this page needs it — see the
// dictionary pattern those files already use.
//
// Several strings in the real design (design/PFST Naslovnica v4.dc.html)
// are dropped or replaced here on purpose — see the deviations list given
// alongside this rebuild. In short: anything presented as a verifiable fact
// (a founding year, a stat, a phone number, a named testimonial) that I
// can't verify is either omitted or kept as an explicit fake placeholder
// per CLAUDE.md § Design intent ("must look obviously fake — 000, TODO,
// Ime Prezime — never plausible invented figures").
//
// TODO: stats and testimonials are deliberately fake placeholders. Swap in
// the real figures and the 4 real testimonials from the current site
// before launch.
const LOREM_QUOTE =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const HOME_COPY = {
  hr: {
    kicker: "Sveučilište u Splitu",
    heroLine1: "Pomorski",
    heroLine2: "fakultet",
    subhead: "Škola za pomorce i inženjere u Splitu. Simulatori, laboratoriji, brod.",
    scrollCue: "Listaj",
    statement: "Obrazujemo pomorce i inženjere spremne za rad na moru i u industriji.",
    quickLinksLabel: "Brzi pristup",
    featuredHeading: "Istaknuto",
    newsHeading: "Novosti",
    allNewsLink: "Sve novosti",
    newsArchiveHref: "/novosti",
    statsSectionLabel: "Brojke",
    stats: [
      { value: "000", label: "TODO" },
      { value: "000", label: "TODO" },
      { value: "000", label: "TODO" },
    ],
    testimonialsSectionLabel: "Iskustva studenata",
    testimonials: [
      { quote: LOREM_QUOTE, name: "Ime Prezime", role: "TODO" },
      { quote: LOREM_QUOTE, name: "Ime Prezime", role: "TODO" },
      { quote: LOREM_QUOTE, name: "Ime Prezime", role: "TODO" },
      { quote: LOREM_QUOTE, name: "Ime Prezime", role: "TODO" },
    ],
    enrollKicker: "Upisi",
    enrollLine1: "Upiši",
    enrollLine2: "pomorski",
    enrollCtaLabel: "Uvjeti upisa",
    // Confirmed live from the real main menu (not guessed from
    // old-routes.txt like the rest of this file's links).
    enrollHref: "https://upisi.pfst.hr/",
    programs: [
      "Pomorska nautika",
      "Brodostrojarstvo",
      "Pomorski menadžment",
      "Pomorske elektrotehničke i informatičke tehnologije",
      "Pomorske tehnologije jahta i marina",
    ],
    eduKicker: "Cjeloživotno obrazovanje",
    eduTitle: "Edukacija pomoraca",
    eduBody: "Tečajevi i programi izobrazbe za pomorce u aktivnoj službi.",
    eduCtaLabel: "Saznaj više",
    eduHref: "/edukacija-pomoraca",
  },
  en: {
    kicker: "University of Split",
    heroLine1: "Faculty of",
    heroLine2: "Maritime Studies",
    subhead: "A school for seafarers and engineers in Split. Simulators, labs, a ship.",
    scrollCue: "Scroll",
    statement: "We educate seafarers and engineers ready to work at sea and in industry.",
    quickLinksLabel: "Quick access",
    featuredHeading: "Featured",
    newsHeading: "News",
    allNewsLink: "All news",
    newsArchiveHref: "/en/news",
    statsSectionLabel: "Numbers",
    stats: [
      { value: "000", label: "TODO" },
      { value: "000", label: "TODO" },
      { value: "000", label: "TODO" },
    ],
    testimonialsSectionLabel: "Student experiences",
    testimonials: [
      { quote: LOREM_QUOTE, name: "Ime Prezime", role: "TODO" },
      { quote: LOREM_QUOTE, name: "Ime Prezime", role: "TODO" },
      { quote: LOREM_QUOTE, name: "Ime Prezime", role: "TODO" },
      { quote: LOREM_QUOTE, name: "Ime Prezime", role: "TODO" },
    ],
    enrollKicker: "Enrolment",
    enrollLine1: "Study",
    enrollLine2: "maritime",
    enrollCtaLabel: "Enrolment conditions",
    enrollHref: "/en/studies/undergraduate-studies",
    programs: [
      "Nautical Studies",
      "Marine Engineering",
      "Maritime Management",
      "Marine Electrical Engineering and Information Technologies",
      "Maritime Yacht and Marina Technologies",
    ],
    eduKicker: "Lifelong learning",
    eduTitle: "Seafarer Education",
    eduBody: "Courses and training programmes for seafarers in active service.",
    eduCtaLabel: "Learn more",
    eduHref: "/en/seafarer-education",
  },
};

export default function HomePage({ language = "hr", menu = [], featured, news }) {
  const copy = HOME_COPY[language] ?? HOME_COPY.hr;
  const quickLinks = menu.slice(0, 5);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.kicker}>{copy.kicker}</p>
        <h1 className={styles.heroTitle}>
          {copy.heroLine1}
          <br />
          {copy.heroLine2}
        </h1>
        <div className={styles.heroRow}>
          <p className={styles.heroSubhead}>{copy.subhead}</p>
          <span className={styles.scrollCue} aria-hidden="true">
            {copy.scrollCue} ↓
          </span>
        </div>
      </section>

      <section className={styles.statement}>
        <p className={styles.statementText}>{copy.statement}</p>
      </section>

      {quickLinks.length > 0 && (
        <nav aria-label={copy.quickLinksLabel} className={styles.quickLinks}>
          {quickLinks.map((item) => (
            <Link key={item.databaseId} href={item.uri} className={styles.quickLinkRow}>
              <span>{item.label}</span>
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </nav>
      )}

      {featured.nodes.length > 0 && (
        <IstaknutoScroller posts={featured.nodes} label={copy.featuredHeading} />
      )}

      <section aria-labelledby="novosti-heading" className={styles.novosti}>
        <div className={styles.sectionHead}>
          <h2 id="novosti-heading">{copy.newsHeading}</h2>
          <Link href={copy.newsArchiveHref}>{copy.allNewsLink} →</Link>
        </div>
        {news.nodes.length === 0 ? null : (
          <ul className={styles.novostiList}>
            {news.nodes.map((post) => (
              <NovostiRow key={post.id} post={post} language={language} />
            ))}
          </ul>
        )}
      </section>

      {/* TODO: placeholder figures — replace with the real numbers before launch. */}
      <section aria-label={copy.statsSectionLabel} className={styles.stats}>
        <ul className={styles.statList}>
          {copy.stats.map((stat, index) => (
            <li key={index} className={styles.statItem}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* TODO: placeholder testimonials — there are 4 real ones on the
          current site; swap them in here before launch. */}
      <TestimonialsPinned
        testimonials={copy.testimonials}
        label={copy.testimonialsSectionLabel}
      />

      <section aria-labelledby="upisi-heading" className={styles.enrollment}>
        <p className={styles.kicker}>{copy.enrollKicker}</p>
        <h2 id="upisi-heading" className={styles.enrollTitle}>
          {copy.enrollLine1}
          <br />
          {copy.enrollLine2}
        </h2>
        <div className={styles.enrollRow}>
          <ul className={styles.programList}>
            {copy.programs.map((program) => (
              <li key={program}>{program}</li>
            ))}
          </ul>
          <Link href={copy.enrollHref} className={styles.enrollCta}>
            {copy.enrollCtaLabel} →
          </Link>
        </div>
      </section>

      <section aria-labelledby="edu-heading" className={styles.eduTeaser}>
        <p className={styles.kicker}>{copy.eduKicker}</p>
        <h2 id="edu-heading">{copy.eduTitle}</h2>
        <div className={styles.eduImage} aria-hidden="true" />
        <div className={styles.eduRow}>
          <p className={styles.eduBody}>{copy.eduBody}</p>
          <Link href={copy.eduHref} className={styles.eduCta}>
            {copy.eduCtaLabel} →
          </Link>
        </div>
      </section>
    </div>
  );
}

// Novosti row — deliberately not the archive's ObavijestiList/NewsDayGroup:
// the design's treatment here (one huge title per row, no day grouping, no
// colored badge pill) is a different visual language from the news archive.
// The archive components stay untouched; this reuses only the data shape
// and lib/news.js helpers.
function NovostiRow({ post, language }) {
  const category = post.categories?.nodes?.find((c) => c.slug !== "istaknuto");
  const date = new Date(post.date);
  const dateLabel = new Intl.DateTimeFormat(language === "en" ? "en-GB" : "hr-HR", {
    day: "2-digit",
    month: "2-digit",
  }).format(date);

  return (
    <li>
      <Link href={post.uri} className={styles.novostiRow}>
        <span className={styles.novostiMeta}>
          {dateLabel} — {category?.name ?? (language === "en" ? "Uncategorized" : "Bez kategorije")}
        </span>
        <span className={styles.novostiTitle}>{post.title}</span>
        <span className={styles.novostiArrow} aria-hidden="true">
          →
        </span>
      </Link>
    </li>
  );
}
