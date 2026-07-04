import { useMemo } from 'react';
import { plateLog } from '../../config/lenses';
import { Icon } from '../../lib/icon';
import { useApp } from '../../state/AppContext';
import { SectionLabel } from '../Shared';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const CIRC = 2 * Math.PI * 15;

function dayTotals(meals: { cal: number; carbs: number; protein: number; fat: number }[]) {
  return meals.reduce(
    (a, x) => ({ cal: a.cal + x.cal, carbs: a.carbs + x.carbs, protein: a.protein + x.protein, fat: a.fat + x.fat }),
    { cal: 0, carbs: 0, protein: 0, fat: 0 },
  );
}

export function PlateCalendar() {
  const { state, lens, calPrev, calNext, setCalSelected } = useApp();
  const { calMonth, calYear, calSelected } = state;

  const first = new Date(calYear, calMonth, 1).getDay();
  const daysIn = new Date(calYear, calMonth + 1, 0).getDate();
  const isJul2026 = calMonth === 6 && calYear === 2026;
  const log = isJul2026 ? plateLog : {};
  const goalCal = state.goal.daily;

  const calDays = useMemo(() => {
    const days: {
      day: string;
      centerBg: string;
      color: string;
      track: string;
      ring: string;
      dash: number;
      offset: number;
      onClick: () => void;
    }[] = [];
    for (let i = 0; i < first; i++) {
      days.push({ day: '', centerBg: 'transparent', color: 'transparent', track: 'transparent', ring: 'transparent', dash: CIRC, offset: CIRC, onClick: () => {} });
    }
    for (let d = 1; d <= daysIn; d++) {
      const sel = d === calSelected;
      const meals = log[d] || null;
      const pct = meals ? Math.min(1, dayTotals(meals).cal / goalCal) : 0;
      days.push({
        day: String(d),
        centerBg: sel ? lens.accent : 'transparent',
        color: sel ? '#fff' : meals ? 'rgb(var(--ink))' : 'rgba(var(--ink),.42)',
        track: meals ? 'rgba(var(--ink),.1)' : 'transparent',
        ring: meals ? lens.accent : 'transparent',
        dash: CIRC,
        offset: CIRC * (1 - pct),
        onClick: () => setCalSelected(d),
      });
    }
    return days;
  }, [first, daysIn, calSelected, log, goalCal, lens.accent, setCalSelected]);

  const selMeals = log[calSelected] || [];
  const selTot = dayTotals(selMeals);
  const calSelPct = Math.min(100, Math.round((selTot.cal / goalCal) * 100));
  const mt = state.consumed.targets;
  const calSelMacros = [
    { label: 'Carbs', value: selTot.carbs, color: '#FF9F0A', barPct: Math.min(100, Math.round((selTot.carbs / mt.carbs) * 100)) },
    { label: 'Protein', value: selTot.protein, color: '#FF375F', barPct: Math.min(100, Math.round((selTot.protein / mt.protein) * 100)) },
    { label: 'Fat', value: selTot.fat, color: '#0A84FF', barPct: Math.min(100, Math.round((selTot.fat / mt.fat) * 100)) },
  ];

  return (
    <>
      <h2 style={{ margin: '0 0 14px', fontSize: '26px', fontWeight: 800, color: 'rgb(var(--ink))', letterSpacing: '-.5px' }}>Calendar</h2>
      <div
        style={{
          background: 'var(--tint)',
          backdropFilter: 'blur(18px) saturate(1.7)',
          WebkitBackdropFilter: 'blur(18px) saturate(1.7)',
          border: '1px solid rgba(255,255,255,.5)',
          borderRadius: '24px',
          padding: '16px',
          boxShadow: '0 10px 30px -16px rgba(0,0,0,.15)',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <button className="press" onClick={calPrev} style={{ width: '34px', height: '34px', border: 'none', cursor: 'pointer', borderRadius: '11px', background: 'var(--panel)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgb(var(--ink))' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <span style={{ fontSize: '15px', fontWeight: 700, color: 'rgb(var(--ink))' }}>{monthNames[calMonth]} {calYear}</span>
          <button className="press" onClick={calNext} style={{ width: '34px', height: '34px', border: 'none', cursor: 'pointer', borderRadius: '11px', background: 'var(--panel)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgb(var(--ink))' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '4px', marginBottom: '6px' }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: '11px', fontWeight: 600, color: 'rgba(var(--ink),.4)' }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '4px' }}>
          {calDays.map((c, i) => (
            <button key={i} onClick={c.onClick} style={{ aspectRatio: '1', border: 'none', cursor: c.day ? 'pointer' : 'default', background: 'none', padding: 0, fontFamily: 'inherit', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 36 36" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="18" cy="18" r="15" fill="none" stroke={c.track} strokeWidth="2.6" />
                <circle cx="18" cy="18" r="15" fill="none" stroke={c.ring} strokeWidth="2.6" strokeLinecap="round" strokeDasharray={c.dash} strokeDashoffset={c.offset} style={{ transition: 'stroke-dashoffset .5s ease' }} />
              </svg>
              <span style={{ position: 'relative', zIndex: 1, width: '64%', height: '64%', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, background: c.centerBg, color: c.color, transition: 'background .3s ease' }}>
                {c.day}
              </span>
            </button>
          ))}
        </div>
      </div>

      <SectionLabel>{monthNames[calMonth]} {calSelected}</SectionLabel>

      {selMeals.length > 0 ? (
        <>
          <div
            style={{
              background: 'linear-gradient(135deg,var(--glass1) 0%,var(--glass2) 100%)',
              backdropFilter: 'blur(24px) saturate(1.8)',
              WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
              border: '1px solid rgba(255,255,255,.6)',
              borderRadius: '20px',
              padding: '18px',
              marginBottom: '14px',
              boxShadow: '0 20px 46px -18px var(--glow),inset 0 1px 1px rgba(255,255,255,.8)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '30px', fontWeight: 800, color: 'rgb(var(--ink))' }}>{selTot.cal}</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(var(--ink),.45)' }}> / {goalCal} kcal</span>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(var(--ink),.5)' }}>
                {selMeals.length} {selMeals.length === 1 ? 'meal' : 'meals'}
              </span>
            </div>
            <div style={{ height: '8px', borderRadius: '99px', background: 'rgba(var(--ink),.08)', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: '99px', background: 'var(--btn)', width: `${calSelPct}%` }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '16px' }}>
              {calSelMacros.map((mm) => (
                <div key={mm.label}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: mm.color }} />
                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'rgba(var(--ink),.55)' }}>{mm.label}</span>
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'rgb(var(--ink))' }}>
                    {mm.value}
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(var(--ink),.4)' }}>g</span>
                  </div>
                  <div style={{ height: '5px', borderRadius: '99px', background: 'rgba(var(--ink),.08)', overflow: 'hidden', marginTop: '5px' }}>
                    <div style={{ height: '100%', borderRadius: '99px', background: mm.color, width: `${mm.barPct}%`, transition: 'width .4s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <SectionLabel>Meals</SectionLabel>
          {selMeals.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '13px', background: 'var(--soft)', border: '1px solid rgba(255,255,255,.5)', borderRadius: '18px', padding: '12px 14px', marginBottom: '10px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '14px', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--panel)', color: 'var(--accent)' }}>
                <Icon html={lens.icon} size="23px" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'rgb(var(--ink))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                <div style={{ fontSize: '12px', color: 'rgba(var(--ink),.5)' }}>{r.time} · {r.carbs}C · {r.protein}P · {r.fat}F</div>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: 'rgb(var(--ink))' }}>
                {r.cal}
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(var(--ink),.45)' }}> kcal</span>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '24px', color: 'rgba(var(--ink),.4)', fontSize: '13.5px' }}>No meals logged this day.</div>
      )}
    </>
  );
}
