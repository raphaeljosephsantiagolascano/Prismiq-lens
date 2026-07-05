export type LensId = 'plate' | 'fresh' | 'plant' | 'rock';

export interface LensTab {
  id: string;
  label: string;
  center?: boolean;
}

export interface ResultField {
  label: string;
  value: string;
}

export interface ResultList {
  title: string;
  items: string[];
}

export interface ChatTurn {
  ai: string;
  options: string[];
}

export interface LensResult {
  title: string;
  subtitle: string;
  aka?: string;
  sci?: string;
  description: string;
  confidence: number;
  caution: string;
  fields: ResultField[];
  lists: ResultList[];
  portionQs?: string[];
  chat?: ChatTurn[];
}

export interface HistoryItem {
  name: string;
  meta?: string;
  time: string;
  cal?: string;
  day?: number;
}

export interface LensContent {
  heroTitle: string;
  heroSub: string;
  cardsTitle: string;
  cards: { name: string; tag: string }[];
  grid?: { name: string; sub: string }[];
  items: { name: string; meta: string }[];
  guide: { title: string; body: string }[];
  careTip?: string;
  reminders?: { plant: string; note: string; when: string }[];
  compare?: { a: string; label: string; b: string }[];
}

export interface DailyMeal {
  name: string;
  time: string;
  cal: number;
  carbs: number;
  protein: number;
  fat: number;
}

export interface Lens {
  id: LensId;
  name: string;
  shortName: string;
  lensType?: string;
  subjectWord: string;
  dailyLimit: number;
  tagline: string;
  cta: string;
  description: string;
  accent: string;
  glow: string;
  /** subtle page-bottom tint behind the white background */
  bgTint: string;
  /** two-stop gradient for buttons / center scan CTA */
  btnColors: [string, string];
  glassTint: string;
  softTint: string;
  scanInstruction: string;
  disclaimer: string;
  tabs: LensTab[];
  result: LensResult;
  history: HistoryItem[];
  content?: LensContent;
}
