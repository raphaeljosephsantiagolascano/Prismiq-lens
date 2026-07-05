import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform, Pressable, StyleSheet, type StyleProp, Text, type TextProps, View, type ViewStyle } from 'react-native';

// ---- fonts: map numeric weights to the loaded Inter Tight families ----
const FONT: Record<number, string> = {
  400: 'InterTight_400Regular',
  500: 'InterTight_500Medium',
  600: 'InterTight_600SemiBold',
  700: 'InterTight_700Bold',
  800: 'InterTight_800ExtraBold',
};
export const font = (w: number = 400) => FONT[w] || FONT[400];

/** Text that resolves fontWeight -> the correct Inter Tight family. */
export function Txt({ style, ...rest }: TextProps) {
  const flat = StyleSheet.flatten(style) || {};
  const w = Number((flat as { fontWeight?: number | string }).fontWeight) || 400;
  const cleaned = { ...(flat as object) } as Record<string, unknown>;
  delete cleaned.fontWeight;
  return <Text {...rest} style={[{ fontFamily: font(w) }, cleaned]} />;
}

/** Pressable that scales to .94 while pressed (mirrors .press:active). */
export function Press({
  onPress,
  onLongPress,
  style,
  children,
  haptic = true,
  disabled,
}: {
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  haptic?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={() => {
        if (haptic && Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
        onPress?.();
      }}
      onLongPress={
        onLongPress
          ? () => {
              if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
              onLongPress();
            }
          : undefined
      }
      style={({ pressed }) => [style, pressed && !disabled ? { transform: [{ scale: 0.94 }] } : null]}
    >
      {children}
    </Pressable>
  );
}

/** Solid gradient button (the primary CTA style). */
export function GradientBtn({
  colors,
  onPress,
  children,
  style,
  glow,
  disabled,
}: {
  colors: [string, string];
  onPress?: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
  glow?: string;
  disabled?: boolean;
}) {
  return (
    <Press
      onPress={onPress}
      disabled={disabled}
      style={[
        disabled ? { opacity: 0.7 } : {},
        glow ? { shadowColor: glow, shadowOpacity: 0.5, shadowRadius: 16, shadowOffset: { width: 0, height: 12 }, elevation: 6 } : {},
        style || {},
      ]}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: (style?.borderRadius as number) ?? 18, alignItems: 'center', justifyContent: 'center' }}
      >
        {children}
      </LinearGradient>
    </Press>
  );
}

/** soft shadow preset shared by glass cards */
export function cardShadow(glow: string, strong = false): ViewStyle {
  return {
    shadowColor: glow,
    shadowOpacity: strong ? 0.4 : 0.2,
    shadowRadius: strong ? 24 : 14,
    shadowOffset: { width: 0, height: strong ? 18 : 10 },
    elevation: strong ? 8 : 4,
  };
}

export function Row({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>{children}</View>;
}
