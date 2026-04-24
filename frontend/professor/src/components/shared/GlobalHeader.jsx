import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import ThemeToggle from '../ThemeToggle'
import ProfileSettingsModal from './ProfileSettingsModal'

const LANDING_LOGIN_URL = 'http://localhost:5176/login'

export default function GlobalHeader({ portalLabel = 'Portal' }) {
  const { user, logout } = useAuth()
  const [showSettings, setShowSettings] = useState(false)

  function handleLogout() {
    logout()
    window.location.href = LANDING_LOGIN_URL
  }

  return (
    <header className="h-[64px] border-b border-[color:var(--border)] bg-[color:var(--surface)] px-6 flex items-center justify-between sticky top-0 z-50 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div className="flex items-center gap-4">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <ThemeToggle />
        </div>
        <Link to="/" className="flex items-center gap-3 no-underline">
          <div className="w-8 h-8 bg-[#28666E] flex items-center justify-center text-white font-bold rounded-lg text-[14px]">H</div>
          <div className="flex flex-col leading-none">
            <span className="text-[13px] font-bold tracking-tight uppercase text-[color:var(--navy)] font-heading">HIRIS</span>
            <span className="text-[10px] text-[#28666E] font-medium uppercase tracking-widest mt-0.5">{portalLabel}</span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <div className="flex items-center gap-2 pl-3 border-l border-[color:var(--border)]">
            <button 
              onClick={() => setShowSettings(true)}
              className="h-8 w-8 rounded-full bg-[#28666E] flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#28666E]"
              title="Profile Settings"
            >
              {user.initials || user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </button>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-[12px] font-semibold text-[color:var(--navy)]">{user.name}</span>
              <button type="button" className="text-left text-[10px] text-[color:var(--text-muted)] mt-0.5 hover:text-[color:var(--teal)]" onClick={() => setShowSettings(true)}>Profile Settings</button>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="ml-1 p-1.5 text-[color:var(--text-muted)] hover:text-[#EF4444] transition-colors duration-150 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EF4444]/20"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        )}
      </div>

      {showSettings && <ProfileSettingsModal onClose={() => setShowSettings(false)} />}
    </header>
  )
}
