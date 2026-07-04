import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { lenses } from '../config/lenses';
import type { Lens } from '../config/types';
import { computeTheme, themeStyleVars, type ThemeVars } from '../lib/theme';
import { estimateGoal, initialState, type AppState, type GoalState } from './AppState';

interface AppContextValue {
  state: AppState;
  setState: (patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => void;
  lens: Lens;
  theme: ThemeVars;
  themeVars: React.CSSProperties;
  dismissWelcome: () => void;
  switchMode: (next: number) => void;
  goTab: (tab: string) => void;
  goScan: () => void;
  goHistory: () => void;
  goResult: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  toggleDark: () => void;
  startScan: () => void;
  answerChat: (opt: string) => void;
  saveResult: () => void;
  setGoalField: <K extends keyof GoalState>(k: K, v: GoalState[K]) => void;
  saveGoal: () => void;
  calPrev: () => void;
  calNext: () => void;
  setQuery: (q: string) => void;
  setCalSelected: (day: number) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setStateRaw] = useState<AppState>(initialState);
  const scanTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const chatTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const setState = useCallback((patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => {
    setStateRaw((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }));
  }, []);

  const lens = lenses[state.active];
  const theme = useMemo(() => computeTheme(lens, state.dark), [lens, state.dark]);
  const themeVars = useMemo(() => themeStyleVars(lens, theme), [lens, theme]);

  const switchMode = useCallback(
    (next: number) => {
      setState((s) => {
        const keepScan = s.tab === 'scan';
        const def = lenses[next].tabs[0].id;
        return { active: next, tab: keepScan ? 'scan' : def };
      });
    },
    [setState],
  );

  const goTab = useCallback((tab: string) => setState({ tab, scanning: false }), [setState]);
  const goScan = useCallback(() => goTab('scan'), [goTab]);
  const goHistory = useCallback(() => goTab('history'), [goTab]);
  const goResult = useCallback(() => setState({ tab: 'result', scanning: false, fromHistory: true }), [setState]);
  const openSettings = useCallback(() => setState({ showSettings: true }), [setState]);
  const closeSettings = useCallback(() => setState({ showSettings: false }), [setState]);
  const toggleDark = useCallback(() => setState((s) => ({ dark: !s.dark })), [setState]);
  const dismissWelcome = useCallback(() => setState({ welcome: false }), [setState]);

  const startScan = useCallback(() => {
    setState((s) => {
      const m = lenses[s.active];
      const lim = m.dailyLimit || 5;
      if ((s.usage[m.id] || 0) >= lim) return {};
      clearTimeout(scanTimer.current);
      scanTimer.current = setTimeout(() => setState({ scanning: false, tab: 'result' }), 2200);
      return {
        scanning: true,
        fromHistory: false,
        chat: { step: 0, answers: [], typing: false },
        usage: { ...s.usage, [m.id]: Math.min(lim, (s.usage[m.id] || 0) + 1) },
      };
    });
  }, [setState]);

  const answerChat = useCallback(
    (opt: string) => {
      setState((s) => ({ chat: { step: s.chat.step + 1, answers: [...s.chat.answers, opt], typing: true } }));
      clearTimeout(chatTimer.current);
      chatTimer.current = setTimeout(() => setState((s) => ({ chat: { ...s.chat, typing: false } })), 1050);
    },
    [setState],
  );

  const saveResult = useCallback(
    () => setState((s) => ({ tab: lenses[s.active].tabs[0].id })),
    [setState],
  );

  const setGoalField = useCallback(
    <K extends keyof GoalState>(k: K, v: GoalState[K]) => setState((s) => ({ goal: { ...s.goal, [k]: v } })),
    [setState],
  );

  const saveGoal = useCallback(
    () => setState((s) => ({ goal: { ...s.goal, daily: estimateGoal(s.goal) }, tab: 'today' })),
    [setState],
  );

  const calPrev = useCallback(
    () =>
      setState((s) => {
        let m = s.calMonth - 1;
        let y = s.calYear;
        if (m < 0) {
          m = 11;
          y--;
        }
        return { calMonth: m, calYear: y };
      }),
    [setState],
  );
  const calNext = useCallback(
    () =>
      setState((s) => {
        let m = s.calMonth + 1;
        let y = s.calYear;
        if (m > 11) {
          m = 0;
          y++;
        }
        return { calMonth: m, calYear: y };
      }),
    [setState],
  );

  const setQuery = useCallback((query: string) => setState({ query }), [setState]);
  const setCalSelected = useCallback((calSelected: number) => setState({ calSelected }), [setState]);

  const value: AppContextValue = {
    state,
    setState,
    lens,
    theme,
    themeVars,
    dismissWelcome,
    switchMode,
    goTab,
    goScan,
    goHistory,
    goResult,
    openSettings,
    closeSettings,
    toggleDark,
    startScan,
    answerChat,
    saveResult,
    setGoalField,
    saveGoal,
    calPrev,
    calNext,
    setQuery,
    setCalSelected,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
