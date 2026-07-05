import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { Icon, UI } from '../lib/icons';
import { useApp } from '../state/AppContext';
import { cardShadow, Press, Row, Txt } from './ui';

/** frosted "liquid glass" card (glass1 -> glass2 gradient) */
export function GlassCard({ children, style, strong }: { children: React.ReactNode; style?: ViewStyle; strong?: boolean }) {
  const { theme } = useApp();
  return (
    <LinearGradient
      colors={[theme.glass1, theme.glass2]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ borderRadius: 24, borderWidth: 1, borderColor: theme.hair, overflow: 'hidden' }, cardShadow(theme.glow, strong), style]}
    >
      {children}
    </LinearGradient>
  );
}

/** thin accent progress bar (fill uses the lens gradient) */
export function Bar({ pct, height = 6, track }: { pct: number; height?: number; track?: string }) {
  const { theme } = useApp();
  return (
    <View style={{ height, borderRadius: 99, backgroundColor: track ?? theme.ink(0.09), overflow: 'hidden' }}>
      <LinearGradient
        colors={theme.btnColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ height: '100%', borderRadius: 99, width: `${Math.max(0, Math.min(100, pct))}%` }}
      />
    </View>
  );
}

export function UsageCard({ style }: { style?: ViewStyle }) {
  const { state, lens, theme } = useApp();
  const lim = lens.dailyLimit || 5;
  const used = Math.min(lim, state.usage[lens.id] || 0);
  const left = lim - used;
  const pct = Math.round((left / lim) * 100);

  return (
    <Row
      style={{
        gap: 13,
        backgroundColor: theme.tint,
        borderWidth: 1,
        borderColor: theme.hair,
        borderRadius: 18,
        padding: 12,
        paddingHorizontal: 15,
        marginBottom: 14,
        ...style,
      }}
    >
      <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: theme.soft, alignItems: 'center', justifyContent: 'center' }}>
        <Icon xml={UI.clockFrame} size={19} color={theme.accent} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Row style={{ justifyContent: 'space-between', marginBottom: 6 }}>
          <Txt style={{ fontSize: 13.5, fontWeight: 700, color: theme.ink() }}>
            {left} of {lim} scans left today
          </Txt>
          <Txt style={{ fontSize: 11, fontWeight: 600, color: theme.ink(0.42) }}>Resets tomorrow</Txt>
        </Row>
        <Bar pct={pct} />
      </View>
    </Row>
  );
}

export function DisclaimerBanner({ text, style }: { text: string; style?: ViewStyle }) {
  const { theme } = useApp();
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 10,
        alignItems: 'flex-start',
        backgroundColor: theme.soft,
        borderWidth: 1,
        borderColor: theme.hair,
        borderRadius: 16,
        padding: 13,
        paddingHorizontal: 15,
        ...style,
      }}
    >
      <Icon xml={UI.infoDown} size={18} color={theme.accent} style={{ marginTop: 1 }} />
      <Txt style={{ flex: 1, fontSize: 12, lineHeight: 18, color: theme.ink(0.6) }}>{text}</Txt>
    </View>
  );
}

export function HomeHeader() {
  const { openSettings, theme } = useApp();
  return (
    <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
      <View>
        <Txt style={{ fontSize: 24, fontWeight: 800, color: theme.ink(), letterSpacing: -0.5 }}>Prismiq</Txt>
        <Txt style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 2, color: theme.ink(0.4), marginTop: 2 }}>
          AI SCANNER SUITE
        </Txt>
      </View>
      <Press
        onPress={openSettings}
        style={{
          width: 44,
          height: 44,
          borderRadius: 15,
          backgroundColor: theme.tint,
          borderWidth: 1,
          borderColor: theme.hair,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Txt style={{ fontWeight: 700, fontSize: 15, color: theme.accent }}>A</Txt>
        <LinearGradient
          colors={theme.btnColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ position: 'absolute', right: -3, bottom: -3, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon xml={UI.gear} size={11} color="#fff" />
        </LinearGradient>
      </Press>
    </Row>
  );
}

export function LensHeroTitle() {
  const { lens, theme } = useApp();
  return (
    <View style={{ alignItems: 'center', marginBottom: 20 }}>
      <Txt style={{ fontSize: 25, fontWeight: 800, color: theme.ink(), letterSpacing: -0.6, textAlign: 'center' }}>
        {lens.tagline}
      </Txt>
      {/* the description now lives on the card back — surface the flip so it's discoverable */}
      <Row style={{ marginTop: 12, gap: 6, backgroundColor: theme.soft, borderWidth: 1, borderColor: theme.hair, borderRadius: 99, paddingVertical: 7, paddingHorizontal: 13 }}>
        <Icon xml={UI.historyRotate} size={13} color={theme.accent} />
        <Txt style={{ fontSize: 12, fontWeight: 600, color: theme.ink(0.6) }}>
          Tap the card for details
        </Txt>
      </Row>
    </View>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  const { theme } = useApp();
  return (
    <Txt style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, color: theme.ink(0.42), marginHorizontal: 2, marginBottom: 10 }}>
      {typeof children === 'string' ? children.toUpperCase() : children}
    </Txt>
  );
}

export function ScreenTitle({ children }: { children: React.ReactNode }) {
  const { theme } = useApp();
  return (
    <Txt style={{ marginBottom: 14, fontSize: 26, fontWeight: 800, color: theme.ink(), letterSpacing: -0.5 }}>{children}</Txt>
  );
}
