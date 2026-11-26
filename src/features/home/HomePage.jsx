import { wpFetch } from "@/lib/wp/wp";
import { NEWS_POSTS } from "@/lib/wp/queries";
import { getFeaturedCategorySlug } from "@/lib/wp/news";
import { toLanguageCodeEnum } from "@/lib/i18n/language";
import SiteChrome from "@/components/layout/SiteChrome";
import HomeHero from "./HomeHero";
import HomeHeroCards from "./HomeHeroCards";
import QuickLinks from "./QuickLinks";
import FeaturedNews from "./FeaturedNews";
import Statement from "./Statement";
import StudyProgrammes from "./StudyProgrammes";
import HomeNews from "./HomeNews";
import CallsToAction from "./CallsToAction";
import { TIMETABLE_SAMPLE } from "./timetableSample";
import { getQuickStats } from "./quickStats";

const EMPTY_POSTS = { nodes: [] };

// Which home hero to show: "fan" (HomeHero — photo fan on the sky) or
// "cards" (HomeHeroCards — light, a row of most-visited-page cards).
const HERO_VERSION = "cards";

const COPY = {
  hr: {
    heroTitle: "Od učionice do zapovjednog mosta.",
    heroLead: "Više od 65 godina tradicije u obuci, podučavanju i prenošenju znanja budućim pomorcima i inženjerima.",
    // Chips floating over the home hero's photo fan.
    heroYears: { value: "65+", label: "godina tradicije", detail: "od obuke do diplome" },
    heroStudies: { value: "4", label: "prijediplomska studija", detail: "nautika · stroj · ETI · menadžment" },
    // Card row of the hero version 2 (HomeHeroCards); its timetable card
    // is the first quick link (QuickLinks.jsx).
    heroCards: {
      admissions: { title: "Upisi", href: "/nastava/upisi" },
      studiesNote: "4 prijediplomska studija",
      consultations: { title: "Konzultacije", text: "Uvijek znaš tko je danas na konzultacijama", href: "/nastava/studiranje/konzultacije" },
      exams: {
        title: "Ispitni rokovi",
        meta: "izmijenjeno 12. 11. 2026.",
        upcoming: "Nadolazeći rokovi",
        href: "/nastava/studiranje/ispitni-rokovi",
        terms: [
          { month: "SIJ", title: "Zimski rok", detail: "1. termin" },
          { month: "VELJ", title: "Zimski rok", detail: "2. termin" },
        ],
      },
      training: { title: "Trening centar", text: "Simulatori i tečajevi za pomorce", href: "/edukacija-pomoraca/trening-centar" },
    },
    exploreStudies: "Istraži studije",
    admissions: "Upisi",
    newLabel: "Novo",
    quickEyebrow: "Brzi pristup",
    quickTitle: "Najposjećenije stranice",
    quickLead: "Raspored, ispitni rokovi, konzultacije i ostalo što studenti i nastavnici najčešće traže.",
    training: "Trening centar",
    // itemDescription: "[OPIS — DOPUNITI]",
    highlightsEyebrow: "Istaknuto",
    highlightsTitle: "Istaknute novosti",
    allNews: "Sve novosti",
    newsPrev: "Prethodne novosti",
    newsNext: "Sljedeće novosti",
    noHighlights: "Trenutačno nema istaknutih novosti.",
    // Statement with pills: text pieces and pills in reading order. A pill
    // sits right after the word before it (never alone at a line start).
    // { src } = photo pill (src: null → placeholder until the photo exists),
    // { pattern: "flags" } = signal-flag pill, hideOnMobile drops it ≤720px.
    // TODO: add the photos to public/images/ and fill in src.
    statement: [
      "Za zapovjednim mostom",
      { src: "/images/statement/bridge.webp", alt: "zapovjedni most" },
      " u strojarnici",
      { src: "/images/statement/engine room.webp", alt: "simulator" },
      " ili u luci ",
      { src: "/images/statement/port.webp", alt: "studenti", hideOnMobile: true },
      " naši studenti uče posao koji pokreće svjetsko more",
      { pattern: "flags" },
      ".",
    ],
    about: "O fakultetu",
    studyEyebrow: "Studiji",
    studyTitle: "Studiji",
    studyLead: "Studiji usklađeni s međunarodnim pomorskim standardima.",
    studyPrograms: [
      {
        title: "Pomorska nautika",
        href: "/nastava/studiji/prijediplomski-studiji/pomorska-nautika",
        photo: "[FOTO: BRODSKI MOST]",
        description: "Za buduće časnike palube i zapovjednike broda - navigacija, upravljanje brodom i sigurnost plovidbe.",
        src: "/images/studies-banners/bridge.webp",
      },
      {
        title: "Brodostrojarstvo",
        href: "/nastava/studiji/prijediplomski-studiji/brodostrojarstvo",
        photo: "[FOTO: STROJARNICA]",
        description: "Za buduće časnike i upravitelje stroja - brodski pogonski sustavi, energetika i održavanje.",
        src: "/images/studies-banners/engine-room.webp",
      },
      {
        title: "Pomorske elektrotehničke i informatičke tehnologije",
        short: "Elektrotehnika i IT",
        href: "/nastava/studiji/prijediplomski-studiji/pomorske-elektrotehnicke-i-informaticke-tehnologije",
        photo: "[FOTO: LABORATORIJ]",
        description: "Elektrotehnika, automatizacija i informacijski sustavi za suvremene brodove i luke.",
        src: "/images/studies-banners/electrical.webp",
      },
      {
        title: "Pomorski menadžment",
        href: "/nastava/studiji/prijediplomski-studiji/pomorski-menadzment",
        photo: "[FOTO: LUKA]",
        description: "Upravljanje lukama, brodarskim tvrtkama i logistikom - poslovna znanja za pomorsko gospodarstvo.",
        src: "/images/studies-banners/luka split PFST.webp",
      },
    ],
    otherEyebrow: "Obavijesti",
    otherTitle: "Ostale novosti",
    otherLead: "Službene obavijesti, natječaji i najave događanja.",
    newsFilters: "Filtriraj novosti",
    all: "Sve",
    featured: "Istaknuto",
    emptyNews: "Trenutačno nema novosti.",
    showMore: "Prikaži još obavijesti",
    fewer: "Prikaži manje",
    ctaLabel: "Upisi",
    ctaTitle: "Upiši Pomorski!",
    ctaLead: "Zanima te more, brodovi ili tehnologija koja ih pokreće? Ovdje su studijski programi, uvjeti upisa, važni datumi i upute za prijavu, bez traženja po cijelom webu.",
    allAdmissions: "Sve o upisima",
    trainingLead: "Osposobljavanje i obnova svjedodžbi pomoraca.",
    trainingHeadline: "Edukacija pomoraca",
    trainingPhoto: "[FOTO: TRENING CENTAR]",
    trainingPhotoSrc: "/images/trening centar PFST 2.webp",
    ctaSectionLabel: "Upisi i Trening centar",
    photoTag: "[FOTO: KAMPUS ILI BROD]",
    eyebrow: "Sveučilište u Splitu",
    categoryFallback: "Obavijesti",
    timetableDays: ["PON", "UTO", "SRI", "ČET", "PET"],
  },
  en: {
    heroTitle: "[TITLE]",
    heroLead: "[FACULTY INTRODUCTION — TO BE PROVIDED]",
    heroYears: { value: "65+", label: "years of tradition", detail: "from training to diploma" },
    heroStudies: { value: "4", label: "undergraduate programmes", detail: "nautical · engineering · ETI · management" },
    heroCards: {
      admissions: { title: "Admissions", href: "/en/studies" },
      studiesNote: "4 undergraduate programmes",
      consultations: { title: "Office hours", text: "[CONSULTATIONS TEXT — TO BE PROVIDED]", href: "/en/faculty/student-services" },
      exams: {
        title: "Exam periods",
        meta: "[UPDATED — TO BE PROVIDED]",
        upcoming: "Upcoming periods",
        href: "/en/faculty/student-services",
        terms: [
          { month: "JAN", title: "Winter period", detail: "1st session" },
          { month: "FEB", title: "Winter period", detail: "2nd session" },
        ],
      },
      training: { title: "Training centre", text: "Simulators and seafarer courses", href: "/en/seafarer-education/training-center" },
    },
    exploreStudies: "Explore studies",
    admissions: "Admissions",
    newLabel: "New",
    quickEyebrow: "Quick access",
    quickTitle: "Frequently visited pages",
    quickLead: "[QUICK ACCESS INTRODUCTION — TO BE PROVIDED]",
    training: "Training centre",
    // itemDescription: "[DESCRIPTION — TO BE PROVIDED]",
    highlightsEyebrow: "Featured",
    highlightsTitle: "News from the Faculty",
    allNews: "All news",
    newsPrev: "Previous news",
    newsNext: "Next news",
    noHighlights: "There are no featured news items at this time.",
    statement: "[FACULTY STATEMENT — TO BE PROVIDED]",
    about: "About the Faculty",
    studyEyebrow: "Studies",
    studyTitle: "Study programmes",
    studyLead: "Study programmes aligned with international maritime standards.",
    studyPrograms: [
      {
        title: "Nautical Studies",
        href: "/en/studies/undergraduate-studies/nautical-studies",
        photo: "[PHOTO: SHIP BRIDGE]",
        description: "For future deck officers and masters – navigation, ship handling and safety at sea.",
        src: "/images/studies-banners/bridge.webp",
      },
      {
        title: "Marine Engineering",
        href: "/en/studies/undergraduate-studies/marine-engineering",
        photo: "[PHOTO: ENGINE ROOM]",
        description: "For future engineer officers and chief engineers – marine propulsion, energy systems and maintenance.",
        src: "/images/studies-banners/engine-room.webp",
      },
      {
        title: "Marine Electrical Engineering and Information Technologies",
        short: "Electrical Engineering & IT",
        href: "/en/studies/undergraduate-studies/marine-electrical-engineering-and-information-technologies",
        photo: "[PHOTO: LABORATORY]",
        description: "Electrical engineering, automation and information systems for modern ships and ports.",
        src: "/images/studies-banners/electrical.webp",
      },
      {
        title: "Maritime Management",
        href: "/en/studies/undergraduate-studies/maritime-management",
        photo: "[PHOTO: PORT]",
        description: "Managing ports, shipping companies and logistics – business skills for the maritime economy.",
        src: "/images/studies-banners/luka split PFST.webp",
      },
    ],
    otherEyebrow: "Announcements",
    otherTitle: "More news",
    otherLead: "[ANNOUNCEMENTS INTRODUCTION — TO BE PROVIDED]",
    newsFilters: "Filter news",
    all: "All",
    featured: "Featured",
    emptyNews: "There are no news items at this time.",
    showMore: "Show more news",
    fewer: "Show fewer",
    ctaLabel: "Admissions",
    ctaTitle: "[ADMISSIONS HEADLINE — TO BE PROVIDED]",
    ctaLead: "[ADMISSIONS DESCRIPTION — TO BE PROVIDED]",
    allAdmissions: "Admissions information",
    trainingLead: "[TRAINING CENTRE DESCRIPTION — TO BE PROVIDED]",
    trainingHeadline: "[TRAINING CENTRE HEADLINE — TO BE PROVIDED]",
    trainingPhoto: "[PHOTO: TRAINING CENTRE]",
    trainingPhotoSrc: "/images/trening centar cta PFST.webp",
    ctaSectionLabel: "Admissions and Training Centre",
    photoTag: "[PHOTO: CAMPUS OR SHIP]",
    eyebrow: "University of Split",
    categoryFallback: "News",
    timetableDays: ["MON", "TUE", "WED", "THU", "FRI"],
  },
};

