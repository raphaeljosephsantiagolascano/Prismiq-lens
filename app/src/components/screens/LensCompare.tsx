import { Icon } from '../../lib/icon';
import { useApp } from '../../state/AppContext';

export function LensCompare() {
  const { lens } = useApp();
  const rows = lens.content?.compare || [];

  return (
    <>
      <h2 style={{ margin: '0 0 4px', fontSize: '26px', fontWeight: 800, color: 'rgb(var(--ink))', letterSpacing: '-.5px' }}>Compare</h2>
      <p style={{ margin: '0 0 18px', fontSize: '13.5px', color: 'rgba(var(--ink),.55)' }}>Compare two possible stones side by side · placeholder.</p>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'stretch', marginBottom: '16px' }}>
        <div style={{ flex: 1, borderRadius: '20px', border: '1.5px dashed rgba(var(--ink),.18)', background: 'var(--tint)', padding: '22px 14px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '15px', background: 'var(--panel)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
            <Icon html={lens.icon} size="26px" />
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'rgb(var(--ink))' }}>Rose Quartz</div>
          <div style={{ fontSize: '11.5px', color: 'rgba(var(--ink),.5)' }}>78% match</div>
        </div>
        <div style={{ alignSelf: 'center', fontSize: '13px', fontWeight: 800, color: 'rgba(var(--ink),.4)' }}>VS</div>
        <div style={{ flex: 1, borderRadius: '20px', border: '1.5px dashed rgba(var(--ink),.18)', background: 'var(--tint)', padding: '22px 14px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '15px', background: 'var(--panel)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(var(--ink),.3)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(var(--ink),.45)' }}>Add a stone</div>
        </div>
      </div>
      {rows.map((cr, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface)', border: '1px solid rgba(255,255,255,.6)', borderRadius: '15px', padding: '13px 16px', marginBottom: '9px', boxShadow: '0 8px 18px -16px rgba(0,0,0,.25)' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'rgb(var(--ink))' }}>{cr.a}</span>
          <span style={{ fontSize: '11.5px', fontWeight: 600, letterSpacing: '.5px', textTransform: 'uppercase', color: 'rgba(var(--ink),.4)' }}>{cr.label}</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(var(--ink),.3)' }}>{cr.b}</span>
        </div>
      ))}
    </>
  );
}
