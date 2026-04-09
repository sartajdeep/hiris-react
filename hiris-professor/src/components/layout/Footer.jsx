export default function Footer() {
  return (
    <footer className="h-11 bg-white border-t border-[#E2E8F0] px-8 flex items-center justify-between text-[11px] font-medium text-[#94A3B8] z-50">
      <div>© 2026 HIRIS Systems — Faculty Portal. All rights reserved.</div>
      <div className="flex gap-4">
        <a href="#" className="hover:text-[#024e56] transition-colors">Help Center</a>
        <a href="#" className="hover:text-[#024e56] transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-[#024e56] transition-colors">System Status</a>
      </div>
    </footer>
  )
}
