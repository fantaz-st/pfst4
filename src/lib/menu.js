import { wpFetch } from "./wp";
import { MENU_ITEMS } from "./queries";
import { toLanguageCodeEnum } from "./language";

export async function getMainMenu(language) {
  const items = [];
  let after = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const data = await wpFetch(
      MENU_ITEMS,
      { after, language: toLanguageCodeEnum(language) },
      { tags: ["wp"] },
    );
    const menuItems = data?.menuItems;
    if (!menuItems) break;

    items.push(...menuItems.nodes);
    hasNextPage = menuItems.pageInfo.hasNextPage;
    after = menuItems.pageInfo.endCursor;
  }

  return buildTree(items);
}

function buildTree(items) {
  const byId = new Map(
    items.map((item) => [
      item.databaseId,
      { databaseId: item.databaseId, label: item.label, uri: item.path, children: [] },
    ]),
  );

  const roots = [];
  for (const raw of items) {
    const node = byId.get(raw.databaseId);
    const parent = byId.get(raw.parentDatabaseId);
    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}
