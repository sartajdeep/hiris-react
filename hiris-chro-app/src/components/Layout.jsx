import { Link, useLocation } from 'react-router-dom'

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

export default function Layout({ children, variant = 'chro' }) {
  const loc = useLocation()
  const search = new URLSearchParams(loc.search)

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)', fontFamily: 'var(--font-body)' }}>
      {/* Sidebar */}
      <nav style={{
        width: 220, flexShrink: 0, background: 'var(--white)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        padding: '20px 0', gap: 4,
      }}>
        {/* Logo */}
        <div style={{ padding: '0 18px 16px', borderBottom: '1px solid var(--border)', marginBottom: 8 }}>
          <div style={{ fontFamily: 'var(--font-h)', fontWeight: 800, fontSize: 18, color: 'var(--teal)', letterSpacing: '-0.5px' }}>
            HIRIS <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.05em' }}>CHRO</span>
          </div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>Plaksha University</div>
        </div>

        {/* Nav links */}
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

        {/* Bottom user badge */}
        <div style={{ marginTop: 'auto', padding: '12px 18px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700 }}>SM</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy)' }}>Smriti Jha</div>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>CHRO</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  )
}
