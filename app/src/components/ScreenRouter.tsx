import { useApp } from '../state/AppContext';
import { PlateToday } from './screens/PlateToday';
import { PlateCalendar } from './screens/PlateCalendar';
import { PlateHistory } from './screens/PlateHistory';
import { PlateGoal } from './screens/PlateGoal';
import { ScanScreen } from './screens/ScanScreen';
import { ResultScreen } from './screens/ResultScreen';
import { LensHome } from './screens/LensHome';
import { LensList } from './screens/LensList';
import { LensCollection } from './screens/LensCollection';
import { LensReminders } from './screens/LensReminders';
import { LensCompare } from './screens/LensCompare';
import { LensGuide } from './screens/LensGuide';

export function ScreenRouter() {
  const { state, lens } = useApp();
  const isPlate = lens.id === 'plate';
  const tab = state.tab;
  const firstTab = lens.tabs[0].id;
  const homeTab = tab === firstTab;

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
