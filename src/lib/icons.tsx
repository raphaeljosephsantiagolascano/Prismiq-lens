import React from 'react';
import { SvgXml } from 'react-native-svg';
import type { LensId } from '../config/types';

// Faithful 1:1 port of the web app's inline SVGs. We keep the exact markup
// and render it with react-native-svg's SvgXml, overriding currentColor.
const stroke = (inner: string, sw = 2) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
const fill = (inner: string) => `<svg viewBox="0 0 24 24" fill="currentColor">${inner}</svg>`;

export const LENS_ICON: Record<LensId, string> = {
  plate: stroke('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.2"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>', 1.7),
  fresh: stroke('<path d="M11 20A7 7 0 0 1 4 13c0-4 3-8 7-8s7 4 7 8a7 7 0 0 1-7 7Z"/><path d="M11 5c0-2 1.5-3 3.5-3"/>', 1.7),
  plant: stroke('<path d="M12 22V11"/><path d="M12 11C12 7 9 4 5 4c0 4 3 7 7 7Z"/><path d="M12 13c0-3.5 3-6 6.5-6 0 3.5-3 6-6.5 6Z"/>', 1.7),
  rock: stroke('<path d="M6 3h12l3 6-9 12L3 9Z"/><path d="M3 9h18M9 3 6 9l6 12M15 3l3 6-6 12"/>', 1.7),
};

const TAB_PATHS: Record<string, string> = {
  today: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/>',
  calendar: '<rect x="3" y="4.5" width="18" height="16" rx="3"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>',
  history: '<path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l3 2"/>',
  goal: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/>',
  discover: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.2 5.3-5.3 2.2 2.2-5.3 5.3-2.2Z"/>',
  saved: '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
  guide: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22.5z"/><path d="M4 4.5v15"/>',
  care: '<path d="M12 3a6 6 0 0 0-6 6c0 4 6 12 6 12s6-8 6-12a6 6 0 0 0-6-6Z"/><circle cx="12" cy="9" r="2"/>',
  myplants: '<path d="M12 22V11"/><path d="M12 11C12 7 9 4 5 4c0 4 3 7 7 7Z"/><path d="M12 13c0-3.5 3-6 6.5-6 0 3.5-3 6-6.5 6Z"/>',
  reminders: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  explore: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.2 5.3-5.3 2.2 2.2-5.3 5.3-2.2Z"/>',
  collection: '<path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 12 10 5 10-5M2 17l10 5 10-5"/>',
  compare: '<path d="M12 3v18"/><path d="M5 8 3 13h4L5 8ZM19 8l-2 5h4l-2-5Z"/><path d="M4 8h16"/>',
};

export function tabXml(id: string): string {
  return stroke(TAB_PATHS[id] || '', 2);
}

// UI / inline icons used across screens
export const UI = {
  clockFrame: stroke('<path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2M3 12h18"/>'),
  camera: stroke('<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"/><circle cx="12" cy="13" r="3"/>'),
  upload: stroke('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>'),
  infoDown: stroke('<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>'),
  infoUp: stroke('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>'),
  alert: stroke('<path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/>'),
  sparkle: fill('<path d="M12 2l1.9 5.6L19.5 9l-4.4 3.4L16.4 18 12 14.8 7.6 18l1.3-5.6L4.5 9l5.6-1.4L12 2Z"/>'),
  chevronRight: stroke('<path d="m9 6 6 6-6 6"/>', 2.4),
  chevronRightSm: stroke('<path d="m9 18 6-6-6-6"/>', 2.2),
  chevronLeft: stroke('<path d="m15 18-6-6 6-6"/>', 2.2),
  chevronLeftBold: stroke('<path d="m15 18-6-6 6-6"/>', 2.4),
  chevronRightBold: stroke('<path d="m9 18 6-6-6-6"/>', 2.4),
  search: stroke('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>'),
  gear: stroke('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H2a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 3.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H8a1.65 1.65 0 0 0 1-1.51V2a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V8a1.65 1.65 0 0 0 1.51 1H22a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>', 2.4),
  close: stroke('<path d="M18 6 6 18M6 6l12 12"/>', 2.4),
  moon: stroke('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>'),
  bellDrop: stroke('<path d="M12 22a7 7 0 0 0 7-7c0-3-2-5-2-8H7c0 3-2 5-2 8a7 7 0 0 0 7 7Z"/><path d="M12 7V3"/>', 1.8),
  book: stroke('<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22.5z"/><path d="M8 7h8M8 11h6"/>', 1.8),
  bookmarkFill: fill('<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>'),
  plus: stroke('<path d="M12 5v14M5 12h14"/>'),
  check: stroke('<path d="M20 6 9 17l-5-5"/>', 2.4),
  careDrop: stroke('<path d="M12 3a6 6 0 0 0-6 6c0 4 6 12 6 12s6-8 6-12a6 6 0 0 0-6-6Z"/><circle cx="12" cy="9" r="2"/>'),
  historyRotate: stroke('<path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l3 2"/>'),
};

interface IconProps {
  xml: string;
  size?: number;
  color?: string;
  style?: object;
}

export function Icon({ xml, size = 24, color, style }: IconProps) {
  return <SvgXml xml={xml} width={size} height={size} color={color} style={style} />;
}
