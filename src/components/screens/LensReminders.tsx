import React from 'react';
import { View } from 'react-native';
import type { LensResult } from '../../config/types';
import { Icon, UI } from '../../lib/icons';
import { scansForLens } from '../../lib/scans';
import { useApp } from '../../state/AppContext';
import { Press, Txt } from '../ui';

const fieldVal = (r: LensResult, label: string) => r.fields.find((f) => f.label.toLowerCase() === label)?.value;

export function LensReminders() {
  const { state, theme, openScan, promptDeleteScan } = useApp();
  const plants = scansForLens(state.savedScans, 'plant');

  return (
    <>
      <Txt style={{ marginBottom: 4, fontSize: 26, fontWeight: 800, color: theme.ink(), letterSpacing: -0.5 }}>Reminders</Txt>
      <Txt style={{ marginBottom: 16, fontSize: 13.5, color: theme.ink(0.55) }}>Care schedule from your saved plants.</Txt>

      {plants.length === 0 ? (
        <Txt style={{ fontSize: 13.5, color: theme.ink(0.4), paddingVertical: 10 }}>Scan a plant to get watering reminders.</Txt>
      ) : (
        plants.map((s) => {
          const water = fieldVal(s.result, 'water') || 'as needed';
          const light = fieldVal(s.result, 'sunlight');
          const note = light ? `Water ${water.toLowerCase()} · ${light.toLowerCase()} light` : `Water ${water.toLowerCase()}`;
          return (
            <Press
              key={s.id}
              haptic={false}
              onPress={() => openScan(s)}
              onLongPress={() => promptDeleteScan(s)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.hair, borderRadius: 18, padding: 14, marginBottom: 11 }}
            >
              <View style={{ width: 48, height: 48, borderRadius: 15, backgroundColor: theme.soft, alignItems: 'center', justifyContent: 'center' }}>
                <Icon xml={UI.bellDrop} size={24} color={theme.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Txt style={{ fontSize: 14.5, fontWeight: 700, color: theme.ink() }} numberOfLines={1}>{s.title}</Txt>
                <Txt style={{ fontSize: 12.5, color: theme.ink(0.55), marginTop: 1 }} numberOfLines={1}>{note}</Txt>
              </View>
              <Txt style={{ fontSize: 12, fontWeight: 600, color: theme.accent, textAlign: 'right' }}>{water}</Txt>
            </Press>
          );
        })
      )}
    </>
  );
}
