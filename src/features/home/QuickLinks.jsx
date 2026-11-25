import Link from "next/link";
import Image from "next/image";
import Photo from "@/components/ui/Photo";
import Icon from "@/components/ui/Icon";
import ArrowCircle from "@/components/ui/ArrowCircle";
import styles from "./QuickLinks.module.css";
import MyTimetableNote from "@/features/personal/MyTimetableNote";
import TimetableMarquee from "./TimetableMarquee";

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

export default function QuickLinks({ language, copy, marquee }) {
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
                      {index === 0 && language === "hr" && <MyTimetableNote className={styles.tileDescription} prefix="Tvoj raspored:" />}
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
