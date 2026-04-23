export default function Footer() {
  return (
    <footer className="h-11 bg-white border-t border-[#E2E8F0] px-6 flex items-center justify-between text-[11px] font-medium text-[#94A3B8] z-50 flex-shrink-0">
      <div>© 2026 HIRIS Systems · Plaksha University. All rights reserved.</div>
      <div className="flex gap-4">
        <a href="#" className="hover:text-[#28666E] transition-colors duration-100">Help Center</a>
        <a href="#" className="hover:text-[#28666E] transition-colors duration-100">Privacy Policy</a>
        <a href="#" className="hover:text-[#28666E] transition-colors duration-100">System Status</a>
      </div>
    </footer>
  )
}
