import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Alert, Platform } from 'react-native';
import { lenses } from '../config/lenses';
import type { Lens } from '../config/types';
import { analyzeImage, type CapturedImage } from '../lib/analyze';
import { makeScan, type SavedScan } from '../lib/scans';
import { computeTheme, type Theme } from '../lib/theme';
import { estimateGoal, initialState, type AppState, type GoalState } from './AppState';
import { loadPersisted, savePersisted } from './persist';

interface AppContextValue {
  state: AppState;
  setState: (patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => void;
  lens: Lens;
  theme: Theme;
  dismissWelcome: () => void;
  switchMode: (next: number) => void;
  goTab: (tab: string) => void;
  goScan: () => void;
  goHistory: () => void;
  goResult: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  toggleDark: () => void;
  /** run the real pipeline: send the captured image to the proxy → AI result → Result screen */
  analyze: (image: CapturedImage) => Promise<void>;
  answerChat: (opt: string) => void;
  /** persist the current AI result as a saved scan, then return home */
  saveResult: () => void;
  /** open a previously saved scan on the Result screen */
  openScan: (scan: SavedScan) => void;
  /** confirm + remove a saved scan from history */
  promptDeleteScan: (scan: SavedScan) => void;
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
  const chatTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const stateRef = useRef(state);
  stateRef.current = state;
  const hydrated = useRef(false);

  const setState = useCallback((patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => {
    setStateRaw((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }));
  }, []);

  // hydrate persisted data (usage, goal, consumed, dark) once on mount
  useEffect(() => {
    loadPersisted().then((saved) => {
      if (saved) setStateRaw((s) => ({ ...s, ...saved }));
      hydrated.current = true;
    });
  }, []);

  // persist the durable subset whenever it changes (after the initial hydrate)
  useEffect(() => {
    if (hydrated.current) savePersisted(stateRef.current);
  }, [state.usage, state.goal, state.consumed, state.dark, state.savedScans]);

  const lens = lenses[state.active];
  const theme = useMemo(() => computeTheme(lens, state.dark), [lens, state.dark]);

  // On lens switch: reset to that lens's default tab UNLESS the user is on Scan.
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

  const analyze = useCallback(
    async (image: CapturedImage) => {
      const m = lenses[stateRef.current.active];
      const lim = m.dailyLimit || 5;
      if ((stateRef.current.usage[m.id] || 0) >= lim) return;
      if (!image.base64) {
        const message = 'That image had no data - try another photo.';
        setState({ scanError: message });
        if (Platform.OS !== 'web') Alert.alert('Scan failed', message);
        return;
      }
      // enter the scanning animation on the scan screen
      setState({ scanning: true, scanError: null, tab: 'scan', fromHistory: false, scanImageUri: image.uri, chat: { step: 0, answers: [], typing: false } });
      try {
        const result = await analyzeImage(image, m.id);
        setState((s) => ({
          scanning: false,
          result,
          tab: 'result',
          usage: { ...s.usage, [m.id]: Math.min(lim, (s.usage[m.id] || 0) + 1) },
        }));
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Something went wrong.';
        setState({ scanning: false, scanError: message });
        if (Platform.OS !== 'web') Alert.alert('Scan failed', message);
      }
    },
    [setState],
  );

  const answerChat = useCallback(
    (opt: string) => {
      setState((s) => ({ chat: { step: s.chat.step + 1, answers: [...s.chat.answers, opt], typing: true } }));
      clearTimeout(chatTimer.current);
      chatTimer.current = setTimeout(() => setState((s) => ({ chat: { ...s.chat, typing: false } })), 1050);
    },
    [setState],
  );

  // save the current AI result into history, then go to the lens's home tab
  const saveResult = useCallback(() => {
    setState((s) => {
      const home = lenses[s.active].tabs[0].id;
      if (!s.result) return { tab: home };
      const scan = makeScan(lenses[s.active].id, s.result, s.scanImageUri);
      return { savedScans: [scan, ...s.savedScans], tab: home, result: null, scanImageUri: null };
    });
  }, [setState]);

  // open a saved scan on the Result screen (switching to its lens if needed)
  const openScan = useCallback(
    (scan: SavedScan) => {
      const idx = lenses.findIndex((l) => l.id === scan.lensId);
      setState((s) => ({
        active: idx >= 0 ? idx : s.active,
        result: scan.result,
        scanImageUri: scan.imageUri,
        tab: 'result',
        fromHistory: true,
      }));
    },
    [setState],
  );

  const promptDeleteScan = useCallback(
    (scan: SavedScan) => {
      Alert.alert('Delete scan?', `Remove “${scan.title}” from your history?`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () =>
            setState((s) => {
              const savedScans = s.savedScans.filter((x) => x.id !== scan.id);
              // if we're viewing the deleted scan, leave the Result screen
              const leaving = s.tab === 'result' && s.result === scan.result;
              return leaving ? { savedScans, tab: lenses[s.active].tabs[0].id, result: null, scanImageUri: null } : { savedScans };
            }),
        },
      ]);
    },
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
    dismissWelcome,
    switchMode,
    goTab,
    goScan,
    goHistory,
    goResult,
    openSettings,
    closeSettings,
    toggleDark,
    analyze,
    answerChat,
    saveResult,
    openScan,
    promptDeleteScan,
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
