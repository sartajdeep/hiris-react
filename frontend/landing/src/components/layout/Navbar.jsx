import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Product', to: '/#features' },
  { label: 'How It Works', to: '/#pipeline' },
  { label: 'Pricing', to: '/pricing' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const loc = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isLanding = loc.pathname === '/'

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: 64,
      background: scrolled || !isLanding ? 'white' : 'transparent',
      borderBottom: scrolled || !isLanding ? '1px solid var(--border)' : 'none',
      transition: 'background 0.25s, border-color 0.25s',
      boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
    }}>
      <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(40,102,110,0.3)' }}>
            <span style={{ color: 'white', fontWeight: 900, fontSize: 16, fontFamily: 'var(--font-h)' }}>H</span>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-h)', fontWeight: 900, fontSize: 16, color: scrolled || !isLanding ? 'var(--navy)' : 'var(--navy)', letterSpacing: '-0.3px', lineHeight: 1 }}>HIRIS</div>
            <div style={{ fontSize: 9, color: 'var(--teal)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 1 }}>Hiring Intelligence</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {NAV_LINKS.map(n => (
            <a key={n.label} href={n.to} style={{ padding: '8px 14px', fontSize: 13, fontWeight: 600, color: 'var(--slate-700)', borderRadius: 7, transition: 'color 0.15s, background 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--teal)'; e.currentTarget.style.background = 'var(--teal-10)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--slate-700)'; e.currentTarget.style.background = 'transparent' }}
            >{n.label}</a>
          ))}
        </nav>

        {/* CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link to="/login" style={{ padding: '8px 16px', fontSize: 13, fontWeight: 600, color: 'var(--slate-700)', borderRadius: 7, transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--teal)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--slate-700)'}
          >Sign In</Link>
          <Link to="/signup" className="btn-primary" style={{ padding: '9px 20px', fontSize: 13 }}>Get Started Free</Link>
        </div>
      </div>
    </header>
  )
}
