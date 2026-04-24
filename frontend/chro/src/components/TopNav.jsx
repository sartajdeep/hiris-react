import { Link, useLocation } from 'react-router-dom'

const NAV_CHRO = [
  { icon: 'dashboard',       label: 'Dashboard',        to: '/' },
  { icon: 'groups',          label: 'Candidates',       to: '/?tab=candidates' },
  { icon: 'policy',          label: 'Hiring Policies',  to: '/chro/policies' },
  { icon: 'work',            label: 'Job Roles',        to: '/chro/job-roles' },
  { icon: 'admin_panel_settings', label: 'Team & Roles', to: '/chro/team-management' },
  { icon: 'receipt_long',    label: 'Hire Requests',    to: '/chro/requests' },
  { icon: 'leaderboard',     label: 'Analytics',        to: '/chro/analytics' },
]

export default function TopNav() {
  const loc = useLocation()
  const search = new URLSearchParams(loc.search)

  return (
    <div className="bg-[color:var(--surface)] border-b border-[color:var(--border)] px-6 flex items-center overflow-x-auto custom-scrollbar flex-shrink-0">
      <div className="flex gap-1 py-3">
        {NAV_CHRO.map(n => {
          const isCandidatesNav = n.to === '/?tab=candidates'
          const active = isCandidatesNav
            ? loc.pathname === '/' && search.get('tab') === 'candidates'
            : n.to === '/'
              ? loc.pathname === '/' && search.get('tab') !== 'candidates'
              : loc.pathname === n.to || (n.to !== '/' && loc.pathname.startsWith(n.to))

          return (
            <Link
              key={n.to}
              to={n.to}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] transition-colors whitespace-nowrap ${
                active 
                  ? 'bg-[color:var(--teal-10)] text-[color:var(--teal)] font-bold' 
                  : 'text-[color:var(--navy)] hover:bg-[color:var(--bg)] font-medium'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{n.icon}</span>
              {n.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
