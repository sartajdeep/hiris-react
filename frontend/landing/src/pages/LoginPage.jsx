import { useState } from 'react'
import Navbar from '../components/layout/Navbar'

// The 3 default demo users (kept for convenience)
const DEMO_USERS = {
  'smriti.kinra@hiris.demo':      { name: 'Smriti Kinra',      role: 'chro',             portal: 'CHRO Portal',      initials: 'SK', portalUrl: 'http://localhost:5175', color: '#28666E' },
  'sartajdeep.singh@hiris.demo':  { name: 'Sartajdeep Singh',  role: 'hiring-assistant', portal: 'Hiring Manager', initials: 'SS', portalUrl: 'http://localhost:5173', color: '#28666E' },
  'gracy.tanna@hiris.demo':       { name: 'Gracy Tanna',       role: 'professor',        portal: 'Faculty Portal',   initials: 'GT', portalUrl: 'http://localhost:5174', color: '#28666E' },
}

function resolveUser(email) {
  const trimmed = email.trim().toLowerCase()
  // Check demo users
  if (DEMO_USERS[trimmed]) return DEMO_USERS[trimmed]
  // Check org-signup invited users
  try {
    const invited = JSON.parse(localStorage.getItem('hiris_invited_users') || '[]')
    const found = invited.find(u => u.email === trimmed)
    if (found) return found
  } catch {}
  return null
}

const GoogleIcon = () => (
  <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.702 14.153 17.64 11.846 17.64 9.2z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
)

const MsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
    <rect x="0" y="0" width="8.5" height="8.5" fill="#F25022"/>
    <rect x="9.5" y="0" width="8.5" height="8.5" fill="#7FBA00"/>
    <rect x="0" y="9.5" width="8.5" height="8.5" fill="#00A4EF"/>
    <rect x="9.5" y="9.5" width="8.5" height="8.5" fill="#FFB900"/>
  </svg>
)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [ssoModal, setSsoModal] = useState(null)
  const [ssoEmail, setSsoEmail] = useState('')

  function doLogin(emailInput) {
    setError('')
    setLoading(true)
    setTimeout(() => {
      const user = resolveUser(emailInput)
      setLoading(false)
      if (!user) {
        setError('This email is not authorised. Use a registered organisation account or a demo email.')
        return
      }
      localStorage.setItem('hiris_user', JSON.stringify({ email: emailInput.trim().toLowerCase(), ...user }))
      window.location.href = user.portalUrl
    }, 600)
  }

  return (
    <>
      <div style={{ minHeight: '100vh', background: 'var(--slate-50)', fontFamily: 'var(--font-body)' }}>
        <Navbar />
        <div style={{ paddingTop: 110, paddingBottom: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ width: '100%', maxWidth: 420, padding: '0 24px' }}>
            {/* Card */}
            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 16, padding: '36px 36px', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ marginBottom: 28 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <span style={{ color: 'white', fontWeight: 900, fontSize: 18, fontFamily: 'var(--font-h)' }}>H</span>
                </div>
                <h1 style={{ fontSize: '1.4rem', marginBottom: 6 }}>Sign in to HIRIS</h1>
                <p style={{ fontSize: 13, color: 'var(--slate-500)', lineHeight: 1.6 }}>
                  Use your registered organisation email address.
                </p>
              </div>

              {/* SSO Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {[{ label: 'Sign in with Google', Icon: GoogleIcon, provider: 'Google' }, { label: 'Sign in with Microsoft', Icon: MsIcon, provider: 'Microsoft' }].map(({ label, Icon, provider }) => (
                  <button key={provider} onClick={() => { setSsoEmail(''); setSsoModal(provider) }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '11px', border: '1px solid var(--border)', borderRadius: 8, background: 'white', fontSize: 13, fontWeight: 600, color: 'var(--navy)', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-50)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  ><Icon />{label}</button>
                ))}
              </div>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                <span style={{ fontSize: 11, color: 'var(--slate-400)', fontWeight: 600 }}>OR</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>

              {/* Email form */}
              <form onSubmit={e => { e.preventDefault(); doLogin(email) }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={labelStyle}>Work Email</label>
                  <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError('') }} placeholder="you@yourorg.com" required style={{ ...inputSt, borderColor: error ? '#EF4444' : 'var(--border)' }}
                    onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                    onBlur={e => e.target.style.borderColor = error ? '#EF4444' : 'var(--border)'}
                  />
                  {error && <div style={{ marginTop: 6, fontSize: 12, color: '#EF4444' }}>{error}</div>}
                </div>
                <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? 'Signing in...' : 'Continue'}
                </button>
              </form>

              <div style={{ marginTop: 20, textAlign: 'center', fontSize: 12, color: 'var(--slate-400)' }}>
                New to HIRIS?{' '}
                <a href="/signup" style={{ color: 'var(--teal)', fontWeight: 600 }}>Set up your organisation</a>
              </div>
            </div>

            {/* Demo hint */}
            <div style={{ marginTop: 20, padding: '14px 16px', background: 'white', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12, color: 'var(--slate-500)' }}>
              <div style={{ fontWeight: 700, color: 'var(--slate-700)', marginBottom: 8 }}>Demo accounts</div>
              {Object.entries(DEMO_USERS).map(([demoEmail, cfg]) => (
                <div
                  key={demoEmail}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '5px 0' }}
                >
                  <button
                    type="button"
                    onClick={() => setEmail(demoEmail)}
                    style={{
                      display: 'block',
                      flex: 1,
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 12,
                      color: 'var(--slate-500)',
                      transition: 'color 0.1s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--teal)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--slate-500)'}
                    title={`Fill ${demoEmail}`}
                  >
                    {cfg.name} — {cfg.portal}
                  </button>
                  <button
                    type="button"
                    onClick={() => doLogin(demoEmail)}
                    style={{
                      border: '1px solid var(--border)',
                      background: 'var(--slate-50)',
                      color: 'var(--teal)',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '4px 8px',
                      borderRadius: 6,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--teal-10)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--slate-50)'}
                    title={`Quick login as ${cfg.name}`}
                  >
                    Quick Login
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SSO modal */}
      {ssoModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 24 }}>
          <div style={{ background: 'white', borderRadius: 14, padding: 30, width: '100%', maxWidth: 360, boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: 16, marginBottom: 6 }}>Sign in with {ssoModal}</h3>
            <p style={{ fontSize: 13, color: 'var(--slate-500)', marginBottom: 18 }}>Enter your {ssoModal} account email to continue.</p>
            <form onSubmit={e => { e.preventDefault(); setSsoModal(null); doLogin(ssoEmail) }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input type="email" value={ssoEmail} onChange={e => setSsoEmail(e.target.value)} placeholder="you@yourorg.com" required autoFocus style={inputSt} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => setSsoModal(null)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '10px' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 2, justifyContent: 'center', padding: '10px' }}>Continue</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

const labelStyle = { display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }
const inputSt = { width: '100%', padding: '10px 13px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13, color: 'var(--navy)', outline: 'none', fontFamily: 'var(--font-body)', boxSizing: 'border-box', transition: 'border-color 0.15s' }
