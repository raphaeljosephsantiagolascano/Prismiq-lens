import type { LensId, LensResult } from '../config/types';
import type { SavedScan } from '../lib/scans';

export interface GoalState {
  sex: 'male' | 'female';
  age: number;
  height: number; // cm
  weight: number; // kg
  activity: number;
  target: 'lose' | 'maintain' | 'gain';
  daily: number;
}

export interface ConsumedState {
  cal: number;
  carbs: number;
  protein: number;
  fat: number;
  targets: { carbs: number; protein: number; fat: number };
}

export interface ChatState {
  step: number;
  answers: string[];
  typing: boolean;
}

export interface AppState {
  welcome: boolean;
  active: number;
  tab: string;
  scanning: boolean;
  scanError: string | null;
  /** the AI-generated result to render on the Result screen (null = use the lens's mock demo) */
  result: LensResult | null;
  /** uri of the captured/uploaded photo for the current result (null = placeholder) */
  scanImageUri: string | null;
  /** every scan the user has saved, newest first */
  savedScans: SavedScan[];
  query: string;
  fromHistory: boolean;
  usage: Record<LensId, number>;
  chat: ChatState;
  goal: GoalState;
  consumed: ConsumedState;
  calMonth: number;
  calYear: number;
  calSelected: number;
  dark: boolean;
  showSettings: boolean;
}

const _now = new Date();

export const initialState: AppState = {
  welcome: true,
  active: 0,
  tab: 'today',
  scanning: false,
  scanError: null,
  result: null,
  scanImageUri: null,
  savedScans: [],
  query: '',
  fromHistory: false,
  usage: { plate: 2, fresh: 2, plant: 1, rock: 1 },
  chat: { step: 0, answers: [], typing: false },
  goal: { sex: 'female', age: 22, height: 181, weight: 52, activity: 1.375, target: 'gain', daily: 2300 },
  consumed: { cal: 330, carbs: 27, protein: 12, fat: 21, targets: { carbs: 275, protein: 60, fat: 70 } },
  calMonth: _now.getMonth(),
  calYear: _now.getFullYear(),
  calSelected: _now.getDate(),
  dark: false,
  showSettings: false,
};

export function estimateGoal(g: GoalState): number {
  const bmr = 10 * g.weight + 6.25 * g.height - 5 * g.age + (g.sex === 'male' ? 5 : -161);
  let cal = bmr * g.activity;
  if (g.target === 'lose') cal -= 400;
  else if (g.target === 'gain') cal += 400;
  return Math.max(1200, Math.round(cal / 10) * 10);
}
