import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View } from 'react-native';
import { Icon, LENS_ICON, UI } from '../../lib/icons';
import { relativeDay, scansForLens } from '../../lib/scans';
import { useApp } from '../../state/AppContext';
import { UsageCard } from '../Shared';
import { cardShadow, Press, Row, Txt } from '../ui';

export function LensHome() {
  const { state, lens, theme, goScan, openScan, promptDeleteScan } = useApp();
  const c = lens.content!;
  const hasCareTip = lens.id === 'plant';
  const recent = scansForLens(state.savedScans, lens.id).slice(0, 3);

  return (
    <>
      <LinearGradient colors={lens.btnColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[{ borderRadius: 24, padding: 22, marginBottom: 16 }, cardShadow(lens.glow, true)]}>
        <View style={{ width: 40, height: 40, borderRadius: 13, backgroundColor: 'rgba(255,255,255,.22)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
          <Icon xml={LENS_ICON[lens.id]} size={22} color="#fff" />
        </View>
        <Txt style={{ fontSize: 19, fontWeight: 800, color: '#fff', lineHeight: 24, letterSpacing: -0.3 }}>{c.heroTitle}</Txt>
        <Txt style={{ fontSize: 13.5, lineHeight: 20, color: 'rgba(255,255,255,.85)', marginTop: 8 }}>{c.heroSub}</Txt>
        <Press onPress={goScan} style={{ marginTop: 16, alignSelf: 'flex-start', backgroundColor: theme.surface, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 20 }}>
          <Txt style={{ fontSize: 14, fontWeight: 700, color: theme.accent }}>{lens.cta}</Txt>
        </Press>
      </LinearGradient>

      <UsageCard />

      {hasCareTip && c.careTip && (
        <Row style={{ gap: 12, alignItems: 'flex-start', backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.hair, borderRadius: 18, padding: 15, paddingHorizontal: 16, marginBottom: 16 }}>
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.soft, alignItems: 'center', justifyContent: 'center' }}>
            <Icon xml={UI.careDrop} size={20} color={theme.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Txt style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.4, color: theme.accent }}>CARE TIP OF THE DAY</Txt>
            <Txt style={{ fontSize: 13.5, lineHeight: 19, color: theme.ink(0.7), marginTop: 3 }}>{c.careTip}</Txt>
          </View>
        </Row>
      )}

      <Txt style={{ fontSize: 16, fontWeight: 700, color: theme.ink(), marginBottom: 10 }}>{c.cardsTitle}</Txt>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
        {c.cards.map((card, i) => (
          <View key={i} style={{ width: '47.8%', flexGrow: 1, minHeight: 96, backgroundColor: theme.tint, borderWidth: 1, borderColor: theme.hair, borderRadius: 18, padding: 15, justifyContent: 'space-between' }}>
            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: theme.panel, alignItems: 'center', justifyContent: 'center' }}>
              <Icon xml={LENS_ICON[lens.id]} size={18} color={theme.accent} />
            </View>
            <View>
              <Txt style={{ fontSize: 14, fontWeight: 700, color: theme.ink() }}>{card.name}</Txt>
              <Txt style={{ fontSize: 11.5, color: theme.ink(0.5), marginTop: 1 }}>{card.tag}</Txt>
            </View>
          </View>
        ))}
      </View>

      <Txt style={{ fontSize: 16, fontWeight: 700, color: theme.ink(), marginBottom: 10 }}>Recent scans</Txt>
      {recent.length === 0 ? (
        <Txt style={{ fontSize: 13.5, color: theme.ink(0.4), paddingVertical: 8 }}>Nothing yet — scan a {lens.subjectWord} to get started.</Txt>
      ) : (
        recent.map((r) => (
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
              <Txt style={{ fontSize: 12, color: theme.ink(0.5) }} numberOfLines={1}>{r.subtitle}</Txt>
            </View>
            <Txt style={{ fontSize: 11, color: theme.ink(0.4) }}>{relativeDay(r.createdAt)}</Txt>
          </Press>
        ))
      )}
    </>
  );
}
