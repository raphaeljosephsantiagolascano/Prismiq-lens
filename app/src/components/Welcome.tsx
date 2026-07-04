import { lenses } from '../config/lenses';
import { Icon } from '../lib/icon';
import { useApp } from '../state/AppContext';

export function Welcome() {
  const { lens, dismissWelcome } = useApp();

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 40px',
        animation: 'fadeup .5s ease',
      }}
    >
      <div
        style={{
          width: '104px',
          height: '104px',
          borderRadius: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--tint)',
          backdropFilter: 'blur(20px) saturate(1.7)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.7)',
          border: '1px solid rgba(255,255,255,.55)',
          boxShadow: '0 20px 50px -14px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.7)',
          marginBottom: '26px',
        }}
      >
        <Icon html={lens.icon} size="56px" color="var(--accent)" />
      </div>
      <div
        style={{
          fontSize: '14px',
          fontWeight: 600,
          letterSpacing: '3px',
          color: 'var(--accent)',
          textTransform: 'uppercase',
          marginBottom: '10px',
        }}
      >
        Prismiq · AI Scanner Suite
      </div>
      <h1 style={{ margin: 0, fontSize: '38px', lineHeight: 1.08, fontWeight: 800, color: 'rgb(var(--ink))', letterSpacing: '-1px' }}>
        One camera.
        <br />
        Multiple lenses.
      </h1>
      <p style={{ margin: '16px 0 0', fontSize: '16px', lineHeight: 1.5, color: 'rgba(var(--ink),.62)', maxWidth: '280px' }}>
        Four intelligent lenses — meals, produce, plants and stones — in one premium scanner.
      </p>
      <div style={{ display: 'flex', gap: '9px', margin: '30px 0 34px' }}>
        {lenses.map((m) => (
          <div
            key={m.id}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--panel)',
              border: '1px solid rgba(255,255,255,.6)',
              color: m.accent,
            }}
          >
            <Icon html={m.icon} size="22px" />
          </div>
        ))}
      </div>
      <button
        className="press"
        onClick={dismissWelcome}
        style={{
          width: '100%',
          maxWidth: '300px',
          border: 'none',
          cursor: 'pointer',
          padding: '18px',
          borderRadius: '20px',
          fontFamily: 'inherit',
          fontSize: '17px',
          fontWeight: 700,
          color: '#fff',
          background: 'var(--btn)',
          boxShadow: '0 16px 34px -12px var(--glow)',
        }}
      >
        Get Started
      </button>
      <p style={{ margin: '18px 0 0', fontSize: '12px', color: 'rgba(var(--ink),.4)' }}>
        AI-generated estimates · verify important results
      </p>
    </div>
  );
}
