import { Link } from 'react-router-dom'

export default function Header({ showSearch = false }) {
  return (
    <header className="h-[64px] border-b border-[#E2E8F0] bg-white px-8 flex items-center justify-between sticky top-0 z-50 shadow-[0_1px_0_#E2E8F0]">
      <Link to="/" className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[#024e56] flex items-center justify-center text-white font-bold rounded-lg text-[13px]">
          <span className="material-symbols-outlined text-lg">school</span>
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-[13px] font-bold tracking-tight uppercase text-[#0F172A]">HIRIS</span>
          <span className="text-[10px] text-[#024e56] font-medium uppercase tracking-widest mt-0.5">Faculty Portal</span>
        </div>
      </Link>

      <div className="flex items-center gap-4">
        {showSearch && (
          <div className="hidden sm:flex relative w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-[16px]">search</span>
            <input
              className="w-full pl-9 pr-4 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#024e56]/20 focus:border-[#024e56] focus:bg-white outline-none transition-all"
              placeholder="Search..."
              type="text"
            />
          </div>
        )}
        <button className="relative p-2 text-[#94A3B8] hover:text-[#024e56] transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-[#024e56]/20">
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-2 right-2 block h-[6px] w-[6px] rounded-full bg-[#EF4444] ring-2 ring-white"></span>
        </button>
        <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-[#024e56]/20">
          <img alt="Dr. Julian Sterling" className="object-cover w-full h-full"
            src="https://ui-avatars.com/api/?name=Julian+Sterling&background=024e56&color=fff&bold=true" />
        </div>
      </div>
    </header>
  )
}
