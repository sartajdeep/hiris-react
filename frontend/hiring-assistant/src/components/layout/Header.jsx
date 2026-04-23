import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

export default function Header({ showSearch = false, portalLabel = 'Hiring Assistant' }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="h-[64px] border-b border-[#E2E8F0] bg-white px-6 flex items-center justify-between sticky top-0 z-50 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 no-underline">
        <div className="w-8 h-8 bg-[#28666E] flex items-center justify-center text-white font-bold rounded-lg text-[14px]">H</div>
        <div className="flex flex-col leading-none">
          <span className="text-[13px] font-bold tracking-tight uppercase text-[#0F172A] font-heading">HIRIS</span>
          <span className="text-[10px] text-[#28666E] font-medium uppercase tracking-widest mt-0.5">{portalLabel}</span>
        </div>
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {showSearch && (
          <div className="hidden sm:flex relative w-56">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-[16px]">search</span>
            <input
              className="w-full pl-9 pr-4 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#28666E]/20 focus:border-[#28666E] focus:bg-white outline-none transition-all duration-150"
              placeholder="Search..."
              type="text"
            />
          </div>
        )}

        {/* Notifications */}
        <button className="relative p-2 text-[#94A3B8] hover:text-[#28666E] transition-colors duration-150 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28666E]/20">
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-2 right-2 block h-[6px] w-[6px] rounded-full bg-[#EF4444] ring-2 ring-white"></span>
        </button>

        {/* User info */}
        {user && (
          <div className="flex items-center gap-2 pl-3 border-l border-[#E2E8F0]">
            <div className="h-8 w-8 rounded-full bg-[#28666E] flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
              {user.initials || user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-[12px] font-semibold text-[#0F172A]">{user.name}</span>
              <span className="text-[10px] text-[#94A3B8] mt-0.5">{user.portal}</span>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="ml-1 p-1.5 text-[#94A3B8] hover:text-[#EF4444] transition-colors duration-150 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EF4444]/20"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
