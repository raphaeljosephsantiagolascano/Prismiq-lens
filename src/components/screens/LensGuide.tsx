import React from 'react';
import { View } from 'react-native';
import { Icon, UI } from '../../lib/icons';
import { useApp } from '../../state/AppContext';
import { DisclaimerBanner } from '../Shared';
import { Row, Txt } from '../ui';

const guideSubMap: Record<string, string> = {
  fresh: 'Storage, ripeness and how to use produce.',
  plant: 'Watering, light and plant safety.',
  rock: 'Field tests and identification basics.',
};

export function LensGuide() {
  const { lens, theme } = useApp();
  const cards = lens.content?.guide || [];

  return (
    <>
      <Txt style={{ marginBottom: 4, fontSize: 26, fontWeight: 800, color: theme.ink(), letterSpacing: -0.5 }}>Guide</Txt>
      <Txt style={{ marginBottom: 16, fontSize: 13.5, color: theme.ink(0.55) }}>{guideSubMap[lens.id] || ''}</Txt>
      {cards.map((g, i) => (
        <Row key={i} style={{ gap: 14, alignItems: 'flex-start', backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.hair, borderRadius: 18, padding: 15, paddingHorizontal: 16, marginBottom: 11 }}>
          <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: theme.soft, alignItems: 'center', justifyContent: 'center' }}>
            <Icon xml={UI.book} size={22} color={theme.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Txt style={{ fontSize: 14.5, fontWeight: 700, color: theme.ink() }}>{g.title}</Txt>
            <Txt style={{ fontSize: 12.5, lineHeight: 19, color: theme.ink(0.58), marginTop: 2 }}>{g.body}</Txt>
          </View>
          <Icon xml={UI.chevronRightSm} size={18} color={theme.ink(0.3)} style={{ marginTop: 12 }} />
        </Row>
      ))}
      <DisclaimerBanner text={lens.disclaimer} style={{ marginTop: 6 }} />
    </>
  );
}
