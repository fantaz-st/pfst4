import styles from "./styleguide.module.css";
import Columns from "@/components/blocks/Columns";
import Gallery from "@/components/blocks/Gallery";
import Group from "@/components/blocks/Group";

export const metadata = {
  title: "Styleguide",
};

const columnsExample = {
  innerBlocks: [
    {
      name: "core/column",
      attributes: { width: "25%" },
      innerBlocks: [
        { name: "core/heading", attributes: { level: 4, content: "Brzi kontakt" } },
        { name: "core/paragraph", attributes: { content: "Ured za studente" } },
      ],
    },
    {
      name: "core/column",
      innerBlocks: [
        { name: "core/heading", attributes: { level: 4, content: "Radno vrijeme" } },
        {
          name: "core/paragraph",
          attributes: { content: "Ponedjeljak – petak, 9:00 – 14:00." },
        },
      ],
    },
    {
      name: "core/column",
      innerBlocks: [
        { name: "core/heading", attributes: { level: 4, content: "Lokacija" } },
        {
          name: "core/paragraph",
          attributes: { content: "Ruđera Boškovića 37, Split" },
        },
      ],
    },
  ],
};

const galleryExample = {
  innerBlocks: [
    {
      name: "core/image",
      attributes: { url: "/globe.svg", width: 400, height: 400, alt: "Shematski prikaz globusa" },
    },
    {
      name: "core/image",
      attributes: {
        url: "/window.svg",
        width: 400,
        height: 300,
        alt: "Ilustracija prozora",
        caption: "Pogled s fakulteta",
      },
    },
    {
      name: "core/image",
      attributes: { url: "/file.svg", width: 300, height: 400, alt: "Ilustracija dokumenta" },
    },
  ],
};

const groupExample = {
  innerBlocks: [
    {
      name: "core/paragraph",
      attributes: {
        content:
          "Grupa je čisti omotač bez vlastitog stila — ovaj odlomak samo dokazuje da se sadržaj unutar nje renderira normalno.",
      },
    },
  ],
};

export default function StyleguidePage() {
  return (
    <main className={styles.page}>
      <section className={styles.scale}>
        <h1>Naslov razine 1</h1>
        <h2>Naslov razine 2</h2>
        <h3>Naslov razine 3</h3>
        <h4>Naslov razine 4</h4>
        <h5>Naslov razine 5</h5>
        <h6>Naslov razine 6</h6>
      </section>

      <article className="prose">
        <h2>Odlomak</h2>
        <p>
          Ovo je primjer odlomka teksta koji prikazuje osnovni tipografski
          stil za sadržaj stranice, uključujući hrvatske dijakritičke znakove:
          č, ć, ž, š, đ te njihove verzije velikih slova Č, Ć, Ž, Š, Đ.
        </p>
        <p>
          Više informacija dostupno je na stranici{" "}
          <a href="https://www.pfst.unist.hr">Pomorskog fakulteta u Splitu</a>
          , gdje se redovito objavljuju obavijesti i natječaji.
        </p>

        <h3 className={styles.section}>Popisi</h3>
        <ul>
          <li>Prva stavka nesortiranog popisa</li>
          <li>Druga stavka</li>
          <li>
            Treća stavka s nešto dužim tekstom radi provjere prijeloma retka
            unutar popisa
          </li>
        </ul>
        <ol>
          <li>Prvi korak postupka</li>
          <li>Drugi korak postupka</li>
          <li>Treći korak postupka</li>
        </ol>

        <h3 className={styles.section}>Tablica sa zaglavljem</h3>
        <table>
          <thead>
            <tr>
              <th>Naziv</th>
              <th>Rok</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Natječaj za upis</td>
              <td>1. rujna 2026.</td>
              <td>Otvoreno</td>
            </tr>
            <tr>
              <td>Prijave Erasmus+</td>
              <td>15. rujna 2026.</td>
              <td>Zatvoreno</td>
            </tr>
          </tbody>
        </table>

        <h3 className={styles.section}>Tablica bez zaglavlja</h3>
        <table>
          <tbody>
            <tr>
              <td>Ured za studente</td>
              <td>ured@pfst.hr</td>
            </tr>
            <tr>
              <td>Referada</td>
              <td>referada@pfst.hr</td>
            </tr>
          </tbody>
        </table>

        <h3 className={styles.section}>Slika s natpisom</h3>
        <figure>
          <img
            src="/globe.svg"
            alt="Shematski prikaz globusa"
            width={160}
            height={160}
          />
          <figcaption>
            Ilustrativna slika — zamjenska grafika za stilski vodič.
          </figcaption>
        </figure>

        <h3 className={styles.section}>Galerija</h3>
        <Gallery block={galleryExample} />

        <h3 className={styles.section}>Stupci</h3>
        <Columns block={columnsExample} />

        <h3 className={styles.section}>Grupa</h3>
        <Group block={groupExample} />

        <h3 className={styles.section}>Citat</h3>
        <blockquote>
          <p>
            Pomorski fakultet u Splitu obrazuje stručnjake u području
            pomorstva od 1852. godine.
          </p>
        </blockquote>

        <h3 className={styles.section}>Proširivi sadržaj</h3>
        <details>
          <summary>Često postavljena pitanja o upisu</summary>
          <p>
            Rok za prijavu na natječaj objavljuje se na mrežnim stranicama
            fakulteta najmanje 30 dana prije početka akademske godine.
          </p>
        </details>

        <h3 className={styles.section}>Preuzimanje datoteke</h3>
        <p>
          <a className="file-download" href="/files/natjecaj-2026.pdf">
            Natječaj za upis 2026./2027.
            <span className="file-meta">PDF, 482 KB</span>
          </a>
        </p>
      </article>
    </main>
  );
}
