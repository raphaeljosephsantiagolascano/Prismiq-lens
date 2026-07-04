import { useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { lenses } from '../config/lenses';
import { Icon } from '../lib/icon';
import { useApp } from '../state/AppContext';

const SPACING = 128;

export function LensWheel() {
  const { state, switchMode } = useApp();
  const [dragFrac, setDragFrac] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const moved = useRef(false);
  const isDragging = useRef(false);

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    startX.current = e.clientX;
    moved.current = false;
    isDragging.current = true;
    setDragging(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  };

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 4) moved.current = true;
    setDragFrac(dx / SPACING);
  };

  const onUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setDragging(false);
    let n = Math.round(state.active - dragFrac);
    n = Math.max(0, Math.min(lenses.length - 1, n));
    setDragFrac(0);
    switchMode(n);
  };

  const select = (i: number) => {
    if (moved.current) return;
    switchMode(i);
  };

  const cardStyle = (i: number): CSSProperties => {
    const rel = i - state.active + dragFrac;
    const a = Math.abs(rel);
    return {
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: '132px',
      height: '156px',
      marginLeft: '-66px',
      marginTop: '-78px',
      transform: `translateX(${rel * SPACING}px) perspective(900px) rotateY(${Math.max(-42, Math.min(42, rel * -22))}deg) scale(${Math.max(0.5, 1 - a * 0.24)})`,
      filter: `blur(${Math.min(6, a * 3)}px)`,
      opacity: Math.max(0.18, 1 - a * 0.42),
      zIndex: 100 - Math.round(a * 10),
      transition: dragging ? 'none' : 'transform .55s cubic-bezier(.34,1.4,.5,1), filter .4s ease, opacity .4s ease',
      cursor: 'pointer',
      touchAction: 'none',
    };
  };

  return (
    <div
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      style={{ position: 'relative', height: '204px', touchAction: 'none', userSelect: 'none', marginBottom: '4px' }}
    >
      {lenses.map((m, i) => {
        const on = i === state.active;
        const lim = m.dailyLimit || 5;
        const left = lim - Math.min(lim, state.usage[m.id] || 0);
        return (
          <div key={m.id} data-testid={`lens-card-${m.id}`} style={cardStyle(i)} onClick={() => select(i)}>
            <div
              style={{
                position: 'absolute',
                inset: '-18px',
                borderRadius: '32px',
                background: m.glow,
                filter: 'blur(26px)',
                opacity: on ? 0.9 : 0,
                transition: 'opacity .5s ease',
              }}
            />
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                borderRadius: '26px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                background: 'rgba(255,255,255,.55)',
                backdropFilter: 'blur(22px) saturate(1.8)',
                WebkitBackdropFilter: 'blur(22px) saturate(1.8)',
                border: '1px solid rgba(255,255,255,.7)',
                boxShadow: on
                  ? '0 22px 46px -16px rgba(0,0,0,.22),inset 0 1px 0 rgba(255,255,255,.9),inset 0 0 0 .5px rgba(255,255,255,.4)'
                  : '0 10px 24px -14px rgba(0,0,0,.14),inset 0 1px 0 rgba(255,255,255,.6)',
              }}
            >
              <Icon html={m.icon} size="44px" color={m.accent} />
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'rgb(var(--ink))', letterSpacing: '-.3px' }}>
                {m.name}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(var(--ink),.5)' }}>{m.shortName}</div>
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: m.accent,
                  marginTop: '1px',
                  opacity: on ? 1 : 0,
                  transition: 'opacity .4s ease',
                }}
              >
                {left} scans left
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function LensDots() {
  const { state, switchMode } = useApp();
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '2px 0 18px' }}>
      {lenses.map((m, i) => (
        <button
          key={m.id}
          data-testid="lens-dot"
          onClick={() => switchMode(i)}
          style={{
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            height: '7px',
            borderRadius: '99px',
            transition: 'all .4s ease',
            background: i === state.active ? m.accent : 'rgba(var(--ink),.2)',
            width: i === state.active ? '22px' : '7px',
          }}
        />
      ))}
    </div>
  );
}
