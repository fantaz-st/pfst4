import Link from "next/link";
import { formatDate } from "@/lib/format";
import Hero from "@/components/layout/Hero";
import Photo from "@/components/ui/Photo";
import Button from "@/components/ui/Button";
import styles from "./HomeHero.module.css";

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

export default function HomeHero({ copy, language, post }) {
  const heroLabel = "home-hero-title";
  return (
    <Hero size="home" labelledBy={heroLabel} photo={{ tag: copy.photoTag, hideTagOnMobile: true, src: "/images/PFST - hero -sailing -team.png" }}>
      {post && <HeroNews post={post} copy={copy} language={language} />}
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
  );
}
