import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { TextInput, View, type ViewStyle } from 'react-native';
import { useApp } from '../../state/AppContext';
import { estimateGoal } from '../../state/AppState';
import { GradientBtn, Press, Row, Txt } from '../ui';

function Seg({ on, label, onPress, style }: { on: boolean; label: string; onPress: () => void; style?: ViewStyle }) {
  const { theme } = useApp();
  const inner = <Txt style={{ paddingVertical: 13, textAlign: 'center', fontSize: 14, fontWeight: 700, color: on ? '#fff' : theme.ink(0.6) }}>{label}</Txt>;
  return (
    <Press haptic={false} onPress={onPress} style={[{ flex: 1, borderRadius: 14, overflow: 'hidden' }, style]}>
      {on ? (
        <LinearGradient colors={theme.btnColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          {inner}
        </LinearGradient>
      ) : (
        <View style={{ backgroundColor: theme.panel }}>{inner}</View>
      )}
    </Press>
  );
}

const ACTIVITY = [
  { v: 1.2, label: 'Sedentary — little exercise' },
  { v: 1.375, label: 'Light — 1–3 days/week' },
  { v: 1.55, label: 'Moderate — 3–5 days/week' },
  { v: 1.725, label: 'Active — 6–7 days/week' },
];

export function PlateGoal() {
  const { state, theme, setGoalField, saveGoal } = useApp();
  const g = state.goal;

  const inputStyle = {
    borderWidth: 1,
    borderColor: theme.hair,
    backgroundColor: theme.tint,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontFamily: 'InterTight_600SemiBold',
    fontSize: 15,
    color: theme.ink(),
  } as const;
  const label = (t: string) => <Txt style={{ fontSize: 13, fontWeight: 600, color: theme.ink(0.55), marginHorizontal: 2, marginBottom: 8 }}>{t}</Txt>;

  const targets: { id: typeof g.target; label: string }[] = [
    { id: 'lose', label: 'Lose' },
    { id: 'maintain', label: 'Maintain' },
    { id: 'gain', label: 'Gain' },
  ];

  return (
    <>
      <Txt style={{ marginBottom: 3, fontSize: 26, fontWeight: 800, color: theme.ink(), letterSpacing: -0.5 }}>Your goal</Txt>
      <Txt style={{ marginBottom: 22, fontSize: 13.5, lineHeight: 20, color: theme.ink(0.55) }}>
        We use this to estimate your daily calories. Values are estimates only.
      </Txt>

      {label('You are')}
      <Row style={{ gap: 8, marginBottom: 18 }}>
        <Seg on={g.sex === 'male'} label="Male" onPress={() => setGoalField('sex', 'male')} />
        <Seg on={g.sex === 'female'} label="Female" onPress={() => setGoalField('sex', 'female')} />
      </Row>

      {label('Age')}
      <TextInput
        value={String(g.age)}
        onChangeText={(v) => setGoalField('age', parseInt(v, 10) || 0)}
        keyboardType="number-pad"
        style={[inputStyle, { marginBottom: 18 }]}
      />

      {label('Height & weight')}
      <Row style={{ gap: 10, marginBottom: 18 }}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <TextInput value={String(g.height)} onChangeText={(v) => setGoalField('height', parseInt(v, 10) || 0)} keyboardType="number-pad" style={[inputStyle, { paddingRight: 44 }]} />
          <Txt style={{ position: 'absolute', right: 14, fontSize: 13, color: theme.ink(0.4) }}>cm</Txt>
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <TextInput value={String(g.weight)} onChangeText={(v) => setGoalField('weight', parseInt(v, 10) || 0)} keyboardType="number-pad" style={[inputStyle, { paddingRight: 44 }]} />
          <Txt style={{ position: 'absolute', right: 14, fontSize: 13, color: theme.ink(0.4) }}>kg</Txt>
        </View>
      </Row>

      {label('Activity level')}
      <View style={{ gap: 8, marginBottom: 18 }}>
        {ACTIVITY.map((a) => {
          const on = g.activity === a.v;
          return (
            <Press key={a.v} haptic={false} onPress={() => setGoalField('activity', a.v)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: on ? theme.accent : theme.hair, backgroundColor: theme.tint, borderRadius: 14, paddingVertical: 13, paddingHorizontal: 16 }}>
              <Txt style={{ fontSize: 14, fontWeight: on ? 700 : 600, color: on ? theme.accent : theme.ink(0.7) }}>{a.label}</Txt>
              <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: on ? theme.accent : theme.ink(0.25), alignItems: 'center', justifyContent: 'center' }}>
                {on && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.accent }} />}
              </View>
            </Press>
          );
        })}
      </View>

      {label('Goal')}
      <Row style={{ gap: 8, marginBottom: 22 }}>
        {targets.map((t) => (
          <Seg key={t.id} on={g.target === t.id} label={t.label} onPress={() => setGoalField('target', t.id)} />
        ))}
      </Row>

      <Row style={{ justifyContent: 'space-between', borderRadius: 20, padding: 20, paddingHorizontal: 22, marginBottom: 16, backgroundColor: '#1a1d24' }}>
        <Txt style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,.7)' }}>Estimated daily goal</Txt>
        <Txt style={{ fontSize: 30, fontWeight: 800, color: '#fff' }}>
          {estimateGoal(g).toLocaleString()}
          <Txt style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,.5)' }}> kcal</Txt>
        </Txt>
      </Row>

      <GradientBtn colors={theme.btnColors} glow={theme.glow} onPress={saveGoal} style={{ borderRadius: 20 }}>
        <Txt style={{ paddingVertical: 18, fontSize: 16, fontWeight: 700, color: '#fff' }}>Save goal</Txt>
      </GradientBtn>
    </>
  );
}
