import { useApp } from '../state/AppContext';

export function CalorieRing() {
  const { state } = useApp();
  const g = state.goal;
  const c = state.consumed;
  const t = c.targets;
  const size = 200;
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
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: '196px', height: '196px', transform: 'rotate(-90deg)' }}>
      {rings.map((ring, i) => {
        const circ = 2 * Math.PI * ring.r;
        const pct = Math.min(1, ring.v / ring.m);
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={ring.r} fill="none" stroke="rgba(var(--ink),.08)" strokeWidth={sw} />
            <circle
              cx={cx}
              cy={cy}
              r={ring.r}
              fill="none"
              stroke={ring.col}
              strokeWidth={sw}
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - pct)}
              style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)' }}
            />
          </g>
        );
      })}
    </svg>
  );
}
