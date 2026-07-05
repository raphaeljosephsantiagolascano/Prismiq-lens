import React, { useState } from 'react';
import { View, type ViewStyle } from 'react-native';
import { Icon, LENS_ICON, UI } from '../../lib/icons';
import { scansForLens, type SavedScan } from '../../lib/scans';
import { useApp } from '../../state/AppContext';
import { Press, Row, Txt } from '../ui';

export function LensCompare() {
  const { state, lens, theme } = useApp();
  const stones = scansForLens(state.savedScans, 'rock');
  // default to the two most recent stones (computed once on mount)
  const [aId, setAId] = useState<string | null>(() => stones[0]?.id ?? null);
  const [bId, setBId] = useState<string | null>(() => stones[1]?.id ?? null);

  const a = stones.find((s) => s.id === aId) ?? null;
  const b = stones.find((s) => s.id === bId) ?? null;

  const select = (s: SavedScan) => {
    if (aId === s.id) return setAId(null);
    if (bId === s.id) return setBId(null);
    if (!a) return setAId(s.id);
    if (!b) return setBId(s.id);
    setBId(s.id); // both full → replace the second slot
  };

  const labels = [...new Set([...(a?.result.fields ?? []), ...(b?.result.fields ?? [])].map((f) => f.label))];
  const valueFor = (scan: SavedScan | null, label: string) => scan?.result.fields.find((f) => f.label === label)?.value ?? '—';

  const slotStyle: ViewStyle = { flex: 1, borderRadius: 20, borderWidth: 1.5, borderStyle: 'dashed', borderColor: theme.ink(0.18), backgroundColor: theme.tint, paddingVertical: 22, paddingHorizontal: 14, alignItems: 'center', gap: 8, justifyContent: 'center' };

  const slot = (scan: SavedScan | null) =>
    scan ? (
      <View style={[slotStyle, { borderStyle: 'solid', borderColor: theme.hair }]}>
        <View style={{ width: 48, height: 48, borderRadius: 15, backgroundColor: theme.panel, alignItems: 'center', justifyContent: 'center' }}>
          <Icon xml={LENS_ICON[lens.id]} size={26} color={theme.accent} />
        </View>
        <Txt style={{ fontSize: 13, fontWeight: 700, color: theme.ink(), textAlign: 'center' }} numberOfLines={2}>{scan.title}</Txt>
        <Txt style={{ fontSize: 11.5, color: theme.ink(0.5) }}>{scan.result.confidence}% match</Txt>
      </View>
    ) : (
      <View style={slotStyle}>
        <View style={{ width: 48, height: 48, borderRadius: 15, backgroundColor: theme.panel, alignItems: 'center', justifyContent: 'center' }}>
          <Icon xml={UI.plus} size={24} color={theme.ink(0.3)} />
        </View>
        <Txt style={{ fontSize: 13, fontWeight: 700, color: theme.ink(0.45) }}>Add a stone</Txt>
      </View>
    );

  return (
    <>
      <Txt style={{ marginBottom: 4, fontSize: 26, fontWeight: 800, color: theme.ink(), letterSpacing: -0.5 }}>Compare</Txt>
      <Txt style={{ marginBottom: 18, fontSize: 13.5, color: theme.ink(0.55) }}>Pick two saved stones to compare side by side.</Txt>

      {stones.length === 0 ? (
        <Txt style={{ fontSize: 13.5, color: theme.ink(0.4), paddingVertical: 10 }}>Scan and save some stones first, then compare them here.</Txt>
      ) : (
        <>
          <Row style={{ gap: 12, alignItems: 'stretch', marginBottom: 16 }}>
            {slot(a)}
            <View style={{ alignSelf: 'center' }}>
              <Txt style={{ fontSize: 13, fontWeight: 800, color: theme.ink(0.4) }}>VS</Txt>
            </View>
            {slot(b)}
          </Row>

          {a && b ? (
            labels.map((label) => (
              <Row key={label} style={{ justifyContent: 'space-between', backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.hair, borderRadius: 15, paddingVertical: 13, paddingHorizontal: 16, marginBottom: 9 }}>
                <Txt style={{ flex: 1, fontSize: 13, fontWeight: 700, color: theme.ink() }} numberOfLines={1}>{valueFor(a, label)}</Txt>
                <Txt style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: 0.5, color: theme.ink(0.4) }}>{label.toUpperCase()}</Txt>
                <Txt style={{ flex: 1, fontSize: 13, fontWeight: 600, color: theme.ink(0.55), textAlign: 'right' }} numberOfLines={1}>{valueFor(b, label)}</Txt>
              </Row>
            ))
          ) : (
            <Txt style={{ fontSize: 12.5, color: theme.ink(0.4), textAlign: 'center', paddingVertical: 8, marginBottom: 8 }}>Tap two stones below to compare them.</Txt>
          )}

          <Txt style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, color: theme.ink(0.42), marginTop: 8, marginBottom: 10, marginLeft: 2 }}>YOUR STONES</Txt>
          {stones.map((s) => {
            const on = s.id === aId || s.id === bId;
            return (
              <Press
                key={s.id}
                haptic={false}
                onPress={() => select(s)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: on ? theme.soft : theme.surface, borderWidth: 1, borderColor: on ? theme.accent : theme.hair, borderRadius: 16, padding: 12, paddingHorizontal: 14, marginBottom: 9 }}
              >
                <View style={{ width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.panel }}>
                  <Icon xml={LENS_ICON[lens.id]} size={21} color={theme.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Txt style={{ fontSize: 14, fontWeight: 700, color: theme.ink() }} numberOfLines={1}>{s.title}</Txt>
                  <Txt style={{ fontSize: 12, color: theme.ink(0.5) }} numberOfLines={1}>{s.subtitle}</Txt>
                </View>
                {on && <Icon xml={UI.check} size={18} color={theme.accent} />}
              </Press>
            );
          })}
        </>
      )}
    </>
  );
}
