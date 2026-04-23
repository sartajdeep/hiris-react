export default function Footer() {
  return (
    <footer className="h-11 bg-[var(--surface)] border-t border-[var(--border)] px-6 flex items-center justify-between text-[11px] font-medium text-[var(--text-muted)] z-50 flex-shrink-0">
      <div>© 2026 HIRIS Systems. All rights reserved.</div>
      <div className="flex gap-4">
        {/* Only legitimate links that might actually map to platform features or docs */}
        <span className="hover:text-[var(--teal)] transition-colors duration-100 cursor-pointer">Platform Documentation</span>
        <span className="hover:text-[var(--teal)] transition-colors duration-100 cursor-pointer">Support</span>
      </div>
    </footer>
  )
}
