// Keeps Tab / Shift+Tab inside a modal dialog: call from the dialog's
// keydown handler. Only visible, enabled controls count.
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function trapTab(event, container) {
  if (event.key !== "Tab" || !container) return;
  const focusable = Array.from(container.querySelectorAll(FOCUSABLE)).filter((element) => element.tabIndex >= 0 && element.offsetParent !== null);
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;
  if (event.shiftKey && (active === first || !container.contains(active))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (active === last || !container.contains(active))) {
    event.preventDefault();
    first.focus();
  }
}
