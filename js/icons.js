/* js/icons.js — SVG icons. Load first. */
const ICONS = {
  overview: '<path d="M4 4h7v7H4V4zm9 0h7v4h-7V4zM4 13h7v7H4v-7zm9 6h7v4h-7v-4zm0-6h7v4h-7v-4z"/>',
  agents: '<circle cx="9" cy="8" r="3"/><path d="M4 19c.8-3 2.8-5 5-5s4.2 2 5 5"/><circle cx="17" cy="9" r="2.5"/><path d="M16.2 14.2c2 .4 3.5 2 4.3 4.3"/>',
  bots: '<rect x="5" y="7" width="14" height="12" rx="3"/><circle cx="9" cy="13" r="1.2"/><circle cx="15" cy="13" r="1.2"/><path d="M12 7V4M9 4h6"/>',
  calls: '<path d="M6.5 4.5c.6 1.8 1.6 3.5 3 5s3.2 2.4 5 3l1.6-1.6a1.5 1.5 0 0 1 1.6-.3 12 12 0 0 0 3.6.6 1.5 1.5 0 0 1 1.5 1.5V19a1.5 1.5 0 0 1-1.5 1.5A16.5 16.5 0 0 1 3.5 4.5 1.5 1.5 0 0 1 5 3h3.3A1.5 1.5 0 0 1 9.8 4.5c0 1.2.2 2.4.6 3.6a1.5 1.5 0 0 1-.3 1.6L8 11"/>',
  chats: '<path d="M5 6h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 3v-3H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/>',
  campaigns: '<path d="M4 12h4l3-7 3 14 3-7h3"/>',
  integrations: '<path d="M8 8h3v3H8V8zm5 5h3v3h-3v-5zM7 14.5 9.5 17M14.5 7 17 9.5"/><rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/>',
  analytics: '<path d="M5 19V10M10 19V5M15 19v-7M20 19V8"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M5 12H3M21 12h-2M6.2 6.2l1.4 1.4M16.4 16.4l1.4 1.4M17.8 6.2l-1.4 1.4M7.6 16.4 6.2 17.8"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="m20 20-4-4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  chevron: '<path d="m8 10 4 4 4-4"/>',
  bell: '<path d="M6 16h12l-1-2V10a5 5 0 0 0-10 0v4l-1 2zm4 2a2 2 0 0 0 4 0"/>',
  play: '<path d="m8 6 10 6-10 6V6z"/>',
  pause: '<path d="M7 6h3v12H7V6zm7 0h3v12h-3V6z"/>',
  copy: '<rect x="8" y="8" width="10" height="12" rx="2"/><path d="M6 16H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  file: '<path d="M7 4h7l4 4v12H7V4z"/><path d="M14 4v4h4"/>',
  logout: '<path d="M10 6H6v12h4M13 16l4-4-4-4M9 12h8"/>',
  team: '<circle cx="9" cy="8" r="3"/><circle cx="16" cy="9" r="2.2"/><path d="M3.8 19c.7-3 2.8-5 5.2-5s4.5 2 5.2 5M16 14c2 0 3.5 1.4 4.2 3.5"/>',
  wallet: '<rect x="3" y="7" width="18" height="12" rx="2"/><path d="M3 10h18"/><circle cx="16" cy="14" r="1.2"/>',
  back: '<path d="M14 6 8 12l6 6"/>',
  close: '<path d="M7 7l10 10M17 7 7 17"/>',
  check: '<path d="M5 12.5 9.5 17 19 7.5"/>',
  alert: '<path d="M12 4 3 19h18L12 4zm0 6v4m0 3h.01"/>',
  folder: '<path d="M3 7h6l2 2h10v10H3V7z"/>',
  pin: '<path d="M15 4.5 19 8.5 14 13.5 13 18l-7-7 4.5-1L15 4.5zM7 17l-3 3"/>',
  nlu: '<circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="7" r="2.5"/><circle cx="12" cy="17" r="2.5"/><path d="M9.2 8.6 10.8 15M14.8 8.6 13.2 15M9.5 7h5"/>',
  knowledge: '<path d="M5 5h9l5 5v11H5V5z"/><path d="M14 5v5h5"/><path d="M8 13h8M8 17h5"/>',
  numbers: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M10 7h4M10 11h4M10 15h2"/>',
  market: '<path d="M4 9h16l-1.5 10H5.5L4 9z"/><path d="M8 9V7a4 4 0 0 1 8 0v2"/>',
  company: '<path d="M4 20V8l6-3 6 3v12M10 20v-6h4v6M8 11h.01M8 14h.01M16 11h.01M16 14h.01"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.2 2.4c-.8.3-1.2.8-1.2 1.6V14"/><path d="M12 17h.01"/>',
  spark: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2"/><circle cx="12" cy="12" r="3"/>',
}

function icon(name, size) {
  const d = ICONS[name] || ICONS.overview
  const cls = size === 16 ? 'icon icon-16' : 'icon'
  return `<span class="${cls}" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${d}</svg></span>`
}
