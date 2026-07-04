import type { Lens } from '../config/types';

export interface ThemeVars {
  ink: string; // "r,g,b" channel for rgb(var(--ink)) / rgba(var(--ink),a)
  surface: string;
  panel: string;
  glass1: string;
  glass2: string;
  tint: string;
  soft: string;
  bg: string;
}

export function computeTheme(lens: Lens, dark: boolean): ThemeVars {
  if (dark) {
    return {
      ink: '232,234,242',
      surface: '#20232c',
      panel: 'rgba(255,255,255,.06)',
      glass1: 'rgba(255,255,255,.09)',
      glass2: 'rgba(255,255,255,.03)',
      tint: 'rgba(255,255,255,.06)',
      soft: 'rgba(255,255,255,.035)',
      bg: 'radial-gradient(120% 120% at 50% -8%,#181b22 0%,#0d0f14 70%)',
    };
  }
  return {
    ink: '25,27,33',
    surface: '#ffffff',
    panel: 'rgba(255,255,255,.6)',
    glass1: 'rgba(255,255,255,.55)',
    glass2: 'rgba(255,255,255,.28)',
    tint: lens.glassTint,
    soft: lens.softTint,
    bg: lens.bgStyle,
  };
}

/** Turns a ThemeVars + lens into a CSS custom-property style object,
 *  mirroring the --accent/--glow/--btn/... vars set on .app in the prototype. */
export function themeStyleVars(lens: Lens, theme: ThemeVars): React.CSSProperties {
  return {
    ['--accent' as string]: lens.accent,
    ['--glow' as string]: lens.glow,
    ['--btn' as string]: lens.buttonGradient,
    ['--tint' as string]: theme.tint,
    ['--soft' as string]: theme.soft,
    ['--ink' as string]: theme.ink,
    ['--surface' as string]: theme.surface,
    ['--panel' as string]: theme.panel,
    ['--glass1' as string]: theme.glass1,
    ['--glass2' as string]: theme.glass2,
  } as React.CSSProperties;
}
