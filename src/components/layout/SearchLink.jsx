"use client";

import { openSiteSearch } from "./header/openSiteSearch";

// A link to the search page that opens the search layer instead. Without
// JS, or with a modifier key (new tab), it stays a normal link.
export default function SearchLink({ href, children, ...rest }) {
  function onClick(event) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    openSiteSearch();
  }

  return (
    <a href={href} onClick={onClick} aria-haspopup="dialog" {...rest}>
      {children}
    </a>
  );
}