export default async function HomePage({ language }) {
  const copy = COPY[language] ?? COPY.hr;
  const languageCode = toLanguageCodeEnum(language);
  const featuredSlugPromise = getFeaturedCategorySlug(language);
  const recentPromise = wpFetch(NEWS_POSTS, { first: 24, after: null, where: { language: languageCode } }, { tags: ["wp"] });
  const [featuredSlug, recentData, quickStats] = await Promise.all([featuredSlugPromise, recentPromise, getQuickStats(language)]);
  // Timetable wall in the "Raspored nastave" tile — hr only (Croatian
  // subject names); the English tile keeps the drawn timetable.
  const marquee = language === "hr" ? TIMETABLE_SAMPLE : [];
  const featuredData = featuredSlug
    ? await wpFetch(
        NEWS_POSTS,
        {
          first: 7,
          after: null,
          where: { language: languageCode, categoryName: featuredSlug },
        },
        { tags: ["wp"] },
      )
    : null;
  const recentPosts = recentData?.posts?.nodes ?? EMPTY_POSTS.nodes;
  const featuredPosts = (featuredData?.posts?.nodes ?? []).filter((post) => post.featuredImage?.node?.sourceUrl).slice(0, 6);
  const rowPosts = [...new Map([...recentPosts, ...(featuredData?.posts?.nodes ?? [])].map((post) => [post.id, post])).values()].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  return (
    <SiteChrome language={language}>
      {HERO_VERSION === "cards" ? (
        <HomeHeroCards copy={copy} language={language} stats={quickStats} />
      ) : (
        <HomeHero copy={copy} language={language} />
      )}

      <QuickLinks language={language} copy={copy} marquee={marquee} stats={quickStats} />
      <FeaturedNews copy={copy} language={language} posts={featuredPosts} featuredSlug={featuredSlug} />
      <Statement copy={copy} language={language} />
      <StudyProgrammes copy={copy} language={language} />
      <HomeNews copy={copy} language={language} posts={rowPosts} featuredSlug={featuredSlug} />
      <CallsToAction copy={copy} language={language} />
    </SiteChrome>
  );
}
