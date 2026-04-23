import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { api } from '../../api/client';
import dummyCandidates from '../../data/dummy_candidates.json';

/* ─────────── Static seed data ─────────── */

const DEPT_PIPELINE = [
  { code: 'CS', name: 'Computer Science', open: 8, interviewing: 6, offered: 2, status: 'On Track', badge: 'badge-green' },
  { code: 'LS', name: 'Life Sciences',    open: 5, interviewing: 3, offered: 1, status: 'Delayed',  badge: 'badge-amber' },
  { code: 'AD', name: 'Administration',   open: 6, interviewing: 8, offered: 3, status: 'At Risk',  badge: 'badge-red'   },
  { code: 'EE', name: 'Electrical Engg.', open: 4, interviewing: 4, offered: 0, status: 'On Track', badge: 'badge-green' },
];

const ACTIVITY_FEED = [
  { icon: 'check_circle',   iconBg: 'rgba(22,163,74,.1)',   iconColor: '#16A34A', msg: 'Offer accepted',         who: 'Dr. Priya Sharma',  sub: 'Asst. Professor, CS · Today 10:14 AM' },
  { icon: 'calendar_month', iconBg: 'rgba(245,158,11,.1)',  iconColor: '#F59E0B', msg: 'Interview scheduled',    who: 'Rahul Verma',       sub: 'Tech Interview 2 · AI Dept · Yesterday 4:45 PM' },
  { icon: 'person_add',     iconBg: 'rgba(40,102,110,.1)',  iconColor: 'var(--teal)', msg: 'Application received', who: 'Karan Malhotra',  sub: 'Data Scientist · CS · Yesterday 2:10 PM' },
  { icon: 'description',    iconBg: 'rgba(37,99,235,.1)',   iconColor: '#2563EB', msg: 'Resume screened by AI',  who: 'Anika Nair',        sub: 'Research Assoc. · CS · Yesterday 11:00 AM' },
  { icon: 'policy',         iconBg: 'rgba(200,151,58,.12)', iconColor: '#C8973A', msg: 'Rubric updated',         who: 'Smriti Kinra',      sub: 'Faculty Evaluation v3 · Mar 18, 2026' },
  { icon: 'send',           iconBg: 'rgba(40,102,110,.1)',  iconColor: 'var(--teal)', msg: 'Calendly link sent', who: 'Simran Bedi',       sub: 'Final Round · CS · Mar 17, 2026' },
];

const UPLOADED_RUBRICS_SEED = [
  { id: 1, name: 'Faculty Evaluation v3.pdf', date: 'Mar 18, 2026', size: '245 KB' },
  { id: 2, name: 'Research Policy 2025.pdf',  date: 'Feb 10, 2026', size: '128 KB' },
];

const FINAL_ROUND_SEED = dummyCandidates;
const APPROVALS_SEED = dummyCandidates.filter(c => c.hmVerdict !== 'Recommended' || c.aiScore < 80);

/* ─────────── Upload Modal ─────────── */

function UploadModal({ onClose, onUploaded }) {
  const fileRef = useRef();
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);

  return (
    <Overlay onClose={onClose}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={modalTitle}>Upload Policy / Rubric</div>
        <CloseBtn onClick={onClose} />
      </div>

      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); setFile(e.dataTransfer.files[0]); }}
        onClick={() => fileRef.current.click()}
        style={{
          border: `2px dashed ${dragging ? 'var(--teal)' : 'var(--border)'}`,
          borderRadius: 12, padding: '32px 20px', textAlign: 'center', cursor: 'pointer',
          background: dragging ? 'rgba(40,102,110,.05)' : 'var(--surface)',
          transition: 'all .2s', marginBottom: 16,
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'var(--teal)', display: 'block', marginBottom: 8 }}>upload_file</span>
        {file
          ? <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--teal)' }}>{file.name}</div>
          : <>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>Drop PDF or DOCX here</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>or click to browse</div>
            </>
        }
        <input ref={fileRef} type="file" accept=".pdf,.docx" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>Cancel</button>
        <button className="btn btn-teal btn-sm" style={{ flex: 1, justifyContent: 'center' }}
          onClick={() => { if (file) { onUploaded(file.name); onClose(); } }}
        >Upload</button>
      </div>
    </Overlay>
  );
}

/* ─────────── Candidate Detail Modal ─────────── */

