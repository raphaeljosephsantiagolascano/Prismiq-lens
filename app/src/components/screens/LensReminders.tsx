import { useApp } from '../../state/AppContext';

const bellIcon =
  '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>';

export function LensReminders() {
  const { lens } = useApp();
  const reminders = lens.content?.reminders || [];

  return (
    <>
      <h2 style={{ margin: '0 0 4px', fontSize: '26px', fontWeight: 800, color: 'rgb(var(--ink))', letterSpacing: '-.5px' }}>Reminders</h2>
      <p style={{ margin: '0 0 16px', fontSize: '13.5px', color: 'rgba(var(--ink),.55)' }}>Upcoming plant care · mock schedule.</p>
      {reminders.map((rm, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--surface)', border: '1px solid rgba(255,255,255,.6)', borderRadius: '18px', padding: '14px', marginBottom: '11px', boxShadow: '0 8px 20px -16px rgba(0,0,0,.25)' }}>
          <div style={{ width: '48px', height: '48px', flex: 'none', borderRadius: '15px', background: 'var(--soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: bellIcon }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'rgb(var(--ink))' }}>{rm.plant}</div>
            <div style={{ fontSize: '12.5px', color: 'rgba(var(--ink),.55)', marginTop: '1px' }}>{rm.note}</div>
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', textAlign: 'right' }}>{rm.when}</div>
        </div>
      ))}
    </>
  );
}
