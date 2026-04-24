import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'

/* ── Default role templates ─────────────────────────────────────────────────── */
const DEFAULT_ROLES = [
  {
    key: 'chro', label: 'CHRO / HR Head', color: '#28666E',
    desc: 'Manages the overall hiring strategy, conducts final interviews, and approves all offers.',
    perms: { can_request_jobs: false, can_build_jd: false, can_review_jd: true, can_conduct_interview: true, can_make_final_decision: true },
  },
  {
    key: 'hiring-assistant', label: 'Hiring Manager', color: '#0F172A',
    desc: 'Prepares job descriptions, manages the application portal, and shortlists candidates.',
    perms: { can_request_jobs: false, can_build_jd: true, can_review_jd: false, can_conduct_interview: false, can_make_final_decision: false },
  },
  {
    key: 'department-leader', label: 'Department Leader / Professor', color: '#475569',
    desc: 'Submits hiring requests, reviews JDs, conducts technical interviews.',
    perms: { can_request_jobs: true, can_build_jd: false, can_review_jd: true, can_conduct_interview: true, can_make_final_decision: false },
  },
]

const PERM_LABELS = {
  can_request_jobs:       'Request Jobs',
  can_build_jd:           'Build JDs',
  can_review_jd:          'Review JDs',
  can_conduct_interview:  'Conduct Interviews',
  can_make_final_decision:'Final Decision',
}

const ORG_SIZES = ['1–50', '51–200', '201–500', '500+']
const INDUSTRIES = ['Higher Education', 'Research Institute', 'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Government', 'Other']

const STEPS = [
  { n: 1, title: 'Organisation', icon: 'domain' },
  { n: 2, title: 'Roles',         icon: 'manage_accounts' },
  { n: 3, title: 'Invite Users',  icon: 'group_add' },
]

/* ── Org Auth Helper ──────────────────────────────────────────────────────── */
function saveOrgAndUsers(org, users) {
  const orgData = { id: `org-${Date.now()}`, ...org }
  localStorage.setItem('hiris_org', JSON.stringify(orgData))

  // Save each invited user so they can log in
  const existing = JSON.parse(localStorage.getItem('hiris_invited_users') || '[]')
  const merged = [
    ...existing.filter(u => !users.find(nu => nu.email === u.email)),
    ...users,
  ]
  localStorage.setItem('hiris_invited_users', JSON.stringify(merged))
}

