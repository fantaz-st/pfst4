import Hero from "@/components/layout/Hero";
import Eyebrow from "@/components/ui/Eyebrow";
import Chip from "@/components/ui/Chip";
import Icon from "@/components/ui/Icon";
import ArrowCircle from "@/components/ui/ArrowCircle";
import Photo from "@/components/ui/Photo";
import styles from "./slider.module.css";

export const metadata = {
  title: "Styleguide — slider novosti",
  robots: { index: false, follow: false },
};

// TODO: styleguide-only page — fake posts and placeholder photos (CLAUDE.md).
// Five layouts for the homepage featured-news slider. Every post has a
// `priority`: 3 = glavna vijest, 2 = istaknuta, 1 = obična. The layouts
// differ in how priority turns into card size.

const SHORT = "[Naslov objave — kratki]";
const LONG = "[Naslov objave koji se proteže kroz dva ili tri retka, da se vidi prelamanje]";

const POSTS = [
  { id: 1, priority: 3, date: "15. 04. 2026.", chip: "Istaknuto", title: "[Glavna vijest — naslov u dva retka]", lead: "[Sažetak glavne vijesti, jedna do dvije rečenice.]", tag: "Foto · Glavna vijest" },
  { id: 2, priority: 1, date: "28. 10. 2025.", chip: "Najave", title: LONG, tag: "Foto · Objava" },
  { id: 3, priority: 2, date: "25. 10. 2025.", chip: "Najave", title: "[Istaknuta objava — naslov srednje duljine]", lead: "[Kratki sažetak istaknute objave.]", tag: "Foto · Istaknuta" },
  { id: 4, priority: 1, date: "25. 10. 2025.", chip: "Stipendije", title: SHORT, tag: "Foto · Objava" },
  { id: 5, priority: 1, date: "24. 10. 2025.", chip: "Natječaji", title: LONG, tag: "Foto · Objava" },
  { id: 6, priority: 2, date: "23. 10. 2025.", chip: "Najave", title: "[Istaknuta objava — gostujuće predavanje]", lead: "[Kratki sažetak istaknute objave.]", tag: "Foto · Istaknuta" },
  { id: 7, priority: 1, date: "20. 10. 2025.", chip: "Obavijesti", title: SHORT, tag: "Foto · Objava" },
];

const dayOf = (date) => date.split(".")[0];
const restOf = (date) => date.split(".").slice(1).join(".").trim();

const size = (w, h) => ({ "--w": `${w}px`, ...(h ? { "--h": `${h}px` } : {}) });

/* ---------- Card building blocks ---------- */

function Meta({ post, onDark = false }) {
  return (
    <span className={`${styles.meta} ${onDark ? styles.metaOnDark : ""}`}>
      <time className="num">{post.date}</time>
      <Chip tone={onDark ? "default" : "white"} className={styles.chip}>
        {post.chip}
      </Chip>
    </span>
  );
}

function Title({ post, className }) {
  return (
    <span className={`${styles.title} ${className ?? ""}`}>
      {post.title}
      <Icon name="arrow" size={20} className={styles.titleArrow} />
    </span>
  );
}

/** Photo fills the card; text sits on a white (or modra) panel at the bottom. */
function OverlayCard({ post, w, h, panel = "white", showLead = false }) {
  const dark = panel === "dark";
  return (
    <a href="#" className={`${styles.card} ${styles.overlay}`} style={size(w, h)}>
      <span className={styles.fill}>
        <Photo sizes={`${w}px`} tag={post.tag} tagPosition="top-left" className={styles.photo} />
      </span>
      <span className={`${styles.panel} ${dark ? styles.panelDark : ""}`}>
        <Meta post={post} onDark={dark} />
        <Title post={post} className={post.priority === 3 ? styles.titleL : styles.titleM} />
        {showLead && post.lead && <span className={styles.lead}>{post.lead}</span>}
      </span>
    </a>
  );
}

/** Photo on top at a fixed height, text below on the page background. */
function StackedCard({ post, w, photoH }) {
  return (
    <a href="#" className={`${styles.card} ${styles.stacked}`} style={size(w)}>
      <span className={styles.photoBox} style={{ height: photoH }}>
        <Photo sizes={`${w}px`} tag={post.tag} tagPosition="bottom-left" tone="light" className={styles.photo} />
      </span>
      <Meta post={post} />
      <Title post={post} className={styles.titleM} />
    </a>
  );
}

