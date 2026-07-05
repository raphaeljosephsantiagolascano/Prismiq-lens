import type { LensId, LensResult } from '../config/types';

export interface Macros {
  cal: number;
  carbs: number;
  protein: number;
  fat: number;
}

/** A scan the user chose to save — the AI result plus its photo and timestamp. */
export interface SavedScan {
  id: string;
  lensId: LensId;
  createdAt: number; // epoch ms
  title: string;
  subtitle: string;
  imageUri: string | null;
  result: LensResult;
  macros?: Macros; // plate only
}

const EMPTY: Macros = { cal: 0, carbs: 0, protein: 0, fat: 0 };

function numFrom(v?: string): number {
  if (!v) return 0;
  const m = v.replace(/,/g, '').match(/-?\d+(\.\d+)?/);
  return m ? Math.round(Number(m[0])) : 0;
}

/** Pull calorie/macro numbers out of a plate result's fields ("450 kcal", "30 g", …). */
export function parseMacros(r: LensResult): Macros {
  const get = (label: string) => r.fields.find((f) => f.label.toLowerCase() === label)?.value;
  return {
    cal: numFrom(get('calories')),
    carbs: numFrom(get('carbs')),
    protein: numFrom(get('protein')),
    fat: numFrom(get('fat')),
  };
}

export function makeScan(lensId: LensId, result: LensResult, imageUri: string | null): SavedScan {
  return {
    id: `s_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
    lensId,
    createdAt: Date.now(),
    title: result.title,
    subtitle: result.subtitle,
    imageUri,
    result,
    macros: lensId === 'plate' ? parseMacros(result) : undefined,
  };
}

export function scansForLens(scans: SavedScan[], lensId: LensId): SavedScan[] {
  return scans.filter((s) => s.lensId === lensId); // stored newest-first
}

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
const isToday = (ts: number) => sameDay(new Date(ts), new Date());

/** e.g. "Today", "Yesterday", "3d ago", "Jul 2". */
export function relativeDay(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  if (isToday(ts)) return 'Today';
  const y = new Date(now);
  y.setDate(now.getDate() - 1);
  if (sameDay(d, y)) return 'Yesterday';
  const days = Math.floor((now.getTime() - ts) / 86_400_000);
  if (days >= 2 && days < 7) return `${days}d ago`;
  if (days >= 7 && days < 14) return 'Last week';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function clockTime(ts: number): string {
  return new Date(ts).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

function addMacros(a: Macros, b: Macros): Macros {
  return { cal: a.cal + b.cal, carbs: a.carbs + b.carbs, protein: a.protein + b.protein, fat: a.fat + b.fat };
}

/** Sum of today's saved plate scans — drives the calorie ring. */
export function todayPlateTotals(scans: SavedScan[]): Macros {
  return scans.filter((s) => s.lensId === 'plate' && s.macros && isToday(s.createdAt)).reduce((acc, s) => addMacros(acc, s.macros!), { ...EMPTY });
}

/** day-of-month → that day's plate scans, for the calendar's visible month. */
export function plateMonthLog(scans: SavedScan[], year: number, month: number): Record<number, SavedScan[]> {
  const log: Record<number, SavedScan[]> = {};
  for (const s of scans) {
    if (s.lensId !== 'plate' || !s.macros) continue;
    const d = new Date(s.createdAt);
    if (d.getFullYear() === year && d.getMonth() === month) {
      (log[d.getDate()] ||= []).push(s);
    }
  }
  return log;
}

export function dayTotals(scans: SavedScan[]): Macros {
  return scans.reduce((acc, s) => (s.macros ? addMacros(acc, s.macros) : acc), { ...EMPTY });
}
