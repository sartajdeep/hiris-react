import { useState } from 'react'
import { useToast } from './ToastContext'

const AVAILABLE_PERMISSIONS = [
  { id: 'view_pipeline', label: 'View Candidate Pipeline', desc: 'Can see candidates in the hiring pipeline.' },
  { id: 'screen_candidates', label: 'Screen Candidates', desc: 'Can move candidates between early stages.' },
  { id: 'view_ai_scores', label: 'View AI Scores', desc: 'Can see the AI generated resume scores and evaluations.' },
  { id: 'draft_jd', label: 'Draft Job Descriptions', desc: 'Can create and edit draft JDs.' },
  { id: 'publish_jd', label: 'Publish Job Descriptions', desc: 'Can make JDs live for candidates to apply.' },
  { id: 'conduct_interview', label: 'Conduct Interviews', desc: 'Access to the Interview Room interface.' },
  { id: 'approve_hires', label: 'Final Approvals', desc: 'Can make the final hire/reject decision.' }
]

export default function RoleBuilderModal({ onClose, onSave, editingRole = null }) {
  const toast = useToast()
  const [roleName, setRoleName] = useState(editingRole?.name || '')
  const [description, setDescription] = useState(editingRole?.description || '')
  const [selectedPerms, setSelectedPerms] = useState(new Set(editingRole?.permissions || []))
  const [saving, setSaving] = useState(false)

  const togglePerm = (id) => {
    const next = new Set(selectedPerms)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedPerms(next)
  }

  const handleSave = () => {
    if (!roleName.trim()) {
      toast('Role name is required', 'error')
      return
    }
    setSaving(true)
    setTimeout(() => {
      onSave({
        id: editingRole?.id || `role_custom_${Date.now()}`,
        name: roleName.trim(),
        description: description.trim(),
        permissions: Array.from(selectedPerms),
        isCustom: true
      })
      setSaving(false)
      onClose()
    }, 500)
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[var(--surface)] w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] anim-scale-in border border-[var(--border)]" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg)] shrink-0 rounded-t-xl">
          <div>
            <h2 className="font-heading font-bold text-lg text-[var(--navy)] m-0">
              {editingRole ? 'Edit Custom Persona' : 'Create Custom Persona'}
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Define a new job role and precisely configure their access and capabilities across the platform.
            </p>
          </div>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--error)] transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Role Name</label>
              <input 
                value={roleName} onChange={e => setRoleName(e.target.value)}
                placeholder="e.g. HR Intern, External Recruiter"
                className="w-full px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--teal)] focus:ring-1 focus:ring-[var(--teal)] transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Description</label>
              <textarea 
                value={description} onChange={e => setDescription(e.target.value)} rows={2}
                placeholder="Briefly describe the responsibilities of this persona..."
                className="w-full px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--teal)] focus:ring-1 focus:ring-[var(--teal)] transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3 mt-2">Platform Permissions</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {AVAILABLE_PERMISSIONS.map(p => {
                  const active = selectedPerms.has(p.id)
                  return (
                    <div 
                      key={p.id}
                      onClick={() => togglePerm(p.id)}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        active 
                          ? 'border-[var(--teal)] bg-[var(--teal-10)]' 
                          : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--teal-30)] hover:bg-[var(--bg)]'
                      }`}
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        active ? 'bg-[var(--teal)] border-[var(--teal)]' : 'border-[var(--border)] bg-white'
                      }`}>
                        {active && <span className="material-symbols-outlined text-white text-[12px] font-bold">check</span>}
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${active ? 'text-[var(--teal)]' : 'text-[var(--navy)]'}`}>
                          {p.label}
                        </div>
                        <div className={`text-[10px] mt-0.5 leading-snug ${active ? 'text-[var(--teal)] opacity-80' : 'text-[var(--text-muted)]'}`}>
                          {p.desc}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--bg)] flex justify-end gap-3 shrink-0 rounded-b-xl">
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-transparent border border-[var(--border)] text-[var(--navy)] rounded-lg font-semibold text-xs hover:bg-[var(--surface)] transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-[var(--teal)] text-white rounded-lg font-bold text-xs hover:bg-[var(--teal-dark)] transition-colors flex items-center gap-2 shadow-sm"
          >
            {saving ? <span className="material-symbols-outlined animate-spin text-[16px]">sync</span> : <span className="material-symbols-outlined text-[16px]">save</span>}
            {saving ? 'Saving...' : 'Save Persona'}
          </button>
        </div>
      </div>
    </div>
  )
}
