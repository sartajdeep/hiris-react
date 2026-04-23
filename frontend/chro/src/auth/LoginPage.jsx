import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, DEMO_USERS } from './AuthContext'

// ── SVG Icons ────────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
)

const MicrosoftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="0" y="0" width="8.5" height="8.5" fill="#F25022"/>
    <rect x="9.5" y="0" width="8.5" height="8.5" fill="#7FBA00"/>
    <rect x="0" y="9.5" width="8.5" height="8.5" fill="#00A4EF"/>
    <rect x="9.5" y="9.5" width="8.5" height="8.5" fill="#FFB900"/>
  </svg>
)

export default function LoginPage() {
  const { login, isOnboarded, completeOnboarding } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [ssoProvider, setSsoProvider] = useState(null)
  const [showSsoModal, setShowSsoModal] = useState(false)
  const [ssoEmail, setSsoEmail] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    doLogin(email)
  }

  function doLogin(emailInput) {
    setError('')
    setLoading(true)
    setTimeout(() => {
      const result = login(emailInput)
      setLoading(false)
      if (!result.success) {
        setError(result.error)
        return
      }
      const user = result.user
      // If same-port portal, just navigate; else redirect to correct port
      const currentPort = window.location.port
      const targetPort = new URL(user.portalUrl).port
      if (currentPort === targetPort) {
        if (!isOnboarded()) {
          navigate('/onboarding')
        } else {
          navigate('/')
        }
      } else {
        const destination = isOnboarded() ? user.portalUrl : `${user.portalUrl}/onboarding`
        window.location.href = destination
      }
    }, 700)
  }

  function handleSsoLogin(provider) {
    setSsoProvider(provider)
    setSsoEmail('')
    setShowSsoModal(true)
  }

  function handleSsoSubmit(e) {
    e.preventDefault()
    setShowSsoModal(false)
    doLogin(ssoEmail)
  }

  return (
    <>
      {/* ── Full-page layout ── */}
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0F172A 0%, #1e3a4a 50%, #0F172A 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', sans-serif",
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(40,102,110,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-15%', left: '-8%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(40,102,110,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, borderRadius: 14, background: '#28666E', marginBottom: 14, boxShadow: '0 8px 24px rgba(40,102,110,0.4)' }}>
              <span style={{ color: 'white', fontSize: 22, fontWeight: 800, fontFamily: "'Manrope', sans-serif" }}>H</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'white', fontFamily: "'Manrope', sans-serif", letterSpacing: '-0.5px' }}>HIRIS</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2 }}>Hiring Intelligence Platform</div>
          </div>

          {/* Glass card */}
          <div style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 20,
            padding: '36px 40px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
          }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: 'white', fontFamily: "'Manrope', sans-serif", marginBottom: 4 }}>Welcome back</h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 28 }}>Sign in with your registered organisation email to access your portal.</p>

            {/* SSO Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
              <button
                id="btn-google-signin"
                onClick={() => handleSsoLogin('Google')}
                style={ssoButtonStyle}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              >
                <GoogleIcon />
                <span>Sign in with Google</span>
              </button>
              <button
                id="btn-microsoft-signin"
                onClick={() => handleSsoLogin('Microsoft')}
                style={ssoButtonStyle}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              >
                <MicrosoftIcon />
                <span>Sign in with Microsoft</span>
              </button>
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.12)' }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>OR CONTINUE WITH EMAIL</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.12)' }} />
            </div>

            {/* Email form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                  Work Email
                </label>
                <input
                  id="input-email"
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  placeholder="you@yourorg.com"
                  required
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    background: 'rgba(255,255,255,0.08)',
                    border: `1.5px solid ${error ? '#ef4444' : 'rgba(255,255,255,0.15)'}`,
                    borderRadius: 10,
                    color: 'white',
                    fontSize: 14,
                    outline: 'none',
                    transition: 'border-color 0.15s',
                    fontFamily: "'Inter', sans-serif",
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = '#28666E'}
                  onBlur={e => e.target.style.borderColor = error ? '#ef4444' : 'rgba(255,255,255,0.15)'}
                />
                {error && (
                  <div style={{ marginTop: 6, fontSize: 12, color: '#f87171', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ fontSize: 14 }}>⚠</span> {error}
                  </div>
                )}
              </div>

              <button
                id="btn-email-signin"
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: loading ? '#1e5059' : '#28666E',
                  color: 'white',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: "'Inter', sans-serif",
                  transition: 'background 0.15s, transform 0.1s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#1e5059' }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#28666E' }}
              >
                {loading ? (
                  <><span style={spinnerStyle} />Signing in...</>
                ) : (
                  <>Continue →</>
                )}
              </button>
            </form>
          </div>

          {/* Authorised users hint */}
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', lineHeight: 1.8 }}>
              Access is restricted to registered organisation accounts.
            </p>
          </div>

          {/* Role hints */}
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
            {Object.entries(DEMO_USERS).map(([email, cfg]) => (
              <button
                key={email}
                onClick={() => setEmail(email)}
                title={`Sign in as ${cfg.name}`}
                style={{
                  padding: '4px 10px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 20,
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.45)',
                  cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(40,102,110,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}
              >
                {cfg.name} · {cfg.portal}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── SSO Modal ── */}
      {showSsoModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 24 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 32, width: '100%', maxWidth: 380, boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              {ssoProvider === 'Google' ? <GoogleIcon /> : <MicrosoftIcon />}
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', fontFamily: "'Manrope', sans-serif" }}>Sign in with {ssoProvider}</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>Enter your {ssoProvider} account email</div>
              </div>
            </div>
            <form onSubmit={handleSsoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input
                type="email"
                value={ssoEmail}
                onChange={e => setSsoEmail(e.target.value)}
                placeholder="you@yourorg.com"
                required
                autoFocus
                style={{ width: '100%', padding: '10px 13px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box' }}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => setShowSsoModal(false)} style={{ flex: 1, padding: '10px', background: '#F1F5F9', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#64748B' }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: '10px', background: '#28666E', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, color: 'white', cursor: 'pointer' }}>Continue</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

const ssoButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  width: '100%',
  padding: '11px 16px',
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 10,
  color: 'white',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: "'Inter', sans-serif",
  transition: 'background 0.15s',
}

const spinnerStyle = {
  display: 'inline-block',
  width: 14,
  height: 14,
  border: '2px solid rgba(255,255,255,0.3)',
  borderTopColor: 'white',
  borderRadius: '50%',
  animation: 'spin 0.7s linear infinite',
}
