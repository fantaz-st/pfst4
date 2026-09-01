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
  const { secret, uri } = body ?? {};

  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ revalidated: false, message: "Invalid secret" }, { status: 401 });
  }

  revalidateTag("wp");
  if (uri) revalidatePath(uri);

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
