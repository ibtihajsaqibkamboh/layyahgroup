// Line icons drawn for this site (24×24 grid, 1.5 stroke, currentColor).
const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: 'false',
}

export const IconArrow = (p) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)
export const IconArrowLeft = (p) => (
  <svg {...base} {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
)
export const IconPhone = (p) => (
  <svg {...base} {...p}>
    <path d="M5 4h3.2l1.6 4-2 1.3a10.5 10.5 0 0 0 6.9 6.9l1.3-2 4 1.6V19a1.6 1.6 0 0 1-1.7 1.6A16 16 0 0 1 3.4 5.7 1.6 1.6 0 0 1 5 4Z" />
  </svg>
)
export const IconWhatsApp = (p) => (
  <svg {...base} {...p}>
    <path d="M4.2 19.8l1.1-3.9A8.4 8.4 0 1 1 8.4 19z" />
    <path d="M9 8.6c.2-.5.5-.6.8-.6h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.6l-.5.6c-.1.2-.1.4 0 .6.6 1 1.4 1.8 2.4 2.4.2.1.4.1.6 0l.6-.5c.2-.1.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.6-.6.8-.6.3-1.6.5-3-.2a9.4 9.4 0 0 1-4.3-4.3c-.7-1.4-.5-2.4-.2-3Z" />
  </svg>
)
export const IconMail = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="1.5" />
    <path d="m4 7 8 6 8-6" />
  </svg>
)
export const IconGlobe = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
  </svg>
)
export const IconPin = (p) => (
  <svg {...base} {...p}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
)
export const IconClock = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
)
export const IconClose = (p) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)
export const IconPlus = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

/* Service icons */
export const IconVilla = (p) => (
  <svg {...base} {...p}>
    <path d="M2.5 20.5h19M4 20.5v-7h8v7M12 20.5v-11h8v11M3 9.5h11M7 16.5h2M15 13h2M15 16.5h2" />
  </svg>
)
export const IconPlaza = (p) => (
  <svg {...base} {...p}>
    <path d="M2.5 20.5h19M3.5 20.5V9h17v11.5M3 6.5h18M6 20.5v-4a2 2 0 0 1 4 0v4M14 20.5v-4a2 2 0 0 1 4 0v4M6 12h12" />
  </svg>
)
export const IconTower = (p) => (
  <svg {...base} {...p}>
    <path d="M2.5 20.5h19M7 20.5V5.5L13 3v17.5M13 8h4.5v12.5M9.5 8h1M9.5 11.5h1M9.5 15h1M15 11.5h1M15 15h1" />
  </svg>
)
export const IconCrane = (p) => (
  <svg {...base} {...p}>
    <path d="M2.5 20.5h19M6 20.5V4.5M6 4.5 3 7.5M6 4.5h15M6 8l4-3.5M17 4.5v5M15.5 9.5h3v2h-3zM4 20.5l2-4 2 4" />
  </svg>
)
export const IconCompass = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="5" r="1.8" />
    <path d="M11 6.6 5 20.5M13 6.6l6 13.9M7.6 14.5h8.8" />
  </svg>
)
export const IconClipboard = (p) => (
  <svg {...base} {...p}>
    <rect x="5" y="4.5" width="14" height="16" rx="1.5" />
    <path d="M9 4.5V3h6v1.5M8.5 10l1.5 1.5 3-3M8.5 16h7" />
  </svg>
)