/* ── Main Component ──────────────────────────────────────────────────────── */
export default function OrgSignup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  // Step 1
  const [org, setOrg] = useState({ name: '', website: '', industry: 'Higher Education', size: '51–200' })

  // Step 2
  const [roles, setRoles] = useState(DEFAULT_ROLES)

  // Step 3
  const [invites, setInvites] = useState([
    { roleKey: 'chro', email: '', name: '' },
    { roleKey: 'hiring-assistant', email: '', name: '' },
    { roleKey: 'department-leader', email: '', name: '' },
  ])

  const addInvite = () => setInvites(i => [...i, { roleKey: roles[0].key, email: '', name: '' }])
  const removeInvite = idx => setInvites(i => i.filter((_, j) => j !== idx))
  const updateInvite = (idx, field, val) => setInvites(i => i.map((inv, j) => j === idx ? { ...inv, [field]: val } : inv))

  function handleLaunch() {
    const users = invites
      .filter(i => i.email.trim())
      .map(i => {
        const role = roles.find(r => r.key === i.roleKey)
        const portal = i.roleKey === 'chro' ? 'CHRO Portal' : i.roleKey === 'hiring-assistant' ? 'Hiring Manager' : 'Faculty Portal'
        const portalUrl = i.roleKey === 'chro' ? 'http://localhost:5175' : i.roleKey === 'hiring-assistant' ? 'http://localhost:5173' : 'http://localhost:5174'
        return {
          email: i.email.trim().toLowerCase(),
          name: i.name.trim() || i.email.split('@')[0],
          role: i.roleKey,
          portal,
          portalUrl,
          initials: (i.name.trim() || i.email).split(/[\s@]/)[0].slice(0, 2).toUpperCase(),
          color: '#28666E',
          orgName: org.name,
          permissions: role?.perms || {},
        }
      })
    saveOrgAndUsers(org, users)
    navigate('/login')
  }

  const progress = (step / 3) * 100

  return (
    <div style={{ minHeight: '100vh', background: 'var(--slate-50)', fontFamily: 'var(--font-body)' }}>
      <Navbar />

      <div style={{ paddingTop: 96, paddingBottom: 64 }}>
        <div style={{ maxWidth: 740, margin: '0 auto', padding: '0 24px' }}>

          {/* Progress header */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h1 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-h)' }}>Set Up Your Organisation</h1>
              <span style={{ fontSize: 12, color: 'var(--slate-400)', fontWeight: 600 }}>Step {step} of 3</span>
            </div>
            <div style={{ height: 4, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'var(--teal)', borderRadius: 99, transition: 'width 0.4s ease' }} />
            </div>
            {/* Step pills */}
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              {STEPS.map(s => (
                <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, border: `1px solid ${s.n === step ? 'var(--teal)' : s.n < step ? 'rgba(40,102,110,0.3)' : 'var(--border)'}`, background: s.n === step ? 'var(--teal-10)' : 'transparent', color: s.n === step ? 'var(--teal)' : s.n < step ? 'var(--teal-dark)' : 'var(--slate-400)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 12 }}>{s.n < step ? 'check_circle' : s.icon}</span>
                  {s.title}
                </div>
              ))}
            </div>
          </div>

          {/* ── Step 1: Org Basics ── */}
          {step === 1 && (
            <StepCard title="Organisation Details" desc="Tell us about your organisation. This information will appear across your HIRIS workspace.">
              <FormField label="Organisation Name" required>
                <input style={inputStyle} placeholder="e.g. National Institute of Technology" value={org.name} onChange={e => setOrg(o => ({ ...o, name: e.target.value }))} />
              </FormField>
              <FormField label="Website URL">
                <input style={inputStyle} placeholder="https://www.yourorganisation.ac.in" value={org.website} onChange={e => setOrg(o => ({ ...o, website: e.target.value }))} />
              </FormField>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <FormField label="Industry">
                  <select style={inputStyle} value={org.industry} onChange={e => setOrg(o => ({ ...o, industry: e.target.value }))}>
                    {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                  </select>
                </FormField>
                <FormField label="Organisation Size">
                  <select style={inputStyle} value={org.size} onChange={e => setOrg(o => ({ ...o, size: e.target.value }))}>
                    {ORG_SIZES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </FormField>
              </div>
              <NavButtons onNext={() => setStep(2)} nextDisabled={!org.name.trim()} />
            </StepCard>
          )}

          {/* ── Step 2: Role Definition ── */}
          {step === 2 && (
            <StepCard title="Define Roles & Permissions" desc="These roles determine who can do what within your hiring workflows. You can customise permissions or add new roles.">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {roles.map((role, ri) => (
                  <div key={role.key} style={{ border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px', background: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--teal-10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--teal)' }}>badge</span>
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)' }}>{role.label}</div>
                        <div style={{ fontSize: 12, color: 'var(--slate-500)', marginTop: 2 }}>{role.desc}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {Object.entries(role.perms).map(([key, val]) => (
                        <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 6, border: `1px solid ${val ? 'rgba(40,102,110,0.3)' : 'var(--border)'}`, background: val ? 'var(--teal-10)' : 'var(--slate-50)', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: val ? 'var(--teal)' : 'var(--slate-500)' }}>
                          <input type="checkbox" checked={val} onChange={e => setRoles(prev => prev.map((r, j) => j === ri ? { ...r, perms: { ...r.perms, [key]: e.target.checked } } : r))} style={{ accentColor: 'var(--teal)', width: 12, height: 12 }} />
                          {PERM_LABELS[key]}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <NavButtons onBack={() => setStep(1)} onNext={() => setStep(3)} />
            </StepCard>
          )}

          {/* ── Step 3: Invite Users ── */}
          {step === 3 && (
            <StepCard title="Invite Your Team" desc="Add the people who will use HIRIS. They will receive login credentials to their respective portals.">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {invites.map((inv, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 160px 36px', gap: 8, alignItems: 'center' }}>
                    <input style={inputStyle} placeholder="Full name" value={inv.name} onChange={e => updateInvite(i, 'name', e.target.value)} />
                    <input style={inputStyle} placeholder="Email address" type="email" value={inv.email} onChange={e => updateInvite(i, 'email', e.target.value)} />
                    <select style={inputStyle} value={inv.roleKey} onChange={e => updateInvite(i, 'roleKey', e.target.value)}>
                      {roles.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
                    </select>
                    <button onClick={() => removeInvite(i)} style={{ height: 38, width: 36, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--slate-50)', color: 'var(--slate-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={addInvite} style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px dashed var(--teal)', background: 'var(--teal-10)', color: 'var(--teal)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                Add Another User
              </button>
              <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--slate-50)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, color: 'var(--slate-500)' }}>
                Credentials will be displayed on the confirmation screen. You can add more users later from Settings.
              </div>
              <NavButtons onBack={() => setStep(2)} onNext={handleLaunch} nextLabel="Launch Workspace" />
            </StepCard>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Sub-components ─────────────────────────────────────────────────────────── */
function StepCard({ title, desc, children }) {
  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 16, padding: '36px 36px 28px', boxShadow: 'var(--shadow-sm)' }}>
      <h2 style={{ fontSize: '1.3rem', marginBottom: 6 }}>{title}</h2>
      <p style={{ fontSize: 13, color: 'var(--slate-500)', marginBottom: 28, lineHeight: 1.6 }}>{desc}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>{children}</div>
    </div>
  )
}

function FormField({ label, required, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
        {label}{required && <span style={{ color: '#EF4444', marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  )
}

function NavButtons({ onBack, onNext, nextDisabled, nextLabel = 'Continue' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
      {onBack ? (
        <button onClick={onBack} className="btn-secondary" style={{ padding: '10px 20px', fontSize: 13 }}>Back</button>
      ) : <div />}
      <button onClick={onNext} disabled={nextDisabled} className="btn-primary" style={{ padding: '10px 24px', fontSize: 13, opacity: nextDisabled ? 0.5 : 1, cursor: nextDisabled ? 'not-allowed' : 'pointer' }}>
        {nextLabel}
      </button>
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '10px 13px',
  border: '1px solid var(--border)', borderRadius: 8,
  fontSize: 13, color: 'var(--navy)', background: 'white',
  outline: 'none', fontFamily: 'var(--font-body)',
  transition: 'border-color 0.15s', boxSizing: 'border-box',
}
