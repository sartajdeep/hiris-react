import { useLocation, Link } from 'react-router-dom'

export default function Breadcrumbs() {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(x => x)

  return (
    <div className="flex items-center gap-2 px-6 py-3 bg-[color:var(--bg)] border-b border-[color:var(--border)] text-[12px] font-medium text-[color:var(--text-muted)]">
      <Link to="/" className="hover:text-[color:var(--teal)] transition-colors flex items-center gap-1">
        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>home</span>
        Home
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`
        const isLast = index === pathnames.length - 1
        const title = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ')

        return (
          <div key={to} className="flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--border)' }}>chevron_right</span>
            {isLast ? (
              <span className="text-[color:var(--text-primary)] font-semibold">{title}</span>
            ) : (
              <Link to={to} className="hover:text-[color:var(--teal)] transition-colors">
                {title}
              </Link>
            )}
          </div>
        )
      })}
    </div>
  )
}
