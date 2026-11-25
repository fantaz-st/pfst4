import Image from "next/image";
import Button from "@/components/ui/Button";
import styles from "./Statement.module.css";

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

export default function Statement({ copy, language }) {
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
