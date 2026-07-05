import React from 'react';
import { TextInput, View } from 'react-native';
import { Icon, LENS_ICON, UI } from '../../lib/icons';
import { relativeDay, scansForLens } from '../../lib/scans';
import { useApp } from '../../state/AppContext';
import { ScreenTitle } from '../Shared';
import { Press, Row, Txt } from '../ui';

export function PlateHistory() {
  const { state, lens, theme, setQuery, openScan, promptDeleteScan } = useApp();
  const q = state.query.trim().toLowerCase();
  const list = scansForLens(state.savedScans, 'plate').filter((h) => q === '' || h.title.toLowerCase().includes(q));

  return (
    <>
      <ScreenTitle>History</ScreenTitle>
      <Row style={{ gap: 9, backgroundColor: theme.tint, borderWidth: 1, borderColor: theme.hair, borderRadius: 15, paddingVertical: 11, paddingHorizontal: 14, marginBottom: 14 }}>
        <Icon xml={UI.search} size={17} color={theme.ink(0.4)} />
        <TextInput
          value={state.query}
          onChangeText={setQuery}
          placeholder="Search meals"
          placeholderTextColor={theme.ink(0.4)}
          style={{ flex: 1, fontFamily: 'InterTight_400Regular', fontSize: 14, color: theme.ink(), padding: 0 }}
        />
      </Row>
      {list.length === 0 ? (
        <Txt style={{ fontSize: 13.5, color: theme.ink(0.4), paddingVertical: 10 }}>
          {state.savedScans.some((s) => s.lensId === 'plate') ? 'No meals match your search.' : 'No saved meals yet.'}
        </Txt>
      ) : (
        <>
          <Txt style={{ fontSize: 11.5, color: theme.ink(0.38), marginBottom: 10, marginLeft: 2 }}>Tap to view · long-press to delete</Txt>
          {list.map((h) => (
            <Press
            key={h.id}
            haptic={false}
            onPress={() => openScan(h)}
            onLongPress={() => promptDeleteScan(h)}
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
              <Txt style={{ fontSize: 14.5, fontWeight: 700, color: theme.ink() }} numberOfLines={1}>{h.title}</Txt>
              <Txt style={{ fontSize: 12, color: theme.ink(0.5) }} numberOfLines={1}>{h.subtitle}</Txt>
            </View>
            <Row style={{ gap: 8 }}>
              <View style={{ alignItems: 'flex-end' }}>
                <Txt style={{ fontSize: 14, fontWeight: 800, color: theme.ink() }}>{h.macros?.cal ?? 0}</Txt>
                <Txt style={{ fontSize: 11, color: theme.ink(0.4) }}>{relativeDay(h.createdAt)}</Txt>
              </View>
              <Icon xml={UI.chevronRightSm} size={16} color={theme.ink(0.3)} />
            </Row>
            </Press>
          ))}
        </>
      )}
    </>
  );
}