/** Small row: square thumbnail + text. Two of them stack into one column. */
function CompactCard({ post }) {
  return (
    <a href="#" className={`${styles.card} ${styles.compact}`}>
      <span className={styles.thumb}>
        <Photo sizes="128px" tone="light" className={styles.photo} />
      </span>
      <span className={styles.compactText}>
        <Meta post={post} />
        <Title post={post} className={styles.titleS} />
      </span>
    </a>
  );
}

/** Photo fills the card; title in white on a modra gradient, no panel. */
function GradientCard({ post, w, h, showLead = false, className = "" }) {
  return (
    <a href="#" className={`${styles.card} ${styles.overlay} ${styles.gradient} ${className}`} style={size(w, h)}>
      <span className={styles.fill}>
        <Photo sizes={`${w}px`} tag={post.tag} tagPosition="top-left" className={styles.photo} />
      </span>
      <span className={styles.shade} aria-hidden="true" />
      <span className={styles.gradientText}>
        <Meta post={post} onDark />
        <Title post={post} className={post.priority === 3 ? styles.titleL : styles.titleM} />
        {showLead && post.lead && <span className={styles.leadOnDark}>{post.lead}</span>}
      </span>
    </a>
  );
}

/** Landscape card: photo on the left, text on the right, white surface. */
function SideCard({ post, w, h }) {
  return (
    <a href="#" className={`${styles.card} ${styles.side}`} style={size(w, h)}>
      <span className={styles.sidePhoto}>
        <Photo sizes={`${Math.round(w / 2)}px`} tone="light" className={styles.photo} />
      </span>
      <span className={styles.sideText}>
        <Meta post={post} />
        <Title post={post} className={post.priority === 3 ? styles.titleL : post.priority === 2 ? styles.titleM : styles.titleS} />
        {post.priority === 3 && post.lead && <span className={styles.lead}>{post.lead}</span>}
      </span>
    </a>
  );
}

/** No photo: a big day numeral, chip and title — for posts without a good image. */
function TextCard({ post, w, h }) {
  return (
    <a href="#" className={`${styles.card} ${styles.textCard}`} style={size(w, h)}>
      <span className={styles.bigDate}>
        <span className={`${styles.day} num`}>{dayOf(post.date)}</span>
        <span className="num">{restOf(post.date)}</span>
      </span>
      <span className={styles.textBody}>
        <Chip className={styles.chip}>{post.chip}</Chip>
        <Title post={post} className={styles.titleM} />
      </span>
    </a>
  );
}

/** White frame around the photo, text inside the frame below it. */
function FramedCard({ post, w, h }) {
  return (
    <a href="#" className={`${styles.card} ${styles.framed}`} style={size(w, h)}>
      <span className={styles.framePhoto}>
        <Photo sizes={`${w}px`} tag={post.tag} tagPosition="top-left" tone={post.priority === 1 ? "light" : "dark"} className={styles.photo} />
      </span>
      <span className={styles.frameText}>
        <Meta post={post} />
        <Title post={post} className={post.priority === 3 ? styles.titleL : styles.titleM} />
      </span>
    </a>
  );
}

function ArchiveCard({ w, h }) {
  return (
    <a href="#" className={styles.archive} style={size(w, h)}>
      <span className={styles.archiveLabel}>Sve novosti</span>
      <span className={styles.archiveTitle}>Novosti s fakulteta</span>
      <ArrowCircle tone="white" size="l" />
    </a>
  );
}

/* ---------- Example wrapper ---------- */

