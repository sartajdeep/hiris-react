import { useState } from 'react'
import { useAuth } from '../../auth/AuthContext'

export default function ProfileSettingsModal({ onClose }) {
  const { user } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [saving, setSaving] = useState(false)

  function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      // Simulate save
      setSaving(false)
      onClose()
    }, 600)
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center" onClick={onClose}>
      <div className="bg-[var(--surface)] w-[400px] rounded-xl shadow-2xl overflow-hidden anim-scale-in border border-[var(--border)]" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg)]">
          <h2 className="font-heading font-bold text-lg text-[var(--text-primary)] m-0">Profile Settings</h2>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--error)] transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSave} className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-[var(--teal)] rounded-full flex items-center justify-center text-white text-2xl font-bold font-heading mb-3 shadow-lg">
              {user?.initials || name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
            </div>
            <button type="button" className="text-xs font-semibold text-[var(--teal)] hover:text-[var(--teal-dark)]">Change Avatar</button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--teal)] focus:ring-1 focus:ring-[var(--teal)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--teal)] focus:ring-1 focus:ring-[var(--teal)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Portal Role</label>
              <input 
                type="text" 
                value={user?.portal || 'User'}
                disabled
                className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-muted)] cursor-not-allowed opacity-70"
              />
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-transparent border border-[var(--border)] text-[var(--text-primary)] rounded-lg font-semibold text-sm hover:bg-[var(--bg)] transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className="flex-1 px-4 py-2 bg-[var(--teal)] text-white rounded-lg font-semibold text-sm hover:bg-[var(--teal-dark)] transition-colors flex items-center justify-center gap-2"
            >
              {saving ? <span className="material-symbols-outlined animate-spin" style={{fontSize: '18px'}}>sync</span> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
