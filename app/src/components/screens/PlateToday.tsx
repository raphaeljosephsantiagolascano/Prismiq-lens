import { CalorieRing } from '../CalorieRing';
import { UsageCard, SectionLabel } from '../Shared';
import { Icon } from '../../lib/icon';
import { useApp } from '../../state/AppContext';

export function PlateToday() {
  const { state, lens, goScan, goHistory } = useApp();
  const macroLegend = [
    { label: 'Carbs', value: state.consumed.carbs, color: '#FF9F0A' },
    { label: 'Protein', value: state.consumed.protein, color: '#FF375F' },
    { label: 'Fat', value: state.consumed.fat, color: '#0A84FF' },
  ];
  const recent = (lens.history || []).slice(0, 1);

  return (
    <>
      <div
        style={{
          position: 'relative',
          borderRadius: '28px',
          overflow: 'hidden',
          background: 'linear-gradient(135deg,var(--glass1) 0%,var(--glass2) 100%)',
          backdropFilter: 'blur(24px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
          border: '1px solid rgba(255,255,255,.6)',
          padding: '22px 20px 20px',
          boxShadow: '0 22px 46px -18px var(--glow),inset 0 1px 1px rgba(255,255,255,.8)',
          marginBottom: '16px',
        }}
      >
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
          <CalorieRing />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', color: 'rgba(var(--ink),.5)' }}>CALORIES</div>
            <div style={{ fontSize: '52px', fontWeight: 800, color: 'rgb(var(--ink))', lineHeight: 1, margin: '2px 0' }}>
              {state.consumed.cal}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(var(--ink),.55)' }}>of {state.goal.daily} kcal</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '8px' }}>
          {macroLegend.map((ml) => (
            <div key={ml.label} style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: ml.color }} />
                <span style={{ fontSize: '12px', color: 'rgba(var(--ink),.55)' }}>{ml.label}</span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'rgb(var(--ink))', marginTop: '3px' }}>
                {ml.value}
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(var(--ink),.45)' }}>g</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <UsageCard />

      <button
        className="press"
        onClick={goScan}
        style={{
          width: '100%',
          border: 'none',
          cursor: 'pointer',
          padding: '18px',
          borderRadius: '20px',
          fontFamily: 'inherit',
          fontSize: '16px',
          fontWeight: 700,
          color: '#fff',
          background: 'var(--btn)',
          boxShadow: '0 16px 34px -12px var(--glow)',
          marginBottom: '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '9px',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z" />
          <circle cx="12" cy="13" r="3" />
        </svg>
        Scan a meal
      </button>

      <SectionLabel>Recent</SectionLabel>
      {recent.map((r, i) => (
        <div
          key={i}
          onClick={goHistory}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '13px',
            background: 'var(--surface)',
            border: '1px solid rgba(255,255,255,.6)',
            borderRadius: '18px',
            padding: '12px 14px',
            marginBottom: '10px',
            boxShadow: '0 8px 22px -16px rgba(0,0,0,.3)',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              flex: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--soft)',
              color: 'var(--accent)',
            }}
          >
            <Icon html={lens.icon} size="24px" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'rgb(var(--ink))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {r.name}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(var(--ink),.5)' }}>{r.time}</div>
          </div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: 'rgb(var(--ink))' }}>
            {r.cal}
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(var(--ink),.45)' }}> kcal</span>
          </div>
        </div>
      ))}
    </>
  );
}
