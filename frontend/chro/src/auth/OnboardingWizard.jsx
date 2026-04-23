import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

const STEPS = [
  { title: 'Organisation Setup', icon: 'domain',           desc: 'Tell us about your organisation.' },
  { title: 'Hiring Policies',    icon: 'policy',           desc: 'Choose your evaluation standard.' },
  { title: 'Invite Team',        icon: 'group_add',        desc: 'Bring your hiring managers on board.' },
  { title: 'Connect Calendly',   icon: 'event_available',  desc: 'Automate interview scheduling.' },
  { title: 'Review & Launch',    icon: 'rocket_launch',    desc: 'Your workspace is ready.' },
]

export default function OnboardingWizard() {
  const { user, completeOnboarding } = useAuth()
  const [step, setStep] = useState(0)
  const navigate = useNavigate()
  const [form, setForm] = useState({
    org: 'Plaksha University', industry: 'Higher Education', size: '201-1000',
    policy: 'rubric', emails: '', calendly: '',
  })

  function next() {
    if (step < STEPS.length - 1) { setStep(s => s + 1) }
    else {
      completeOnboarding()
      navigate('/')
    }
  }

  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1e3a4a 50%, #0F172A 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Header */}
      <div style={{ width: '100%', maxWidth: 620, marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#28666E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 800, fontSize: 14, fontFamily: "'Manrope', sans-serif" }}>H</span>
            </div>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 16, fontFamily: "'Manrope', sans-serif" }}>HIRIS</span>
          </div>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
            Step {step + 1} of {STEPS.length}
          </span>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: '#28666E', borderRadius: 99, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {/* Step pills */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
            background: i === step ? 'rgba(40,102,110,0.3)' : i < step ? 'rgba(40,102,110,0.15)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${i === step ? '#28666E' : i < step ? 'rgba(40,102,110,0.4)' : 'rgba(255,255,255,0.1)'}`,
            color: i === step ? '#7ecdd4' : i < step ? '#4ab3bc' : 'rgba(255,255,255,0.35)',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
              {i < step ? 'check_circle' : s.icon}
            </span>
            <span>{s.title}</span>
          </div>
        ))}
      </div>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 520,
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 20,
        padding: '36px 40px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
      }}>
        {/* Step heading */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(40,102,110,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{ color: '#7ecdd4', fontSize: 22 }}>{STEPS[step].icon}</span>
          </div>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: 'white', fontFamily: "'Manrope', sans-serif", margin: 0 }}>{STEPS[step].title}</h2>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: '3px 0 0' }}>{STEPS[step].desc}</p>
          </div>
        </div>

        {/* Step content */}
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Organisation Name" value={form.org} onChange={v => setForm(f => ({ ...f, org: v }))} placeholder="Plaksha University" />
            <SelectField label="Industry" value={form.industry} onChange={v => setForm(f => ({ ...f, industry: v }))} options={['Higher Education', 'Technology', 'Healthcare', 'Finance', 'Other']} />
            <SelectField label="Organisation Size" value={form.size} onChange={v => setForm(f => ({ ...f, size: v }))} options={['1-50', '51-200', '201-1000', '1000+']} />
          </div>
        )}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { v: 'rubric', label: '🎯 Rubric-based', desc: 'Detailed criteria per evaluation dimension' },
              { v: 'scorecard', label: '📋 Scorecard', desc: 'Competency-based structured assessment' },
              { v: 'simple', label: '✅ Simple Rating', desc: 'Quick 1-5 star ratings for each candidate' },
            ].map(opt => (
              <label key={opt.v} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, border: `1.5px solid ${form.policy === opt.v ? '#28666E' : 'rgba(255,255,255,0.1)'}`, cursor: 'pointer', background: form.policy === opt.v ? 'rgba(40,102,110,0.15)' : 'rgba(255,255,255,0.04)', transition: 'all 0.15s' }}>
                <input type="radio" name="policy" value={opt.v} checked={form.policy === opt.v} onChange={e => setForm(f => ({ ...f, policy: e.target.value }))} style={{ accentColor: '#28666E' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'white' }}>{opt.label}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>
        )}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0 }}>Invite hiring managers via email (comma-separated).</p>
            <textarea
              style={{ ...inputStyle, height: 100, resize: 'vertical' }}
              placeholder="arjun@plaksha.edu.in, meera@plaksha.edu.in"
              value={form.emails}
              onChange={e => setForm(f => ({ ...f, emails: e.target.value }))}
            />
          </div>
        )}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ padding: 14, background: 'rgba(40,102,110,0.15)', borderRadius: 10, border: '1px solid rgba(40,102,110,0.3)' }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#7ecdd4', marginBottom: 4 }}>Auto-scheduling enabled</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>When a candidate advances to interview stage, HIRIS sends your Calendly link automatically.</div>
            </div>
            <Field label="Calendly Username or Link" value={form.calendly} onChange={v => setForm(f => ({ ...f, calendly: v }))} placeholder="calendly.com/your-link" />
          </div>
        )}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '0 0 6px' }}>Your HIRIS workspace is configured. Here's the summary:</p>
            {[
              ['Welcome', user?.name || 'User'],
              ['Organisation', form.org],
              ['Evaluation Standard', form.policy === 'rubric' ? 'Rubric-based' : form.policy === 'scorecard' ? 'Scorecard' : 'Simple Rating'],
              ['Team Invites', form.emails ? `${form.emails.split(',').filter(Boolean).length} manager(s)` : 'None yet'],
              ['Calendly', form.calendly || 'Not connected'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', borderRadius: 8, fontSize: 13, border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>{k}</span>
                <span style={{ fontWeight: 700, color: 'white' }}>{v}</span>
              </div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} style={{ padding: '11px 18px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
              ← Back
            </button>
          )}
          <button onClick={next} style={{ flex: 1, padding: '11px', background: '#28666E', border: 'none', borderRadius: 10, color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter', sans-serif', transition: 'background 0.15s'" }}
            onMouseEnter={e => e.currentTarget.style.background = '#1e5059'}
            onMouseLeave={e => e.currentTarget.style.background = '#28666E'}
          >
            {step < STEPS.length - 1 ? 'Continue →' : '🚀 Launch HIRIS'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────
const inputStyle = {
  width: '100%', padding: '10px 13px',
  background: 'rgba(255,255,255,0.08)',
  border: '1.5px solid rgba(255,255,255,0.12)',
  borderRadius: 8, color: 'white', fontSize: 13,
  outline: 'none', fontFamily: "'Inter', sans-serif",
  boxSizing: 'border-box',
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>{label}</label>
      <input style={inputStyle} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  )
}
function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>{label}</label>
      <select style={{ ...inputStyle, cursor: 'pointer' }} value={value} onChange={e => onChange(e.target.value)}>
        {options.map(o => <option key={o} value={o} style={{ background: '#1e3a4a' }}>{o}</option>)}
      </select>
    </div>
  )
}
