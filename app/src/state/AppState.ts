import type { LensId } from '../config/types';

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

export const initialState: AppState = {
  welcome: true,
  active: 0,
  tab: 'today',
  scanning: false,
  query: '',
  fromHistory: false,
  usage: { plate: 2, fresh: 2, plant: 1, rock: 1 },
  chat: { step: 0, answers: [], typing: false },
  goal: { sex: 'female', age: 22, height: 181, weight: 52, activity: 1.375, target: 'gain', daily: 2300 },
  consumed: { cal: 330, carbs: 27, protein: 12, fat: 21, targets: { carbs: 275, protein: 60, fat: 70 } },
  calMonth: 6,
  calYear: 2026,
  calSelected: 3,
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
