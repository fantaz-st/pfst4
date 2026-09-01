import { notFound } from "next/navigation";
import { wpFetch } from "@/lib/wp";
import { CILJ_TERM, NEWS_POSTS } from "@/lib/queries";
import { buildNewsWhere } from "@/lib/news";
import { CILJEVI_META, getCiljMeta } from "@/lib/ciljevi";
import ObavijestiList from "@/components/news/ObavijestiList";
import styles from "./page.module.css";

export const dynamicParams = true;

const LIST_FIRST = 20;
const EMPTY_PAGE = { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } };

export function generateStaticParams() {
  return Object.keys(CILJEVI_META).map((slug) => ({ slug }));
}

async function getTerm(slug) {
  const data = await wpFetch(CILJ_TERM, { slug }, { tags: ["wp"] });
  return data?.cilj ?? null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const term = await getTerm(slug);
  if (!term) return {};

  return {
    title: `${term.name} — Novosti — Pomorski fakultet u Splitu`,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/novosti/ciljevi/${slug}/`,
    },
  };
}

export default async function CiljArchivePage({ params }) {
  const { slug } = await params;
  const term = await getTerm(slug);
  if (!term) notFound();

  const data = await wpFetch(
    NEWS_POSTS,
    { first: LIST_FIRST, after: null, where: buildNewsWhere({ ciljeviSlugs: [slug], language: "hr" }) },
    { tags: ["wp"] },
  );
  const list = data?.posts ?? EMPTY_PAGE;
  const meta = getCiljMeta(slug);

  return (
    <div className={styles.page}>
      {meta?.number && (
        <p className={styles.eyebrow}>Cilj održivog razvoja {meta.number}</p>
      )}
      <h1 className={styles.heading} style={{ "--cilj-color": meta?.color }}>
        {term.name}
      </h1>

      <ObavijestiList
        initialPosts={list.nodes}
        initialPageInfo={list.pageInfo}
        ciljeviSlugs={[slug]}
      />
    </div>
  );
}
