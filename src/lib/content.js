import { wpFetch } from "./wp";
import { ALL_CONTENT_URIS } from "./queries";

export async function getAllContentNodes() {
  const nodes = [];
  let after = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const data = await wpFetch(ALL_CONTENT_URIS, { first: 100, after }, { tags: ["wp"] });
    if (!data) break;

    nodes.push(...data.contentNodes.nodes);
    hasNextPage = data.contentNodes.pageInfo.hasNextPage;
    after = data.contentNodes.pageInfo.endCursor;
  }

  return nodes;
}
