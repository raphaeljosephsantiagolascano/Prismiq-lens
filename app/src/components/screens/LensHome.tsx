import { Icon } from '../../lib/icon';
import { useApp } from '../../state/AppContext';
import { UsageCard } from '../Shared';

export function LensHome() {
  const { lens, goScan } = useApp();
  const c = lens.content!;
  const hasCareTip = lens.id === 'plant';

  return (
    <>
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', background: 'var(--btn)', padding: '22px', marginBottom: '16px', boxShadow: '0 18px 40px -18px var(--glow)' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '13px', background: 'var(--panel)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '14px' }}>
          <Icon html={lens.icon} size="22px" />
        </div>
        <div style={{ fontSize: '19px', fontWeight: 800, color: '#fff', lineHeight: 1.25, letterSpacing: '-.3px' }}>{c.heroTitle}</div>
        <div style={{ fontSize: '13.5px', lineHeight: 1.5, color: 'rgba(255,255,255,.82)', marginTop: '8px' }}>{c.heroSub}</div>
        <button
          className="press"
          onClick={goScan}
          style={{ marginTop: '16px', border: 'none', cursor: 'pointer', padding: '12px 20px', borderRadius: '14px', fontFamily: 'inherit', fontSize: '14px', fontWeight: 700, color: 'var(--accent)', background: 'var(--surface)', boxShadow: '0 8px 18px -8px rgba(0,0,0,.3)' }}
        >
          {lens.cta}
        </button>
      </div>

      <UsageCard />

      {hasCareTip && c.careTip && (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'var(--surface)', border: '1px solid rgba(255,255,255,.6)', borderRadius: '18px', padding: '15px 16px', marginBottom: '16px', boxShadow: '0 8px 22px -16px rgba(0,0,0,.25)' }}>
          <div style={{ width: '40px', height: '40px', flex: 'none', borderRadius: '12px', background: 'var(--soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a6 6 0 0 0-6 6c0 4 6 12 6 12s6-8 6-12a6 6 0 0 0-6-6Z" />
              <circle cx="12" cy="9" r="2" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '.4px', textTransform: 'uppercase', color: 'var(--accent)' }}>Care tip of the day</div>
            <div style={{ fontSize: '13.5px', lineHeight: 1.45, color: 'rgba(var(--ink),.7)', marginTop: '3px' }}>{c.careTip}</div>
          </div>
        </div>
      )}

      <div style={{ fontSize: '16px', fontWeight: 700, color: 'rgb(var(--ink))', margin: '2px 0 10px' }}>{c.cardsTitle}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
        {c.cards.map((card, i) => (
          <div key={i} style={{ background: 'var(--tint)', backdropFilter: 'blur(14px) saturate(1.7)', WebkitBackdropFilter: 'blur(14px) saturate(1.7)', border: '1px solid rgba(255,255,255,.5)', borderRadius: '18px', padding: '15px', minHeight: '96px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--panel)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
              <Icon html={lens.icon} size="18px" />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'rgb(var(--ink))' }}>{card.name}</div>
              <div style={{ fontSize: '11.5px', color: 'rgba(var(--ink),.5)', marginTop: '1px' }}>{card.tag}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: '16px', fontWeight: 700, color: 'rgb(var(--ink))', margin: '2px 0 10px' }}>Recent scans</div>
      {(lens.history || []).map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '13px', background: 'var(--soft)', border: '1px solid rgba(255,255,255,.5)', borderRadius: '18px', padding: '12px 14px', marginBottom: '10px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '14px', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--panel)', color: 'var(--accent)' }}>
            <Icon html={lens.icon} size="23px" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'rgb(var(--ink))' }}>{r.name}</div>
            <div style={{ fontSize: '12px', color: 'rgba(var(--ink),.5)' }}>{r.meta}</div>
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(var(--ink),.4)' }}>{r.time}</div>
        </div>
      ))}
    </>
  );
}
