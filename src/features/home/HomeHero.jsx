import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/layout/Hero";
import Button from "@/components/ui/Button";
import { FLAG_DESIGNS } from "@/components/ui/flagDesigns";
import styles from "./HomeHero.module.css";

/**
 * Home hero (design: "PFST — Naslovni hero (alternativa)", centred board):
 * sky gradient, the title centred across the full width, lead and buttons,
 * then a fan of photo cards rising from the bottom with a faint POMORSKI
 * wordmark behind them, two stat chips and a few floating signal flags.
 *
 * The fan is laid out on the 1440px design: every card has its offset from
 * the centre, size and tilt in design px (--x/--y/--w/--h/--r), and --u
 * turns a design px into real px for the fan's width (never above 1px).
 * z: stacking, centre card on top. Phones use their own 390px layout (--mx/--my/--mw/--mh/--mr) and show only
 * the three cards that have one. Study cards link to their programme.
 */

// program: index into copy.studyPrograms (label + link). m: phone layout.
const CARDS = [
  { src: "/images/statement/port.webp", x: -648, y: 150, w: 176, h: 300, r: -15, z: 1 },
  { src: "/images/studies-banners/electrical.webp", program: 2, x: -488, y: 95, w: 196, h: 340, r: -10, z: 2 },
  { src: "/images/statement/bridge.webp", program: 0, x: -313, y: 55, w: 216, h: 380, r: -5, z: 3, m: { x: -187, y: 40, w: 150, h: 260, r: -10 } },
  { src: "/images/PFST - hero -sailing -team.png", x: -140, y: 0, w: 280, h: 470, r: 0, z: 5, position: "42% 50%", m: { x: -93, y: 0, w: 186, h: 320, r: 0 } },
  { src: "/images/statement/engine room.webp", program: 1, x: 97, y: 55, w: 216, h: 380, r: 5, z: 3, m: { x: 37, y: 40, w: 150, h: 260, r: 10 } },
  { src: "/images/studies-banners/luka split PFST.webp", program: 3, x: 292, y: 95, w: 196, h: 340, r: 10, z: 2 },
  { src: "/images/trening centar PFST 2.webp", training: true, x: 472, y: 150, w: 176, h: 300, r: 15, z: 1, position: "50% 30%" },
];

const FLAGS = [
  { design: 5, x: 120, y: -34, s: 56, r: 8, m: { x: 66, y: -22, s: 40, r: 10 } },
  { design: 6, x: -186, y: 250, s: 48, r: -10, m: { x: 120, y: 200, s: 36, r: -8 } },
  { design: 0, x: 330, y: 40, s: 44, r: 12 },
  { design: 4, x: -420, y: 26, s: 40, r: -14 },
];

function vars(item) {
  const style = { "--x": item.x, "--y": item.y, "--w": item.w ?? item.s, "--h": item.h ?? item.s, "--r": item.r };
  if (item.m) {
    Object.assign(style, { "--mx": item.m.x, "--my": item.m.y, "--mw": item.m.w ?? item.m.s, "--mh": item.m.h ?? item.m.s, "--mr": item.m.r });
  }
  return style;
}

function Flag({ design }) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
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

function Card({ card, copy }) {
  const program = card.program !== undefined ? copy.studyPrograms?.[card.program] : null;
  const label = program ? program.short ?? program.title : card.training ? copy.training : null;
  const className = [styles.card, card.m ? null : styles.desktopOnly].filter(Boolean).join(" ");
  const style = { ...vars(card), zIndex: card.z };
  const content = (
    <>
      <Image src={card.src} alt="" fill sizes="(max-width: 720px) 45vw, 280px" priority={card.z === 5} className={styles.cardImage} style={{ objectPosition: card.position ?? "50% 50%" }} />
      {label && <span className={styles.caption}>{label}</span>}
    </>
  );

  return program?.href ? (
    <Link href={program.href} className={className} style={style} data-hero-fade>
      {content}
    </Link>
  ) : (
    <span className={className} style={style} aria-hidden={label ? undefined : "true"} data-hero-fade>
      {content}
    </span>
  );
}

function Chip({ chip, tone, className }) {
  if (!chip) return null;
  return (
    <span className={`${styles.chip} ${className}`} data-hero-fade>
      <span className={styles.chipValue} data-tone={tone}>
        {chip.value}
      </span>
      <span className={styles.chipText}>
        {chip.label}
        <span className={styles.chipDetail}>{chip.detail}</span>
      </span>
    </span>
  );
}

export default function HomeHero({ copy, language }) {
  const heroLabel = "home-hero-title";

  return (
    <Hero size="home" solid fit labelledBy={heroLabel}>
      <span className={styles.sky} aria-hidden="true" />

      <div className={styles.intro} data-home-hero-content>
        <h1 id={heroLabel} className={styles.title} data-split="chars">
          {copy.heroTitle}
        </h1>
        <p className={styles.lead} data-hero-fade>
          {copy.heroLead}
        </p>
        <div className={styles.actions} data-hero-fade>
          <Button href="#studiji" variant="white">
            {copy.exploreStudies}
          </Button>
          <Button href={language === "en" ? "/en/studies" : "/nastava/upisi"} variant="glass">
            {copy.admissions}
          </Button>
        </div>
      </div>

      <div className={styles.fan}>
        <span className={styles.wordmark} aria-hidden="true">
          POMORSKI
        </span>
        {CARDS.map((card) => (
          <Card key={card.src} card={card} copy={copy} />
        ))}
        <Chip chip={copy.heroYears} tone="modra" className={styles.chipYears} />
        <Chip chip={copy.heroStudies} tone="plava" className={styles.chipStudies} />
        {FLAGS.map((flag) => (
          <span
            key={`${flag.x}-${flag.y}`}
            className={`${styles.flag} ${flag.m ? "" : styles.desktopOnly}`}
            style={{ ...vars(flag), animationDelay: `${flag.r * 0.2}s` }}
            aria-hidden="true"
          >
            <Flag design={flag.design} />
          </span>
        ))}
      </div>
    </Hero>
  );
}
