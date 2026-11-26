// Asks WordPress for a page with the exact query the site uses, bypassing
// Next and Vercel entirely. Temporary debugging aid — delete when done.
//
//   node scripts/check-wp.mjs /nastava/ "my test string"
import { NODE_BY_URI } from "../src/lib/wp/queries.js";

const [uri = "/nastava/", needle = ""] = process.argv.slice(2);
const endpoint = process.env.WP_GRAPHQL_ENDPOINT || "https://backend.pfst.hr/graphql";

const res = await fetch(endpoint, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query: NODE_BY_URI, variables: { uri } }),
});
const json = await res.json();

console.log("endpoint:", endpoint, "→ HTTP", res.status);
for (const [key, value] of res.headers) {
  if (/cache|graphql|age|expires/i.test(key)) console.log(`  ${key}: ${value}`);
}
console.log("modified:", json.data?.nodeByUri?.modified ?? "(none)");
if (json.errors) console.log("errors:", JSON.stringify(json.errors, null, 2));
if (needle) console.log(`"${needle}" found:`, JSON.stringify(json).includes(needle));
