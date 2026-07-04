import { lenses } from '../config/lenses';
import { useApp } from '../state/AppContext';

export function SettingsSheet() {
  const { state, closeSettings, toggleDark } = useApp();

  const usageRows = lenses.map((md) => {
    const limit = md.dailyLimit || 5;
    const used = Math.min(limit, state.usage[md.id] || 0);
    return { name: md.shortName, accent: md.accent, used, limit };
  });
  const tokUsed = usageRows.reduce((a, r) => a + r.used, 0);
  const tokTotal = usageRows.reduce((a, r) => a + r.limit, 0);
  const tokPct = Math.round((tokUsed / tokTotal) * 100);
  const dark = state.dark;

  return (
    <>
      <div
        onClick={closeSettings}
        style={{ position: 'absolute', inset: 0, zIndex: 70, background: 'rgba(6,8,12,.5)', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)', animation: 'fadein .25s ease' }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 71,
          borderRadius: '30px 30px 0 0',
          padding: '22px 20px 30px',
          background: 'var(--surface)',
          borderTop: '1px solid rgba(255,255,255,.14)',
          boxShadow: '0 -24px 60px -20px rgba(0,0,0,.5)',
          animation: 'fadeup .32s cubic-bezier(.22,1,.36,1)',
        }}
      >
        <div style={{ width: '38px', height: '5px', borderRadius: '99px', background: 'rgba(var(--ink),.18)', margin: '0 auto 16px' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ fontSize: '21px', fontWeight: 800, color: 'rgb(var(--ink))', letterSpacing: '-.4px' }}>Settings</div>
          <button onClick={closeSettings} className="press" style={{ width: '34px', height: '34px', borderRadius: '11px', border: 'none', cursor: 'pointer', background: 'var(--tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgb(var(--ink))' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div style={{ borderRadius: '22px', padding: '18px', marginBottom: '14px', background: 'linear-gradient(135deg,var(--glass1) 0%,var(--glass2) 100%)', backdropFilter: 'blur(20px) saturate(1.8)', WebkitBackdropFilter: 'blur(20px) saturate(1.8)', border: '1px solid rgba(255,255,255,.14)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,.2)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '.4px', textTransform: 'uppercase', color: 'rgba(var(--ink),.5)' }}>Scan tokens</div>
            <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'rgba(var(--ink),.5)' }}>{tokTotal - tokUsed} scans left today</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '6px 0 12px' }}>
            <span style={{ fontSize: '34px', fontWeight: 800, color: 'rgb(var(--ink))', lineHeight: 1 }}>{tokUsed}</span>
            <span style={{ fontSize: '15px', fontWeight: 600, color: 'rgba(var(--ink),.42)' }}>/ {tokTotal} used today</span>
          </div>
          <div style={{ height: '9px', borderRadius: '99px', background: 'rgba(var(--ink),.1)', overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{ height: '100%', borderRadius: '99px', width: `${tokPct}%`, background: 'var(--btn)', boxShadow: '0 0 12px -2px var(--glow)' }} />
          </div>
          {usageRows.map((u) => (
            <div key={u.name} style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '11px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', flex: 'none', background: u.accent }} />
              <span style={{ flex: 'none', width: '66px', fontSize: '13px', fontWeight: 700, color: 'rgb(var(--ink))' }}>{u.name}</span>
              <div style={{ flex: 1, height: '6px', borderRadius: '99px', background: 'rgba(var(--ink),.1)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: '99px', width: `${Math.round((u.used / u.limit) * 100)}%`, background: u.accent }} />
              </div>
              <span style={{ flex: 'none', fontSize: '12px', fontWeight: 700, color: 'rgba(var(--ink),.5)', fontVariantNumeric: 'tabular-nums' }}>
                {u.used} / {u.limit}
              </span>
            </div>
          ))}
        </div>

        <div onClick={toggleDark} className="press" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '13px', borderRadius: '20px', padding: '15px 16px', background: 'var(--tint)', backdropFilter: 'blur(16px) saturate(1.7)', WebkitBackdropFilter: 'blur(16px) saturate(1.7)', border: '1px solid rgba(255,255,255,.14)' }}>
          <div style={{ width: '38px', height: '38px', flex: 'none', borderRadius: '12px', background: 'var(--soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgb(var(--ink))' }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'rgb(var(--ink))' }}>Dark mode</div>
            <div style={{ fontSize: '12px', color: 'rgba(var(--ink),.5)' }}>{dark ? 'On · easier on the eyes' : 'Off · bright theme'}</div>
          </div>
          <div style={{ width: '50px', height: '30px', borderRadius: '99px', flex: 'none', padding: '3px', transition: 'background .3s ease', background: dark ? 'var(--btn)' : 'rgba(var(--ink),.18)', display: 'flex', justifyContent: dark ? 'flex-end' : 'flex-start' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,.35)', transition: 'all .3s ease' }} />
          </div>
        </div>
      </div>
    </>
  );
}
