import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Image, View } from 'react-native';
import Animated, { Easing, FadeInDown, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated';
import { macroColor } from '../../config/lenses';
import { Icon, UI } from '../../lib/icons';
import { useApp } from '../../state/AppContext';
import { GlassCard } from '../Shared';
import { GradientBtn, Press, Row, Txt } from '../ui';

function Dot({ delay, color }: { delay: number; color: string }) {
  const v = useSharedValue(0.25);
  useEffect(() => {
    v.value = withDelay(delay, withRepeat(withTiming(1, { duration: 550, easing: Easing.inOut(Easing.quad) }), -1, true));
  }, [v, delay]);
  const style = useAnimatedStyle(() => ({ opacity: v.value, transform: [{ translateY: (v.value - 0.6) * -4 }] }));
  return <Animated.View style={[{ width: 6, height: 6, borderRadius: 3, backgroundColor: color }, style]} />;
}

export function ResultScreen() {
  const { state, lens, theme, goScan, goHistory, saveResult, answerChat } = useApp();
  const isPlate = lens.id === 'plate';
  // the AI-generated result when we have one; otherwise the lens's built-in demo
  const r = state.result ?? lens.result;
  const conf = r.confidence;
  const confLabel = conf >= 85 ? 'High confidence' : conf >= 70 ? 'Moderate confidence' : 'Low confidence';
  const confColor = conf >= 85 ? '#22A45D' : conf >= 70 ? '#FF9F0A' : '#FF375F';
  const resultAka = r.aka ? `Also known as ${r.aka}` : r.sci ? `Scientific name · ${r.sci}` : '';

  const chatCfg = (isPlate && r.chat) || [];
  const cst = state.chat;
  type Msg = { role: 'ai' | 'user'; text: string };
  const chatMsgs: Msg[] = [];
  for (let i = 0; i < cst.step && i < chatCfg.length; i++) {
    chatMsgs.push({ role: 'ai', text: chatCfg[i].ai });
    chatMsgs.push({ role: 'user', text: cst.answers[i] });
  }
  let chatOptions: string[] = [];
  if (!cst.typing) {
    if (cst.step < chatCfg.length) {
      chatMsgs.push({ role: 'ai', text: chatCfg[cst.step].ai });
      chatOptions = chatCfg[cst.step].options;
    } else if (chatCfg.length) {
      chatMsgs.push({ role: 'ai', text: 'Perfect — I’ve updated your estimate. Your numbers look solid ✨' });
    }
  }
  const chatSummary = chatCfg.map((c, i) => ({ q: c.ai, a: cst.answers[i] != null ? cst.answers[i] : c.options?.[0] || '—' }));
  const hasPortionQs = isPlate && !state.fromHistory && !!(r.portionQs && r.portionQs.length);
  const hasChatSummary = isPlate && state.fromHistory && chatSummary.length > 0;

  return (
    <Animated.View entering={FadeInDown.duration(450)}>
      <Press haptic={false} onPress={state.fromHistory ? goHistory : goScan} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 14, alignSelf: 'flex-start' }}>
        <Icon xml={UI.chevronLeft} size={16} color={theme.ink(0.55)} />
        <Txt style={{ fontSize: 13, fontWeight: 600, color: theme.ink(0.55) }}>{state.fromHistory ? 'Back to history' : 'Scan again'}</Txt>
      </Press>

      {/* captured photo (real when we have one, placeholder for the demo) */}
      <View style={{ aspectRatio: 16 / 10, borderRadius: 22, overflow: 'hidden', marginBottom: 16, borderWidth: 1, borderColor: theme.hair, backgroundColor: theme.soft, alignItems: 'center', justifyContent: 'center' }}>
        {state.scanImageUri ? (
          <Image source={{ uri: state.scanImageUri }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} resizeMode="cover" />
        ) : (
          <Txt style={{ fontFamily: 'InterTight_500Medium', fontSize: 11, letterSpacing: 0.5, color: theme.ink(0.4) }}>{lens.subjectWord} photo</Txt>
        )}
        <View style={{ position: 'absolute', top: 12, left: 12, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 99, backgroundColor: theme.panel }}>
          <Txt style={{ fontSize: 11, fontWeight: 700, color: theme.accent }}>Captured</Txt>
        </View>
      </View>

      {/* main identification card */}
      <GlassCard strong style={{ padding: 18, marginBottom: 18 }}>
        <Txt style={{ fontSize: 24, fontWeight: 800, color: theme.ink(), letterSpacing: -0.5 }}>{r.title}</Txt>
        <Txt style={{ fontSize: 14, color: theme.ink(0.55), marginTop: 3 }}>{r.subtitle}</Txt>
        {!!resultAka && <Txt style={{ fontSize: 12.5, fontWeight: 600, color: theme.accent, marginTop: 4 }}>{resultAka}</Txt>}
        {!!r.description && <Txt style={{ marginTop: 8, fontSize: 13, lineHeight: 20, color: theme.ink(0.6) }}>{r.description}</Txt>}
        <View style={{ marginTop: 14 }}>
          <Row style={{ justifyContent: 'space-between', marginBottom: 6 }}>
            <Txt style={{ fontSize: 12, fontWeight: 700, color: theme.ink() }}>{confLabel}</Txt>
            <Txt style={{ fontSize: 12, fontWeight: 800, color: confColor }}>{conf}%</Txt>
          </Row>
          <View style={{ height: 8, borderRadius: 99, backgroundColor: theme.ink(0.09), overflow: 'hidden' }}>
            <View style={{ height: '100%', borderRadius: 99, width: `${conf}%`, backgroundColor: confColor }} />
          </View>
        </View>
      </GlassCard>

      {/* key detail cards */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
        {r.fields.map((f, i) => {
          const color = macroColor[f.label] || lens.accent;
          return (
            <View key={i} style={{ width: '47.8%', flexGrow: 1, overflow: 'hidden', backgroundColor: theme.tint, borderWidth: 1, borderColor: theme.hair, borderRadius: 18, paddingVertical: 15, paddingHorizontal: 16, paddingLeft: 18 }}>
              <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: color }} />
              <Row style={{ gap: 6 }}>
                <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: color }} />
                <Txt style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: 0.4, color: theme.ink(0.45) }}>{f.label.toUpperCase()}</Txt>
              </Row>
              <Txt style={{ fontSize: 19, fontWeight: 800, color, marginTop: 4 }}>{f.value}</Txt>
            </View>
          );
        })}
      </View>

      {/* explanation lists */}
      {r.lists.map((rl, i) => (
        <View key={i} style={{ backgroundColor: theme.soft, borderWidth: 1, borderColor: theme.hair, borderRadius: 18, padding: 15, paddingHorizontal: 16, marginBottom: 14 }}>
          <Txt style={{ fontSize: 14, fontWeight: 700, color: theme.ink(), marginBottom: 10 }}>{rl.title}</Txt>
          {rl.items.map((t, j) => (
            <Row key={j} style={{ gap: 9, alignItems: 'flex-start', marginBottom: 8 }}>
              <Icon xml={UI.check} size={17} color={theme.accent} style={{ marginTop: 1 }} />
              <Txt style={{ flex: 1, fontSize: 13, lineHeight: 19, color: theme.ink(0.7) }}>{t}</Txt>
            </Row>
          ))}
        </View>
      ))}

      {/* caution */}
      <Row style={{ gap: 10, alignItems: 'flex-start', backgroundColor: '#fdecec', borderWidth: 1, borderColor: 'rgba(220,60,60,.18)', borderRadius: 16, padding: 13, paddingHorizontal: 15, marginBottom: 16 }}>
        <Icon xml={UI.alert} size={18} color="#d23b3b" style={{ marginTop: 1 }} />
        <Txt style={{ flex: 1, fontSize: 12, lineHeight: 18, color: '#b23636' }}>{r.caution}</Txt>
      </Row>

      {/* interactive refine chat */}
      {hasPortionQs && (
        <View style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.hair, borderRadius: 20, padding: 16, marginBottom: 16 }}>
          <Row style={{ gap: 10, marginBottom: 14 }}>
            <LinearGradient colors={theme.btnColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
              <Icon xml={UI.sparkle} size={17} color="#fff" />
            </LinearGradient>
            <View>
              <Txt style={{ fontSize: 13.5, fontWeight: 700, color: theme.ink() }}>Refine with Prismiq AI</Txt>
              <Txt style={{ fontSize: 11, color: theme.ink(0.5) }}>A quick chat sharpens your estimate</Txt>
            </View>
          </Row>
          <View style={{ backgroundColor: theme.soft, borderWidth: 1, borderColor: theme.hair, borderRadius: 16, padding: 13, paddingBottom: 15 }}>
            {chatMsgs.map((cm, i) => {
              const ai = cm.role === 'ai';
              return (
                <View key={i} style={{ flexDirection: 'row', justifyContent: ai ? 'flex-start' : 'flex-end', marginBottom: 8 }}>
                  {ai ? (
                    <View style={{ maxWidth: '80%', paddingVertical: 9, paddingHorizontal: 13, borderRadius: 15, borderBottomLeftRadius: 4, backgroundColor: theme.surface }}>
                      <Txt style={{ fontSize: 13, lineHeight: 18, color: theme.ink() }}>{cm.text}</Txt>
                    </View>
                  ) : (
                    <LinearGradient colors={theme.btnColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ maxWidth: '80%', paddingVertical: 9, paddingHorizontal: 13, borderRadius: 15, borderBottomRightRadius: 4 }}>
                      <Txt style={{ fontSize: 13, lineHeight: 18, color: '#fff' }}>{cm.text}</Txt>
                    </LinearGradient>
                  )}
                </View>
              );
            })}
            {cst.typing && (
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <Row style={{ gap: 4, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 15, borderBottomLeftRadius: 4, backgroundColor: theme.surface }}>
                  <Dot delay={0} color={theme.ink(0.4)} />
                  <Dot delay={150} color={theme.ink(0.4)} />
                  <Dot delay={300} color={theme.ink(0.4)} />
                </Row>
              </View>
            )}
            {chatOptions.length > 0 && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
                {chatOptions.map((o, i) => (
                  <Press key={i} onPress={() => answerChat(o)} style={{ borderWidth: 1.5, borderColor: theme.accent, backgroundColor: theme.panel, borderRadius: 99, paddingVertical: 8, paddingHorizontal: 14 }}>
                    <Txt style={{ fontSize: 12.5, fontWeight: 700, color: theme.accent }}>{o}</Txt>
                  </Press>
                ))}
              </View>
            )}
          </View>
        </View>
      )}

      {/* read-only refine summary (history detail) */}
      {hasChatSummary && (
        <GlassCard strong style={{ padding: 16, marginBottom: 16, borderRadius: 20 }}>
          <Row style={{ gap: 10, marginBottom: 14 }}>
            <LinearGradient colors={theme.btnColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
              <Icon xml={UI.sparkle} size={17} color="#fff" />
            </LinearGradient>
            <View>
              <Txt style={{ fontSize: 13.5, fontWeight: 700, color: theme.ink() }}>Refine summary</Txt>
              <Txt style={{ fontSize: 11, color: theme.ink(0.5) }}>How this estimate was sharpened</Txt>
            </View>
          </Row>
          {chatSummary.map((cs, i) => (
            <View key={i} style={{ paddingVertical: 10, borderTopWidth: 1, borderTopColor: theme.ink(0.07) }}>
              <Txt style={{ fontSize: 12, color: theme.ink(0.5), lineHeight: 17 }}>{cs.q}</Txt>
              <Txt style={{ fontSize: 13.5, fontWeight: 700, color: theme.ink(), marginTop: 3 }}>{cs.a}</Txt>
            </View>
          ))}
        </GlassCard>
      )}

      {!state.fromHistory && (
        <>
          <GradientBtn colors={theme.btnColors} glow={theme.glow} onPress={saveResult} style={{ borderRadius: 18 }}>
            <Txt style={{ paddingVertical: 17, fontSize: 15, fontWeight: 700, color: '#fff' }}>Save result</Txt>
          </GradientBtn>
          <Press onPress={goHistory} style={{ marginTop: 10, borderWidth: 1, borderColor: theme.hair, borderRadius: 18, backgroundColor: theme.tint }}>
            <Row style={{ paddingVertical: 15, gap: 8, justifyContent: 'center' }}>
              <Icon xml={UI.historyRotate} size={18} color={theme.ink()} />
              <Txt style={{ fontSize: 14.5, fontWeight: 700, color: theme.ink() }}>View history</Txt>
            </Row>
          </Press>
        </>
      )}
    </Animated.View>
  );
}
