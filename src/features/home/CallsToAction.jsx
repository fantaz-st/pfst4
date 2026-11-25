import Link from "next/link";
import Photo from "@/components/ui/Photo";
import ArrowCircle from "@/components/ui/ArrowCircle";
import styles from "./CallsToAction.module.css";
import AdmissionsCard from "./AdmissionsCard";

export default function CallsToAction({ copy, language }) {
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
