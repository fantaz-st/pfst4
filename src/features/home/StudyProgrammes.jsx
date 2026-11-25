import Link from "next/link";
import Photo from "@/components/ui/Photo";
import ArrowCircle from "@/components/ui/ArrowCircle";
import styles from "./StudyProgrammes.module.css";

export default function StudyProgrammes({ copy, language }) {
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
