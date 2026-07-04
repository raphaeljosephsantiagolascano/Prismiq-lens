import { BottomNav } from './BottomNav';
import { LensDots, LensWheel } from './LensWheel';
import { ScreenRouter } from './ScreenRouter';
import { SettingsSheet } from './SettingsSheet';
import { HomeHeader, LensHeroTitle } from './Shared';
import { Welcome } from './Welcome';
import { useApp } from '../state/AppContext';

export function AppShell() {
  const { state, lens, theme, themeVars } = useApp();
  const isHomeTab = state.tab === lens.tabs[0].id;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        maxWidth: '480px',
        margin: '0 auto',
        overflow: 'hidden',
        fontFamily: "'Inter Tight',-apple-system,system-ui,sans-serif",
        boxShadow: '0 0 60px rgba(0,0,0,.08)',
        ...themeVars,
      }}
    >
      {/* background layer */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, transition: 'background .7s ease', background: theme.bg }} />
        <div style={{ position: 'absolute', top: '-60px', left: '-40px', width: '240px', height: '240px', borderRadius: '50%', filter: 'blur(46px)', opacity: 0.55, animation: 'blob 14s ease-in-out infinite', background: 'var(--glow)' }} />
        <div style={{ position: 'absolute', bottom: '120px', right: '-60px', width: '260px', height: '260px', borderRadius: '50%', filter: 'blur(52px)', opacity: 0.4, animation: 'blob 18s ease-in-out infinite reverse', background: 'var(--glow)' }} />
        <div style={{ position: 'absolute', top: '8%', left: '36%', width: '160px', height: '160px', borderRadius: '50%', filter: 'blur(50px)', opacity: 0.26, animation: 'blob 22s ease-in-out infinite', background: '#ffffff' }} />
      </div>

      {state.welcome ? (
        <Welcome />
      ) : (
        <>
          <div
            key={`${lens.id}-${state.tab}`}
            className="sp-scroll"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              overflowY: 'auto',
              padding: 'max(20px, env(safe-area-inset-top)) 20px calc(122px + env(safe-area-inset-bottom))',
              animation: 'fadein .35s ease',
            }}
          >
            {isHomeTab && (
              <>
                <HomeHeader />
                <LensWheel />
                <LensDots />
                <LensHeroTitle />
              </>
            )}
            <ScreenRouter />
          </div>

          <div style={{ position: 'absolute', bottom: 'calc(16px + env(safe-area-inset-bottom))', left: '16px', right: '16px', zIndex: 45 }}>
            <BottomNav />
          </div>

          {state.showSettings && <SettingsSheet />}
        </>
      )}
    </div>
  );
}
