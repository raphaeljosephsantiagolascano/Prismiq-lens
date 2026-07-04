import { useApp } from '../../state/AppContext';
import { DisclaimerBanner } from '../Shared';

const guideSubMap: Record<string, string> = {
  fresh: 'Storage, ripeness and how to use produce.',
  plant: 'Watering, light and plant safety.',
  rock: 'Field tests and identification basics.',
};

const bookIcon = '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22.5z"/><path d="M8 7h8M8 11h6"/>';
const chevronIcon = '<path d="m9 18 6-6-6-6"/>';

export function LensGuide() {
  const { lens } = useApp();
  const cards = lens.content?.guide || [];

  return (
    <>
      <h2 style={{ margin: '0 0 4px', fontSize: '26px', fontWeight: 800, color: 'rgb(var(--ink))', letterSpacing: '-.5px' }}>Guide</h2>
      <p style={{ margin: '0 0 16px', fontSize: '13.5px', color: 'rgba(var(--ink),.55)' }}>{guideSubMap[lens.id] || ''}</p>
      {cards.map((g, i) => (
        <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', background: 'var(--surface)', border: '1px solid rgba(255,255,255,.6)', borderRadius: '18px', padding: '15px 16px', marginBottom: '11px', boxShadow: '0 8px 20px -16px rgba(0,0,0,.25)' }}>
          <div style={{ width: '44px', height: '44px', flex: 'none', borderRadius: '14px', background: 'var(--soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: bookIcon }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'rgb(var(--ink))' }}>{g.title}</div>
            <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'rgba(var(--ink),.58)', marginTop: '2px' }}>{g.body}</div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(var(--ink),.3)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none', marginTop: '12px' }} dangerouslySetInnerHTML={{ __html: chevronIcon }} />
        </div>
      ))}
      <DisclaimerBanner text={lens.disclaimer} style={{ marginTop: '6px' }} />
    </>
  );
}
