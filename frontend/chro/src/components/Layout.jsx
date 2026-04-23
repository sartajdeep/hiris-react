import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const NAV_CHRO = [
  { icon: 'dashboard',       label: 'Dashboard',        to: '/' },
  { icon: 'groups',          label: 'Candidates',       to: '/?tab=candidates' },
  { icon: 'policy',          label: 'Hiring Policies',  to: '/chro/policies' },
  { icon: 'work',            label: 'Job Roles',        to: '/chro/job-roles' },
  { icon: 'manage_accounts', label: 'Assign Managers',  to: '/chro/assign-managers' },
  { icon: 'receipt_long',    label: 'Hire Requests',    to: '/chro/requests' },
  { icon: 'leaderboard',     label: 'Analytics',        to: '/chro/analytics' },
  { icon: 'settings',        label: 'Settings',         to: '/chro/settings' },
]

export default function Layout({ children }) {
  const loc = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const search = new URLSearchParams(loc.search)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const initials = user?.initials || user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)', fontFamily: 'var(--font-body)' }}>
      {/* ── Sidebar ── */}
      <nav style={{
        width: 220, flexShrink: 0, background: 'var(--white)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        padding: '0',
      }}>
        {/* Logo header */}
        <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 14, fontFamily: 'var(--font-h)', flexShrink: 0 }}>H</div>
            <div>
              <div style={{ fontFamily: 'var(--font-h)', fontWeight: 800, fontSize: 14, color: 'var(--navy)', letterSpacing: '-0.3px' }}>HIRIS</div>
              <div style={{ fontSize: 9, color: 'var(--teal)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>CHRO Portal</div>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
          {NAV_CHRO.map(n => {
            const isCandidatesNav = n.to === '/?tab=candidates'
            const active = isCandidatesNav
              ? loc.pathname === '/' && search.get('tab') === 'candidates'
              : n.to === '/'
                ? loc.pathname === '/' && search.get('tab') !== 'candidates'
                : loc.pathname === n.to || (n.to !== '/' && loc.pathname.startsWith(n.to))
            return (
              <Link key={n.to} to={n.to} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 18px', textDecoration: 'none',
                borderRadius: '0 10px 10px 0', marginRight: 10,
                background: active ? 'rgba(40,102,110,.1)' : 'transparent',
                color: active ? 'var(--teal)' : 'var(--navy)',
                fontWeight: active ? 700 : 500, fontSize: 13,
                transition: 'all .15s',
              }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--surface)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{n.icon}</span>
                {n.label}
              </Link>
            )
          })}
        </div>

        {/* User badge + logout */}
        <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'CHRO'}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>CHRO · Plaksha</div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#DC2626'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Main content ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {children}
        </div>
        {/* Unified footer */}
        <footer style={{ height: 44, background: 'white', borderTop: '1px solid var(--border)', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, fontWeight: 500, color: 'var(--muted)', flexShrink: 0 }}>
          <div>© 2026 HIRIS Systems · Plaksha University. All rights reserved.</div>
          <div style={{ display: 'flex', gap: 16 }}>
            <a href="#" style={{ color: 'var(--muted)', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--teal)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>Help Center</a>
            <a href="#" style={{ color: 'var(--muted)', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--teal)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>Privacy Policy</a>
            <a href="#" style={{ color: 'var(--muted)', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--teal)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>System Status</a>
          </div>
        </footer>
      </div>
    </div>
  )
}

