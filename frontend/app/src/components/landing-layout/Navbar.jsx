import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ThemeToggle from '../shared/ThemeToggle'

const NAV_LINKS = [
  { label: 'Product', to: '/#features' },
  { label: 'How It Works', to: '/#pipeline' },
  { label: 'Pricing', to: '/pricing' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const loc = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isLanding = loc.pathname === '/'
  // When sitting on the dark hero (transparent bg), use white text
  const onDark = isLanding && !scrolled

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: 64,
      background: scrolled || !isLanding ? 'var(--surface)' : 'transparent',
      borderBottom: scrolled || !isLanding ? '1px solid var(--border)' : 'none',
      transition: 'background 0.25s, border-color 0.25s',
      boxShadow: scrolled ? 'var(--sh-sm)' : 'none',
    }}>
      <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(40,102,110,0.3)' }}>
            <span style={{ color: 'white', fontWeight: 900, fontSize: 16, fontFamily: "'Times New Roman', Times, serif" }}>H</span>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-h)', fontWeight: 900, fontSize: 16, color: onDark ? 'white' : 'var(--text-primary)', letterSpacing: '-0.3px', lineHeight: 1 }}>HIRIS</div>
            <div style={{ fontSize: 9, color: onDark ? '#7ecdd4' : 'var(--teal)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 1 }}>Hiring Intelligence</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {NAV_LINKS.map(n => (
            <a key={n.label} href={n.to}
              style={{ padding: '8px 14px', fontSize: 13, fontWeight: 600, borderRadius: 7, transition: 'color 0.15s, background 0.15s', color: onDark ? 'rgba(255,255,255,0.8)' : 'var(--text-primary)' }}
              onMouseEnter={e => { e.currentTarget.style.color = onDark ? 'white' : 'var(--teal)'; e.currentTarget.style.background = onDark ? 'rgba(255,255,255,0.1)' : 'rgba(40,102,110,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.color = onDark ? 'rgba(255,255,255,0.8)' : 'var(--text-primary)'; e.currentTarget.style.background = 'transparent' }}
            >{n.label}</a>
          ))}
        </nav>

        {/* CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <ThemeToggle />
          <Link to="/login"
            style={{ padding: '8px 16px', fontSize: 13, fontWeight: 600, borderRadius: 7, transition: 'color 0.15s', textDecoration: 'none', color: onDark ? 'rgba(255,255,255,0.8)' : 'var(--text-primary)' }}
            onMouseEnter={e => e.currentTarget.style.color = onDark ? 'white' : 'var(--teal)'}
            onMouseLeave={e => e.currentTarget.style.color = onDark ? 'rgba(255,255,255,0.8)' : 'var(--text-primary)'}
          >Sign In</Link>
          <Link to="/signup" className="btn-primary" style={{ padding: '9px 20px', fontSize: 13 }}>Get Started Free</Link>
        </div>
      </div>
    </header>
  )
}
