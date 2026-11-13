import Button from "@/components/ui/Button";
import { getChromeCopy } from "@/lib/chromeCopy";
import { localizedHomeUri } from "@/lib/language";
import PageHero from "./PageHero";
import styles from "./NotFoundView.module.css";

// 404: the page hero carries the message; one button back home.
export default function NotFoundView({ language = "hr" }) {
  const copy = getChromeCopy(language);

  return (
    <>
      <PageHero
        language={language}
        title={copy.notFoundTitle}
        eyebrow={copy.notFoundEyebrow}
        lead={copy.notFoundDescription}
        showCrumbs={false}
      />
      <div className={styles.wrap}>
        <Button href={localizedHomeUri(language)}>{copy.notFoundHomeLink}</Button>
      </div>
    </>
  );
}
