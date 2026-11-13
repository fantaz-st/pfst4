import Link from "next/link";
import ArrowCircle from "@/components/ui/ArrowCircle";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import Eyebrow from "@/components/ui/Eyebrow";
import Icon, { ICON_NAMES } from "@/components/ui/Icon";
import Photo from "@/components/ui/Photo";
import Hero from "@/components/layout/Hero";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import styles from "./styleguide.module.css";

export const metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

// A living check of design/STYLEGUIDE.md against the real components.
// TODO: every text below is placeholder content for this page only —
// obviously fake, per CLAUDE.md.

const COLOURS = [
  ["--pfst-modra", "PFST modra"],
  ["--pfst-plava", "PFST plava"],
  ["--color-bg", "Pozadina"],
  ["--color-surface", "Površina"],
  ["--color-text-muted", "Prigušeni tekst"],
  ["--color-text-on-dark", "Tekst na modroj"],
  ["--color-line", "Linija"],
  ["--color-deep", "Duboka (učitavanje)"],
  ["--tint-plava-1", "Nijansa plava 1"],
  ["--tint-plava-2", "Nijansa plava 2"],
  ["--tint-plava-3", "Nijansa plava 3"],
  ["--tint-modra-1", "Nijansa modra 1"],
  ["--tint-modra-2", "Nijansa modra 2"],
  ["--color-error", "Greška"],
  ["--color-success", "Uspjeh"],
];

const TYPE = [
  ["hero", "Hero — Znanje koje plovi"],
  ["pageTitle", "Naslov stranice"],
  ["h2", "Naslov sekcije"],
  ["statement", "Izjava u dva retka teksta"],
  ["h3", "Velika kartica"],
  ["titleL", "Title L — naslov"],
  ["titleM", "Title M — naslov novosti"],
  ["titleS", "Title S — pločica, redak"],
  [
    "bodyL",
    "Body L — uvodni tekst stranice, najviše oko šezdeset znakova u retku.",
  ],
  ["body", "Body — osnovni tekst. Čćžšđ ČĆŽŠĐ."],
  ["small", "Small — datumi, opisi, sekundarni tekst"],
  ["label", "Label — oznaka"],
  ["micro", "Micro — sitna oznaka"],
];

// Fake WordPress blocks, shaped like the live payload (CLAUDE.md).
const PROSE_BLOCKS = [
  {
    name: "core/heading",
    attributes: { level: 2, content: "TODO naslov sekcije" },
  },
  {
    name: "core/paragraph",
    attributes: {
      content:
        'TODO odlomak teksta s <a href="/styleguide">poveznicom unutar sadržaja</a> i <strong>naglašenim dijelom</strong>.',
    },
  },
  {
    name: "core/list",
    attributes: { ordered: false },
    innerBlocks: [
      { name: "core/list-item", attributes: { content: "TODO prva stavka" } },
      { name: "core/list-item", attributes: { content: "TODO druga stavka" } },
    ],
  },
  { name: "core/heading", attributes: { level: 3, content: "TODO podnaslov" } },
  {
    name: "core/table",
    attributes: {
      headers: ["Ime Prezime", "Zvanje", "E-pošta"],
      rows: [
        [
          "Ime Prezime",
          "TODO",
          '<a href="mailto:todo@example.com">todo@example.com</a>',
        ],
        [
          "Ime Prezime",
          "TODO",
          '<a href="mailto:todo@example.com">todo@example.com</a>',
        ],
      ],
    },
  },
  {
    name: "core/details",
    attributes: { summary: "TODO pitanje harmonike", showContent: false },
    innerBlocks: [
      { name: "core/paragraph", attributes: { content: "TODO odgovor." } },
    ],
  },
  {
    name: "core/details",
    attributes: { summary: "TODO otvorena harmonika", showContent: true },
    innerBlocks: [
      { name: "core/paragraph", attributes: { content: "TODO sadržaj." } },
    ],
  },
  {
    name: "core/file",
    attributes: {
      href: "/styleguide",
      fileLabel: "TODO dokument.pdf",
      extension: "pdf",
      filesizeHuman: "000 KB",
    },
  },
];

