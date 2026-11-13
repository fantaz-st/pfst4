// WordPress uris carry a trailing slash, Next pathnames don't.
function withSlash(path) {
  return path.endsWith("/") ? path : `${path}/`;
}

// The top-level item the current page lives under (highlighted as a white
// pill on inner pages). The homepage itself highlights nothing.
export function isCurrentSection(item, pathname) {
  if (!item?.uri || !pathname) return false;
  const uri = withSlash(item.uri);
  if (uri === "/" || uri === "/en/") return false;
  return withSlash(pathname).startsWith(uri);
}

export function isCurrentPage(item, pathname) {
  return Boolean(item?.uri && pathname) && withSlash(item.uri) === withSlash(pathname);
}

// Mega-menu columns: groups are dealt round-robin into 4 columns, which is
// how design/mega-menu.html orders them (col 1 = groups 1 and 5, …).
export function toColumns(groups, count = 4) {
  const columns = Array.from({ length: Math.min(count, groups.length) }, () => []);
  groups.forEach((group, index) => columns[index % columns.length].push(group));
  return columns;
}
