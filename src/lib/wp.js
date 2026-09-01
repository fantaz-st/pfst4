const ENDPOINT = process.env.WP_GRAPHQL_ENDPOINT;

export async function wpFetch(query, variables = {}, { tags, preview = false } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (preview && process.env.WP_PREVIEW_USER && process.env.WP_PREVIEW_APP_PASSWORD) {
    const credentials = Buffer.from(
      `${process.env.WP_PREVIEW_USER}:${process.env.WP_PREVIEW_APP_PASSWORD}`,
    ).toString("base64");
    headers.Authorization = `Basic ${credentials}`;
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
      // Draft content must never be served from Next's Data Cache.
      ...(preview ? { cache: "no-store" } : { next: { tags } }),
    });

    const { data, errors } = await res.json();

    if (errors) {
      console.error("wpFetch GraphQL error", errors);
      return null;
    }

    return data;
  } catch (error) {
    console.error("wpFetch network error", error);
    return null;
  }
}
