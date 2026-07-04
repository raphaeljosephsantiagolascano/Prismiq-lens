import type { ReactNode } from 'react';
import { useApp } from '../state/AppContext';

const clockIcon =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2M3 12h18"/></svg>';

export function UsageCard({ style }: { style?: React.CSSProperties }) {
  const { state, lens } = useApp();
  const lim = lens.dailyLimit || 5;
  const used = Math.min(lim, state.usage[lens.id] || 0);
  const left = lim - used;
  const pct = Math.round((left / lim) * 100);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '13px',
        background: 'var(--tint)',
        backdropFilter: 'blur(16px) saturate(1.7)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.7)',
        border: '1px solid rgba(255,255,255,.55)',
        borderRadius: '18px',
        padding: '12px 15px',
        marginBottom: '14px',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,.6)',
        ...style,
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          flex: 'none',
          borderRadius: '11px',
          background: 'var(--soft)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent)',
        }}
        dangerouslySetInnerHTML={{ __html: clockIcon }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'rgb(var(--ink))' }}>
            {left} of {lim} scans left today
          </span>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(var(--ink),.42)' }}>Resets tomorrow</span>
        </div>
        <div style={{ height: '6px', borderRadius: '99px', background: 'rgba(var(--ink),.09)', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              borderRadius: '99px',
              background: 'var(--btn)',
              width: `${pct}%`,
              transition: 'width .5s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function DisclaimerBanner({ text, style }: { text: string; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-start',
        background: 'var(--soft)',
        border: '1px solid rgba(255,255,255,.45)',
        borderRadius: '16px',
        padding: '13px 15px',
        ...style,
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        style={{ flex: 'none', marginTop: '1px' }}
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
      </svg>
      <span style={{ fontSize: '12px', lineHeight: 1.5, color: 'rgba(var(--ink),.6)' }}>{text}</span>
    </div>
  );
}

const gearIcon =
  '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H2a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 3.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H8a1.65 1.65 0 0 0 1-1.51V2a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V8a1.65 1.65 0 0 0 1.51 1H22a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';

export function HomeHeader() {
  const { openSettings } = useApp();
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
      <div>
        <div style={{ fontSize: '24px', fontWeight: 800, color: 'rgb(var(--ink))', letterSpacing: '-.5px' }}>
          Prismiq
        </div>
        <div
          style={{
            fontSize: '10.5px',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'rgba(var(--ink),.4)',
            marginTop: '2px',
          }}
        >
          AI Scanner Suite
        </div>
      </div>
      <button
        onClick={openSettings}
        className="press"
        style={{
          position: 'relative',
          width: '44px',
          height: '44px',
          borderRadius: '15px',
          background: 'var(--tint)',
          backdropFilter: 'blur(16px) saturate(1.7)',
          WebkitBackdropFilter: 'blur(16px) saturate(1.7)',
          border: '1px solid rgba(255,255,255,.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontFamily: 'inherit',
          fontSize: '15px',
          color: 'var(--accent)',
          cursor: 'pointer',
        }}
      >
        A
        <span
          style={{
            position: 'absolute',
            right: '-3px',
            bottom: '-3px',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: 'var(--btn)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px -4px var(--glow)',
          }}
          dangerouslySetInnerHTML={{ __html: gearIcon }}
        />
      </button>
    </div>
  );
}

export function LensHeroTitle() {
  const { lens } = useApp();
  return (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <div
        style={{
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'var(--accent)',
        }}
      >
        {lens.name}
      </div>
      <h2 style={{ margin: '5px 0 6px', fontSize: '25px', fontWeight: 800, color: 'rgb(var(--ink))', letterSpacing: '-.6px' }}>
        {lens.tagline}
      </h2>
      <p style={{ margin: '0 auto', maxWidth: '290px', fontSize: '14px', lineHeight: 1.5, color: 'rgba(var(--ink),.58)' }}>
        {lens.description}
      </p>
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontSize: '12px',
        fontWeight: 700,
        letterSpacing: '.6px',
        textTransform: 'uppercase',
        color: 'rgba(var(--ink),.42)',
        margin: '0 2px 10px',
      }}
    >
      {children}
    </div>
  );
}

export function ScreenTitle({ children }: { children: ReactNode }) {
  return (
    <h2 style={{ margin: '0 0 14px', fontSize: '26px', fontWeight: 800, color: 'rgb(var(--ink))', letterSpacing: '-.5px' }}>
      {children}
    </h2>
  );
}
