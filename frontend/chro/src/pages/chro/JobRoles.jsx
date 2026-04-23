import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useToast } from '../../components/ToastContext';
import { api } from '../../api/client';

const JOBS_FALLBACK = [
  { id: 1, title: 'ML Research Associate',  department: 'Computer Science',  status: 'active', urgency: 'urgent', manager_name: 'Sartajdeep Singh', applied: 24, stage: 'Screening' },
  { id: 2, title: 'Asst. Professor – EE',   department: 'Electrical Engg.',  status: 'active', urgency: 'high',   manager_name: 'Sartajdeep Singh', applied: 11, stage: 'Interview' },
  { id: 3, title: 'Lab Manager',            department: 'Life Sciences',     status: 'active', urgency: 'medium', manager_name: 'Prof. Meera Iyer', applied: 8,  stage: 'Applied' },
  { id: 4, title: 'Sr. Data Scientist × 2', department: 'Computer Science',  status: 'active', urgency: 'urgent', manager_name: 'Dr. Arjun Mehta', applied: 31, stage: 'Screening' },
  { id: 5, title: 'Lab Technician × 1',     department: 'Life Sciences',     status: 'active', urgency: 'medium', manager_name: 'Prof. Meera Iyer', applied: 6,  stage: 'Applied' },
  { id: 6, title: 'Asst. Professor – CS',   department: 'Computer Science',  status: 'active', urgency: 'high',   manager_name: 'Dr. Arjun Mehta', applied: 18, stage: 'Offered' },
];

const STAGE_BADGE = { Screening: 'badge-blue', Interview: 'badge-amber', Applied: 'badge-slate', Offered: 'badge-green', Rejected: 'badge-red' };
const URGENCY_BADGE = { urgent: 'badge-red', high: 'badge-amber', medium: 'badge-teal', low: 'badge-slate' };

export default function JobRoles() {
  const toast = useToast();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(JOBS_FALLBACK);

  useEffect(() => {
    api.get('/jobs').then(data => { if (data?.length) setJobs(data); }).catch(() => {});
  }, []);

  return (
    <Layout variant="chro">
      <div style={{ flex: 1, overflowY: 'auto', padding: '26px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-h)', fontSize: 22, fontWeight: 800, color: 'var(--navy)', margin: 0 }}>Job Roles & Pipelines</h1>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 0' }}>{jobs.length} active positions across Plaksha University</p>
          </div>
          <button className="btn btn-teal" onClick={() => navigate('/hm/new-posting')}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span> New Role
          </button>
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead><tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
              {['Job Title','Department','Urgency','Manager','Applied','Stage','Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {jobs.map(j => (
                <tr key={j.id} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}
                >
                  <td style={{ padding: '11px 14px', fontWeight: 700 }}>{j.title}</td>
                  <td style={{ padding: '11px 14px', color: 'var(--muted)' }}>{j.department}</td>
                  <td style={{ padding: '11px 14px' }}><span className={`badge ${URGENCY_BADGE[j.urgency] || 'badge-slate'}`}>{j.urgency}</span></td>
                  <td style={{ padding: '11px 14px', color: 'var(--muted)' }}>{j.manager_name || '—'}</td>
                  <td style={{ padding: '11px 14px', fontWeight: 700 }}>{j.applied || 0}</td>
                  <td style={{ padding: '11px 14px' }}><span className={`badge ${STAGE_BADGE[j.stage] || 'badge-slate'}`}>{j.stage || 'Applied'}</span></td>
                  <td style={{ padding: '11px 14px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/hm/pipeline')}>Pipeline</button>
                      <button className="btn btn-teal btn-sm" onClick={() => toast(`Editing ${j.title}`, 'info')}>Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