function CandidateDetailModal({ candidate, onClose, onDecision }) {
  if (!candidate) return null;
  return (
    <Overlay onClose={onClose} width={460}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={modalTitle}>Candidate Review</div>
        <CloseBtn onClick={onClose} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, padding: 16, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)' }}>
        <Avatar c={candidate} size={48} fontSize={18} />
        <div>
          <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--navy)', fontFamily: 'var(--font-h)' }}>{candidate.name}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{candidate.role} · {candidate.dept}</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--teal)', fontFamily: 'var(--font-h)' }}>{candidate.aiScore}</div>
          <div style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>AI Score</div>
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={fieldLabel}>HM Verdict</div>
        <span className={`badge ${verdictBadge(candidate.hmVerdict)}`} style={{ fontSize: 11 }}>{candidate.hmVerdict}</span>
      </div>

      <div style={{ marginBottom: 22 }}>
        <div style={fieldLabel}>Summary</div>
        <div style={{ fontSize: 12, color: 'var(--slate)', lineHeight: 1.7, background: 'var(--surface)', padding: 14, borderRadius: 10, border: '1px solid var(--border)' }}>
          {candidate.summary}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center', color: 'var(--error)', borderColor: '#FECACA' }}
          onClick={() => onDecision(candidate.id, 'reject')}>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>cancel</span> Reject
        </button>
        <button className="btn btn-teal btn-sm" style={{ flex: 1, justifyContent: 'center' }}
          onClick={() => onDecision(candidate.id, 'approve')}>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check_circle</span> Approve & Hire
        </button>
      </div>
    </Overlay>
  );
}

/* ─────────── Shared tiny helpers ─────────── */

function Overlay({ children, onClose, width = 430 }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,31,61,.45)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}
         onClick={onClose}>
      <div className="anim-scale-in" style={{ background: 'var(--white)', borderRadius: 18, padding: 28, width, maxWidth: '94vw', boxShadow: '0 28px 60px rgba(0,0,0,.18)' }}
           onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
function CloseBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', color: 'var(--muted)', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
  );
}
function Avatar({ c, size = 42, fontSize = 15 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-h)', fontWeight: 800, fontSize, color: 'white', flexShrink: 0 }}>
      {c.initials}
    </div>
  );
}
function verdictBadge(v) {
  return v === 'Recommended' ? 'badge-green' : v === 'On the fence' ? 'badge-amber' : 'badge-red';
}
const modalTitle = { fontFamily: 'var(--font-h)', fontSize: 16, fontWeight: 800, color: 'var(--navy)' };
const fieldLabel = { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--muted)', marginBottom: 6 };
const secTitle   = { fontFamily: 'var(--font-h)', fontSize: 15, fontWeight: 800, color: 'var(--navy)', margin: '0 0 12px' };

/* ─────────── Notification pill ─────────── */
function NotifBadge({ count }) {
  if (!count) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: 18, height: 18, borderRadius: 20, background: '#EF4444',
      color: 'white', fontSize: 10, fontWeight: 800, padding: '0 5px',
      marginLeft: 6, animation: 'scaleIn .25s ease-out forwards',
    }}>{count}</span>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */

