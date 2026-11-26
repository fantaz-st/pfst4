import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { FLAG_DESIGNS } from "@/components/ui/flagDesigns";
import ArrowCircle from "@/components/ui/ArrowCircle";
import MyTimetableNote from "@/features/personal/MyTimetableNote";
import { TIMETABLE_SAMPLE } from "./timetableSample";
import { QUICK_LINKS } from "./QuickLinks";
import TimetableMarquee from "./TimetableMarquee";
import ConsultationsToday from "./ConsultationsToday";
import styles from "./HomeHeroCards.module.css";

/**
 * Home hero, version 2 (design: "PFST — Naslovni hero (alternativa)",
 * board "kartice po referenci"): a light hero with the title centred and a
 * row of five cards for the most visited pages, bottom-aligned at
 * different heights — timetable, admissions, studies + consultations,
 * exam periods, training centre. Each card is a link.
 *
 * The row keeps its design sizes; when the screen is narrower than the row
 * it scrolls sideways (snap). data-hero-tone="light" switches the shared
 * header to its light look (SiteHeader.module.css, Brand.module.css).
 *
 * The timetable card is the quick-links "Raspored nastave" tile (same link,
 * same timetable wall — decorative TIMETABLE_SAMPLE, Croatian only);
 * consultations show today's live count.
 */

function Flag({ design }) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      {FLAG_DESIGNS[design].map(([type, ...rest], index) => {
        const className = styles[rest[rest.length - 1]];
        if (type === "rect") {
          const [x, y, width, height] = rest;
          return <rect key={index} className={className} x={x} y={y} width={width} height={height} />;
        }
        if (type === "circle") {
          const [cx, cy, r] = rest;
          return <circle key={index} className={className} cx={cx} cy={cy} r={r} />;
        }
        return <polygon key={index} className={className} points={rest[0]} />;
      })}
    </svg>
  );
}

export default function HomeHeroCards({ copy, language, stats = {} }) {
  const heroLabel = "home-hero-title";
  const cards = copy.heroCards;
  const timetable = QUICK_LINKS[language]?.[0] ?? QUICK_LINKS.hr[0];
  const wall = language === "hr";

  return (
    <section className={styles.hero} aria-labelledby={heroLabel} data-hero data-hero-tone="light">
      <div className={styles.intro}>
        <h1 id={heroLabel} className={styles.title} data-split="chars">
          {copy.heroTitle}
        </h1>
        <p className={styles.lead} data-hero-fade>
          {copy.heroLead}
        </p>
        {/* Phones: the CTA box sits in the card row off screen, so the
            buttons come up here instead. */}
        <div className={styles.mobileActions} data-hero-fade>
          <Button href="#studiji">{copy.exploreStudies}</Button>
          <Button href={cards.admissions.href} variant="outline">
            {copy.admissions}
          </Button>
        </div>
      </div>

      <div className={styles.row}>
        {/* 1 · Timetable: the "Raspored nastave" quick-links tile — the
            moving timetable wall (hr), title, last change, "Tvoj raspored". */}
        <Link href={timetable.href} className={`${styles.card} ${styles.timetable} ${wall ? styles.timetableWall : ""}`} data-hero-fade>
          {wall && <TimetableMarquee entries={TIMETABLE_SAMPLE} />}
          <span className={styles.timetableIcon} aria-hidden="true">
            <Icon name={timetable.icon} size={22} />
          </span>
          <ArrowCircle className={styles.timetableArrow} tone={wall ? "light" : "white"} />
          <span className={styles.timetableBody}>
            <span className={styles.timetableTitle}>{timetable.title}</span>
            {timetable.description && <span className={styles.timetableDescription}>{timetable.description}</span>}
            {language === "hr" && <MyTimetableNote className={styles.myTimetable} prefix="Tvoj raspored:" />}
          </span>
        </Link>

        {/* 2 · Admissions */}
        <Link href={cards.admissions.href} className={`${styles.card} ${styles.admissions}`} data-hero-fade>
          <Image src="/images/PFST - hero -sailing -team.png" alt="" fill sizes="216px" priority className={styles.photo} style={{ objectPosition: "42% 50%" }} />
          <span className={styles.pill}>
            {cards.admissions.title}
            <span className={styles.pillArrow} aria-hidden="true">
              <Icon name="arrow" size={16} />
            </span>
          </span>
        </Link>

        {/* 3 · Studies CTA + consultations */}
        <div className={styles.stack}>
          <div className={styles.cta} data-hero-fade>
            <Button href="#studiji" size="m" className={styles.ctaButton}>
              {copy.exploreStudies}
            </Button>
            <span className={styles.ctaNote}>{cards.studiesNote}</span>
          </div>
          <Link href={cards.consultations.href} className={`${styles.card} ${styles.consultations}`} data-hero-fade>
            <span className={styles.consultationsText}>{cards.consultations.text}</span>
            <span className={styles.consultationsFoot}>
              {cards.consultations.title}
              <ConsultationsToday counts={stats.consultationsByDay} className={styles.liveChip} />
            </span>
          </Link>
        </div>

        {/* 4 · Exam periods */}
        <Link href={cards.exams.href} className={`${styles.card} ${styles.exams}`} data-hero-fade>
          <span className={styles.examsHead}>
            <span className={styles.avatar} aria-hidden="true">
              <Flag design={5} />
            </span>
            <span className={styles.examsTitle}>
              {cards.exams.title}
              <span className={styles.examsMeta}>{cards.exams.meta}</span>
            </span>
          </span>
          <span className={styles.examsLabel}>{cards.exams.upcoming}</span>
          <span className={styles.terms}>
            {cards.exams.terms.map((term) => (
              <span key={`${term.month}-${term.detail}`} className={styles.term}>
                <span className={styles.termMonth}>{term.month}</span>
                <span className={styles.termText}>
                  {term.title}
                  <span className={styles.termDetail}>{term.detail}</span>
                </span>
              </span>
            ))}
          </span>
        </Link>

        {/* 5 · Training centre */}
        <Link href={cards.training.href} className={`${styles.card} ${styles.training}`} data-hero-fade>
          <Image src="/images/trening centar PFST 2.webp" alt="" fill sizes="270px" className={styles.photo} style={{ objectPosition: "50% 30%" }} />
          <span className={styles.trainingShade} aria-hidden="true" />
          <span className={styles.trainingText}>{cards.training.text}</span>
          <span className={styles.trainingBar}>
            <span className={styles.trainingArrow} aria-hidden="true">
              <Icon name="arrow" size={18} />
            </span>
            {cards.training.title}
          </span>
        </Link>
      </div>
    </section>
  );
}
