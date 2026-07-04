import { macroColor } from '../../config/lenses';
import { hexA } from '../../lib/color';
import { Icon } from '../../lib/icon';
import { useApp } from '../../state/AppContext';
import { DisclaimerBanner, UsageCard } from '../Shared';

const badgePositions = [
  { top: '15%', left: '50%', transform: 'translateX(-50%)' },
  { top: '46%', left: '11%' },
  { bottom: '19%', right: '11%' },
];

export function ScanScreen() {
  const { state, lens, startScan } = useApp();
  const lim = lens.dailyLimit || 5;
  const used = Math.min(lim, state.usage[lens.id] || 0);
  const left = lim - used;

  const badges = (lens.result.fields || []).slice(0, 3).map((f, i) => {
    const c = macroColor[f.label] || lens.accent;
    return {
      value: f.value,
      label: f.label,
      color: c,
      tint: hexA(c, 0.22),
      pos: badgePositions[i],
      size: i === 0 ? 92 : 70,
      fs: i === 0 ? 17 : 14,
      delay: 0.5 + i * 0.55,
    };
  });

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '18px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent)' }}>{lens.name}</div>
        <h2 style={{ margin: '5px 0 4px', fontSize: '24px', fontWeight: 800, color: 'rgb(var(--ink))' }}>{lens.cta}</h2>
        <p style={{ margin: '0 auto', maxWidth: '280px', fontSize: '13.5px', lineHeight: 1.5, color: 'rgba(var(--ink),.55)' }}>{lens.scanInstruction}</p>
      </div>

      <UsageCard />

      <div
        style={{
          position: 'relative',
          aspectRatio: '3/3.4',
          borderRadius: '28px',
          overflow: 'hidden',
          background: 'var(--tint)',
          backdropFilter: 'blur(18px) saturate(1.7)',
          WebkitBackdropFilter: 'blur(18px) saturate(1.7)',
          border: '1px solid rgba(255,255,255,.5)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        {state.scanning ? (
          <div style={{ position: 'absolute', inset: 0, zIndex: 2, overflow: 'hidden', borderRadius: '28px' }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(115deg,transparent 34%,rgba(255,255,255,.4) 50%,transparent 66%)',
                backgroundSize: '220% 100%',
                animation: 'sweep 1.7s linear infinite',
              }}
            />
            {badges.map((sb, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  ...sb.pos,
                  zIndex: 3,
                  opacity: 0,
                  animation: 'floatIn .9s cubic-bezier(.22,1,.36,1) forwards',
                  animationDelay: `${sb.delay}s`,
                }}
              >
                <div
                  style={{
                    animation: 'bob 3.2s ease-in-out infinite',
                    animationDelay: `${sb.delay}s`,
                    width: `${sb.size}px`,
                    height: `${sb.size}px`,
                    borderRadius: '50%',
                    background: `radial-gradient(120% 120% at 30% 22%,rgba(255,255,255,.5) 0%,rgba(255,255,255,.18) 55%,${sb.tint} 100%)`,
                    backdropFilter: 'blur(20px) saturate(1.9)',
                    WebkitBackdropFilter: 'blur(20px) saturate(1.9)',
                    border: '1px solid rgba(255,255,255,.55)',
                    boxShadow: `0 14px 32px -10px var(--glow),inset 0 1px 1px rgba(255,255,255,.9),inset 0 0 0 1px ${sb.tint},inset 0 -6px 14px -6px ${sb.color}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '6px',
                  }}
                >
                  <div style={{ fontSize: `${sb.fs}px`, fontWeight: 800, color: sb.color, lineHeight: 1.05 }}>{sb.value}</div>
                  <div style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '.3px', color: sb.color, marginTop: '2px', textTransform: 'uppercase' }}>{sb.label}</div>
                </div>
              </div>
            ))}
            <div style={{ position: 'absolute', bottom: '16px', left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', zIndex: 4 }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(var(--ink),.15)', borderTopColor: 'var(--accent)', animation: 'spin .9s linear infinite' }} />
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'rgb(var(--ink))' }}>Analyzing…</span>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '0 30px' }}>
            <div style={{ width: '70px', height: '70px', margin: '0 auto 16px', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--panel)', color: 'var(--accent)' }}>
              <Icon html={lens.icon} size="36px" />
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'rgb(var(--ink))' }}>Point at your {lens.subjectWord}</div>
            <div style={{ fontSize: '12.5px', color: 'rgba(var(--ink),.5)', marginTop: '4px', lineHeight: 1.5 }}>Fill the frame · good lighting · steady hands</div>
          </div>
        )}
        <div style={{ position: 'absolute', top: '16px', left: '16px', width: '26px', height: '26px', borderLeft: '2.5px solid var(--accent)', borderTop: '2.5px solid var(--accent)', borderRadius: '6px 0 0 0' }} />
        <div style={{ position: 'absolute', top: '16px', right: '16px', width: '26px', height: '26px', borderRight: '2.5px solid var(--accent)', borderTop: '2.5px solid var(--accent)', borderRadius: '0 6px 0 0' }} />
        <div style={{ position: 'absolute', bottom: '16px', left: '16px', width: '26px', height: '26px', borderLeft: '2.5px solid var(--accent)', borderBottom: '2.5px solid var(--accent)', borderRadius: '0 0 0 6px' }} />
        <div style={{ position: 'absolute', bottom: '16px', right: '16px', width: '26px', height: '26px', borderRight: '2.5px solid var(--accent)', borderBottom: '2.5px solid var(--accent)', borderRadius: '0 0 6px 0' }} />
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
        <button className="press" onClick={startScan} style={{ flex: 1, border: 'none', cursor: 'pointer', padding: '15px', borderRadius: '16px', fontFamily: 'inherit', fontSize: '14px', fontWeight: 700, color: 'rgb(var(--ink))', background: 'var(--tint)', borderColor: 'rgba(255,255,255,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="m17 8-5-5-5 5" />
            <path d="M12 3v12" />
          </svg>
          Upload
        </button>
        <button className="press" onClick={startScan} style={{ flex: 1, border: 'none', cursor: 'pointer', padding: '15px', borderRadius: '16px', fontFamily: 'inherit', fontSize: '14px', fontWeight: 700, color: 'rgb(var(--ink))', background: 'var(--tint)', borderColor: 'rgba(255,255,255,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z" />
            <circle cx="12" cy="13" r="3" />
          </svg>
          Camera
        </button>
      </div>

      {left > 0 ? (
        <button
          className="press"
          onClick={startScan}
          style={{ width: '100%', border: 'none', cursor: 'pointer', padding: '18px', borderRadius: '18px', fontFamily: 'inherit', fontSize: '16px', fontWeight: 700, color: '#fff', background: 'var(--btn)', boxShadow: '0 16px 34px -12px var(--glow)', marginBottom: '16px' }}
        >
          Analyze
        </button>
      ) : (
        <button disabled style={{ width: '100%', border: 'none', padding: '18px', borderRadius: '18px', fontFamily: 'inherit', fontSize: '14.5px', fontWeight: 700, color: 'rgba(var(--ink),.4)', background: 'rgba(var(--ink),.06)', marginBottom: '16px', cursor: 'not-allowed' }}>
          Daily limit reached · resets tomorrow
        </button>
      )}

      <DisclaimerBanner text={lens.disclaimer} />
    </>
  );
}
