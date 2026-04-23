import { useState, useMemo } from 'react'
import { useToast } from '../../components/ToastContext'
import dummyUsersData from '../../data/dummy_users.json'
import dummyRolesData from '../../data/dummy_roles.json'
import RoleBuilderModal from '../../components/RoleBuilderModal'

export default function TeamManagement() {
  const toast = useToast()
  const [tab, setTab] = useState('users') // 'users' or 'roles'
  const [users, setUsers] = useState(dummyUsersData)
  const [roles, setRoles] = useState(dummyRolesData)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [editingRole, setEditingRole] = useState(null)

  // Handlers
  const handleSaveRole = (newRole) => {
    setRoles(prev => {
      const idx = prev.findIndex(r => r.id === newRole.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = newRole
        return next
      }
      return [...prev, newRole]
    })
    toast(`Persona "${newRole.name}" saved successfully.`, 'success')
  }

  const handleDeleteRole = (id) => {
    if (users.some(u => u.roleId === id)) {
      toast('Cannot delete a persona that is assigned to active users.', 'error')
      return
    }
    setRoles(prev => prev.filter(r => r.id !== id))
    toast('Persona deleted.', 'success')
  }

  const openRoleModal = (role = null) => {
    setEditingRole(role)
    setShowRoleModal(true)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden p-8 max-w-[1200px] mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[var(--navy)] tracking-tight">Team & Roles Management</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">Manage organization members and build custom platform personas with granular access control.</p>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-[var(--surface)] p-1 rounded-lg border border-[var(--border)]">
          <button 
            onClick={() => setTab('users')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
              tab === 'users' ? 'bg-white text-[var(--navy)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--navy)]'
            }`}
          >
            Users Directory
          </button>
          <button 
            onClick={() => setTab('roles')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              tab === 'roles' ? 'bg-[var(--teal)] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--navy)]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
            Roles & Personas
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-white rounded-xl border border-[var(--border)] shadow-sm">
        
        {/* USERS TAB */}
        {tab === 'users' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-[18px]">search</span>
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  className="w-full pl-9 pr-4 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-xs font-medium focus:outline-none focus:border-[var(--teal)] focus:ring-1 focus:ring-[var(--teal)] transition-all"
                />
              </div>
              <button onClick={() => toast('Invite feature mocked for prototype.', 'info')} className="btn btn-teal btn-sm shadow-sm">
                <span className="material-symbols-outlined text-[16px]">person_add</span>
                Invite User
              </button>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                  <th className="px-4 py-3 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Department</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Assigned Persona</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {users.map(u => {
                  const role = roles.find(r => r.id === u.roleId)
                  return (
                    <tr key={u.id} className="hover:bg-[var(--bg)] transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold" style={{backgroundColor: u.avatar}}>
                            {u.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[var(--navy)]">{u.name}</div>
                            <div className="text-[10px] text-[var(--text-muted)]">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-[var(--text-primary)]">{u.department}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold border ${role?.isCustom ? 'bg-[var(--teal-10)] text-[var(--teal)] border-[var(--teal-30)]' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                          {role?.isCustom && <span className="material-symbols-outlined text-[12px]">build</span>}
                          {role?.name || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="text-[var(--text-muted)] hover:text-[var(--teal)] transition-colors p-1" title="Edit Assignment">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ROLES TAB */}
        {tab === 'roles' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <p className="text-xs text-[var(--text-muted)] font-medium max-w-xl leading-relaxed">
                Personas dictate what features a user can access. You can use the standard system personas, or create custom ones tailored to your exact organizational needs (e.g. creating an "Intern" role with restricted visibility).
              </p>
              <button onClick={() => openRoleModal(null)} className="btn btn-teal btn-sm shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[16px]">add</span>
                Create Custom Persona
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {roles.map(r => (
                <div key={r.id} className="border border-[var(--border)] rounded-xl p-5 hover:border-[var(--teal-30)] hover:shadow-md transition-all flex flex-col bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[var(--navy)]">{r.name}</h3>
                      {r.isCustom ? (
                        <span className="bg-[var(--teal-10)] text-[var(--teal)] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-[var(--teal-30)]">Custom</span>
                      ) : (
                        <span className="bg-slate-100 text-slate-500 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-slate-200">System Default</span>
                      )}
                    </div>
                    {r.isCustom && (
                      <div className="flex gap-1">
                        <button onClick={() => openRoleModal(r)} className="text-[var(--text-muted)] hover:text-[var(--teal)] transition-colors p-1" title="Edit Persona">
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button onClick={() => handleDeleteRole(r.id)} className="text-[var(--text-muted)] hover:text-[var(--error)] transition-colors p-1" title="Delete Persona">
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4 flex-1">
                    {r.description}
                  </p>

                  <div className="border-t border-[var(--border)] pt-3 mt-auto">
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Capabilities ({r.permissions.length})</p>
                    <div className="flex flex-wrap gap-1.5">
                      {r.permissions.map(p => (
                        <span key={p} className="bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] text-[10px] font-semibold px-2 py-1 rounded-md">
                          {p.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showRoleModal && <RoleBuilderModal onClose={() => setShowRoleModal(false)} onSave={handleSaveRole} editingRole={editingRole} />}
    </div>
  )
}
