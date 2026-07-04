import { Icon } from '../lib/icon';
import { tabIconSvg } from '../config/lenses';
import { useApp } from '../state/AppContext';

const scanIcon =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"/><circle cx="12" cy="13" r="3.2"/></svg>';

export function BottomNav() {
  const { state, lens, goTab } = useApp();

  return (
    <div
      key={lens.id}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        gap: '2px',
        padding: '9px 10px',
        borderRadius: '26px',
        background: 'rgba(255,255,255,.58)',
        backdropFilter: 'blur(26px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(26px) saturate(1.5)',
        border: '1px solid rgba(255,255,255,.6)',
        boxShadow: '0 14px 40px -12px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.7)',
        animation: 'fadeup .4s ease',
      }}
    >
      {lens.tabs.map((t) => {
        if (t.center) {
          return (
            <button
              key="scan"
              data-testid="nav-scan"
              className="press"
              onClick={() => goTab('scan')}
              style={{
                border: 'none',
                cursor: 'pointer',
                width: '58px',
                height: '58px',
                marginTop: '-26px',
                borderRadius: '50%',
                background: lens.buttonGradient,
                boxShadow: `0 12px 26px -8px ${lens.glow},inset 0 1px 0 rgba(255,255,255,.4)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                flex: 'none',
              }}
            >
              <Icon html={scanIcon} size="26px" />
            </button>
          );
        }
        const active = state.tab === t.id || (t.id === 'scan' && state.tab === 'result');
        return (
          <button
            key={t.id}
            data-testid={`nav-tab-${t.id}`}
            onClick={() => goTab(t.id)}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              padding: '4px 6px',
              flex: 1,
              color: active ? lens.accent : 'rgba(var(--ink),.42)',
              transition: 'color .3s ease',
            }}
          >
            <Icon html={tabIconSvg(t.id)} size="22px" />
            <span style={{ fontSize: '9.5px', fontWeight: 600, letterSpacing: '.2px', whiteSpace: 'nowrap' }}>
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
