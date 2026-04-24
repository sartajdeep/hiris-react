import { Link } from 'react-router-dom'

const FOOTER_LINKS = {
  Product: [
    { label: 'Features', to: '/#features' },
    { label: 'How It Works', to: '/#pipeline' },
    { label: 'Pricing', to: '/pricing' },
  ],
  Access: [
    { label: 'Sign In', to: '/login' },
    { label: 'Start Free Trial', to: '/signup' },
  ],
}

export default function Footer() {
  return (
    <footer style={{ background: 'var(--footer-bg)', color: 'white', paddingTop: 72, paddingBottom: 40 }}>
      <div className="container">
        {/* Top: logo + links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 2fr) repeat(2, minmax(130px, 1fr))', gap: 48, paddingBottom: 56, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontWeight: 900, fontSize: 16, fontFamily: 'var(--font-h)' }}>H</span>
              </div>
              <div style={{ fontFamily: 'var(--font-h)', fontWeight: 900, fontSize: 18, letterSpacing: '-0.3px' }}>HIRIS</div>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 280 }}>
              Hiring Intelligence Platform — streamlining the entire hiring process for faculty and non-faculty roles.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([col, links]) => (
            <div key={col}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>{col}</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map(l => (
                  <li key={l.label}>
                    <a href={l.to} style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', transition: 'color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'white'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                    >{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
            © {new Date().getFullYear()} HIRIS Systems. All rights reserved.
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Built for faculty and non-faculty hiring teams.</p>
        </div>
      </div>
    </footer>
  )
}
