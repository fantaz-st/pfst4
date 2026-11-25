import Link from "next/link";
import Brand from "@/components/layout/Brand";
import Button from "@/components/ui/Button";
import SplitReveal from "@/components/motion/SplitReveal";
import { getChromeCopy } from "@/lib/i18n/chromeCopy";
import { ENROLL_URL, getSiteLinks } from "@/lib/i18n/siteLinks";
import CookieSettingsButton from "@/features/consent/CookieSettingsButton";
import styles from "./SiteFooter.module.css";

function LinkList({ links }) {
  return links.map((link) =>
    link.href ? (
      <Link key={link.label} href={link.href} className={styles.link}>
        {link.label}
      </Link>
    ) : (
      <span key={link.label}>{link.label}</span>
    ),
  );
}

export default function SiteFooter({ language = "hr" }) {
  const copy = getChromeCopy(language);
  const { footer } = getSiteLinks(language);
  const columns = [
    { label: copy.footerAddress, content: footer.address.map((line) => <span key={line}>{line}</span>) },
    { label: copy.footerContact, content: <LinkList links={footer.contact} /> },
    { label: copy.footerFaculty, content: <LinkList links={footer.faculty} /> },
    { label: copy.footerStudents, content: <LinkList links={footer.students} /> },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.box}>
        <div className={styles.wrap}>
          <div className={styles.top}>
            <Brand language={language} size="l" />
            <Button href={ENROLL_URL} variant="white">
              {copy.enroll}
            </Button>
          </div>
          <div className={styles.grid}>
            {columns.map((column) => (
              <div key={column.label} className={styles.column}>
                <h2 className={styles.label}>{column.label}</h2>
                {column.content}
              </div>
            ))}
          </div>
        </div>
        <SplitReveal mode="chars" className={styles.wordmark} aria-hidden="true">
          POMORSKI
        </SplitReveal>
        <div className={styles.bottom}>
          <span className="num">{copy.copyright(new Date().getFullYear())}</span>
          <span className={styles.bottomEnd}>
            <CookieSettingsButton className={styles.bottomLink}>{copy.cookieSettings}</CookieSettingsButton>
            <span>{copy.universityName}</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
