import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { View, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { lenses } from '../config/lenses';
import { Icon, LENS_ICON } from '../lib/icons';
import { useApp } from '../state/AppContext';
import { Press, Txt } from './ui';

const SPACING = 128;
const CARD_W = 132;
const CARD_H = 156;
// gentle glide with a touch of overshoot (mirrors the web wheel's cubic-bezier easing)
const WHEEL_SPRING = { damping: 16, stiffness: 140, mass: 0.9 } as const;

/** frosted liquid-glass fill + top specular highlight, shared by both card faces */
function GlassFill({ dark, g1, g2 }: { dark: boolean; g1: string; g2: string }) {
  return (
    <>
      <LinearGradient
        colors={dark ? [g1, g2] : ['rgba(255,255,255,.62)', 'rgba(255,255,255,.34)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <LinearGradient
        colors={['rgba(255,255,255,.9)', 'rgba(255,255,255,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 44 }}
      />
    </>
  );
}

function WheelCard({
  i,
  drag,
  activeSV,
  onTap,
}: {
  i: number;
  drag: SharedValue<number>;
  activeSV: SharedValue<number>;
  onTap: () => void;
}) {
  const { theme } = useApp();
  const m = lenses[i];
  const { state } = useApp();
  const lim = m.dailyLimit || 5;
  const left = lim - Math.min(lim, state.usage[m.id] || 0);

  // strip the alpha off the lens glow so the radial gradient controls its own falloff
  const glowRGB = m.glow.replace(/^rgba?\(/, '').replace(/\)$/, '').split(',').slice(0, 3).map((s) => s.trim()).join(',');
  const glowColor = `rgb(${glowRGB})`;

  // tap the active card to flip it over to the scanner description
  const isActive = state.active === i;
  const [flipped, setFlipped] = useState(false);
  const flip = useSharedValue(0);
  useEffect(() => {
    flip.value = withTiming(flipped ? 1 : 0, { duration: 520, easing: Easing.inOut(Easing.cubic) });
  }, [flipped, flip]);
  // reset to the front whenever this card stops being the active one
  useEffect(() => {
    if (!isActive) setFlipped(false);
  }, [isActive]);

  const handleTap = () => {
    if (isActive) setFlipped((f) => !f);
    else onTap();
  };

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1000 }, { rotateY: `${flip.value * 180}deg` }],
  }));
  const backStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1000 }, { rotateY: `${flip.value * 180 - 180}deg` }],
  }));

  const faceStyle: ViewStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 26,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.dark ? theme.hair : 'rgba(255,255,255,.75)',
    backfaceVisibility: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const cardStyle = useAnimatedStyle(() => {
    const rel = i - activeSV.value + drag.value;
    const a = Math.abs(rel);
    return {
      transform: [
        { perspective: 900 },
        { translateX: rel * SPACING },
        { rotateY: `${Math.max(-42, Math.min(42, rel * -22))}deg` },
        { scale: Math.max(0.5, 1 - a * 0.24) },
      ],
      opacity: Math.max(0.18, 1 - a * 0.42),
      zIndex: Math.round(100 - a * 10),
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    const a = Math.abs(i - activeSV.value + drag.value);
    return { opacity: Math.max(0, Math.min(0.9, 0.9 - a * 2)) };
  });

  const infoStyle = useAnimatedStyle(() => {
    const a = Math.abs(i - activeSV.value + drag.value);
    return { opacity: Math.max(0, Math.min(1, 1 - a * 2)) };
  });

  return (
    <Animated.View
      style={[
        { position: 'absolute', left: '50%', top: '50%', width: CARD_W, height: CARD_H, marginLeft: -CARD_W / 2, marginTop: -CARD_H / 2 },
        cardStyle,
      ]}
    >
      {/* soft radial glow that fades to transparent so it blends into the card instead of framing it */}
      <Animated.View
        pointerEvents="none"
        style={[{ position: 'absolute', top: -34, left: -34, right: -34, bottom: -34 }, glowStyle]}
      >
        <Svg width="100%" height="100%">
          <Defs>
            <RadialGradient id={`glow-${m.id}`} cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0" stopColor={glowColor} stopOpacity={0.5} />
              <Stop offset="0.5" stopColor={glowColor} stopOpacity={0.42} />
              <Stop offset="0.82" stopColor={glowColor} stopOpacity={0.16} />
              <Stop offset="1" stopColor={glowColor} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" rx="46" ry="46" fill={`url(#glow-${m.id})`} />
        </Svg>
      </Animated.View>
      <Press
        onPress={handleTap}
        haptic
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 26,
          // frosted base so the drop shadow still casts, and the card never shows through at 90°
          backgroundColor: theme.dark ? 'rgba(30,33,42,.55)' : 'rgba(255,255,255,.42)',
          shadowColor: '#000',
          shadowOpacity: 0.16,
          shadowRadius: 22,
          shadowOffset: { width: 0, height: 18 },
          elevation: 8,
        }}
      >
        {/* ---- FRONT: icon + lens name ---- */}
        <Animated.View style={[faceStyle, frontStyle]}>
          <GlassFill dark={theme.dark} g1={theme.glass1} g2={theme.glass2} />
          <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <Icon xml={LENS_ICON[m.id]} size={44} color={m.accent} />
            <Txt style={{ marginTop: 12, fontSize: 15, fontWeight: 800, color: theme.ink(), letterSpacing: -0.3 }}>{m.name}</Txt>
            <Txt style={{ marginTop: 4, fontSize: 11, fontWeight: 600, color: theme.ink(0.5) }}>{m.shortName}</Txt>
            <Animated.View style={infoStyle}>
              <Txt style={{ marginTop: 5, fontSize: 10, fontWeight: 700, color: m.accent }}>{left} scans left</Txt>
            </Animated.View>
          </View>
        </Animated.View>

        {/* ---- BACK: scanner description on the lens's brand gradient ---- */}
        <Animated.View style={[faceStyle, backStyle, { paddingHorizontal: 18, borderColor: 'rgba(255,255,255,.35)' }]}>
          <LinearGradient
            colors={m.btnColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          {/* top sheen so the coloured face keeps the glass feel */}
          <LinearGradient
            colors={['rgba(255,255,255,.28)', 'rgba(255,255,255,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 52 }}
          />
          <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <Txt style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.6, color: 'rgba(255,255,255,.85)', textTransform: 'uppercase', marginBottom: 9 }}>
              {m.name}
            </Txt>
            <Txt style={{ fontSize: 12.5, lineHeight: 18, fontWeight: 600, color: '#fff', textAlign: 'center' }}>
              {m.description}
            </Txt>
          </View>
        </Animated.View>
      </Press>
    </Animated.View>
  );
}

