import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppState } from './AppState';

const KEY = 'prismiq:v1';

// Only durable, user-owned data is persisted — usage counts (so daily limits
// survive a reload), the goal, macro targets, dark mode, and saved scans.
// Ephemeral UI state (tab, scanning, current result) is intentionally left out.
type Persisted = Pick<AppState, 'usage' | 'goal' | 'consumed' | 'dark' | 'savedScans'>;

export function pickPersisted(s: AppState): Persisted {
  return { usage: s.usage, goal: s.goal, consumed: s.consumed, dark: s.dark, savedScans: s.savedScans };
}

export async function loadPersisted(): Promise<Partial<AppState> | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Partial<AppState>) : null;
  } catch {
    return null;
  }
}

export async function savePersisted(s: AppState): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(pickPersisted(s)));
  } catch {
    /* best-effort */
  }
}
