import { Icon } from '../../lib/icon';
import { useApp } from '../../state/AppContext';

export function LensList() {
  const { lens } = useApp();
  const isPlate = lens.id === 'plate';
  const title = 'History';
  const sub = isPlate ? 'Every meal you have scanned' : 'Produce you have scanned';

  return (
    <>
      <h2 style={{ margin: '0 0 4px', fontSize: '26px', fontWeight: 800, color: 'rgb(var(--ink))', letterSpacing: '-.5px' }}>{title}</h2>
      <p style={{ margin: '0 0 16px', fontSize: '13.5px', color: 'rgba(var(--ink),.55)' }}>{sub}</p>
      {(lens.history || []).map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '13px', background: 'var(--surface)', border: '1px solid rgba(255,255,255,.6)', borderRadius: '18px', padding: '12px 14px', marginBottom: '10px', boxShadow: '0 8px 20px -16px rgba(0,0,0,.25)' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '14px', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--soft)', color: 'var(--accent)' }}>
            <Icon html={lens.icon} size="24px" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'rgb(var(--ink))' }}>{r.name}</div>
            <div style={{ fontSize: '12px', color: 'rgba(var(--ink),.5)' }}>{r.meta}</div>
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(var(--ink),.4)' }}>{r.time}</div>
        </div>
      ))}
    </>
  );
}
