import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--navy)', color: 'white', paddingTop: 64, paddingBottom: 36 }}>
      <div className="container">
        {/* Top: brand + working links */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 48, paddingBottom: 48, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontWeight: 900, fontSize: 16, fontFamily: "'Times New Roman', Times, serif" }}>H</span>
              </div>
              <div style={{ fontFamily: 'var(--font-h)', fontWeight: 900, fontSize: 18, letterSpacing: '-0.3px' }}>HIRIS</div>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 280 }}>
              Hiring Intelligence Platform — streamlining the entire hiring process for faculty and non-faculty roles.
            </p>
          </div>

          {/* Product links — all real pages */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>Product</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Features', to: '/#features' },
                { label: 'How It Works', to: '/#pipeline' },
                { label: 'Pricing', to: '/pricing' },
              ].map(l => (
                <li key={l.label}>
                  <a href={l.to} style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', transition: 'color 0.15s', textDecoration: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'white'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                  >{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Account links — all real pages */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>Account</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Sign In', to: '/login' },
                { label: 'Get Started Free', to: '/signup' },
              ].map(l => (
                <li key={l.label}>
                  <Link to={l.to} style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', transition: 'color 0.15s', textDecoration: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'white'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                  >{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: 0 }}>
            © {new Date().getFullYear()} HIRIS Systems. All rights reserved.
          </p>
          <a href="https://www.youtube.com/@hiris-intelligence" target="_blank" rel="noreferrer"
            style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', transition: 'color 0.15s', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
          >YouTube</a>
        </div>
      </div>
    </footer>
  )
}
