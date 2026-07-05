import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { Icon, LENS_ICON, UI } from '../../lib/icons';
import { clockTime, dayTotals, plateMonthLog } from '../../lib/scans';
import { useApp } from '../../state/AppContext';
import { Bar, GlassCard, ScreenTitle, SectionLabel } from '../Shared';
import { Press, Row, Txt } from '../ui';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const CIRC = 2 * Math.PI * 15;

export function PlateCalendar() {
  const { state, lens, theme, calPrev, calNext, setCalSelected, openScan, promptDeleteScan } = useApp();
  const { calMonth, calYear, calSelected, savedScans } = state;

  const first = new Date(calYear, calMonth, 1).getDay();
  const daysIn = new Date(calYear, calMonth + 1, 0).getDate();
  const log = useMemo(() => plateMonthLog(savedScans, calYear, calMonth), [savedScans, calYear, calMonth]);
  const goalCal = state.goal.daily;

  const cells = useMemo(() => {
    const arr: { day: number | null; pct: number; logged: boolean }[] = [];
    for (let i = 0; i < first; i++) arr.push({ day: null, pct: 0, logged: false });
    for (let d = 1; d <= daysIn; d++) {
      const meals = log[d];
      const pct = meals ? Math.min(1, dayTotals(meals).cal / goalCal) : 0;
      arr.push({ day: d, pct, logged: !!meals });
    }
    return arr;
  }, [first, daysIn, log, goalCal]);

  const selMeals = log[calSelected] || [];
  const selTot = dayTotals(selMeals);
  const selPct = Math.min(100, Math.round((selTot.cal / goalCal) * 100));
  const mt = state.consumed.targets;
  const selMacros = [
    { label: 'Carbs', value: selTot.carbs, color: '#FF9F0A', barPct: Math.min(100, Math.round((selTot.carbs / mt.carbs) * 100)) },
    { label: 'Protein', value: selTot.protein, color: '#FF375F', barPct: Math.min(100, Math.round((selTot.protein / mt.protein) * 100)) },
    { label: 'Fat', value: selTot.fat, color: '#0A84FF', barPct: Math.min(100, Math.round((selTot.fat / mt.fat) * 100)) },
  ];

  return (
    <>
      <ScreenTitle>Calendar</ScreenTitle>

      <View style={{ backgroundColor: theme.tint, borderWidth: 1, borderColor: theme.hair, borderRadius: 24, padding: 16, marginBottom: 16 }}>
        <Row style={{ justifyContent: 'space-between', marginBottom: 14 }}>
          <Press onPress={calPrev} haptic={false} style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: theme.panel, alignItems: 'center', justifyContent: 'center' }}>
            <Icon xml={UI.chevronLeftBold} size={16} color={theme.ink()} />
          </Press>
          <Txt style={{ fontSize: 15, fontWeight: 700, color: theme.ink() }}>
            {monthNames[calMonth]} {calYear}
          </Txt>
          <Press onPress={calNext} haptic={false} style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: theme.panel, alignItems: 'center', justifyContent: 'center' }}>
            <Icon xml={UI.chevronRightBold} size={16} color={theme.ink()} />
          </Press>
        </Row>

        <Row style={{ marginBottom: 6 }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <View key={i} style={{ width: `${100 / 7}%`, alignItems: 'center' }}>
              <Txt style={{ fontSize: 11, fontWeight: 600, color: theme.ink(0.4) }}>{d}</Txt>
            </View>
          ))}
        </Row>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {cells.map((c, i) => {
            const sel = c.day === calSelected;
            const numColor = sel ? '#fff' : c.logged ? theme.ink() : theme.ink(0.42);
            return (
              <Press
                key={i}
                haptic={false}
                onPress={() => c.day && setCalSelected(c.day)}
                style={{ width: `${100 / 7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' }}
              >
                {c.day != null && (
                  <>
                    {c.logged && (
                      // arc starts at 12 o'clock: rotate a <G> around its center using numeric
                      // originX/originY (works on web + iOS; the "18, 18" string form mis-parses natively)
                      <Svg viewBox="0 0 36 36" width="100%" height="100%" style={{ position: 'absolute' }}>
                        <G rotation={-90} originX={18} originY={18}>
                          <Circle cx={18} cy={18} r={15} fill="none" stroke={theme.ink(0.1)} strokeWidth={2.6} />
                          <Circle cx={18} cy={18} r={15} fill="none" stroke={lens.accent} strokeWidth={2.6} strokeLinecap="round" strokeDasharray={`${CIRC} ${CIRC}`} strokeDashoffset={CIRC * (1 - c.pct)} />
                        </G>
                      </Svg>
                    )}
                    <View style={{ width: '64%', height: '64%', borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: sel ? lens.accent : 'transparent' }}>
                      <Txt style={{ fontSize: 13, fontWeight: 700, color: numColor }}>{c.day}</Txt>
                    </View>
                  </>
                )}
              </Press>
            );
          })}
        </View>
      </View>

      <SectionLabel>{`${monthNames[calMonth]} ${calSelected}`}</SectionLabel>

      {selMeals.length > 0 ? (
        <>
          <GlassCard strong style={{ padding: 18, borderRadius: 20, marginBottom: 14 }}>
            <Row style={{ justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
              <Txt style={{ fontSize: 30, fontWeight: 800, color: theme.ink() }}>
                {selTot.cal}
                <Txt style={{ fontSize: 14, fontWeight: 600, color: theme.ink(0.45) }}> / {goalCal} kcal</Txt>
              </Txt>
              <Txt style={{ fontSize: 13, fontWeight: 600, color: theme.ink(0.5) }}>
                {selMeals.length} {selMeals.length === 1 ? 'meal' : 'meals'}
              </Txt>
            </Row>
            <Bar pct={selPct} height={8} track={theme.ink(0.08)} />
            <Row style={{ marginTop: 16, gap: 12, alignItems: 'flex-start' }}>
              {selMacros.map((mm) => (
                <View key={mm.label} style={{ flex: 1 }}>
                  <Row style={{ gap: 5, marginBottom: 3 }}>
                    <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: mm.color }} />
                    <Txt style={{ fontSize: 11.5, fontWeight: 600, color: theme.ink(0.55) }}>{mm.label}</Txt>
                  </Row>
                  <Txt style={{ fontSize: 16, fontWeight: 800, color: theme.ink() }}>
                    {mm.value}
                    <Txt style={{ fontSize: 11, fontWeight: 600, color: theme.ink(0.4) }}>g</Txt>
                  </Txt>
                  <View style={{ height: 5, borderRadius: 99, backgroundColor: theme.ink(0.08), overflow: 'hidden', marginTop: 5 }}>
                    <View style={{ height: '100%', borderRadius: 99, backgroundColor: mm.color, width: `${mm.barPct}%` }} />
                  </View>
                </View>
              ))}
            </Row>
          </GlassCard>

          <SectionLabel>Meals</SectionLabel>
          {selMeals.map((r) => {
            const m = r.macros;
            return (
              <Press
                key={r.id}
                haptic={false}
                onPress={() => openScan(r)}
                onLongPress={() => promptDeleteScan(r)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: theme.soft, borderWidth: 1, borderColor: theme.hair, borderRadius: 18, padding: 12, paddingHorizontal: 14, marginBottom: 10 }}
              >
                <View style={{ width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.panel }}>
                  <Icon xml={LENS_ICON[lens.id]} size={23} color={theme.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Txt style={{ fontSize: 14, fontWeight: 700, color: theme.ink() }} numberOfLines={1}>{r.title}</Txt>
                  <Txt style={{ fontSize: 12, color: theme.ink(0.5) }}>{clockTime(r.createdAt)} · {m?.carbs ?? 0}C · {m?.protein ?? 0}P · {m?.fat ?? 0}F</Txt>
                </View>
                <Txt style={{ fontSize: 14, fontWeight: 800, color: theme.ink() }}>
                  {m?.cal ?? 0}
                  <Txt style={{ fontSize: 11, fontWeight: 600, color: theme.ink(0.45) }}> kcal</Txt>
                </Txt>
              </Press>
            );
          })}
        </>
      ) : (
        <Txt style={{ textAlign: 'center', padding: 24, color: theme.ink(0.4), fontSize: 13.5 }}>No meals logged this day.</Txt>
      )}
    </>
  );
}
