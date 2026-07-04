import { Icon } from '../../lib/icon';
import { useApp } from '../../state/AppContext';
import { ScreenTitle } from '../Shared';

export function PlateHistory() {
  const { state, lens, setQuery, goResult } = useApp();
  const q = state.query.trim().toLowerCase();
  const list = (lens.history || []).filter((h) => q === '' || h.name.toLowerCase().includes(q));

  return (
    <>
      <ScreenTitle>History</ScreenTitle>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '9px',
          background: 'var(--tint)',
          backdropFilter: 'blur(14px) saturate(1.7)',
          WebkitBackdropFilter: 'blur(14px) saturate(1.7)',
          border: '1px solid rgba(255,255,255,.5)',
          borderRadius: '15px',
          padding: '11px 14px',
          marginBottom: '14px',
        }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(var(--ink),.4)" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" strokeLinecap="round" />
        </svg>
        <input
          value={state.query}
          onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
          placeholder="Search meals"
          style={{ flex: 1, border: 'none', background: 'none', outline: 'none', fontFamily: 'inherit', fontSize: '14px', color: 'rgb(var(--ink))' }}
        />
      </div>
      {list.map((h, i) => (
        <div
          key={i}
          onClick={goResult}
          className="press"
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
            boxShadow: '0 8px 20px -16px rgba(0,0,0,.25)',
          }}
        >
          <div style={{ width: '46px', height: '46px', borderRadius: '14px', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--soft)', color: 'var(--accent)' }}>
            <Icon html={lens.icon} size="24px" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'rgb(var(--ink))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.name}</div>
            <div style={{ fontSize: '12px', color: 'rgba(var(--ink),.5)' }}>{h.meta}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: 'rgb(var(--ink))' }}>{h.cal}</div>
              <div style={{ fontSize: '11px', color: 'rgba(var(--ink),.4)' }}>{h.time}</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(var(--ink),.3)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 6 6 6-6 6" />
            </svg>
          </div>
        </div>
      ))}
    </>
  );
}
