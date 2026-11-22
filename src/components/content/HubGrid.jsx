import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { getChromeCopy } from "@/lib/chromeCopy";
import { getSiteLinks } from "@/lib/siteLinks";
import PageCards from "./PageCards";
import styles from "./HubGrid.module.css";

/**
 * Section overview (design/reference/opcenito.html): "U ovoj cjelini" — a
 * card per child page (PageCards), then the dark help card with the
 * signal-flag band.
 */
export default function HubGrid({ pages, language = "hr" }) {
  const copy = getChromeCopy(language);
  const { help } = getSiteLinks(language);

  return (
    <section aria-labelledby="hub-title">
      <div className={styles.head}>
        <h2 id="hub-title" className={styles.title}>
          {copy.inThisSection}
        </h2>
        <span className={styles.count}>{copy.pageCount(pages.length)}</span>
      </div>
      <PageCards pages={pages}>
        <div className={styles.help}>
          <div className={styles.flags} aria-hidden="true" />
          <div className={styles.helpText}>
            <span className={styles.helpEyebrow}>{copy.helpEyebrow}</span>
            <span className={styles.helpTitle}>{copy.helpTitle}</span>
          </div>
          <div className={styles.helpActions}>
            {help.contacts.map((item) => (
              <span key={item.label} className={styles.contact}>
                <Icon name={item.icon} />
                {item.label}
              </span>
            ))}
            <Button href={help.href} variant="white" size="m">
              {copy.helpCta}
            </Button>
          </div>
        </div>
      </PageCards>
    </section>
  );
}
