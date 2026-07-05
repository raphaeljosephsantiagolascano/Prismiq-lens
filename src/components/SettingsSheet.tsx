import React from 'react';
import { Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { lenses } from '../config/lenses';
import { Icon, UI } from '../lib/icons';
import { useApp } from '../state/AppContext';
import { Bar, GlassCard } from './Shared';
import { Press, Row, Txt } from './ui';

export function SettingsSheet() {
  const { state, theme, closeSettings, toggleDark } = useApp();
  const insets = useSafeAreaInsets();

  const usageRows = lenses.map((md) => {
    const limit = md.dailyLimit || 5;
    const used = Math.min(limit, state.usage[md.id] || 0);
    return { name: md.shortName, accent: md.accent, used, limit };
  });
  const tokUsed = usageRows.reduce((a, r) => a + r.used, 0);
  const tokTotal = usageRows.reduce((a, r) => a + r.limit, 0);
  const tokPct = Math.round((tokUsed / tokTotal) * 100);
  const dark = state.dark;

  return (
    <Modal transparent animationType="slide" onRequestClose={closeSettings} statusBarTranslucent>
      <Pressable onPress={closeSettings} style={{ flex: 1, backgroundColor: 'rgba(6,8,12,.5)' }} />
      <View style={{ backgroundColor: theme.surface, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 20, paddingTop: 22, paddingBottom: 30 + insets.bottom }}>
        <View style={{ width: 38, height: 5, borderRadius: 99, backgroundColor: theme.ink(0.18), alignSelf: 'center', marginBottom: 16 }} />
        <Row style={{ justifyContent: 'space-between', marginBottom: 18 }}>
          <Txt style={{ fontSize: 21, fontWeight: 800, color: theme.ink(), letterSpacing: -0.4 }}>Settings</Txt>
          <Press onPress={closeSettings} style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: theme.tint, alignItems: 'center', justifyContent: 'center' }}>
            <Icon xml={UI.close} size={17} color={theme.ink()} />
          </Press>
        </Row>

        {/* token usage */}
        <GlassCard style={{ padding: 18, borderRadius: 22, marginBottom: 14 }}>
          <Row style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <Txt style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.4, color: theme.ink(0.5) }}>SCAN TOKENS</Txt>
            <Txt style={{ fontSize: 12.5, fontWeight: 700, color: theme.ink(0.5) }}>{tokTotal - tokUsed} scans left today</Txt>
          </Row>
          <Row style={{ alignItems: 'flex-end', gap: 6, marginTop: 6, marginBottom: 12 }}>
            <Txt style={{ fontSize: 34, fontWeight: 800, color: theme.ink(), lineHeight: 36 }}>{tokUsed}</Txt>
            <Txt style={{ fontSize: 15, fontWeight: 600, color: theme.ink(0.42) }}>/ {tokTotal} used today</Txt>
          </Row>
          <View style={{ marginBottom: 16 }}>
            <Bar pct={tokPct} height={9} track={theme.ink(0.1)} />
          </View>
          {usageRows.map((u) => (
            <Row key={u.name} style={{ gap: 11, marginBottom: 11 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: u.accent }} />
              <Txt style={{ width: 66, fontSize: 13, fontWeight: 700, color: theme.ink() }}>{u.name}</Txt>
              <View style={{ flex: 1, height: 6, borderRadius: 99, backgroundColor: theme.ink(0.1), overflow: 'hidden' }}>
                <View style={{ height: '100%', borderRadius: 99, width: `${Math.round((u.used / u.limit) * 100)}%`, backgroundColor: u.accent }} />
              </View>
              <Txt style={{ fontSize: 12, fontWeight: 700, color: theme.ink(0.5) }}>{u.used} / {u.limit}</Txt>
            </Row>
          ))}
        </GlassCard>

        {/* dark mode */}
        <Press onPress={toggleDark} haptic={false} style={{ flexDirection: 'row', alignItems: 'center', gap: 13, borderRadius: 20, padding: 15, paddingHorizontal: 16, backgroundColor: theme.tint, borderWidth: 1, borderColor: theme.hair }}>
          <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: theme.soft, alignItems: 'center', justifyContent: 'center' }}>
            <Icon xml={UI.moon} size={19} color={theme.ink()} />
          </View>
          <View style={{ flex: 1 }}>
            <Txt style={{ fontSize: 14.5, fontWeight: 700, color: theme.ink() }}>Dark mode</Txt>
            <Txt style={{ fontSize: 12, color: theme.ink(0.5) }}>{dark ? 'On · easier on the eyes' : 'Off · bright theme'}</Txt>
          </View>
          <View style={{ width: 50, height: 30, borderRadius: 99, padding: 3, backgroundColor: dark ? theme.accent : theme.ink(0.18), alignItems: dark ? 'flex-end' : 'flex-start' }}>
            <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff' }} />
          </View>
        </Press>
      </View>
    </Modal>
  );
}
