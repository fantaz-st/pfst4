import { wpFetch } from "@/lib/wp/wp";
import { NEWS_POSTS, NODE_BY_URI } from "@/lib/wp/queries";
import { toLanguageCodeEnum } from "@/lib/i18n/language";
import { parseConsultations } from "@/features/consultations/consultations";

// Live details for the mobile quick-links list (QuickLinks → QuickList).
// Both come from WordPress and refresh with it; either can be null.
const CONSULTATIONS_URI = "/nastava/studiranje/konzultacije/";
const TENDERS_CATEGORY = "natjecaji";

function findConsultationsTable(blocks = []) {
  for (const block of blocks) {
    const classes = String(block.attributes?.className ?? "").split(/\s+/);
    if (block.name === "core/table" && classes.includes("konzultacije")) return block;
    const nested = findConsultationsTable(block.innerBlocks ?? []);
    if (nested) return nested;
  }
  return null;
}

/**
 * @returns {Promise<{ consultationsByDay: number[] | null, latestTender: string | null }>}
 *   consultationsByDay: slots per weekday, Monday first (the client picks today)
 */
export async function getQuickStats(language) {
  if (language !== "hr") return { consultationsByDay: null, latestTender: null };

  const [page, tenders] = await Promise.all([
    wpFetch(NODE_BY_URI, { uri: CONSULTATIONS_URI }, { tags: ["wp"] }),
    wpFetch(
      NEWS_POSTS,
      { first: 1, after: null, where: { language: toLanguageCodeEnum(language), categoryName: TENDERS_CATEGORY } },
      { tags: ["wp"] },
    ),
  ]);

  const table = findConsultationsTable(page?.nodeByUri?.blocks ?? []);
  let consultationsByDay = null;
  if (table) {
    consultationsByDay = [0, 0, 0, 0, 0];
    parseConsultations(table.attributes).forEach((entry) =>
      entry.slots.forEach((slot) => {
        consultationsByDay[slot.day] += 1;
      }),
    );
  }

  return { consultationsByDay, latestTender: tenders?.posts?.nodes?.[0]?.date ?? null };
}