export function LensWheel() {
  const { state, switchMode } = useApp();
  const drag = useSharedValue(0);
  const activeSV = useSharedValue(state.active);

  // spring the active index so lens switches glide (dots, card taps, swipe release)
  useEffect(() => {
    activeSV.value = withSpring(state.active, WHEEL_SPRING);
  }, [state.active, activeSV]);

  const commit = (n: number) => {
    activeSV.value = withSpring(n, WHEEL_SPRING);
    drag.value = withSpring(0, WHEEL_SPRING);
    switchMode(n);
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-14, 14])
    .onUpdate((e) => {
      drag.value = e.translationX / SPACING;
    })
    .onEnd(() => {
      const n = Math.max(0, Math.min(lenses.length - 1, Math.round(activeSV.value - drag.value)));
      runOnJS(commit)(n);
    });

  return (
    <GestureDetector gesture={pan}>
      <View style={{ height: 204, marginBottom: 4 }} collapsable={false}>
        {lenses.map((_, i) => (
          <WheelCard key={lenses[i].id} i={i} drag={drag} activeSV={activeSV} onTap={() => switchMode(i)} />
        ))}
      </View>
    </GestureDetector>
  );
}

export function LensDots() {
  const { state, switchMode, theme } = useApp();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 2, marginBottom: 18 }}>
      {lenses.map((m, i) => (
        <Press key={m.id} haptic={false} onPress={() => switchMode(i)} style={{ paddingVertical: 6 }}>
          <View
            style={{
              height: 7,
              borderRadius: 99,
              backgroundColor: i === state.active ? m.accent : theme.ink(0.2),
              width: i === state.active ? 22 : 7,
            }}
          />
        </Press>
      ))}
    </View>
  );
}