export default function CHRODashboard() {
  const toast    = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  /* tab state */
  const [activeTab, setActiveTab] = useState('dashboard');
  const [highlightedCandidateId, setHighlightedCandidateId] = useState(null);

  /* data state */
  const [rubrics,      setRubrics]     = useState(UPLOADED_RUBRICS_SEED);
  const [finalCands,   setFinalCands]  = useState(FINAL_ROUND_SEED);
  const [approvals,    setApprovals]   = useState(APPROVALS_SEED);
  const [newCandCount, setNewCandCount]= useState(1); // simulate 1 new candidate already queued

  /* modals */
  const [showUpload,    setShowUpload]    = useState(false);
  const [reviewCand,    setReviewCand]    = useState(null);

  /* Fetch data on mount */
  useEffect(() => {
    // Fetch candidates with HR Round status for the Candidates tab
    api.get('/candidates?status=HR Round').then(d => {
      setFinalCands(d.map(c => ({
        id: c.id,
        name: c.name,
        role: c.role_applied,
        dept: 'Computer Science', // Placeholder, map from opening_id if needed
        initials: c.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        color: '#28666E',
        aiScore: 85,
        hmVerdict: 'Recommended',
        isNew: false,
      })));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    const candidateId = params.get('candidateId');

    if (tab === 'candidates') {
      setActiveTab('candidates');
    } else if (tab === 'approvals') {
      setActiveTab('approvals');
    } else {
      setActiveTab('dashboard');
    }

    setHighlightedCandidateId(candidateId ? Number(candidateId) : null);
  }, [location.search]);

  /* ── Simulate a new candidate arriving every 30 s ── */
  const newCandRef = useRef(0);
  useEffect(() => {
    const timer = setInterval(() => {
      newCandRef.current += 1;
      const fake = {
        id: 100 + newCandRef.current,
        name: ['Arjun Mehta', 'Sneha Kapoor', 'Dev Patel'][newCandRef.current % 3],
        role: ['Sr. Researcher – EE', 'Lab Coordinator', 'Asst. Prof – LS'][newCandRef.current % 3],
        dept: ['Electrical Engg.', 'Life Sciences', 'Life Sciences'][newCandRef.current % 3],
        initials: ['AM', 'SK', 'DP'][newCandRef.current % 3],
        color: ['#059669', '#7C3AED', '#EA580C'][newCandRef.current % 3],
        aiScore: 78 + newCandRef.current,
        hmVerdict: 'Recommended',
        isNew: true,
      };
      setFinalCands(prev => [fake, ...prev]);
      setNewCandCount(n => n + 1);
      toast(`New final-round candidate: ${fake.name}`, 'info');
    }, 30000);
    return () => clearInterval(timer);
  }, [toast]);

  /* clear new-candidate badge when user visits that tab */
  function goTab(t) {
    if (t === 'candidates') {
      navigate('/?tab=candidates', { replace: true });
      setNewCandCount(0);
    } else {
      navigate('/', { replace: true });
    }
    setActiveTab(t);
  }

  /* handlers */
  function handleUpload(fileName) {
    setRubrics(prev => [{ id: Date.now(), name: fileName, date: 'Today', size: '—' }, ...prev]);
    toast(`"${fileName}" uploaded successfully`, 'success');
  }

  function handleDecision(id, action) {
    const c = approvals.find(x => x.id === id);
    setApprovals(prev => prev.filter(x => x.id !== id));
    setReviewCand(null);
    toast(`${c.name} ${action === 'approve' ? 'approved ✓ — offer will be sent' : 'rejected'}`, action === 'approve' ? 'success' : 'error');
  }

  /* ── Tab bar definition ── */
  const TABS = [
    { id: 'dashboard',  icon: 'dashboard',    label: 'Dashboard' },
    { id: 'candidates', icon: 'groups',        label: 'Candidates',  notif: newCandCount },
    { id: 'approvals',  icon: 'how_to_reg',   label: 'Approvals',   notif: approvals.length },
  ];

  return (
    <>
      {/* Modals */}
      {showUpload  && <UploadModal onClose={() => setShowUpload(false)} onUploaded={handleUpload} />}
      {reviewCand  && <CandidateDetailModal candidate={reviewCand} onClose={() => setReviewCand(null)} onDecision={handleDecision} />}

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* ── Page title row ── */}
        <div style={{ padding: '22px 32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-h)', fontSize: 24, fontWeight: 800, color: 'var(--navy)', margin: 0 }}>Welcome, Smriti</h1>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 0' }}>Organisation-wide hiring control centre · Plaksha University</p>
          </div>
          <span className="badge badge-slate">Q1 · FY 2025</span>
        </div>

        {/* ── In-page tab bar ── */}
        <div style={{ padding: '18px 32px 0', display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', background: 'transparent' }}>
          {TABS.map(t => {
            const active = activeTab === t.id;
            return (
              <button key={t.id} onClick={() => goTab(t.id)} style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '9px 18px', border: 'none', cursor: 'pointer',
                background: 'none', fontFamily: 'var(--font-b)',
                fontSize: 12, fontWeight: active ? 700 : 600,
                color: active ? 'var(--teal)' : 'var(--muted)',
                borderBottom: active ? '2px solid var(--teal)' : '2px solid transparent',
                borderRadius: '6px 6px 0 0',
                transition: 'all .15s',
                marginBottom: -1,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{t.icon}</span>
                {t.label}
                <NotifBadge count={t.notif} />
              </button>
            );
          })}
        </div>

        {/* ── Tab content ── */}
        <div style={{ flex: 1, padding: '26px 32px', display: 'flex', flexDirection: 'column', gap: 26 }}>

          {/* ══ TAB 1: DASHBOARD ══ */}
          {activeTab === 'dashboard' && (
            <>
              {/* KPI row */}
              <section>
                <h2 style={secTitle}>Hiring Overview</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
                  {[
                    { val: 47,    label: 'Open Positions',    color: 'var(--teal)',  icon: 'work' },
                    { val: 312,   label: 'Active Applicants', color: 'var(--teal)',  icon: 'group' },
                    { val: '32d', label: 'Avg. Time to Fill', color: 'var(--gold)',  icon: 'schedule' },
                    { val: '78%', label: 'Offer Accept Rate', color: 'var(--navy)', icon: 'handshake' },
                  ].map(k => (
                    <div key={k.label} className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 40, height: 40, background: `${k.color}18`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 20, color: k.color }}>{k.icon}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: k.color, fontFamily: 'var(--font-h)', lineHeight: 1 }}>{k.val}</div>
                        <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 600, marginTop: 2 }}>{k.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dept pipeline */}
                <div className="card" style={{ overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--navy)', fontFamily: 'var(--font-h)' }}>Department Pipeline</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span className="badge badge-green">4 On Track</span>
                      <span className="badge badge-amber">1 Delayed</span>
                      <span className="badge badge-red">1 At Risk</span>
                    </div>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                        {['Department','Open','Interviewing','Offered','Status'].map(h => (
                          <th key={h} style={{ textAlign: h === 'Department' ? 'left' : 'center', padding: '9px 14px', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {DEPT_PIPELINE.map(d => (
                        <tr key={d.code} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '10px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ width: 26, height: 26, background: 'rgba(40,102,110,.1)', color: 'var(--teal)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700 }}>{d.code}</div>
                              <span style={{ fontWeight: 600 }}>{d.name}</span>
                            </div>
                          </td>
                          <td style={{ textAlign: 'center', fontWeight: 700 }}>{d.open}</td>
                          <td style={{ textAlign: 'center', color: 'var(--muted)' }}>{d.interviewing}</td>
                          <td style={{ textAlign: 'center', color: 'var(--muted)' }}>{d.offered}</td>
                          <td style={{ textAlign: 'center' }}><span className={`badge ${d.badge}`}>{d.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Recent Activity */}
              <section>
                <h2 style={secTitle}>Recent Activity</h2>
                <div className="card" style={{ overflow: 'hidden' }}>
                  {ACTIVITY_FEED.map((a, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 18px', borderBottom: i < ACTIVITY_FEED.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <div style={{ width: 32, height: 32, background: a.iconBg, color: a.iconColor, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 15 }}>{a.icon}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--slate)' }}>
                          {a.msg} — <span style={{ color: 'var(--teal)' }}>{a.who}</span>
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 1 }}>{a.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Rubrics & Policies */}
              <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h2 style={{ ...secTitle, margin: 0 }}>Institutional Rubrics & Policies</h2>
                  <button className="btn btn-teal btn-sm" onClick={() => setShowUpload(true)}>
                    <span className="material-symbols-outlined" style={{ fontSize: 15 }}>upload</span>
                    Upload Document
                  </button>
                </div>
                <div className="card" style={{ overflow: 'hidden' }}>
                  {rubrics.length === 0 && (
                    <div style={{ padding: 32, textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>No documents yet.</div>
                  )}
                  {rubrics.map((r, i) => (
                    <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 18px', borderBottom: i < rubrics.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#DC2626', flexShrink: 0 }}>picture_as_pdf</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy)' }}>{r.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--muted)' }}>{r.date} · {r.size}</div>
                      </div>
                      <button className="btn btn-ghost btn-sm" onClick={() => toast(`Downloading ${r.name}…`, 'info')}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>download</span>
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* ══ TAB 2: CANDIDATES (Final Round) ══ */}
          {activeTab === 'candidates' && (
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h2 style={{ ...secTitle, margin: 0 }}>Final Round — Your Interviews</h2>
                <span className="badge badge-amber">{finalCands.length} Scheduled</span>
              </div>
              {highlightedCandidateId && (
                <div style={{ marginBottom: 18, padding: '14px 18px', borderRadius: 14, background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8' }}>
                  {finalCands.some(c => c.id === highlightedCandidateId)
                    ? `Candidate ${finalCands.find(c => c.id === highlightedCandidateId)?.name} has been routed into HR Round and is visible here.`
                    : `Candidate #${highlightedCandidateId} has been routed into HR Round and can be reviewed by CHRO.`}
                </div>
              )}

              {finalCands.length === 0 && (
                <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 40, display: 'block', marginBottom: 10, color: 'var(--border)' }}>groups</span>
                  No candidates in the final round yet.
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {finalCands.map(c => (
                  <div key={c.id} className="card anim-fade-up" style={{
                    padding: 18,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    position: 'relative',
                    overflow: 'visible',
                    border: c.id === highlightedCandidateId ? '1px solid #22c55e' : undefined,
                    boxShadow: c.id === highlightedCandidateId ? '0 0 0 0.8rem rgba(34,197,94,.08)' : undefined,
                  }}>
                    {/* NEW badge */}
                    {c.isNew && (
                      <span style={{ position: 'absolute', top: -8, right: 12, background: '#EF4444', color: 'white', fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '.08em', boxShadow: '0 2px 8px rgba(239,68,68,.4)', animation: 'scaleIn .3s ease-out' }}>
                        New
                      </span>
                    )}
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Avatar c={c} size={44} fontSize={16} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--navy)', fontFamily: 'var(--font-h)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 1 }}>{c.role}</div>
                        <div style={{ fontSize: 10, color: 'var(--muted)' }}>{c.dept}</div>
                      </div>
                    </div>
                    {/* Scores */}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div style={{ flex: 1, background: 'var(--surface)', borderRadius: 8, padding: '8px 10px', textAlign: 'center', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--teal)', fontFamily: 'var(--font-h)' }}>{c.aiScore}</div>
                        <div style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>AI Score</div>
                      </div>
                      <div style={{ flex: 1, background: 'var(--surface)', borderRadius: 8, padding: '8px 10px', textAlign: 'center', border: '1px solid var(--border)' }}>
                        <span className={`badge ${verdictBadge(c.hmVerdict)}`} style={{ fontSize: 10 }}>{c.hmVerdict}</span>
                        <div style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', marginTop: 4 }}>HM Verdict</div>
                      </div>
                    </div>
                    {/* CTA */}
                    <button
                      className="btn btn-navy btn-sm"
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={() => navigate(`/chro/interview-room/${c.id}`, { state: { candidate: c } })}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>videocam</span>
                      Start Interview
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ══ TAB 3: APPROVALS ══ */}
          {activeTab === 'approvals' && (
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h2 style={{ ...secTitle, margin: 0 }}>Awaiting Your Decision</h2>
                <span className="badge badge-red">{approvals.length} Pending</span>
              </div>

              {approvals.length === 0 && (
                <div className="card" style={{ padding: 48, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 44, display: 'block', marginBottom: 10, color: '#16A34A' }}>check_circle</span>
                  All decisions are done — no pending approvals.
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {approvals.map(c => (
                  <div key={c.id} className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Avatar c={c} size={44} fontSize={15} />

                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--navy)', fontFamily: 'var(--font-h)' }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{c.role} · {c.dept}</div>
                    </div>

                    <div style={{ textAlign: 'center', paddingRight: 16, borderRight: '1px solid var(--border)', minWidth: 60 }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--teal)', fontFamily: 'var(--font-h)' }}>{c.aiScore}</div>
                      <div style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>AI Score</div>
                    </div>

                    <div style={{ textAlign: 'center', paddingRight: 16, borderRight: '1px solid var(--border)', minWidth: 100 }}>
                      <span className={`badge ${verdictBadge(c.hmVerdict)}`}>{c.hmVerdict}</span>
                      <div style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', marginTop: 4 }}>HM Verdict</div>
                    </div>

                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--teal)', borderColor: 'rgba(40,102,110,.3)' }}
                        onClick={() => setReviewCand(c)}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>visibility</span>
                        Review
                      </button>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)', borderColor: '#FECACA' }}
                        onClick={() => handleDecision(c.id, 'reject')}>
                        Reject
                      </button>
                      <button className="btn btn-teal btn-sm"
                        onClick={() => handleDecision(c.id, 'approve')}>
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </>
  );
}
