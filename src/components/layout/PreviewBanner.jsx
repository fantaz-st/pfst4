import Link from "next/link";
import styles from "./PreviewBanner.module.css";

export default function PreviewBanner() {
  return (
    <div className={styles.banner}>
      <p>Pregled nadolazećeg sadržaja koji još nije objavljen.</p>
      <Link href="/api/preview/disable">Izađi iz pregleda</Link>
    </div>
  );
}