function Example({ letter, name, rules, specs, align = "start", children }) {
  return (
    <section className={styles.example} aria-labelledby={`ex-${letter}`}>
      <div className={styles.exampleHead}>
        <span className={styles.letter}>{letter}</span>
        <div className={styles.exampleText}>
          <h2 id={`ex-${letter}`} className={styles.exampleName}>
            {name}
          </h2>
          <p className={styles.rules}>{rules}</p>
          <ul className={styles.specs} role="list">
            {specs.map((spec) => (
              <li key={spec}>{spec}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className={`${styles.track} ${align === "end" ? styles.alignEnd : ""}`}>{children}</div>
    </section>
  );
}

export default function SliderStyleguidePage() {
  const [main, ...rest] = POSTS;
  const level2 = POSTS.filter((p) => p.priority === 2);
  const level1 = POSTS.filter((p) => p.priority === 1);

  return (
    <>
      <Hero photo={{ tag: "Foto · TODO styleguide" }} labelledBy="sg-slider-title">
        <div className={styles.header}>
          <Eyebrow tone="dark">Styleguide</Eyebrow>
          <h1 id="sg-slider-title">Slider novosti</h1>
        </div>
      </Hero>

      <div className={styles.page}>
        <div className={styles.intro}>
          <p>
            Rasporedi kartica za istaknute novosti na naslovnici (A–J). Svaka objava ima razinu važnosti: <strong>3</strong> glavna
            vijest, <strong>2</strong> istaknuta, <strong>1</strong> obična. Raspored određuje kako razina postaje veličina kartice.
          </p>
          <p className={styles.note}>
            Prijedlog izvora razine u WordPressu: 3 = zalijepljena objava (sticky, <code>isSticky</code> u WPGraphQL-u), 2 = kategorija
            Istaknuto, 1 = sve ostalo. Svi primjeri koriste isti hover: okvir se uvlači, strelica uz naslov, oznaka u modro.
          </p>
        </div>

        <Example
          letter="A"
          name="Standard (trenutačno)"
          rules="Prva objava je velika, sve ostale jednake. Razina 2 se ne razlikuje od razine 1."
          specs={["glavna 680 × 540, slika preko cijele kartice", "ostale 420 široke, slika 4:3 (315)", "kraj: Sve novosti 320 × 540"]}
        >
          <OverlayCard post={main} w={680} h={540} />
          {rest.map((post) => (
            <StackedCard key={post.id} post={post} w={420} photoH={315} />
          ))}
          <ArchiveCard w={320} h={540} />
        </Example>

        <Example
          letter="B"
          name="Tri razine"
          rules="Veličina prati razinu: glavna je najveća, istaknute su visoke kartice s kvadratnom slikom, obične su manje. Poredak ostaje kronološki."
          specs={["razina 3: 720 × 600, sažetak vidljiv", "razina 2: 440 široke, slika 1:1 (440)", "razina 1: 320 široke, slika 4:3 (240)"]}
        >
          <OverlayCard post={main} w={720} h={600} showLead />
          {rest.map((post) =>
            post.priority === 2 ? (
              <StackedCard key={post.id} post={post} w={440} photoH={440} />
            ) : (
              <StackedCard key={post.id} post={post} w={320} photoH={240} />
            ),
          )}
          <ArchiveCard w={300} h={600} />
        </Example>

        <Example
          letter="C"
          name="Ritam visina"
          align="end"
          rules="Kartice poravnate po dnu, visine se izmjenjuju: istaknute su visoke s modrim panelom, obične niže. Daje traci ritam bez promjene širina."
          specs={["razina 3: 600 × 640, bijeli panel", "razina 2: 380 × 560, modri panel", "razina 1: 380 × 420, bijeli panel", "align-items: flex-end"]}
        >
          <OverlayCard post={main} w={600} h={640} showLead />
          {rest.map((post) =>
            post.priority === 2 ? (
              <OverlayCard key={post.id} post={post} w={380} h={560} panel="dark" />
            ) : (
              <OverlayCard key={post.id} post={post} w={380} h={420} />
            ),
          )}
          <ArchiveCard w={300} h={420} />
        </Example>

        <Example
          letter="D"
          name="Ista visina, širina po važnosti"
          rules="Sve kartice iste visine i istog stila; važnost se vidi samo po širini. Najmirniji raspored — traka izgleda kao jedan red fotografija."
          specs={["visina 560 za sve", "razina 3: 760 · razina 2: 520 · razina 1: 380", "slika preko cijele kartice, bijeli panel"]}
        >
          <OverlayCard post={main} w={760} h={560} showLead />
          {rest.map((post) => (
            <OverlayCard key={post.id} post={post} w={post.priority === 2 ? 520 : 380} h={560} />
          ))}
          <ArchiveCard w={300} h={560} />
        </Example>

        <Example
          letter="E"
          name="Urednički stupci"
          rules="Glavna vijest, zatim istaknute kao visoke kartice, a obične objave složene po dvije u stupac kao kratki redci. Stane najviše objava na najmanje širine."
          specs={["razina 3: 640 × 600", "razina 2: 380 × 600, modri panel", "razina 1: stupac 440 široko, 2 retka po 292, sličica 128 × 128"]}
        >
          <OverlayCard post={main} w={640} h={600} showLead />
          {level2.map((post, index) => (
            <span key={post.id} className={styles.group}>
              <OverlayCard post={post} w={380} h={600} panel="dark" />
              <span className={styles.column} style={size(440, 600)}>
                {level1.slice(index * 2, index * 2 + 2).map((p) => (
                  <CompactCard key={p.id} post={p} />
                ))}
              </span>
            </span>
          ))}
          <ArchiveCard w={300} h={600} />
        </Example>

        <Example
          letter="F"
          name="Gradijent preko slike"
          rules="Bez bijelog panela: naslov stoji na modrom gradijentu u donjem dijelu fotografije. Ista visina, širina po važnosti. Fotografija dobiva najviše prostora; gradijent jamči kontrast na svakoj slici."
          specs={["visina 600 za sve", "razina 3: 720 · razina 2: 480 · razina 1: 360", "gradijent modra 0 → 88 % u donjih 60 %"]}
        >
          <GradientCard post={main} w={720} h={600} showLead />
          {rest.map((post) => (
            <GradientCard key={post.id} post={post} w={post.priority === 2 ? 480 : 360} h={600} />
          ))}
          <ArchiveCard w={300} h={600} />
        </Example>

        <Example
          letter="G"
          name="Vodoravne kartice"
          align="end"
          rules="Svaka kartica je položena: slika lijevo, tekst desno na bijeloj podlozi. Važnost određuje cijelu veličinu kartice. Kraće trake, puno teksta vidljivo odjednom — dobro za objave s dugim naslovima."
          specs={["razina 3: 880 × 440, sažetak vidljiv", "razina 2: 640 × 340", "razina 1: 500 × 260", "poravnato po dnu"]}
        >
          <SideCard post={main} w={880} h={440} />
          {rest.map((post) => (
            <SideCard key={post.id} post={post} w={post.priority === 2 ? 640 : 500} h={post.priority === 2 ? 340 : 260} />
          ))}
          <ArchiveCard w={260} h={260} />
        </Example>

        <Example
          letter="H"
          name="Tipografske kartice"
          rules="Obične objave nemaju fotografiju — velik broj dana, oznaka i naslov. Fotografiju dobivaju samo glavna i istaknute vijesti. Rješava objave bez dobre slike (natječaji, obavijesti) i jasno odvaja razine."
          specs={["razina 3: 680 × 540, slika + bijeli panel", "razina 2: 420 široke, slika 4:3", "razina 1: 300 × 420, bez slike, dan 96 px"]}
        >
          <OverlayCard post={main} w={680} h={540} showLead />
          {rest.map((post) =>
            post.priority === 2 ? (
              <StackedCard key={post.id} post={post} w={420} photoH={315} />
            ) : (
              <TextCard key={post.id} post={post} w={300} h={420} />
            ),
          )}
          <ArchiveCard w={300} h={420} />
        </Example>

        <Example
          letter="I"
          name="Bijeli okvir"
          rules="Svaka kartica je bijela ploha s fotografijom uokvirenom unutra i tekstom ispod, unutar okvira. Ista visina, širina po važnosti. Mirno i uredno na sivoj pozadini stranice; ne ovisi o tome kakva je fotografija."
          specs={["visina 560 za sve", "razina 3: 720 · razina 2: 460 · razina 1: 340", "okvir 10 px, slika r20, tekst u okviru"]}
        >
          <FramedCard post={main} w={720} h={560} />
          {rest.map((post) => (
            <FramedCard key={post.id} post={post} w={post.priority === 2 ? 460 : 340} h={560} />
          ))}
          <ArchiveCard w={300} h={560} />
        </Example>

        <Example
          letter="J"
          name="Mozaik u dva reda"
          rules="Traka je mreža s dva reda: glavna vijest zauzima 2 × 2 polja, istaknute 1 × 2 (visoke), obične 1 × 1 i slažu se jedna ispod druge. Najgušći raspored — puno objava na malo širine, a hijerarhija ostaje jasna."
          specs={["polje 300 × 290, razmak 16", "razina 3: 2 stupca × 2 reda", "razina 2: 1 stupac × 2 reda", "razina 1: 1 × 1, grid-auto-flow: column dense"]}
        >
          <span className={styles.mosaic}>
            <GradientCard post={main} w={616} h={596} showLead className={styles.span22} />
            {rest.map((post) => (
              <GradientCard
                key={post.id}
                post={post}
                w={300}
                h={post.priority === 2 ? 596 : 290}
                className={post.priority === 2 ? styles.span12 : styles.span11}
              />
            ))}
          </span>
          <ArchiveCard w={300} h={596} />
        </Example>
      </div>
    </>
  );
}
