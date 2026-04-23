import { useState } from 'react';
import { useToast } from '../../components/ToastContext';

const POLICIES = [
  { id: 1, title: 'Faculty Evaluation Rubric v3', dept: 'All Departments', type: 'Rubric', status: 'Active', lastUpdated: 'Mar 18, 2026', criteria: ['Technical Expertise', 'Research Output', 'Teaching Philosophy', 'Cultural Fit'] },
  { id: 2, title: 'Staff Screening Checklist',    dept: 'Administration',  type: 'Checklist', status: 'Active', lastUpdated: 'Feb 5, 2026', criteria: ['Work Experience', 'Communication', 'References Verified'] },
  { id: 3, title: 'Research Associate Scorecard', dept: 'Computer Science', type: 'Scorecard', status: 'Draft',  lastUpdated: 'Mar 22, 2026', criteria: ['Publication Record', 'Technical Skills', 'Problem Solving'] },
];

export default function HiringPolicies() {
  const toast = useToast();
  const [policies, setPolicies] = useState(POLICIES);
  const [editing, setEditing] = useState(null);

  return (
    <>
      <div style={{ flex: 1, overflowY: 'auto', padding: '26px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-h)', fontSize: 22, fontWeight: 800, color: 'var(--navy)', margin: 0 }}>Hiring Policies & Rubrics</h1>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 0' }}>Define evaluation standards for all job postings across Plaksha University.</p>
          </div>
          <button className="btn btn-teal" onClick={() => toast('New policy template opened', 'info')}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span> New Policy
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {policies.map(p => (
            <div key={p.id} className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className={`badge ${p.status === 'Active' ? 'badge-green' : 'badge-amber'}`}>{p.status}</span>
                <span className="badge badge-slate">{p.type}</span>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-h)', fontWeight: 800, fontSize: 14, color: 'var(--navy)', marginBottom: 4 }}>{p.title}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{p.dept} · Updated {p.lastUpdated}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {p.criteria.map(c => (
                  <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, color: 'var(--slate)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--teal)' }}>check_circle</span>
                    {c}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 7, marginTop: 'auto', paddingTop: 4 }}>
                <button className="btn btn-teal btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { setEditing(p); toast(`Editing ${p.title}`, 'info'); }}>Edit</button>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => toast(`${p.title} duplicated`, 'success')}>Duplicate</button>
              </div>
            </div>
          ))}

          {/* Add new */}
          <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', minHeight: 200, border: '2px dashed var(--border)' }}
            onClick={() => toast('New policy template opened', 'info')}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(40,102,110,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--teal)', fontSize: 24 }}>add</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--teal)' }}>Create New Policy</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>Rubric, scorecard, or custom checklist</div>
          </div>
        </div>
      </div>
    </>
  );
}
