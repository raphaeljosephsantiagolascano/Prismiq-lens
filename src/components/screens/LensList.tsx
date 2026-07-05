import React from 'react';
import { View } from 'react-native';
import { Icon, LENS_ICON } from '../../lib/icons';
import { relativeDay, scansForLens } from '../../lib/scans';
import { useApp } from '../../state/AppContext';
import { Press, Row, Txt } from '../ui';

export function LensList() {
  const { state, lens, theme, openScan, promptDeleteScan } = useApp();
  const sub = lens.id === 'plate' ? 'Every meal you have scanned' : `${lens.subjectWord[0].toUpperCase()}${lens.subjectWord.slice(1)} you have scanned`;
  const list = scansForLens(state.savedScans, lens.id);

  return (
    <>
      <Txt style={{ marginBottom: 4, fontSize: 26, fontWeight: 800, color: theme.ink(), letterSpacing: -0.5 }}>History</Txt>
      <Txt style={{ marginBottom: 16, fontSize: 13.5, color: theme.ink(0.55) }}>{sub}</Txt>
      {list.length === 0 ? (
        <Txt style={{ fontSize: 13.5, color: theme.ink(0.4), paddingVertical: 10 }}>Nothing saved yet — scan a {lens.subjectWord} to get started.</Txt>
      ) : (
        list.map((r) => (
          <Press
            key={r.id}
            haptic={false}
            onPress={() => openScan(r)}
            onLongPress={() => promptDeleteScan(r)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.hair, borderRadius: 18, padding: 12, paddingHorizontal: 14, marginBottom: 10 }}
          >
            <View style={{ width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.soft }}>
              <Icon xml={LENS_ICON[lens.id]} size={24} color={theme.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt style={{ fontSize: 14.5, fontWeight: 700, color: theme.ink() }} numberOfLines={1}>{r.title}</Txt>
              <Txt style={{ fontSize: 12, color: theme.ink(0.5) }} numberOfLines={1}>{r.subtitle}</Txt>
            </View>
            <Txt style={{ fontSize: 11, color: theme.ink(0.4) }}>{relativeDay(r.createdAt)}</Txt>
          </Press>
        ))
      )}
    </>
  );
}
