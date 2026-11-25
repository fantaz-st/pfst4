// Diacritic-insensitive text for matching Croatian names and titles.

// "Čačić Đurić" → "cacic duric". Length-preserving (each letter stays one
// character), so an index found in the folded text is valid in the original
// — SearchOverlay's highlight relies on that.
export function fold(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d");
}

// For filtering lists (compare searchKey(query) with searchKey(text)):
// people type đ as "d" or "dj", so "dj" folds to "d" too and "Duric",
// "Djuric" and "Đurić" all match. Not length-preserving.
export const searchKey = (value) => fold(value).replace(/dj/g, "d");
