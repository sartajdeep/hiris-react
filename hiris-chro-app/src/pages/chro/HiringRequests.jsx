import { useState } from 'react';
import Layout from '../../components/Layout';
import { useToast } from '../../components/ToastContext';

const REQUESTS_DATA = [
  { id: 1, title: 'Sr. Data Scientist × 2', dept: 'Computer Science', submitter: 'Dr. Arjun Mehta', urgency: 'urgent', urgencyBadge: 'badge-red',   status: 'pending',       submitted: '2 days ago' },
  { id: 2, title: 'Lab Technician × 1',     dept: 'Life Sciences',    submitter: 'Prof. Meera Iyer', urgency: 'medium', urgencyBadge: 'badge-amber', status: 'pending',       submitted: '5 days ago' },
  { id: 3, title: 'ML Research Associate',   dept: 'Computer Science', submitter: 'Sartajdeep Singh',urgency: 'high',   urgencyBadge: 'badge-amber', status: 'under_review',  submitted: '3 days ago' },
  { id: 4, title: 'Lab Manager × 1',        dept: 'Life Sciences',    submitter: 'Prof. Meera Iyer', urgency: 'medium', urgencyBadge: 'badge-teal',  status: 'approved',      submitted: '1 week ago' },
  { id: 5, title: 'Administrative Officer', dept: 'Administration',   submitter: 'HR Admin',         urgency: 'low',    urgencyBadge: 'badge-slate', status: 'rejected',      submitted: '2 weeks ago' },
];

const STATUS_BADGE = { pending: 'badge-amber', under_review: 'badge-blue', approved: 'badge-green', rejected: 'badge-red' };
const STATUS_LABEL = { pending: 'Pending', under_review: 'Under Review', approved: 'Approved', rejected: 'Rejected' };

export default function HiringRequests() {
  const toast = useToast();
  const [reqs, setReqs] = useState(REQUESTS_DATA);

  function updateStatus(id, status) {
    setReqs(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    toast(`Request ${STATUS_LABEL[status].toLowerCase()}`, status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'info');
  }

  const pending = reqs.filter(r => r.status === 'pending' || r.status === 'under_review');
  const resolved = reqs.filter(r => r.status === 'approved' || r.status === 'rejected');

  return (
    <Layout variant="chro">
      <div style={{ flex: 1, overflowY: 'auto', padding: '26px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-h)', fontSize: 22, fontWeight: 800, color: 'var(--navy)', margin: 0 }}>Hiring Requests</h1>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 0' }}>Review and approve headcount requests from hiring managers</p>
          </div>
          <span className="badge badge-amber">{pending.length} Pending Review</span>
        </div>

        {/* Pending */}
        {pending.length > 0 && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-h)', fontSize: 14, fontWeight: 700, color: 'var(--navy)', marginBottom: 12 }}>Awaiting Action</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pending.map(r => (
                <div key={r.id} className="card" style={{ padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)' }}>{r.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{r.dept} · Requested by {r.submitter} · {r.submitted}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span className={`badge ${r.urgencyBadge}`}>{r.urgency}</span>
                      <span className={`badge ${STATUS_BADGE[r.status]}`}>{STATUS_LABEL[r.status]}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-teal btn-sm" onClick={() => updateStatus(r.id, 'approved')}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check</span> Approve
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => updateStatus(r.id, 'under_review')}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>rate_review</span> Request Info
                    </button>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)', borderColor: '#FECACA' }} onClick={() => updateStatus(r.id, 'rejected')}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resolved */}
        {resolved.length > 0 && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-h)', fontSize: 14, fontWeight: 700, color: 'var(--navy)', marginBottom: 12 }}>Resolved</h3>
            <div className="card" style={{ overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead><tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                  {['Position','Department','Submitted by','Urgency','Status'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '9px 14px', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {resolved.map(r => (
                    <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 600 }}>{r.title}</td>
                      <td style={{ padding: '10px 14px', color: 'var(--muted)' }}>{r.dept}</td>
                      <td style={{ padding: '10px 14px', color: 'var(--muted)' }}>{r.submitter}</td>
                      <td style={{ padding: '10px 14px' }}><span className={`badge ${r.urgencyBadge}`}>{r.urgency}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className={`badge ${STATUS_BADGE[r.status]}`}>{STATUS_LABEL[r.status]}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
