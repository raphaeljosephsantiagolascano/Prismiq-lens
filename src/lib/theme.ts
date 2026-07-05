import type { Lens } from '../config/types';

// Ported from the web app's CSS-variable theme. RN has no CSS custom
// properties, so the `--ink` text channel becomes an `ink(alpha)` helper
// and the `--tint/--soft/...` surfaces become plain resolved colors.
export interface Theme {
  dark: boolean;
  // brand (per lens)
  accent: string;
  glow: string;
  btnColors: [string, string];
  // ink text channel — call ink(a) for any text/border color
  inkRGB: string; // "r,g,b"
  ink: (a?: number) => string;
  // surfaces
  surface: string;
  panel: string;
  glass1: string;
  glass2: string;
  tint: string;
  soft: string;
  // page background gradient (top -> bottom)
  bgColors: [string, string];
  // frosted white border used throughout the glass system
  hair: string;
}

export function computeTheme(lens: Lens, dark: boolean): Theme {
  const mk = (inkRGB: string, rest: Omit<Theme, 'inkRGB' | 'ink' | 'dark' | 'accent' | 'glow' | 'btnColors'>): Theme => ({
    dark,
    accent: lens.accent,
    glow: lens.glow,
    btnColors: lens.btnColors,
    inkRGB,
    ink: (a = 1) => `rgba(${inkRGB},${a})`,
    ...rest,
  });

  if (dark) {
    return mk('232,234,242', {
      surface: '#20232c',
      panel: 'rgba(255,255,255,.06)',
      glass1: 'rgba(255,255,255,.09)',
      glass2: 'rgba(255,255,255,.03)',
      tint: 'rgba(255,255,255,.06)',
      soft: 'rgba(255,255,255,.035)',
      bgColors: ['#181b22', '#0d0f14'],
      hair: 'rgba(255,255,255,.14)',
    });
  }
  return mk('25,27,33', {
    surface: '#ffffff',
    panel: 'rgba(255,255,255,.6)',
    glass1: 'rgba(255,255,255,.55)',
    glass2: 'rgba(255,255,255,.28)',
    tint: lens.glassTint,
    soft: lens.softTint,
    bgColors: ['#ffffff', lens.bgTint],
    hair: 'rgba(255,255,255,.6)',
  });
}
