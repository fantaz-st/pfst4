import Link from "next/link";
import { wpFetch } from "@/lib/wp";
import { NEWS_POSTS } from "@/lib/queries";
import { getFeaturedCategorySlug } from "@/lib/news";
import { NEWS_ARCHIVE_URI, getPostCategories, isRecentPost } from "@/lib/posts";
import { toLanguageCodeEnum } from "@/lib/language";
import { formatDate } from "@/lib/format";
import SiteChrome from "@/components/layout/SiteChrome";
import Hero from "@/components/layout/Hero";
import Image from "next/image";
import Photo from "@/components/ui/Photo";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import Icon from "@/components/ui/Icon";
import ArrowCircle from "@/components/ui/ArrowCircle";
import HomeNewsRows from "./HomeNewsRows";
import styles from "./HomePage.module.css";
import AdmissionsCard from "./AdmissionsCard";
import NewsSlider, { NewsSliderControls, NewsSliderViewport } from "./NewsSlider";
import TimetableMarquee from "./TimetableMarquee";
import { TIMETABLE_SAMPLE } from "./timetableSample";

const EMPTY_POSTS = { nodes: [] };

const COPY = {
  hr: {
    heroTitle: "POMORSKI FAKULTET",
    heroLead: "Više od 65 godina tradicije u obuci, podučavanju i prenošenju znanja budućim pomorcima i inženjerima.",
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

const QUICK_LINKS = {
  hr: [
    {
      title: "Raspored nastave",
      href: "/nastava/studiranje/raspored",
      icon: "clock",
      style: "large",
      description: "Izmijenjeno: 14. 11. 2026.",
      imageSrc: "/images/sceduly-timetable.webp",
    },
    { title: "Upisi", href: "/nastava/upisi", icon: "cap", style: "accent", description: "Sve informacije o upisima — upisni rokovi, potrebni dokumenti i ostalo." },
    { title: "Ispitni rokovi", href: "/nastava/studiranje/ispitni-rokovi", icon: "exam", description: "Izmijenjeno: 12. 11. 2026." },
    { title: "Konzultacije", href: "/nastava/studiranje/konzultacije", icon: "chat", description: "Izmijenjeno: 10. 11. 2026." },
    { title: "Trening centar", href: "/edukacija-pomoraca/trening-centar", icon: "building", style: "image" },
    { title: "Nastavnici i suradnici", href: "/fakultet/opcenito/ustroj/nastavnici-i-suradnici", icon: "users" },
    { title: "Natječaji", href: "/novosti?kategorija=natjecaji", icon: "doc" },
  ],
  en: [
    { title: "Timetable", href: "/en/studies", icon: "clock", style: "large" },
    { title: "Admissions", href: "/en/studies", icon: "cap", style: "accent", description: "Everything about admissions — deadlines, required documents and more." },
    { title: "Student services", href: "/en/faculty/student-services", icon: "exam" },
    { title: "Teachers and associates", href: "/en/faculty/general-information/structure/teachers-and-associates", icon: "users" },
    { title: "Training centre", href: "/en/seafarer-education/training-center", icon: "building", style: "image" },
    { title: "Research", href: "/en/research", icon: "chat" },
    { title: "News", href: "/en/news", icon: "doc" },
  ],
};

function getQuickLinks(language) {
  return QUICK_LINKS[language].map((link, index) => ({
    ...link,
    // description: copy.itemDescription,
    className: index === 0 ? "large" : link.style,
  }));
}

function QuickLinks({ language, copy, marquee }) {
  const links = getQuickLinks(language);

  return (
    <section className={styles.quick} aria-labelledby="home-quick-title">
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <div className={styles.sectionHeadLeft}>
            {/* <span className={styles.eyebrow}>
              <span />
              {copy.quickEyebrow}
            </span> */}
            <h2 id="home-quick-title" className={styles.sectionTitle}>
              {copy.quickTitle}
            </h2>
          </div>
          <p className={styles.sectionLead}>{copy.quickLead}</p>
        </div>

        <div className={styles.bento} data-stagger>
          {links.map((link, index) => {
            // The first tile shows the timetable wall (sample data).
            const wall = index === 0 && marquee.length > 0;
            return (
              <Link
                key={link.title}
                href={link.href}
                className={[
                  styles.tile,
                  link.className === "large" ? styles.tileLarge : "",
                  wall ? styles.tileTimetable : "",
                  link.className === "accent" ? styles.tileAccent : "",
                  link.className === "image" ? styles.tileImage : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {wall && <TimetableMarquee entries={marquee} />}
                {link.className === "image" ? (
                  <>
                    <Photo className={styles.tilePhoto} sizes="(max-width: 720px) 100vw, 50vw" tag={copy.trainingPhoto} src={copy.trainingPhotoSrc} tagPosition="top-left" />
                    <span className={styles.tileImagePanel}>
                      <span className={styles.tileTitle}>{copy.training}</span>
                      {/* <span className={styles.tileDescription}>{copy.itemDescription}</span> */}
                    </span>
                  </>
                ) : (
                  <>
                    <span className={styles.tileIcon}>
                      <Icon name={link.icon} size={24} />
                    </span>
                    {wall ? null : link.imageSrc ? (
                      <span className={styles.tileShot}>
                        <Image src={link.imageSrc} alt="" fill sizes="(max-width: 720px) 100vw, 50vw" />
                      </span>
                    ) : (
                      index === 0 && <TimetableGraphic days={copy.timetableDays} />
                    )}
                    <span className={styles.tileBody}>
                      <span className={styles.tileTitle}>{link.title}</span>
                      {link.description && <span className={styles.tileDescription}>{link.description}</span>}
                    </span>
                  </>
                )}
                <ArrowCircle className={styles.tileArrow} tone={!wall && ["large", "accent", "image"].includes(link.className) ? "white" : "light"} />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TimetableGraphic({ days }) {
  return (
    <span className={styles.timetable} aria-hidden="true">
      {days.map((day, index) => (
        <span className={styles.timetableColumn} key={day}>
          <span className={styles.timetableDay}>{day}</span>
          <span className={`${styles.timetableBlock} ${index % 2 === 0 ? styles.timetableBlockAccent : ""}`} />
          <span className={`${styles.timetableBlock} ${index % 3 === 0 ? styles.timetableBlockMid : ""}`} />
          <span className={`${styles.timetableBlock} ${index % 2 === 1 ? styles.timetableBlockAccent : ""}`} />
        </span>
      ))}
    </span>
  );
}

function HeroNews({ post, copy, language }) {
  const image = post.featuredImage.node;
  return (
    <Link href={post.uri} className={styles.heroNews} data-hero-fade>
      <Photo src={image.sourceUrl} alt={image.altText ?? ""} ratio="1/1" radius="panel" sizes="64px" className={styles.heroNewsPhoto} />
      <span className={styles.heroNewsText}>
        <span className={styles.heroNewsMeta}>
          {copy.newLabel} · {formatDate(post.date, language)}
        </span>
        <span className={styles.heroNewsTitle}>{post.title}</span>
      </span>
    </Link>
  );
}

function FeaturedNews({ copy, language, posts, featuredSlug }) {
  const archive = NEWS_ARCHIVE_URI[language];
  const [lead, ...rest] = posts;

  const head = (controls) => (
    <div className={`${styles.wrap} ${styles.highlightsHead}`}>
      <div className={styles.sectionHeadLeft}>
        <h2 id="home-highlights-title" className={styles.sectionTitle}>
          {copy.highlightsTitle}
        </h2>
      </div>
      <div className={styles.highlightsActions}>
        {controls}
        {/* <Button href={archive} variant="primary">
          {copy.allNews}
        </Button> */}
      </div>
    </div>
  );

  return (
    <section className={styles.highlights} id={language === "en" ? "news" : "novosti"} aria-labelledby="home-highlights-title">
      <div className={styles.highlightsInner}>
        {posts.length ? (
          // Embla slider. The cards below are Server Components passed in as
          // children — only the slider shell (NewsSlider) hydrates.
          <NewsSlider>
            {head(<NewsSliderControls prevLabel={copy.newsPrev} nextLabel={copy.newsNext} className={styles.sliderControls} />)}
            <NewsSliderViewport label={copy.highlightsTitle}>
              {lead && <FeaturedCard post={lead} language={language} featuredSlug={featuredSlug} featured />}
              {rest.map((post) => (
                <FeaturedCard key={post.id} post={post} language={language} featuredSlug={featuredSlug} />
              ))}
              <Link href={archive} className={styles.archiveCard}>
                <span className={styles.archiveLabel}>{copy.allNews}</span>
                <span className={styles.archiveTitle}>{copy.highlightsTitle}</span>
                <ArrowCircle tone="white" size="l" />
              </Link>
            </NewsSliderViewport>
          </NewsSlider>
        ) : (
          <>
            {head(null)}
            <p className={`${styles.wrap} ${styles.emptyHighlights}`}>{copy.noHighlights}</p>
          </>
        )}
      </div>
    </section>
  );
}

function FeaturedCard({ post, language, featuredSlug, featured = false }) {
  const category = getPostCategories(post, featuredSlug)[0];
  const image = post.featuredImage?.node;

  // Same height as the featured card: the photo takes whatever height the
  // date row and the (max three-line) title leave, so every card in the
  // strip lines up top and bottom.
  return (
    <Link href={post.uri} className={featured ? styles.featuredCard : styles.newsCard}>
      {featured ? (
        <Photo src={image?.sourceUrl} alt={image?.altText ?? ""} sizes="(max-width: 720px) 85vw, 680px" className={styles.featuredPhoto} radius="feature" zoom />
      ) : (
        <span className={styles.newsPhoto}>
          <Photo src={image?.sourceUrl} alt={image?.altText ?? ""} sizes="(max-width: 720px) 75vw, 420px" zoom />
        </span>
      )}
      {featured && (
        <span className={styles.featuredPanel}>
          <span className={styles.newsMeta}>
            <time dateTime={post.date} className="num">
              {formatDate(post.date, language)}
            </time>
            {category && <Chip className={styles.newsChip}>{category.name}</Chip>}
          </span>
          <span className={styles.featuredTitle}>
            {post.title}
            <Icon name="arrow" size={24} className={styles.titleArrow} />
          </span>
        </span>
      )}
      {!featured && (
        <>
          <span className={styles.newsMeta}>
            <time dateTime={post.date} className="num">
              {formatDate(post.date, language)}
            </time>
            {category && (
              <Chip tone="white" className={styles.newsChip}>
                {category.name}
              </Chip>
            )}
          </span>
          <span className={styles.newsTitle}>
            {post.title}
            <Icon name="arrow" size={18} className={styles.titleArrow} />
          </span>
        </>
      )}
    </Link>
  );
}

// One decorative pill: a photo (or its placeholder) or the signal-flag
// pattern. aria-hidden — the sentence reads complete without the pills.
function StatementPill({ pill }) {
  const kind = pill.pattern === "flags" ? styles.pillFlags : pill.src ? styles.pillPhoto : styles.pillPlaceholder;
  return (
    <span className={[styles.pill, kind, pill.hideOnMobile ? styles.pillHideSm : ""].filter(Boolean).join(" ")} data-home-pill aria-hidden="true">
      <span className={styles.pillMedia} data-home-pill-media>
        {pill.src && <Image src={pill.src} alt="" fill sizes="160px" />}
      </span>
    </span>
  );
}

// Renders the statement pieces. The last word before each pill is wrapped
// with the pill in a nowrap span, so a pill never starts a line on its own.
function StatementText({ parts }) {
  if (typeof parts === "string") return parts;
  return parts.map((part, index) => {
    if (typeof part !== "string") return null;
    const next = parts[index + 1];
    if (!next || typeof next === "string") return <span key={index}>{part}</span>;
    const match = part.match(/^(.*?)(\S+)$/s);
    const head = match ? match[1] : "";
    const lastWord = match ? match[2] : part;
    return (
      <span key={index}>
        {head}
        <span className={styles.pillWord}>
          {lastWord} <StatementPill pill={next} />
        </span>
      </span>
    );
  });
}

function Statement({ copy, language }) {
  const about = language === "en" ? "/en/faculty/general-information" : "/fakultet/opcenito";
  return (
    <section className={styles.statement} aria-label={copy.about}>
      <div className={styles.wrap}>
        <p className={styles.statementText} data-home-statement>
          <StatementText parts={copy.statement} />
        </p>
        <div className={styles.statementActions} data-fade>
          <Button href={about}>{copy.about}</Button>
          <Button href="#studiji" variant="outline" arrow={false}>
            {copy.studyTitle}
          </Button>
        </div>
      </div>
    </section>
  );
}

function StudyProgrammes({ copy, language }) {
  return (
    <section className={styles.studies} id="studiji" aria-labelledby="home-studies-title">
      <div className={styles.studiesBox}>
        <div className={styles.wrap}>
          <div className={`${styles.sectionHead} ${styles.studiesHead}`}>
            <div className={styles.sectionHeadLeft}>
              {/* <span className={`${styles.eyebrow} ${styles.eyebrowDark}`}>
                <span />
                {copy.studyEyebrow}
              </span> */}
              <h2 id="home-studies-title" className={styles.sectionTitle}>
                {copy.studyTitle}
              </h2>
            </div>
            <p className={styles.sectionLead}>{copy.studyLead}</p>
          </div>

          <div className={styles.stack}>
            {copy.studyPrograms.map((program, index) => (
              <Link href={program.href} className={`${styles.studyCard} ${styles[`studyCard${index + 1}`]}`} data-home-study-card key={program.href}>
                <span className={styles.studyText}>
                  <span className={styles.studyTop}>
                    <span className={`${styles.studyNumber} num`}>{String(index + 1).padStart(2, "0")} / 04</span>
                    <ArrowCircle tone={index === 3 ? "white" : "primary"} size="l" />
                  </span>
                  <span className={styles.studyBody}>
                    <span className={styles.studyTitle}>{program.title}</span>
                    <span className={styles.studyDescription}>{program.description}</span>
                  </span>
                </span>
                <span className={styles.studyMedia}>
                  <Photo className={styles.studyPhoto} src={program.src} sizes="(max-width: 1080px) 100vw, 55vw" tag={program.photo} tagPosition="bottom-left" />
                </span>
                {index < copy.studyPrograms.length - 1 && <span className={styles.studyDim} data-home-study-dim aria-hidden="true" />}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeNews({ copy, language, posts, featuredSlug }) {
  return (
    <section className={styles.other} aria-labelledby="home-other-title">
      <div className={`${styles.wrap} ${styles.otherGrid}`}>
        <div className={styles.otherAside}>
          {/* <span className={styles.eyebrow}>
            <span />
            {copy.otherEyebrow}
          </span> */}
          <h2 id="home-other-title" className={styles.otherTitle}>
            {copy.otherTitle}
          </h2>
          <p className={styles.sectionLead}>{copy.otherLead}</p>
        </div>
        <HomeNewsRows
          posts={posts.map((post) => ({ ...post, isNew: isRecentPost(post.date) }))}
          featuredSlug={featuredSlug}
          language={language}
          labels={{
            all: copy.all,
            featured: copy.featured,
            filterLabel: copy.newsFilters,
            empty: copy.emptyNews,
            showMore: copy.showMore,
            fewer: copy.fewer,
            categoryFallback: copy.categoryFallback,
            new: copy.newLabel,
            allNews: copy.allNews,
            archiveHref: NEWS_ARCHIVE_URI[language],
          }}
        />
      </div>
    </section>
  );
}

function CallsToAction({ copy, language }) {
  const admissionsHref = language === "en" ? "/en/studies" : "/nastava/upisi";
  const trainingHref = language === "en" ? "/en/seafarer-education/training-center" : "/edukacija-pomoraca/trening-centar";

  return (
    <section className={styles.ctaSection} aria-label={copy.ctaSectionLabel}>
      <div className={styles.ctaGrid}>
        <AdmissionsCard href={admissionsHref} label={copy.ctaLabel} title={copy.ctaTitle} lead={copy.ctaLead} cta={copy.allAdmissions} />
        <Link href={trainingHref} className={styles.trainingCard} data-home-clip data-delay={0.15}>
          <Photo
            className={styles.trainingPhoto}
            sizes="(max-width: 1080px) 100vw, 50vw"
            tag={copy.trainingPhoto}
            src="/images/trening centar cta PFST.webp"
            tagPosition="top-left"
          />
          <span className={styles.trainingPanel}>
            <span>
              <span className={styles.trainingLabel}>{copy.training}</span>
              <span className={styles.trainingTitle}>{copy.trainingHeadline}</span>
              <span className={styles.trainingLead}>{copy.trainingLead}</span>
            </span>
            <ArrowCircle tone="light" size="l" />
          </span>
        </Link>
      </div>
    </section>
  );
}

export default async function HomePage({ language }) {
  const copy = COPY[language] ?? COPY.hr;
  const languageCode = toLanguageCodeEnum(language);
  const featuredSlugPromise = getFeaturedCategorySlug(language);
  const recentPromise = wpFetch(NEWS_POSTS, { first: 24, after: null, where: { language: languageCode } }, { tags: ["wp"] });
  const [featuredSlug, recentData] = await Promise.all([featuredSlugPromise, recentPromise]);
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

  const heroLabel = "home-hero-title";
  return (
    <SiteChrome language={language}>
      <Hero size="home" labelledBy={heroLabel} photo={{ tag: copy.photoTag, hideTagOnMobile: true, src: "/images/PFST - hero -sailing -team.png" }}>
        {featuredPosts[0] && <HeroNews post={featuredPosts[0]} copy={copy} language={language} />}
        <div className={styles.heroContent} data-home-hero-content>
          <div className={styles.heroChips} data-hero-fade>
            <span className={styles.glassChip}>{copy.eyebrow}</span>
          </div>
          <div className={styles.heroBottom}>
            <h1 id={heroLabel} className={styles.heroTitle} data-split="chars">
              {copy.heroTitle}
            </h1>
            <div className={styles.heroSide}>
              <p className={styles.heroLead} data-hero-fade>
                {copy.heroLead}
              </p>
              <div className={styles.heroActions} data-hero-fade>
                <Button href="#studiji" variant="white">
                  {copy.exploreStudies}
                </Button>
                <Button href={language === "en" ? "/en/studies" : "/nastava/upisi"} variant="glass">
                  {copy.admissions}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Hero>

      <QuickLinks language={language} copy={copy} marquee={marquee} />
      <FeaturedNews copy={copy} language={language} posts={featuredPosts} featuredSlug={featuredSlug} />
      <Statement copy={copy} language={language} />
      <StudyProgrammes copy={copy} language={language} />
      <HomeNews copy={copy} language={language} posts={rowPosts} featuredSlug={featuredSlug} />
      <CallsToAction copy={copy} language={language} />
    </SiteChrome>
  );
}
