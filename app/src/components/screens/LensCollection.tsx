import { Icon } from '../../lib/icon';
import { useApp } from '../../state/AppContext';

const titleMap: Record<string, [string, string]> = {
  saved: ['Saved', 'Your saved fruits and vegetables'],
  myplants: ['My Plants', 'Every plant in your collection'],
  collection: ['Collection', 'Your saved rocks and minerals'],
};

export function LensCollection() {
  const { state, lens } = useApp();
  const [title, sub] = titleMap[state.tab] || ['', ''];
  const c = lens.content!;
  const hasGrid = lens.id === 'fresh' && state.tab === 'saved';

  return (
    <>
      <h2 style={{ margin: '0 0 4px', fontSize: '26px', fontWeight: 800, color: 'rgb(var(--ink))', letterSpacing: '-.5px' }}>{title}</h2>
      <p style={{ margin: '0 0 16px', fontSize: '13.5px', color: 'rgba(var(--ink),.55)' }}>{sub}</p>
      {hasGrid && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
          {(c.grid || []).map((col, i) => (
            <div key={i} style={{ borderRadius: '20px', padding: '16px', background: 'var(--btn)', boxShadow: '0 12px 28px -18px var(--glow)', minHeight: '110px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '11px', background: 'var(--panel)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Icon html={lens.icon} size="20px" />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>{col.name}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.8)', marginTop: '1px' }}>{col.sub}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {(c.items || []).map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '13px', background: 'var(--surface)', border: '1px solid rgba(255,255,255,.6)', borderRadius: '18px', padding: '13px 14px', marginBottom: '10px', boxShadow: '0 8px 20px -16px rgba(0,0,0,.25)' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '14px', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--soft)', color: 'var(--accent)' }}>
            <Icon html={lens.icon} size="24px" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'rgb(var(--ink))' }}>{s.name}</div>
            <div style={{ fontSize: '12px', color: 'rgba(var(--ink),.5)' }}>{s.meta}</div>
          </div>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="var(--accent)" stroke="var(--accent)" strokeWidth="1.5">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </div>
      ))}
    </>
  );
}
