import Link from "next/link";
import IstaknutoScroller from "@/components/home/IstaknutoScroller";
import TestimonialsPinned from "@/components/home/TestimonialsPinned";
import ArticleList from "@/components/news/ArticleList";
import styles from "./HomePage.module.css";

const HOME_COPY = {
  hr: {
    kicker: "Sveučilište u Splitu",
    heroLine1: "Pomorski",
    heroLine2: "fakultet",
    subhead:
      "Više od 65 godina tradicije u obuci, podučavanju i prenošenju znanja budućim pomorcima i inženjerima.",
    scrollCue: "Listaj",
    statement:
      "Obrazujemo pomorce i inženjere spremne za rad na moru i u industriji.",
    quickLinksLabel: "Brzi pristup",
    featuredHeading: "Istaknuto",
    newsHeading: "Novosti",
    allNewsLink: "Sve novosti",
    newsArchiveHref: "/novosti",
    statsSectionLabel: "Brojke",
    stats: [
      { value: "065", label: "GODINA TRADICIJE" },
      { value: "004", label: "STUDIJSKA PROGRAMA" },
      { value: "600", label: "STUDENATA GODIŠNJE" },
    ],
    testimonialsSectionLabel: "Iskustva studenata",
    testimonials: [
      {
        quote:
          "Sustav obrazovanja na Fakultetu je na visokoj razini te sam usavršila svoje vještine organizacije, timskog rada, prezentiranja, komunikacije, pretraživanja znanstveno potkrijepljenih informacija, kritičkog razmišljanja i izrade pisanih radova.",
        name: "Mirta",
        role: "Pomorski menadžment",
      },
      {
        quote:
          "Vrednovanje aktivnog sudjelovanja na nastavi, poticanje na sudjelovanje u izvannastavnim aktivnostima te fleksibilnost u načinu izvršenja studentskih obveza su samo neke od pogodnosti koje su nam profesori omogućili.",
        name: "Marko",
        role: "Pomorski menadžment",
      },
      {
        quote:
          "Jedno od najvažnijih iskustava s fakulteta je bila terenska praksa na brodovima i simulatoru, koja mi je omogućila da teorijska znanja primijenim u stvarnom okruženju.",
        name: "Tony",
        role: "Pomorska nautika",
      },
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
    subhead:
      "A school for seafarers and engineers in Split. Simulators, labs, a ship.",
    scrollCue: "Scroll",
    statement:
      "We educate seafarers and engineers ready to work at sea and in industry.",
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
      {
        quote:
          "Sustav obrazovanja na Fakultetu je na visokoj razini te sam usavršila svoje vještine organizacije, timskog rada, prezentiranja, komunikacije, pretraživanja znanstveno potkrijepljenih informacija, kritičkog razmišljanja i izrade pisanih radova.",
        name: "Mirta",
        role: "Pomorski menadžment",
      },
      {
        quote:
          "Vrednovanje aktivnog sudjelovanja na nastavi, poticanje na sudjelovanje u izvannastavnim aktivnostima te fleksibilnost u načinu izvršenja studentskih obveza su samo neke od pogodnosti koje su nam profesori omogućili.",
        name: "Marko",
        role: "Pomorski menadžment",
      },
      {
        quote:
          "Jedno od najvažnijih iskustava s fakulteta je bila terenska praksa na brodovima i simulatoru, koja mi je omogućila da teorijska znanja primijenim u stvarnom okruženju.",
        name: "Tony",
        role: "Pomorska nautika",
      },
      {
        quote:
          "Jedno od najvažnijih iskustava s fakulteta je bila terenska praksa na brodovima i simulatoru, koja mi je omogućila da teorijska znanja primijenim u stvarnom okruženju.",
        name: "Tony",
        role: "Pomorska nautika",
      },
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

export default function HomePage({
  language = "hr",
  menu = [],
  featured,
  news,
}) {
  const copy = HOME_COPY[language] ?? HOME_COPY.hr;
  const quickLinks = [
    {
      id: "homequick-1",
      label: "Raspored nastave",
      subLabel: "izmijenjen: 8. travnja 2026., BS2, BS6",
      uri: "/nastava/studiranje/raspored",
    },
    {
      id: "homequick-2",
      label: "Konzultacije",
      subLabel: "izmijenjene: 17. travanja 2026.",
      uri: "/nastava/studiranje/konzultacije",
    },
    {
      id: "homequick-3",
      label: "Ispitni rokovi",
      uri: "/nastava/studiranje/ispitni-rokovi",
    },
    {
      id: "homequick-4",
      label: "Nastavnici i suradnici",
      uri: "/fakultet/opcenito/ustroj/nastavnici-i-suradnici",
    },
  ];

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
            {copy.scrollCue}
            <img
              src="/chevron.svg"
              className={styles.scrollArrow}
              alt=""
              aria-hidden="true"
            />
          </span>
        </div>
      </section>

      <section className={styles.statement}>
        <p className={styles.statementText}>{copy.statement}</p>
      </section>

      {quickLinks.length > 0 && (
        <nav aria-label={copy.quickLinksLabel} className={styles.quickLinks}>
          {quickLinks.map((item) => (
            <Link key={item.id} href={item.uri} className={styles.quickLinkRow}>
              <div className={styles.quickLinkText}>
                <span className={styles.quickLinkLabel}>{item.label}</span>
                {item.subLabel && (
                  <span className={styles.quickLinkSubLabel}>
                    {item.subLabel}
                  </span>
                )}
              </div>

              <img
                src="/chevron.svg"
                className={styles.arrow}
                alt=""
                aria-hidden="true"
              />
            </Link>
          ))}
        </nav>
      )}

      {featured.nodes.length > 0 && (
        <IstaknutoScroller
          posts={featured.nodes}
          label={copy.featuredHeading}
        />
      )}

      <section aria-labelledby="novosti-heading" className={styles.novosti}>
        <div className={styles.sectionHead}>
          <h2 id="novosti-heading">{copy.newsHeading}</h2>
          <Link href={copy.newsArchiveHref}>
            {copy.allNewsLink}
            <img
              src="/chevron.svg"
              className={styles.inlineArrow}
              alt=""
              aria-hidden="true"
            />
          </Link>
        </div>
        <ArticleList
          initialPosts={news.nodes}
          initialPageInfo={news.pageInfo}
          language={language}
          variant="home"
        />
      </section>

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
            {copy.enrollCtaLabel}
            <img
              src="/chevron.svg"
              className={styles.inlineArrow}
              alt=""
              aria-hidden="true"
            />
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
            {copy.eduCtaLabel}
            <img
              src="/chevron.svg"
              className={styles.inlineArrow}
              alt=""
              aria-hidden="true"
            />
          </Link>
        </div>
      </section>
    </div>
  );
}
