import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const secret = searchParams.get("secret");
  const id = searchParams.get("id");
  const type = searchParams.get("type");

  const expectedSecret = process.env.WP_PREVIEW_SECRET;
  if (!expectedSecret || secret !== expectedSecret) {
    return new NextResponse("Invalid preview secret", { status: 401 });
  }

  if (!id || (type !== "page" && type !== "post")) {
    return new NextResponse("Missing or invalid id/type", { status: 400 });
  }

  (await draftMode()).enable();

  const previewUrl = new URL("/preview", origin);
  previewUrl.searchParams.set("id", id);
  previewUrl.searchParams.set("type", type);

  return NextResponse.redirect(previewUrl);
}
