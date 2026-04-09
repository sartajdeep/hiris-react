import Layout from '../../components/Layout';

const METRICS = [
  { label: 'Time to Fill', val: '32 days', delta: '↓ 4d vs last Q', badge: 'badge-green' },
  { label: 'Offer Accept Rate', val: '78%', delta: '↑ 3% vs last Q', badge: 'badge-green' },
  { label: 'Diversity Ratio', val: '62%', delta: '→ No change', badge: 'badge-amber' },
  { label: 'Cost per Hire', val: '₹68K', delta: '↑ ₹3K vs last Q', badge: 'badge-red' },
  { label: 'Pipeline Velocity', val: '18 days', delta: '↓ 2d vs last Q', badge: 'badge-green' },
  { label: 'Applicants / Role', val: '14.3', delta: '↑ 1.8 vs last Q', badge: 'badge-teal' },
];

const DEPT_DATA = [
  { dept: 'Computer Science', pct: 85, color: 'var(--teal)' },
  { dept: 'Life Sciences',    pct: 62, color: 'var(--gold)' },
  { dept: 'Electrical Engg.', pct: 70, color: '#7C3AED' },
  { dept: 'Administration',   pct: 45, color: '#EA580C' },
];

const FUNNEL = [
  { stage: 'Applied',     count: 312, pct: 100 },
  { stage: 'Screened',    count: 198, pct: 63  },
  { stage: 'Interviewing',count: 74,  pct: 24  },
  { stage: 'Offered',     count: 11,  pct: 3.5 },
  { stage: 'Accepted',    count: 8,   pct: 2.6 },
];

export default function Analytics() {
  return (
    <Layout variant="chro">
      <div style={{ flex: 1, overflowY: 'auto', padding: '26px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-h)', fontSize: 22, fontWeight: 800, color: 'var(--navy)', margin: 0 }}>Analytics & Trends</h1>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 0' }}>Q1 FY 2025 · Plaksha University</p>
          </div>
          <span className="badge badge-slate">Q1 · FY 2025</span>
        </div>

        {/* KPI grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {METRICS.map(m => (
            <div key={m.label} className="card" style={{ padding: 18 }}>
              <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>{m.label}</div>
              <div style={{ fontSize: 28, fontWeight: 900, fontFamily: 'var(--font-h)', color: 'var(--navy)' }}>{m.val}</div>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className={`badge ${m.badge}`} style={{ fontSize: 9 }}>{m.delta}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Hiring Funnel */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontFamily: 'var(--font-h)', fontWeight: 800, fontSize: 15, color: 'var(--navy)', marginBottom: 16 }}>Hiring Funnel</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {FUNNEL.map(f => (
                <div key={f.stage}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>{f.stage}</span>
                    <span style={{ color: 'var(--muted)' }}>{f.count} <span style={{ fontWeight: 700, color: 'var(--teal)' }}>({f.pct}%)</span></span>
                  </div>
                  <div className="progress-bar" style={{ height: 6 }}>
                    <div className="progress-fill" style={{ width: `${f.pct}%`, height: '100%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dept pipeline health */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontFamily: 'var(--font-h)', fontWeight: 800, fontSize: 15, color: 'var(--navy)', marginBottom: 16 }}>Pipeline Health by Department</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {DEPT_DATA.map(d => (
                <div key={d.dept}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 5 }}>
                    <span style={{ fontWeight: 600 }}>{d.dept}</span>
                    <span style={{ fontWeight: 800, color: d.color }}>{d.pct}%</span>
                  </div>
                  <div className="progress-bar" style={{ height: 8 }}>
                    <div className="progress-fill" style={{ width: `${d.pct}%`, height: '100%', background: d.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Diversity note */}
        <div style={{ padding: 16, background: 'rgba(200,151,58,.06)', border: '1px solid rgba(200,151,58,.3)', borderRadius: 'var(--r-lg)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--gold)', fontSize: 20, flexShrink: 0 }}>info</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--navy)', marginBottom: 3 }}>Diversity Opportunity</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>Women in senior faculty roles is at 62%. HIRIS recommends setting a 70% target in the rubric for Q2 to improve representation in CS and EE departments.</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
