import { macroColor } from '../../config/lenses';
import { useApp } from '../../state/AppContext';

const sparkleIcon = 'M12 2l1.9 5.6L19.5 9l-4.4 3.4L16.4 18 12 14.8 7.6 18l1.3-5.6L4.5 9l5.6-1.4L12 2Z';

export function ResultScreen() {
  const { state, lens, goScan, goHistory, saveResult, answerChat } = useApp();
  const isPlate = lens.id === 'plate';
  const r = lens.result;
  const conf = r.confidence;
  const confLabel = conf >= 85 ? 'High confidence' : conf >= 70 ? 'Moderate confidence' : 'Low confidence';
  const confColor = conf >= 85 ? '#22A45D' : conf >= 70 ? '#FF9F0A' : '#FF375F';
  const resultAka = r.aka ? `Also known as ${r.aka}` : r.sci ? `Scientific name · ${r.sci}` : '';

  const chatCfg = (isPlate && r.chat) || [];
  const cst = state.chat;
  type Msg = { role: 'ai' | 'user'; text: string };
  const chatMsgs: Msg[] = [];
  for (let i = 0; i < cst.step && i < chatCfg.length; i++) {
    chatMsgs.push({ role: 'ai', text: chatCfg[i].ai });
    chatMsgs.push({ role: 'user', text: cst.answers[i] });
  }
  let chatOptions: string[] = [];
  if (!cst.typing) {
    if (cst.step < chatCfg.length) {
      chatMsgs.push({ role: 'ai', text: chatCfg[cst.step].ai });
      chatOptions = chatCfg[cst.step].options;
    } else if (chatCfg.length) {
      chatMsgs.push({ role: 'ai', text: 'Perfect — I’ve updated your estimate. Your numbers look solid ✨' });
    }
  }
  const chatSummary = chatCfg.map((c, i) => ({ q: c.ai, a: cst.answers[i] != null ? cst.answers[i] : c.options?.[0] || '—' }));

  const hasPortionQs = isPlate && !state.fromHistory && !!(r.portionQs && r.portionQs.length);
  const hasChatSummary = isPlate && state.fromHistory && chatSummary.length > 0;

  return (
    <div style={{ animation: 'reveal .5s ease' }}>
      {!state.fromHistory ? (
        <div onClick={goScan} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: 600, color: 'rgba(var(--ink),.55)', marginBottom: '14px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          Scan again
        </div>
      ) : (
        <div onClick={goHistory} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: 600, color: 'rgba(var(--ink),.55)', marginBottom: '14px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          Back to history
        </div>
      )}

      <div
        style={{
          position: 'relative',
          aspectRatio: '16/10',
          borderRadius: '22px',
          overflow: 'hidden',
          marginBottom: '16px',
          border: '1px solid rgba(255,255,255,.5)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,.55)',
          background: 'repeating-linear-gradient(135deg,rgba(var(--ink),.055) 0 11px,rgba(var(--ink),.02) 11px 22px)',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'ui-monospace,SFMono-Regular,Menlo,monospace', fontSize: '11px', letterSpacing: '.5px', color: 'rgba(var(--ink),.4)' }}>
          {lens.subjectWord} photo
        </div>
        <div style={{ position: 'absolute', top: '12px', left: '12px', padding: '5px 10px', borderRadius: '99px', background: 'var(--panel)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', fontSize: '11px', fontWeight: 700, color: 'var(--accent)' }}>
          Captured
        </div>
      </div>

      <div
        style={{
          textAlign: 'left',
          marginBottom: '18px',
          padding: '18px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg,var(--glass1) 0%,var(--glass2) 100%)',
          backdropFilter: 'blur(24px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
          border: '1px solid rgba(255,255,255,.6)',
          boxShadow: '0 20px 46px -18px var(--glow),inset 0 1px 1px rgba(255,255,255,.8)',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: 'rgb(var(--ink))', letterSpacing: '-.5px' }}>{r.title}</h2>
        <div style={{ fontSize: '14px', color: 'rgba(var(--ink),.55)', marginTop: '3px' }}>{r.subtitle}</div>
        {resultAka && <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--accent)', marginTop: '4px' }}>{resultAka}</div>}
        {r.description && <p style={{ margin: '8px 0 0', fontSize: '13px', lineHeight: 1.5, color: 'rgba(var(--ink),.6)' }}>{r.description}</p>}
        <div style={{ marginTop: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgb(var(--ink))' }}>{confLabel}</span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: confColor }}>{conf}%</span>
          </div>
          <div style={{ height: '8px', borderRadius: '99px', background: 'rgba(var(--ink),.09)', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: '99px', width: `${conf}%`, background: confColor, boxShadow: `0 0 10px -1px ${confColor}` }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
        {r.fields.map((f, i) => {
          const color = macroColor[f.label] || lens.accent;
          return (
            <div key={i} style={{ position: 'relative', overflow: 'hidden', background: 'var(--tint)', backdropFilter: 'blur(16px) saturate(1.7)', WebkitBackdropFilter: 'blur(16px) saturate(1.7)', border: '1px solid rgba(255,255,255,.5)', borderRadius: '18px', padding: '15px 16px 15px 18px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.55)' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: color }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', flex: 'none', background: color }} />
                <div style={{ fontSize: '11.5px', fontWeight: 600, letterSpacing: '.4px', textTransform: 'uppercase', color: 'rgba(var(--ink),.45)' }}>{f.label}</div>
              </div>
              <div style={{ fontSize: '19px', fontWeight: 800, color, marginTop: '4px' }}>{f.value}</div>
            </div>
          );
        })}
      </div>

      {r.lists.map((rl, i) => (
        <div key={i} style={{ background: 'var(--soft)', border: '1px solid rgba(255,255,255,.5)', borderRadius: '18px', padding: '15px 16px', marginBottom: '14px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'rgb(var(--ink))', marginBottom: '10px' }}>{rl.title}</div>
          {rl.items.map((t, j) => (
            <div key={j} style={{ display: 'flex', gap: '9px', alignItems: 'flex-start', marginBottom: '8px' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none', marginTop: '1px' }}>
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <span style={{ fontSize: '13px', lineHeight: 1.45, color: 'rgba(var(--ink),.7)' }}>{t}</span>
            </div>
          ))}
        </div>
      ))}

      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', background: '#fdecec', border: '1px solid rgba(220,60,60,.18)', borderRadius: '16px', padding: '13px 15px', marginBottom: '16px' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d23b3b" strokeWidth="2" style={{ flex: 'none', marginTop: '1px' }}>
          <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontSize: '12px', lineHeight: 1.5, color: '#b23636' }}>{r.caution}</span>
      </div>

      {hasPortionQs && (
        <div style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,.6)', borderRadius: '20px', padding: '16px', marginBottom: '16px', boxShadow: '0 8px 22px -16px rgba(0,0,0,.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ width: '32px', height: '32px', flex: 'none', borderRadius: '50%', background: 'var(--btn)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 6px 16px -6px var(--glow)' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d={sparkleIcon} /></svg>
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'rgb(var(--ink))' }}>Refine with Prismiq AI</div>
              <div style={{ fontSize: '11px', color: 'rgba(var(--ink),.5)' }}>A quick chat sharpens your estimate</div>
            </div>
          </div>
          <div style={{ background: 'var(--soft)', border: '1px solid rgba(255,255,255,.5)', borderRadius: '16px', padding: '13px 13px 15px' }}>
            {chatMsgs.map((cm, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: cm.role === 'ai' ? 'flex-start' : 'flex-end', marginBottom: '8px' }}>
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '9px 13px',
                    borderRadius: cm.role === 'ai' ? '15px 15px 15px 4px' : '15px 15px 4px 15px',
                    fontSize: '13px',
                    lineHeight: 1.42,
                    background: cm.role === 'ai' ? 'var(--surface)' : lens.buttonGradient,
                    color: cm.role === 'ai' ? 'rgb(var(--ink))' : '#fff',
                    boxShadow: '0 4px 14px -9px rgba(0,0,0,.3)',
                  }}
                >
                  {cm.text}
                </div>
              </div>
            ))}
            {cst.typing && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '12px 14px', borderRadius: '15px 15px 15px 4px', background: 'var(--surface)', boxShadow: '0 4px 14px -9px rgba(0,0,0,.3)' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(var(--ink),.4)', animation: 'typedot 1.1s ease infinite' }} />
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(var(--ink),.4)', animation: 'typedot 1.1s ease infinite .15s' }} />
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(var(--ink),.4)', animation: 'typedot 1.1s ease infinite .3s' }} />
                </div>
              </div>
            )}
            {chatOptions.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'flex-end', marginTop: '6px' }}>
                {chatOptions.map((o, i) => (
                  <button key={i} className="press" onClick={() => answerChat(o)} style={{ border: '1.5px solid var(--accent)', background: 'var(--panel)', color: 'var(--accent)', fontFamily: 'inherit', fontSize: '12.5px', fontWeight: 700, padding: '8px 14px', borderRadius: '99px', cursor: 'pointer' }}>
                    {o}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {hasChatSummary && (
        <div
          style={{
            background: 'linear-gradient(135deg,var(--glass1) 0%,var(--glass2) 100%)',
            backdropFilter: 'blur(24px) saturate(1.8)',
            WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
            border: '1px solid rgba(255,255,255,.6)',
            borderRadius: '20px',
            padding: '16px',
            marginBottom: '16px',
            boxShadow: '0 20px 46px -18px var(--glow),inset 0 1px 1px rgba(255,255,255,.8)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ width: '32px', height: '32px', flex: 'none', borderRadius: '50%', background: 'var(--btn)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 6px 16px -6px var(--glow)' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d={sparkleIcon} /></svg>
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'rgb(var(--ink))' }}>Refine summary</div>
              <div style={{ fontSize: '11px', color: 'rgba(var(--ink),.5)' }}>How this estimate was sharpened</div>
            </div>
          </div>
          {chatSummary.map((cs, i) => (
            <div key={i} style={{ padding: '10px 0', borderTop: '1px solid rgba(var(--ink),.07)' }}>
              <div style={{ fontSize: '12px', color: 'rgba(var(--ink),.5)', lineHeight: 1.4 }}>{cs.q}</div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'rgb(var(--ink))', marginTop: '3px' }}>{cs.a}</div>
            </div>
          ))}
        </div>
      )}

      {!state.fromHistory && (
        <>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="press" onClick={saveResult} style={{ flex: 1, border: 'none', cursor: 'pointer', padding: '17px', borderRadius: '18px', fontFamily: 'inherit', fontSize: '15px', fontWeight: 700, color: '#fff', background: 'var(--btn)', boxShadow: '0 14px 30px -12px var(--glow)' }}>
              Save result
            </button>
          </div>
          <button
            className="press"
            onClick={goHistory}
            style={{ width: '100%', marginTop: '10px', border: '1px solid rgba(255,255,255,.5)', cursor: 'pointer', padding: '15px', borderRadius: '18px', fontFamily: 'inherit', fontSize: '14.5px', fontWeight: 700, color: 'rgb(var(--ink))', background: 'var(--tint)', backdropFilter: 'blur(16px) saturate(1.7)', WebkitBackdropFilter: 'blur(16px) saturate(1.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v5h5" />
              <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
              <path d="M12 7v5l3 2" />
            </svg>
            View history
          </button>
        </>
      )}
    </div>
  );
}
