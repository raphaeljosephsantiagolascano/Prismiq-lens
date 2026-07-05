import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Alert, Image, View, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { macroColor } from '../../config/lenses';
import type { CapturedImage } from '../../lib/analyze';
import { hexA } from '../../lib/color';
import { Icon, LENS_ICON, UI } from '../../lib/icons';
import { pickFromLibrary } from '../../lib/media';
import { useApp } from '../../state/AppContext';
import { CameraCapture } from '../CameraCapture';
import { DisclaimerBanner, UsageCard } from '../Shared';
import { GradientBtn, Press, Row, Txt } from '../ui';

function Spinner({ color, track }: { color: string; track: string }) {
  const rot = useSharedValue(0);
  useEffect(() => {
    rot.value = withRepeat(withTiming(360, { duration: 900, easing: Easing.linear }), -1);
  }, [rot]);
  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${rot.value}deg` }] }));
  return (
    <Animated.View style={[{ width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: track, borderTopColor: color }, style]} />
  );
}

function BadgeBubble({
  value,
  label,
  color,
  tint,
  size,
  fs,
  delayMs,
  pos,
  glow,
}: {
  value: string;
  label: string;
  color: string;
  tint: string;
  size: number;
  fs: number;
  delayMs: number;
  pos: ViewStyle;
  glow: string;
}) {
  const bob = useSharedValue(0);
  useEffect(() => {
    bob.value = withRepeat(withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, [bob]);
  const bobStyle = useAnimatedStyle(() => ({ transform: [{ translateY: bob.value * -5 }] }));

  return (
    <Animated.View entering={FadeIn.delay(delayMs).duration(700)} style={[{ position: 'absolute' }, pos]}>
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: tint,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,.65)',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 6,
            shadowColor: glow,
            shadowOpacity: 0.6,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 8 },
            elevation: 6,
          },
          bobStyle,
        ]}
      >
        <Txt style={{ fontSize: fs, fontWeight: 800, color, lineHeight: fs + 1 }}>{value}</Txt>
        <Txt style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.3, color, marginTop: 2 }}>{label.toUpperCase()}</Txt>
      </Animated.View>
    </Animated.View>
  );
}

function Sweep() {
  const x = useSharedValue(-1);
  useEffect(() => {
    x.value = withRepeat(withTiming(1, { duration: 1700, easing: Easing.linear }), -1);
  }, [x]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: `${x.value * 120}%` }, { rotate: '18deg' }] }));
  return (
    <Animated.View pointerEvents="none" style={[{ position: 'absolute', top: -40, bottom: -40, width: '55%' }, style]}>
      <LinearGradient
        colors={['transparent', 'rgba(255,255,255,.4)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ flex: 1 }}
      />
    </Animated.View>
  );
}

const POSITIONS: ViewStyle[] = [
  { top: '12%', alignSelf: 'center' },
  { top: '44%', left: '10%' },
  { bottom: '17%', right: '10%' },
];

export function ScanScreen() {
  const { state, lens, theme, analyze, setState } = useApp();
  const lim = lens.dailyLimit || 5;
  const left = lim - Math.min(lim, state.usage[lens.id] || 0);

  const [pending, setPending] = useState<CapturedImage | null>(null);
  const [camOpen, setCamOpen] = useState(false);

  const onUpload = async () => {
    try {
      setState({ scanError: null });
      const img = await pickFromLibrary();
      if (img) setPending(img);
    } catch (e) {
      Alert.alert('Upload', e instanceof Error ? e.message : 'Could not open the photo library.');
    }
  };

  const onCameraCapture = (img: CapturedImage) => {
    setCamOpen(false);
    setPending(img);
  };

  const onAnalyze = () => {
    if (state.scanning) return;
    if (pending) analyze(pending);
    else onUpload(); // nothing picked yet — open the library so the button still does something
  };

  const badges = (lens.result.fields || []).slice(0, 3).map((f, i) => {
    const c = macroColor[f.label] || lens.accent;
    return { value: f.value, label: f.label, color: c, tint: hexA(c, 0.22), size: i === 0 ? 92 : 70, fs: i === 0 ? 17 : 14, delay: 500 + i * 550 };
  });

  const corner = (s: ViewStyle) => (
    <View style={[{ position: 'absolute', width: 26, height: 26, borderColor: theme.accent }, s]} />
  );

  const scanBtnStyle: ViewStyle = { flex: 1, backgroundColor: theme.tint, borderWidth: 1, borderColor: theme.hair, borderRadius: 16 };

  return (
    <>
      <View style={{ alignItems: 'center', marginBottom: 18 }}>
        <Txt style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2, color: theme.accent }}>{lens.name.toUpperCase()}</Txt>
        <Txt style={{ marginTop: 5, fontSize: 24, fontWeight: 800, color: theme.ink() }}>{lens.cta}</Txt>
        <Txt style={{ marginTop: 4, maxWidth: 280, fontSize: 13.5, lineHeight: 20, color: theme.ink(0.55), textAlign: 'center' }}>{lens.scanInstruction}</Txt>
      </View>

      <UsageCard />

      <View
        style={{
          aspectRatio: 3 / 3.4,
          borderRadius: 28,
          overflow: 'hidden',
          backgroundColor: theme.tint,
          borderWidth: 1,
          borderColor: theme.hair,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        {state.scanning ? (
          <>
            <Sweep />
            {badges.map((b, i) => (
              <BadgeBubble
                key={i}
                value={b.value}
                label={b.label}
                color={b.color}
                tint={b.tint}
                size={b.size}
                fs={b.fs}
                delayMs={b.delay}
                pos={POSITIONS[i]}
                glow={lens.glow}
              />
            ))}
            <Row style={{ position: 'absolute', bottom: 16, gap: 8 }}>
              <Spinner color={theme.accent} track={theme.ink(0.15)} />
              <Txt style={{ fontSize: 13, fontWeight: 700, color: theme.ink() }}>Analyzing…</Txt>
            </Row>
          </>
        ) : pending ? (
          <>
            <Image source={{ uri: pending.uri }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} resizeMode="cover" />
            <Press onPress={() => setPending(null)} style={{ position: 'absolute', top: 14, right: 14, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 99, backgroundColor: 'rgba(0,0,0,.5)' }}>
              <Txt style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Retake</Txt>
            </Press>
          </>
        ) : (
          <View style={{ alignItems: 'center', paddingHorizontal: 30 }}>
            <View style={{ width: 70, height: 70, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.panel, marginBottom: 16 }}>
              <Icon xml={LENS_ICON[lens.id]} size={36} color={theme.accent} />
            </View>
            <Txt style={{ fontSize: 15, fontWeight: 700, color: theme.ink() }}>Point at your {lens.subjectWord}</Txt>
            <Txt style={{ fontSize: 12.5, color: theme.ink(0.5), marginTop: 4, textAlign: 'center' }}>Fill the frame · good lighting · steady hands</Txt>
          </View>
        )}
        {corner({ top: 16, left: 16, borderLeftWidth: 2.5, borderTopWidth: 2.5, borderTopLeftRadius: 6 })}
        {corner({ top: 16, right: 16, borderRightWidth: 2.5, borderTopWidth: 2.5, borderTopRightRadius: 6 })}
        {corner({ bottom: 16, left: 16, borderLeftWidth: 2.5, borderBottomWidth: 2.5, borderBottomLeftRadius: 6 })}
        {corner({ bottom: 16, right: 16, borderRightWidth: 2.5, borderBottomWidth: 2.5, borderBottomRightRadius: 6 })}
      </View>

      <Row style={{ gap: 10, marginBottom: 12 }}>
        <Press onPress={onUpload} style={scanBtnStyle}>
          <Row style={{ paddingVertical: 15, gap: 7, justifyContent: 'center' }}>
            <Icon xml={UI.upload} size={18} color={theme.ink()} />
            <Txt style={{ fontSize: 14, fontWeight: 700, color: theme.ink() }}>Upload</Txt>
          </Row>
        </Press>
        <Press onPress={() => setCamOpen(true)} style={scanBtnStyle}>
          <Row style={{ paddingVertical: 15, gap: 7, justifyContent: 'center' }}>
            <Icon xml={UI.camera} size={18} color={theme.ink()} />
            <Txt style={{ fontSize: 14, fontWeight: 700, color: theme.ink() }}>Camera</Txt>
          </Row>
        </Press>
      </Row>

      {state.scanError ? (
        <View style={{ borderRadius: 14, borderWidth: 1, borderColor: '#dc5656', backgroundColor: 'rgba(220,86,86,.1)', padding: 12, marginBottom: 12 }}>
          <Txt style={{ color: '#b63535', fontSize: 13, lineHeight: 18, fontWeight: 600 }}>Scan failed: {state.scanError}</Txt>
        </View>
      ) : null}

      {left > 0 ? (
        <GradientBtn colors={theme.btnColors} glow={theme.glow} onPress={onAnalyze} disabled={state.scanning} style={{ borderRadius: 18, marginBottom: 16 }}>
          <Txt style={{ paddingVertical: 18, fontSize: 16, fontWeight: 700, color: '#fff' }}>{state.scanning ? 'Analyzing...' : pending ? 'Analyze' : 'Choose a photo'}</Txt>
        </GradientBtn>
      ) : (
        <View style={{ borderRadius: 18, backgroundColor: theme.ink(0.06), marginBottom: 16 }}>
          <Txt style={{ paddingVertical: 18, textAlign: 'center', fontSize: 14.5, fontWeight: 700, color: theme.ink(0.4) }}>
            Daily limit reached · resets tomorrow
          </Txt>
        </View>
      )}

      <DisclaimerBanner text={lens.disclaimer} />

      <CameraCapture visible={camOpen} accent={theme.accent} onCapture={onCameraCapture} onClose={() => setCamOpen(false)} />
    </>
  );
}
