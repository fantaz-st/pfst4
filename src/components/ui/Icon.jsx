// The site's one icon set (STYLEGUIDE §6): 24px grid, currentColor.
// Interface glyphs (arrows, chevrons, search, menu, close) use stroke 1.8;
// pictograms (tile icons, contact rows, page tools) use 1.5. Paths are
// taken from the design reference so the set stays visually consistent.
const UI = 1.8;
const PICTO = 1.5;

const ICONS = {
  // ---- Interface ----
  arrow: { stroke: UI, shape: <path d="M5 12h14M13 6l6 6-6 6" /> },
  chevronDown: { stroke: UI, shape: <path d="M6 9l6 6 6-6" /> },
  search: {
    stroke: UI,
    shape: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-4-4" />
      </>
    ),
  },
  menu: { stroke: UI, shape: <path d="M4 9h16M4 15h16" /> },
  close: { stroke: UI, shape: <path d="M6 6l12 12M18 6L6 18" /> },
  home: {
    stroke: UI,
    shape: <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />,
  },
  download: { stroke: UI, shape: <path d="M12 4v12M6 10l6 6 6-6M5 20h14" /> },

  // ---- Page tools ----
  print: {
    stroke: PICTO,
    shape: (
      <>
        <path d="M7 9V3h10v6M7 17H4v-7h16v7h-3" />
        <rect x="7" y="14" width="10" height="7" />
      </>
    ),
  },
  share: {
    stroke: PICTO,
    shape: (
      <>
        <circle cx="18" cy="5" r="2.5" />
        <circle cx="6" cy="12" r="2.5" />
        <circle cx="18" cy="19" r="2.5" />
        <path d="M8.2 10.9l7.6-4.4M8.2 13.1l7.6 4.4" />
      </>
    ),
  },
  copy: {
    stroke: PICTO,
    shape: (
      <>
        <rect x="8" y="8" width="12" height="12" rx="2" />
        <path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
      </>
    ),
  },

  // ---- Contact ----
  phone: {
    stroke: PICTO,
    shape: (
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
    ),
  },
  mail: {
    stroke: PICTO,
    shape: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </>
    ),
  },
  clock: {
    stroke: PICTO,
    shape: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  },
  mapPin: {
    stroke: PICTO,
    shape: (
      <>
        <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
        <circle cx="12" cy="9.5" r="2.5" />
      </>
    ),
  },

  // ---- Pictograms (tiles, hub cards) ----
  cap: {
    stroke: PICTO,
    shape: (
      <>
        <path d="M2 9l10-5 10 5-10 5z" />
        <path d="M6 11v5c3 2.5 9 2.5 12 0v-5" />
      </>
    ),
  },
  exam: {
    stroke: PICTO,
    shape: (
      <>
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <path d="M9 3h6v3H9zM9 12h6M9 16h4" />
      </>
    ),
  },
  chat: {
    stroke: PICTO,
    shape: (
      <>
        <path d="M4 5h16v11H9l-5 4z" />
        <path d="M8 9.5h8M8 12.5h5" />
      </>
    ),
  },
  users: {
    stroke: PICTO,
    shape: (
      <>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5" />
        <path d="M16 4.8a3.3 3.3 0 0 1 0 6.4M18 14.8c1.9.7 3.1 2.4 3.5 5.2" />
      </>
    ),
  },
  doc: {
    stroke: PICTO,
    shape: (
      <>
        <path d="M6 3h9l4 4v14H6z" />
        <path d="M14 3v5h5M9 13h7M9 17h5" />
      </>
    ),
  },
  building: {
    stroke: PICTO,
    shape: (
      <>
        <path d="M4 21V6l8-3 8 3v15" />
        <path d="M9 21v-4h6v4M8 9h2M14 9h2M8 13h2M14 13h2M2 21h20" />
      </>
    ),
  },
  warning: {
    stroke: PICTO,
    shape: (
      <>
        <path d="M12 4l9 16H3z" />
        <path d="M12 10v4M12 17v.5" />
      </>
    ),
  },
  shield: {
    stroke: PICTO,
    shape: (
      <>
        <path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
  accessibility: {
    stroke: PICTO,
    shape: (
      <>
        <circle cx="12" cy="4.5" r="1.8" />
        <path d="M5 9l7 1.2L19 9M12 10.2v4.8l-3 6M12 15l3 6" />
      </>
    ),
  },
  info: {
    stroke: PICTO,
    shape: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v6M12 7.5v.5" />
      </>
    ),
  },
};

export const ICON_NAMES = Object.keys(ICONS);

/**
 * @param {{ name: keyof typeof ICONS, size?: number, label?: string, className?: string }} props
 * Decorative by default (aria-hidden). Pass `label` only when the icon is
 * the sole content of its control and nothing else names it.
 */
export default function Icon({ name, size = 24, label, className }) {
  const icon = ICONS[name];
  if (!icon) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={icon.stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      focusable="false"
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      {icon.shape}
    </svg>
  );
}
