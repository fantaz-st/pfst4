import { revalidateTag } from "next/cache";
import { SCEDULY_TAG, getTimetableData } from "@/lib/sceduly";

/**
 * The once-a-day Sceduly sync, called by the Vercel cron in vercel.json.
 * Marks the timetable stale and reads it once, which starts the single
 * refresh; visitors keep getting the previous day's data until it lands
 * (and keep it if Sceduly fails, since a failed load is never cached).
 *
 * Vercel sends `Authorization: Bearer $CRON_SECRET`; nobody else may
 * trigger a sync, since Sceduly allows only one per day.
 */
export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ synced: false, message: "Unauthorized" }, { status: 401 });
  }

  revalidateTag(SCEDULY_TAG, "max");
  await getTimetableData();

  return Response.json({ synced: true, now: Date.now() });
}
