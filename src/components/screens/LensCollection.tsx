import React from 'react';
import { View } from 'react-native';
import { Icon, LENS_ICON, UI } from '../../lib/icons';
import { relativeDay, scansForLens } from '../../lib/scans';
import { useApp } from '../../state/AppContext';
import { Press, Row, Txt } from '../ui';

const titleMap: Record<string, [string, string]> = {
  saved: ['Saved', 'Your saved fruits and vegetables'],
  myplants: ['My Plants', 'Every plant in your collection'],
  collection: ['Collection', 'Your saved rocks and minerals'],
};

export function LensCollection() {
  const { state, lens, theme, openScan, promptDeleteScan } = useApp();
  const [title, sub] = titleMap[state.tab] || ['Saved', ''];
  const items = scansForLens(state.savedScans, lens.id);

  return (
    <>
      <Txt style={{ marginBottom: 4, fontSize: 26, fontWeight: 800, color: theme.ink(), letterSpacing: -0.5 }}>{title}</Txt>
      <Txt style={{ marginBottom: 16, fontSize: 13.5, color: theme.ink(0.55) }}>
        {items.length > 0 ? `${items.length} saved · ${sub}` : sub}
      </Txt>

      {items.length === 0 ? (
        <Txt style={{ fontSize: 13.5, color: theme.ink(0.4), paddingVertical: 10 }}>Nothing saved yet — scan a {lens.subjectWord} to build your collection.</Txt>
      ) : (
        items.map((s) => (
          <Press
            key={s.id}
            haptic={false}
            onPress={() => openScan(s)}
            onLongPress={() => promptDeleteScan(s)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.hair, borderRadius: 18, padding: 13, paddingHorizontal: 14, marginBottom: 10 }}
          >
            <View style={{ width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.soft }}>
              <Icon xml={LENS_ICON[lens.id]} size={24} color={theme.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt style={{ fontSize: 14.5, fontWeight: 700, color: theme.ink() }} numberOfLines={1}>{s.title}</Txt>
              <Txt style={{ fontSize: 12, color: theme.ink(0.5) }} numberOfLines={1}>{s.subtitle}</Txt>
            </View>
            <Row style={{ gap: 8 }}>
              <Txt style={{ fontSize: 11, color: theme.ink(0.4) }}>{relativeDay(s.createdAt)}</Txt>
              <Icon xml={UI.bookmarkFill} size={19} color={theme.accent} />
            </Row>
          </Press>
        ))
      )}
    </>
  );
}
