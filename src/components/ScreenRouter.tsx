import React from 'react';
import { useApp } from '../state/AppContext';
import { LensCollection } from './screens/LensCollection';
import { LensCompare } from './screens/LensCompare';
import { LensGuide } from './screens/LensGuide';
import { LensHome } from './screens/LensHome';
import { LensList } from './screens/LensList';
import { LensReminders } from './screens/LensReminders';
import { PlateCalendar } from './screens/PlateCalendar';
import { PlateGoal } from './screens/PlateGoal';
import { PlateHistory } from './screens/PlateHistory';
import { PlateToday } from './screens/PlateToday';
import { ResultScreen } from './screens/ResultScreen';
import { ScanScreen } from './screens/ScanScreen';

export function ScreenRouter() {
  const { state, lens } = useApp();
  const isPlate = lens.id === 'plate';
  const tab = state.tab;
  const homeTab = tab === lens.tabs[0].id;

  if (tab === 'scan') return <ScanScreen />;
  if (tab === 'result') return <ResultScreen />;

  if (isPlate) {
    if (tab === 'today') return <PlateToday />;
    if (tab === 'calendar') return <PlateCalendar />;
    if (tab === 'history') return <PlateHistory />;
    if (tab === 'goal') return <PlateGoal />;
    return null;
  }

  if (homeTab) return <LensHome />;
  if (tab === 'history') return <LensList />;
  if (tab === 'saved' || tab === 'myplants' || tab === 'collection') return <LensCollection />;
  if (tab === 'reminders') return <LensReminders />;
  if (tab === 'compare') return <LensCompare />;
  if (tab === 'guide') return <LensGuide />;
  return null;
}
