import { useState } from 'react';
import Layout from '../../components/Layout';
import { useToast } from '../../components/ToastContext';

const MANAGERS = [
  { id: 1, name: 'Sartajdeep Singh', role: 'Hiring Manager', dept: 'Computer Science & AI', assigned: 3, color: '#28666E', initials: 'SS' },
  { id: 2, name: 'Dr. Arjun Mehta',  role: 'Hiring Manager', dept: 'Computer Science',      assigned: 2, color: '#7C3AED', initials: 'AM' },
  { id: 3, name: 'Prof. Meera Iyer', role: 'Hiring Manager', dept: 'Life Sciences',         assigned: 2, color: '#EA580C', initials: 'MI' },
];

const UNASSIGNED = [
  { id: 1, title: 'Asst. Prof – Psychology', dept: 'Social Sciences' },
  { id: 2, title: 'Research Engineer',        dept: 'Computer Science' },
  { id: 3, title: 'Lab Coordinator',          dept: 'Chemistry' },
  { id: 4, title: 'Academic Advisor',         dept: 'Administration' },
  { id: 5, title: 'Content Strategist',       dept: 'Communications' },
];

export default function AssignManagers() {
  const toast = useToast();
  const [unassigned, setUnassigned] = useState(UNASSIGNED);

  function assign(jobId, jobTitle) {
    toast(`${jobTitle} assigned to Sartajdeep Singh`, 'success');
    setUnassigned(u => u.filter(j => j.id !== jobId));
  }

  return (
    <Layout variant="chro">
      <aside style={{ width: '35%', overflowY: 'auto', borderRight: '1px solid var(--border)', padding: 26, display: 'flex', flexDirection: 'column', gap: 18, background: 'rgba(255,255,255,.5)' }}>
        <h2 style={{ fontFamily: 'var(--font-h)', fontSize: 18, fontWeight: 800, color: 'var(--navy)', margin: 0 }}>Hiring Managers</h2>
        {MANAGERS.map(m => (
          <div key={m.id} className="card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: m.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-h)', fontWeight: 800, fontSize: 14 }}>{m.initials}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--navy)' }}>{m.name}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>{m.dept}</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '8px 12px', background: 'var(--surface)', borderRadius: 8 }}>
              <span style={{ color: 'var(--muted)' }}>Assigned positions</span>
              <span style={{ fontWeight: 800, color: 'var(--teal)' }}>{m.assigned}</span>
            </div>
          </div>
        ))}
      </aside>

      <section style={{ flex: 1, overflowY: 'auto', padding: 26, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-h)', fontSize: 18, fontWeight: 800, color: 'var(--navy)', margin: 0 }}>Unassigned Positions</h2>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 0' }}>{unassigned.length} positions need a hiring manager</p>
          </div>
          <span className="badge badge-red">{unassigned.length} Pending</span>
        </div>

        {unassigned.length === 0 ? (
          <div className="card" style={{ padding: 40, textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#16A34A' }}>check_circle</span>
            <div style={{ fontWeight: 700, marginTop: 12, color: 'var(--navy)' }}>All positions assigned!</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {unassigned.map(j => (
              <div key={j.id} className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{j.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{j.dept}</div>
                </div>
                <select className="field" style={{ width: 180 }} defaultValue="">
                  <option value="" disabled>Select manager…</option>
                  {MANAGERS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <button className="btn btn-teal btn-sm" onClick={() => assign(j.id, j.title)}>Assign</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
