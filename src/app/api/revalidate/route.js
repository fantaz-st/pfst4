import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ revalidated: false, message: "Invalid JSON" }, { status: 400 });
  }

  const expectedSecret = process.env.WP_REVALIDATE_SECRET;
  const { secret } = body ?? {};

  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ revalidated: false, message: "Invalid secret" }, { status: 401 });
  }

  // Every WordPress fetch carries the "wp" tag, so this also covers the page
  // at `uri`. expire: 0 makes the next request wait for fresh content
  // instead of being served the stale copy — an editor who just hit
  // "Update" should see their change on first reload. (The single-argument
  // form behaved the same way but is deprecated in Next 16.)
  revalidateTag("wp", { expire: 0 });
  // Belt and braces: also drop every rendered page. Every route carries the
  // root "_N_T_/layout" soft tag, so this covers hr and /en alike, even a page
  // whose cache entry somehow didn't pick up the "wp" fetch tag.
  revalidatePath("/", "layout");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
