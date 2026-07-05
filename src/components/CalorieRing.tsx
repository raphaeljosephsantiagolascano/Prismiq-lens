import React from 'react';
import Svg, { Circle, G } from 'react-native-svg';
import type { Macros } from '../lib/scans';
import { useApp } from '../state/AppContext';

// concentric multi-ring: calories / carbs / protein / fat.
// `consumed` overrides today's totals (from real scans); targets come from state.
export function CalorieRing({ size = 196, consumed }: { size?: number; consumed?: Macros }) {
  const { state, theme } = useApp();
  const g = state.goal;
  const t = state.consumed.targets;
  const c = consumed ?? state.consumed;
  const cx = 100;
  const cy = 100;
  const sw = 13;
  const rings = [
    { r: 82, col: '#34C759', v: c.cal, m: g.daily },
    { r: 64, col: '#FF9F0A', v: c.carbs, m: t.carbs },
    { r: 46, col: '#FF375F', v: c.protein, m: t.protein },
    { r: 28, col: '#0A84FF', v: c.fat, m: t.fat },
  ];

  return (
    <Svg viewBox="0 0 200 200" width={size} height={size}>
      {/* arc starts at 12 o'clock: rotate around center via numeric originX/originY (web + iOS) */}
      <G rotation={-90} originX={100} originY={100}>
        {rings.map((ring, i) => {
          const circ = 2 * Math.PI * ring.r;
          const pct = Math.min(1, ring.v / ring.m);
          return (
            <G key={i}>
              <Circle cx={cx} cy={cy} r={ring.r} fill="none" stroke={theme.ink(0.08)} strokeWidth={sw} />
              <Circle
                cx={cx}
                cy={cy}
                r={ring.r}
                fill="none"
                stroke={ring.col}
                strokeWidth={sw}
                strokeLinecap="round"
                strokeDasharray={`${circ} ${circ}`}
                strokeDashoffset={circ * (1 - pct)}
              />
            </G>
          );
        })}
      </G>
    </Svg>
  );
}
