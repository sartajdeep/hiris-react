import { createContext, useContext, useState, useEffect } from 'react'

// ── Demo whitelist (default accounts) ────────────────────────────────────────
export const DEMO_USERS = {
  'smriti.kinra@hiris.demo': {
    name: 'Smriti Kinra',
    role: 'chro',
    portal: 'CHRO Portal',
    initials: 'SK',
    portalUrl: 'http://localhost:5175',
    color: '#28666E',
  },
  'sartajdeep.singh@hiris.demo': {
    name: 'Sartajdeep Singh',
    role: 'hiring-assistant',
    portal: 'Hiring Manager',
    initials: 'SS',
    portalUrl: 'http://localhost:5173',
    color: '#28666E',
  },
  'gracy.tanna@hiris.demo': {
    name: 'Gracy Tanna',
    role: 'professor',
    portal: 'Faculty Portal',
    initials: 'GT',
    portalUrl: 'http://localhost:5174',
    color: '#28666E',
  },
}

// Kept for backward compat — components referencing USER_WHITELIST still work
export const USER_WHITELIST = DEMO_USERS

/** Merge demo users with any users created via the org-signup wizard */
function buildUserMap() {
  const map = { ...DEMO_USERS }
  try {
    const invited = JSON.parse(localStorage.getItem('hiris_invited_users') || '[]')
    invited.forEach(u => { if (u.email) map[u.email] = u })
  } catch {}
  return map
}

const STORAGE_KEY = 'hiris_user'
const ONBOARDED_KEY = 'hiris_onboarded'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const isOnboarded = () => {
    try { return !!localStorage.getItem(ONBOARDED_KEY) } catch { return false }
  }

  function login(email) {
    const trimmed = email.trim().toLowerCase()
    const config = buildUserMap()[trimmed]
    if (!config) return { success: false, error: 'This email is not authorised. Use a registered organisation account or a demo email.' }
    const userData = { email: trimmed, ...config }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    setUser(userData)
    return { success: true, user: userData }
  }

  function completeOnboarding() {
    localStorage.setItem(ONBOARDED_KEY, 'true')
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isOnboarded, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
