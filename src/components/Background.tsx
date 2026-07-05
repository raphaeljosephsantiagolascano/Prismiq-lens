import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { useApp } from '../state/AppContext';

/** page background: soft top->bottom wash + two floating glow blobs (SVG radial) */
export function Background() {
  const { theme, lens } = useApp();
  const { width, height } = useWindowDimensions();

  // unique per lens + light/dark so the whole wash crossfades on switch instead of snapping
  const g1 = `g1-${lens.id}-${theme.dark ? 'd' : 'l'}`;
  const g2 = `g2-${lens.id}-${theme.dark ? 'd' : 'l'}`;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View
        key={`${lens.id}-${theme.dark ? 'd' : 'l'}`}
        entering={FadeIn.duration(600)}
        exiting={FadeOut.duration(600)}
        style={StyleSheet.absoluteFill}
      >
        <LinearGradient colors={theme.bgColors} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={StyleSheet.absoluteFill} />
        <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
          <Defs>
            <RadialGradient id={g1} cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor={lens.accent} stopOpacity={theme.dark ? 0.45 : 0.35} />
              <Stop offset="1" stopColor={lens.accent} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id={g2} cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor={lens.accent} stopOpacity={theme.dark ? 0.35 : 0.28} />
              <Stop offset="1" stopColor={lens.accent} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx={width * 0.2} cy={height * 0.12} r={170} fill={`url(#${g1})`} />
          <Circle cx={width * 0.9} cy={height * 0.55} r={190} fill={`url(#${g2})`} />
        </Svg>
      </Animated.View>
    </View>
  );
}
