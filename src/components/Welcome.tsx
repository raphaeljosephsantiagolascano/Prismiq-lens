import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { lenses } from '../config/lenses';
import { Icon, LENS_ICON } from '../lib/icons';
import { useApp } from '../state/AppContext';
import { GradientBtn, Press, Row, Txt } from './ui';

export function Welcome() {
  const { lens, theme, dismissWelcome } = useApp();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingBottom: insets.bottom }}>
      <View
        style={{
          width: 104,
          height: 104,
          borderRadius: 30,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.tint,
          borderWidth: 1,
          borderColor: theme.hair,
          marginBottom: 26,
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 30,
          shadowOffset: { width: 0, height: 18 },
          elevation: 6,
        }}
      >
        <Icon xml={LENS_ICON[lens.id]} size={56} color={theme.accent} />
      </View>

      <Txt style={{ fontSize: 14, fontWeight: 600, letterSpacing: 3, color: theme.accent, marginBottom: 10 }}>
        PRISMIQ · AI SCANNER SUITE
      </Txt>
      <Txt style={{ fontSize: 38, lineHeight: 41, fontWeight: 800, color: theme.ink(), letterSpacing: -1, textAlign: 'center' }}>
        One camera.{'\n'}Multiple lenses.
      </Txt>
      <Txt style={{ marginTop: 16, fontSize: 16, lineHeight: 24, color: theme.ink(0.62), maxWidth: 280, textAlign: 'center' }}>
        Four intelligent lenses — meals, produce, plants and stones — in one premium scanner.
      </Txt>

      <Row style={{ gap: 9, marginTop: 30, marginBottom: 34 }}>
        {lenses.map((m) => (
          <View
            key={m.id}
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.panel,
              borderWidth: 1,
              borderColor: theme.hair,
            }}
          >
            <Icon xml={LENS_ICON[m.id]} size={22} color={m.accent} />
          </View>
        ))}
      </Row>

      <GradientBtn colors={theme.btnColors} glow={theme.glow} onPress={dismissWelcome} style={{ width: '100%', maxWidth: 300, borderRadius: 20 }}>
        <Txt style={{ paddingVertical: 18, fontSize: 17, fontWeight: 700, color: '#fff' }}>Get Started</Txt>
      </GradientBtn>

      <Txt style={{ marginTop: 18, fontSize: 12, color: theme.ink(0.4), textAlign: 'center' }}>
        AI-generated estimates · verify important results
      </Txt>
    </View>
  );
}