function Section({ title, children }) {
  return (
    <section className={styles.section} aria-labelledby={`sg-${title}`}>
      <h2 id={`sg-${title}`} className={styles.sectionTitle}>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <>
      <Hero photo={{ tag: "Foto · TODO styleguide" }} labelledBy="sg-title">
        <div className={styles.header}>
          <Eyebrow tone="dark">Styleguide</Eyebrow>
          <h1 id="sg-title">Primitivi</h1>
        </div>
      </Hero>
      <div className={styles.page}>
        <Section title="Boje">
          <ul className={styles.swatches} role="list">
            {COLOURS.map(([token, label]) => (
              <li key={token} className={styles.swatch}>
                <span
                  className={styles.swatchColour}
                  style={{ "--swatch": `var(${token})` }}
                />
                <span className={styles.swatchLabel}>{label}</span>
                <code className={styles.swatchToken}>{token}</code>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Tipografija">
          <ul className={styles.typeList} role="list">
            {TYPE.map(([key, sample]) => (
              <li key={key} className={styles.typeRow}>
                <code className={styles.typeKey}>{key}</code>
                <span className={styles[`t_${key}`]}>{sample}</span>
              </li>
            ))}
            <li className={styles.typeRow}>
              <code className={styles.typeKey}>num</code>
              <span className="num">12. 11. 2026. · 2026./2027.</span>
            </li>
          </ul>
        </Section>

        <Section title="Gumbi">
          <div className={styles.row}>
            <Button href="/styleguide">Primarni L</Button>
            <Button href="/styleguide" size="m">
              Primarni M
            </Button>
            <Button href="/styleguide" size="s">
              Primarni S
            </Button>
            <Button href="/styleguide" variant="accent" magnetic>
              Upiši se (magnetski)
            </Button>
            <Button href="/styleguide" variant="outline">
              Obrub
            </Button>
            <Button variant="outline" arrow>
              Obrub sa strelicom
            </Button>
            <Button disabled>Onemogućen</Button>
          </div>
          <div className={`${styles.row} ${styles.dark}`}>
            <Button href="/styleguide" variant="white">
              Bijeli
            </Button>
            <Button href="/styleguide" variant="white" size="m">
              Bijeli M
            </Button>
            <Button href="/styleguide" variant="glass">
              Stakleni
            </Button>
            <Button href="/styleguide" variant="accent" size="s">
              Naglašeni S
            </Button>
          </div>
        </Section>

        <Section title="Krug sa strelicom">
          <div className={styles.row}>
            {["light", "white", "primary", "accent"].map((tone) => (
              <Link key={tone} href="/styleguide" className={styles.circleDemo}>
                <ArrowCircle tone={tone} />
                <ArrowCircle tone={tone} size="l" />
                <span>{tone}</span>
              </Link>
            ))}
            <Link href="/styleguide" className={styles.circleDemo}>
              <ArrowCircle direction="back" />
              <span>natrag</span>
            </Link>
          </div>
        </Section>

        <Section title="Oznake">
          <div className={styles.row}>
            <Chip>Natječaji</Chip>
            <Chip>Najave</Chip>
            <Chip href="/styleguide">Poveznica</Chip>
            <span className={styles.onSurface}>
              <Chip>Na bijeloj</Chip>
            </span>
            <Chip tone="white">Bijela na pozadini</Chip>
          </div>
          <div className={styles.row}>
            <Eyebrow>Novosti</Eyebrow>
            <span className={styles.dark}>
              <Eyebrow tone="dark">Studiji</Eyebrow>
            </span>
          </div>
        </Section>

        <Section title="Fotografije">
          <div className={styles.photoGrid}>
            <Link href="/styleguide" className={styles.photoDemo}>
              <Photo
                ratio="4/3"
                radius="card"
                sizes="(max-width: 720px) 100vw, 33vw"
                tag="Foto · TODO kampus"
                zoom
              />
              <span>4:3 · r24 · zoom</span>
            </Link>
            <div className={styles.photoDemo}>
              <Photo
                ratio="5/4"
                radius="feature"
                tone="light"
                sizes="(max-width: 720px) 100vw, 33vw"
                tag="Foto · TODO brod"
                tagPosition="top-left"
              />
              <span>5:4 · r28 · svijetla</span>
            </div>
            <div className={styles.photoDemo}>
              <Photo
                ratio="1/1"
                radius="panel"
                sizes="(max-width: 720px) 100vw, 33vw"
                tag="Foto · TODO simulator"
              />
              <span>1:1 · r20</span>
            </div>
          </div>
        </Section>

        <Section title="Ikone">
          <ul className={styles.icons} role="list">
            {ICON_NAMES.map((name) => (
              <li key={name} className={styles.iconItem}>
                <span className={styles.iconBox}>
                  <Icon name={name} />
                </span>
                <code>{name}</code>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Sadržaj (.prose)">
          <div className={`prose ${styles.prose}`}>
            <BlockRenderer blocks={PROSE_BLOCKS} />
            <blockquote>
              TODO citat koji se ističe u sadržaju stranice.
              <cite>Ime Prezime</cite>
            </blockquote>
          </div>
        </Section>
      </div>
    </>
  );
}
