import { estimateGoal } from '../../state/AppState';
import { useApp } from '../../state/AppContext';

function segStyle(on: boolean): React.CSSProperties {
  return { color: on ? '#fff' : 'rgba(var(--ink),.6)', background: on ? 'var(--btn)' : 'rgba(255,255,255,.55)' };
}

export function PlateGoal() {
  const { state, setGoalField, saveGoal } = useApp();
  const g = state.goal;
  const targetOptions: { id: typeof g.target; label: string }[] = [
    { id: 'lose', label: 'Lose' },
    { id: 'maintain', label: 'Maintain' },
    { id: 'gain', label: 'Gain' },
  ];

  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: '1px solid rgba(255,255,255,.6)',
    background: 'var(--tint)',
    backdropFilter: 'blur(14px) saturate(1.7)',
    WebkitBackdropFilter: 'blur(14px) saturate(1.7)',
    borderRadius: '14px',
    padding: '14px 16px',
    fontFamily: 'inherit',
    fontSize: '15px',
    fontWeight: 600,
    color: 'rgb(var(--ink))',
    outline: 'none',
  };
  const labelStyle: React.CSSProperties = { fontSize: '13px', fontWeight: 600, color: 'rgba(var(--ink),.55)', margin: '0 2px 8px' };

  return (
    <>
      <h2 style={{ margin: '0 0 3px', fontSize: '26px', fontWeight: 800, color: 'rgb(var(--ink))', letterSpacing: '-.5px' }}>Your goal</h2>
      <p style={{ margin: '0 0 22px', fontSize: '13.5px', lineHeight: 1.5, color: 'rgba(var(--ink),.55)' }}>
        We use this to estimate your daily calories. Values are estimates only.
      </p>

      <div style={labelStyle}>You are</div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
        <button className="press" onClick={() => setGoalField('sex', 'male')} style={{ flex: 1, border: 'none', cursor: 'pointer', padding: '13px', borderRadius: '14px', fontFamily: 'inherit', fontSize: '14px', fontWeight: 700, transition: 'all .3s ease', ...segStyle(g.sex === 'male') }}>
          Male
        </button>
        <button className="press" onClick={() => setGoalField('sex', 'female')} style={{ flex: 1, border: 'none', cursor: 'pointer', padding: '13px', borderRadius: '14px', fontFamily: 'inherit', fontSize: '14px', fontWeight: 700, transition: 'all .3s ease', ...segStyle(g.sex === 'female') }}>
          Female
        </button>
      </div>

      <div style={labelStyle}>Age</div>
      <input
        value={g.age}
        onChange={(e) => setGoalField('age', +e.target.value || 0)}
        type="number"
        style={{ ...inputStyle, marginBottom: '18px' }}
      />

      <div style={labelStyle}>Height &amp; weight</div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input value={g.height} onChange={(e) => setGoalField('height', +e.target.value || 0)} type="number" style={{ ...inputStyle, padding: '14px 44px 14px 16px' }} />
          <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: 'rgba(var(--ink),.4)' }}>cm</span>
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <input value={g.weight} onChange={(e) => setGoalField('weight', +e.target.value || 0)} type="number" style={{ ...inputStyle, padding: '14px 44px 14px 16px' }} />
          <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: 'rgba(var(--ink),.4)' }}>kg</span>
        </div>
      </div>

      <div style={labelStyle}>Activity level</div>
      <select
        value={String(g.activity)}
        onChange={(e) => setGoalField('activity', +e.target.value)}
        style={{ ...inputStyle, marginBottom: '18px', appearance: 'none', WebkitAppearance: 'none' }}
      >
        <option value="1.2">Sedentary — little exercise</option>
        <option value="1.375">Light — 1–3 days/week</option>
        <option value="1.55">Moderate — 3–5 days/week</option>
        <option value="1.725">Active — 6–7 days/week</option>
      </select>

      <div style={labelStyle}>Goal</div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '22px' }}>
        {targetOptions.map((t) => (
          <button
            key={t.id}
            onClick={() => setGoalField('target', t.id)}
            style={{ flex: 1, border: 'none', cursor: 'pointer', padding: '13px', borderRadius: '14px', fontFamily: 'inherit', fontSize: '14px', fontWeight: 700, transition: 'all .3s ease', ...segStyle(g.target === t.id) }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '20px', background: 'linear-gradient(165deg,#20242c,#14161b)', padding: '20px 22px', marginBottom: '16px', boxShadow: '0 16px 34px -18px rgba(0,0,0,.4)' }}>
        <span style={{ fontSize: '15px', fontWeight: 600, color: 'rgba(255,255,255,.7)' }}>Estimated daily goal</span>
        <span style={{ fontSize: '30px', fontWeight: 800, color: '#fff' }}>
          {estimateGoal(g).toLocaleString()}
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,.5)' }}> kcal</span>
        </span>
      </div>
      <button
        className="press"
        onClick={saveGoal}
        style={{ width: '100%', border: 'none', cursor: 'pointer', padding: '18px', borderRadius: '20px', fontFamily: 'inherit', fontSize: '16px', fontWeight: 700, color: '#fff', background: 'var(--btn)', boxShadow: '0 16px 34px -12px var(--glow)' }}
      >
        Save goal
      </button>
    </>
  );
}
