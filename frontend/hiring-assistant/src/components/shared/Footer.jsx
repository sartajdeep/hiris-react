const LANDING_URL = 'http://localhost:5176'

export default function Footer() {
  return (
    <footer className="min-h-11 bg-[color:var(--surface)] border-t border-[color:var(--border)] px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-medium text-[color:var(--text-muted)] z-50 flex-shrink-0">
      <div>© 2026 HIRIS Systems. All rights reserved.</div>
      <div className="flex gap-4">
        <a href={LANDING_URL} className="hover:text-[color:var(--teal)] transition-colors duration-100">Landing</a>
        <a href={`${LANDING_URL}/pricing`} className="hover:text-[color:var(--teal)] transition-colors duration-100">Pricing</a>
      </div>
    </footer>
  )
}
