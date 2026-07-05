import React from 'react';
import { View } from 'react-native';
import { Icon, LENS_ICON, UI } from '../../lib/icons';
import { clockTime, scansForLens, todayPlateTotals } from '../../lib/scans';
import { useApp } from '../../state/AppContext';
import { CalorieRing } from '../CalorieRing';
import { GlassCard, SectionLabel, UsageCard } from '../Shared';
import { GradientBtn, Press, Row, Txt } from '../ui';

export function PlateToday() {
  const { state, lens, theme, goScan, openScan, promptDeleteScan } = useApp();
  const today = todayPlateTotals(state.savedScans);
  const macroLegend = [
    { label: 'Carbs', value: today.carbs, color: '#FF9F0A' },
    { label: 'Protein', value: today.protein, color: '#FF375F' },
    { label: 'Fat', value: today.fat, color: '#0A84FF' },
  ];
  const recent = scansForLens(state.savedScans, 'plate').slice(0, 3);

  return (
    <>
      <GlassCard strong style={{ padding: 22, paddingBottom: 20, borderRadius: 28, marginBottom: 16 }}>
        <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
          <CalorieRing consumed={today} />
          <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center' }}>
            <Txt style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: theme.ink(0.5) }}>CALORIES</Txt>
            <Txt style={{ fontSize: 52, fontWeight: 800, color: theme.ink(), lineHeight: 56 }}>{today.cal}</Txt>
            <Txt style={{ fontSize: 13, color: theme.ink(0.55) }}>of {state.goal.daily} kcal</Txt>
          </View>
        </View>
        <Row style={{ marginTop: 8 }}>
          {macroLegend.map((ml) => (
            <View key={ml.label} style={{ flex: 1, alignItems: 'center' }}>
              <Row style={{ gap: 5 }}>
                <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: ml.color }} />
                <Txt style={{ fontSize: 12, color: theme.ink(0.55) }}>{ml.label}</Txt>
              </Row>
              <Txt style={{ fontSize: 18, fontWeight: 800, color: theme.ink(), marginTop: 3 }}>
                {ml.value}
                <Txt style={{ fontSize: 12, fontWeight: 600, color: theme.ink(0.45) }}>g</Txt>
              </Txt>
            </View>
          ))}
        </Row>
      </GlassCard>

      <UsageCard />

      <GradientBtn colors={theme.btnColors} glow={theme.glow} onPress={goScan} style={{ borderRadius: 20, marginBottom: 22 }}>
        <Row style={{ paddingVertical: 18, gap: 9 }}>
          <Icon xml={UI.camera} size={20} color="#fff" />
          <Txt style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Scan a meal</Txt>
        </Row>
      </GradientBtn>

      <SectionLabel>Recent</SectionLabel>
      {recent.length === 0 ? (
        <Txt style={{ fontSize: 13.5, color: theme.ink(0.4), paddingVertical: 8 }}>No meals yet — scan one to start tracking.</Txt>
      ) : (
        recent.map((r) => (
          <Press
            key={r.id}
            haptic={false}
            onPress={() => openScan(r)}
            onLongPress={() => promptDeleteScan(r)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 13,
              backgroundColor: theme.surface,
              borderWidth: 1,
              borderColor: theme.hair,
              borderRadius: 18,
              padding: 12,
              paddingHorizontal: 14,
              marginBottom: 10,
            }}
          >
            <View style={{ width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.soft }}>
              <Icon xml={LENS_ICON[lens.id]} size={24} color={theme.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt style={{ fontSize: 14.5, fontWeight: 700, color: theme.ink() }} numberOfLines={1}>{r.title}</Txt>
              <Txt style={{ fontSize: 12, color: theme.ink(0.5) }}>{clockTime(r.createdAt)}</Txt>
            </View>
            <Txt style={{ fontSize: 15, fontWeight: 800, color: theme.ink() }}>
              {r.macros?.cal ?? 0}
              <Txt style={{ fontSize: 11, fontWeight: 600, color: theme.ink(0.45) }}> kcal</Txt>
            </Txt>
          </Press>
        ))
      )}
    </>
  );
}
