import { cache } from "react";
import { wpFetch } from "./wp";
import { SECTION_TREE } from "./queries";

// The section a page belongs to is its top-level ancestor (e.g. /fakultet/
// for /fakultet/opcenito/ustroj/uprava/); a top-level page is its own root.
// WPGraphQL lists ancestors nearest-first, so the root is the last one.
export function getSectionRootUri(page) {
  const ancestors = page.ancestors?.nodes ?? [];
  return ancestors.length > 0 ? ancestors[ancestors.length - 1].uri : page.uri;
}

function toTree(node) {
  return {
    id: node.id,
    title: node.title,
    uri: node.uri,
    children: (node.children?.nodes ?? []).filter((child) => child?.uri).map(toTree),
  };
}

// Memoized per request (wpFetch POSTs, which Next doesn't dedupe).
export const getSectionTree = cache(async (rootUri) => {
  const data = await wpFetch(SECTION_TREE, { uri: rootUri }, { tags: ["wp"] });
  const root = data?.nodeByUri;
  return root?.uri ? toTree(root) : null;
});
