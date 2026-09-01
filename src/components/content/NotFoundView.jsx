import Link from "next/link";
import { getChromeCopy } from "@/lib/chromeCopy";
import { localizedHomeUri } from "@/lib/language";
import styles from "./NotFoundView.module.css";

export default function NotFoundView({ language = "hr" }) {
  const copy = getChromeCopy(language);

  return (
    <div className={styles.page}>
      <h1>{copy.notFoundTitle}</h1>
      <p>{copy.notFoundDescription}</p>
      <Link href={localizedHomeUri(language)}>{copy.notFoundHomeLink}</Link>
    </div>
  );
}
