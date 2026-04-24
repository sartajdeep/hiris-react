import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function ProfessorDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard') // dashboard, approvals, analytics
  const [activeJDs, setActiveJDs] = useState([
    { title: "Lead Data Scientist", dept: "AI Research" },
    { title: "ML Engineer", dept: "Cloud Systems" },
    { title: "AI Ethicist", dept: "Policy Lab" }
  ])
  
  const [pipeline, setPipeline] = useState([])
  const [todayGrid, setTodayGrid] = useState([
    { name:"James Anderson",  role:"Admissions Officer",   time:"09:00 AM" },
    { name:"Sarah Jenkins",   role:"Lead Data Scientist",  time:"11:00 AM" },
    { name:"Dr. Robert Fox",  role:"Senior AI Researcher", time:"02:00 PM" }
  ])

  const [statusFilter, setStatusFilter] = useState('All')
  const [roleFilter, setRoleFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetch('http://localhost:3001/api/candidates')
      .then(res => res.json())
      .then(data => setPipeline(data))
  }, [])

  const pendingApprovals = pipeline.filter(c => c.status === 'Applied' || c.status === 'Under Review')
  
  const handleUpdateStatus = async (id, newStatus) => {
    await fetch(`http://localhost:3001/api/candidates/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
    setPipeline(pipeline.map(c => c.id === id ? { ...c, status: newStatus } : c))
  }

  const filteredPipeline = pipeline.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchRole = roleFilter === 'All' || c.role_applied === roleFilter
    let matchStatus = true
    if (statusFilter !== 'All') {
      if (statusFilter === 'Shortlisted') {
        matchStatus = (c.status === 'Offer' || c.status === 'Interview' || c.status === 'Final Round' || c.status === 'Shortlisted')
      } else if (statusFilter === 'Approved') {
        matchStatus = (c.status === 'HR Round' || c.status === 'Approved')
      } else if (statusFilter === 'Rejected') {
        matchStatus = (c.status === 'Rejected')
      }
    }
    return matchSearch && matchRole && matchStatus
  })

  // Render Stats
  const totalCounts = pipeline.length
  const pendingCounts = pendingApprovals.length
  const shortCounts = pipeline.filter(c => c.status === 'Offer' || c.status === 'Interview' || c.status === 'Shortlisted').length

  const getStatusBadge = (status) => {
    if (status === 'Shortlisted' || status === 'Offer' || status === 'Final Round' || status === 'Interview') return <span className="px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase border bg-green-50 text-green-700 border-green-100">Shortlisted</span>
    if (status === 'Approved' || status === 'HR Round') return <span className="px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase border bg-teal-50 text-teal-700 border-teal-100">Approved</span>
    if (status === 'Rejected') return <span className="px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase border bg-red-50 text-red-600 border-red-100">Rejected</span>
    return <span className="px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase border bg-amber-50 text-amber-700 border-amber-100">Pending</span>
  }

  return (
    <div className="bg-[color:var(--bg)] text-[color:var(--text-primary)] antialiased min-h-screen flex flex-col font-sans overflow-hidden">
      
      
      {/* Sub Header Navbar */}
      <div className="bg-[color:var(--surface)] border-b border-[color:var(--border)] px-8 flex items-center justify-center gap-7 text-[11px] font-semibold text-slate-400 uppercase tracking-[.15em] h-10 shrink-0">
          <button onClick={() => setActiveTab('dashboard')} className={`border-b-2 hover:text-[#0F1F3D] transition-all pb-1 ${activeTab==='dashboard'? 'border-[#C8973A] text-[#0F1F3D]' : 'border-transparent'}`}>Dashboard</button>
          <button onClick={() => setActiveTab('approvals')} className={`border-b-2 hover:text-[#0F1F3D] transition-all pb-1 relative ${activeTab==='approvals'? 'border-[#C8973A] text-[#0F1F3D]' : 'border-transparent'}`}>
              Approvals
              {pendingCounts > 0 && <span className="absolute -top-1 -right-3.5 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">{pendingCounts}</span>}
          </button>
          <button onClick={() => setActiveTab('analytics')} className={`border-b-2 hover:text-[#0F1F3D] transition-all pb-1 ${activeTab==='analytics'? 'border-[#C8973A] text-[#0F1F3D]' : 'border-transparent'}`}>Analytics</button>
      </div>

      <main className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-72 bg-[color:var(--surface)] border-r border-slate-200 flex flex-col shrink-0">
            <div className="p-5">
                <Link to="/job-posting-builder" className="w-full py-3 bg-[#0F1F3D] text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#162847] transition-all flex items-center justify-center gap-2 shadow-sm">
                    <span className="material-symbols-outlined text-base">add_circle</span> Post New JD
                </Link>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-6 custom-scrollbar">
                <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Active Roles</p>
                    <div className="space-y-0.5">
                      {activeJDs.map(jd => (
                        <div key={jd.title} onClick={() => { setRoleFilter(jd.title); setActiveTab('analytics'); }} className="flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-50 group transition-all">
                            <div>
                                <p className="text-xs font-semibold text-[#0F1F3D] group-hover:text-[#C8973A] transition-colors leading-tight">{jd.title}</p>
                                <p className="text-[9px] text-slate-400 mt-0.5">{jd.dept}</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-300 text-sm group-hover:text-[#C8973A] transition-colors">chevron_right</span>
                        </div>
                      ))}
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between px-2 mb-2">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Pending Approvals</p>
                        {pendingCounts > 0 && <span className="text-[9px] text-white bg-red-500 font-bold px-1.5 py-0.5 rounded-full animate-pulse">{pendingCounts}</span>}
                    </div>
                    <div className="space-y-0.5">
                      {pendingApprovals.map(c => (
                        <div key={c.id} onClick={() => navigate(`/review-jd/${c.opening_id || 'CS-2026-001'}`)} className="flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-50 group transition-all border border-transparent hover:border-amber-100">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full shrink-0 animate-pulse"></span>
                                <div>
                                    <p className="text-xs font-semibold text-[#0F1F3D] group-hover:text-[#C8973A] transition-colors leading-tight">{c.name}</p>
                                    <p className="text-[9px] text-slate-400 mt-0.5">{c.role_applied}</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-slate-300 text-sm group-hover:text-[#C8973A] transition-colors">chevron_right</span>
                        </div>
                      ))}
                    </div>
                </div>
            </div>
        </aside>

        {/* CONTENT */}
        <section className="flex-1 flex flex-col overflow-hidden bg-[color:var(--bg)]">
          {activeTab === 'dashboard' && (
            <div className="flex-1 flex overflow-hidden animate-[fadeIn_0.2s_ease-out]">
              <div className="flex-1 p-7 overflow-y-auto custom-scrollbar">
                  <div className="mb-6">
                      <h2 className="text-xl font-bold text-[#0F1F3D] font-heading">Recruitment Overview</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Today's interviews and pipeline summary.</p>
                  </div>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
                    {todayGrid.map(m => (
                      <div key={m.name} className="bg-[color:var(--surface)] border border-[#E8ECF2] shadow-sm rounded-2xl p-5 flex flex-col gap-4 hover:border-[#C8973A]/40 transition-all">
                          <div>
                              <span className="text-[9px] font-bold text-[#C8973A] uppercase tracking-widest bg-amber-50 px-2 py-1 rounded-lg">{m.time}</span>
                              <h4 className="font-bold text-[#0F1F3D] mt-3 font-heading">{m.name}</h4>
                              <p className="text-xs text-slate-400 uppercase tracking-wide mt-0.5">{m.role}</p>
                          </div>
                          <Link to="/interview/1" className="w-full py-2.5 bg-[#0F1F3D] text-white text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-[#162847] transition-all flex items-center justify-center gap-2">
                              <span className="material-symbols-outlined text-base">video_camera_front</span> Start Interview
                          </Link>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                      <div className="bg-[color:var(--surface)] border border-[#E8ECF2] rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 shrink-0">
                              <span className="material-symbols-outlined text-xl">group</span>
                          </div>
                          <div>
                              <p className="text-2xl font-bold text-[#0F1F3D]">{totalCounts}</p>
                              <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">Total Candidates</p>
                          </div>
                      </div>
                      <div className="bg-[color:var(--surface)] border border-[#E8ECF2] rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                              <span className="material-symbols-outlined text-xl">pending_actions</span>
                          </div>
                          <div>
                              <p className="text-2xl font-bold text-[#0F1F3D]">{pendingCounts}</p>
                              <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">Pending Review</p>
                          </div>
                      </div>
                      <div className="bg-[color:var(--surface)] border border-[#E8ECF2] rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                              <span className="material-symbols-outlined text-xl">bookmark_added</span>
                          </div>
                          <div>
                              <p className="text-2xl font-bold text-[#0F1F3D]">{shortCounts}</p>
                              <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">Shortlisted</p>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Day Schedule (Right Pane) */}
              <div className="w-80 bg-[color:var(--surface)] border-l border-slate-200 flex flex-col shrink-0">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                      <p className="text-xs font-bold text-[#0F1F3D] uppercase tracking-wider">Day Schedule</p>
                      <span className="material-symbols-outlined text-[#C8973A] text-lg">calendar_today</span>
                  </div>
                  <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2 custom-scrollbar">
                    {["09:00 AM","10:00 AM","11:00 AM","12:00 PM","01:00 PM","02:00 PM","03:00 PM"].map(hour => {
                      const m = todayGrid.find(x => x.time === hour)
                      return (
                        <div key={hour} className="relative pl-12 min-h-[64px] border-l border-slate-100">
                          <span className="absolute -left-4 top-0 text-[9px] font-bold text-slate-300 bg-[color:var(--surface)] px-1 uppercase whitespace-nowrap">{hour}</span>
                          {m ? (
                            <Link to="/interview/1" className="block mt-2 p-3 rounded-xl border-l-4 border-[#C8973A] bg-amber-50/60 cursor-pointer hover:bg-amber-50 transition-all">
                                <p className="text-[11px] font-bold text-[#0F1F3D]">{m.name}</p>
                                <p className="text-[9px] text-slate-400 uppercase tracking-tight mt-0.5">{m.role}</p>
                            </Link>
                          ) : <div className="h-6"></div>}
                        </div>
                      )
                    })}
                  </div>
              </div>
            </div>
          )}

          {activeTab === 'approvals' && (
            <div className="flex-1 flex flex-col p-7 overflow-hidden animate-[fadeIn_0.2s_ease-out]">
              <div className="flex items-center justify-between mb-5 shrink-0">
                  <div>
                      <h2 className="text-xl font-bold text-[#0F1F3D] font-heading">Pending Approvals</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Candidates awaiting your decision.</p>
                  </div>
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                      <span className="material-symbols-outlined text-amber-500 text-sm">pending_actions</span>
                      <span className="text-xs font-bold text-amber-700">{pendingCounts} awaiting review</span>
                  </div>
              </div>
              <div className="flex-1 bg-[color:var(--surface)] border border-[#E8ECF2] shadow-sm rounded-2xl overflow-hidden overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left">
                      <thead className="bg-[color:var(--bg)] border-b border-slate-100 sticky top-0">
                          <tr className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                              <th className="px-5 py-3.5">Candidate</th>
                              <th className="px-5 py-3.5">Role</th>
                              <th className="px-5 py-3.5">Date</th>
                              <th className="px-5 py-3.5 text-right">Action</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {pendingApprovals.map(c => (
                          <tr key={c.id} className="hover:bg-slate-50 transition-all">
                              <td className="px-5 py-4 cursor-pointer" onClick={() => navigate(`/review-jd/${c.opening_id || 'CS-2026-001'}`)}>
                                  <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#0F1F3D] font-bold text-xs shrink-0">
                                          {c.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                                      </div>
                                      <div>
                                          <p className="text-sm font-semibold text-[#0F1F3D]">{c.name}</p>
                                          <p className="text-[10px] text-slate-400">Applied {new Date(c.applied_date).toLocaleDateString()}</p>
                                      </div>
                                  </div>
                              </td>
                              <td className="px-5 py-4 text-xs text-slate-500">{c.role_applied}</td>
                              <td className="px-5 py-4 text-xs text-slate-400">{new Date(c.applied_date).toLocaleDateString()}</td>
                              <td className="px-5 py-4 text-right">
                                  <div className="flex gap-1.5 justify-end">
                                      <button onClick={() => handleUpdateStatus(c.id, 'Interview')} className="flex items-center gap-1 px-2.5 py-1.5 bg-green-50 text-green-700 border border-green-100 rounded-lg hover:bg-green-600 hover:text-white transition-all text-[9px] font-bold uppercase">
                                          <span className="material-symbols-outlined text-sm">bookmark_added</span> Shortlist
                                      </button>
                                      <button onClick={() => handleUpdateStatus(c.id, 'HR Round')} className="flex items-center gap-1 px-2.5 py-1.5 bg-teal-50 text-teal-700 border border-teal-100 rounded-lg hover:bg-teal-600 hover:text-white transition-all text-[9px] font-bold uppercase">
                                          <span className="material-symbols-outlined text-sm">check_circle</span> Approve
                                      </button>
                                      <button onClick={() => handleUpdateStatus(c.id, 'Rejected')} className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-500 hover:text-white transition-all text-[9px] font-bold uppercase">
                                          <span className="material-symbols-outlined text-sm">cancel</span> Reject
                                      </button>
                                  </div>
                              </td>
                          </tr>
                        ))}
                        {pendingApprovals.length === 0 && (
                          <tr><td colSpan="4" className="py-16 text-center">
                            <span className="material-symbols-outlined text-4xl text-slate-200 block mb-2">check_circle</span>
                            <p className="text-sm font-semibold text-slate-300">All caught up!</p>
                          </td></tr>
                        )}
                      </tbody>
                  </table>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="flex-1 flex flex-col p-7 overflow-hidden animate-[fadeIn_0.2s_ease-out]">
              <div className="flex items-center justify-between mb-5 shrink-0">
                  <div>
                      <h2 className="text-xl font-bold text-[#0F1F3D] font-heading">Candidate Management</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Full pipeline and status tracking.</p>
                  </div>
                  <div className="flex items-center gap-2">
                      <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                          {['All','Approved','Shortlisted','Rejected'].map(s => (
                            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 text-[9px] font-bold uppercase rounded-lg transition-all ${statusFilter===s ? 'bg-[color:var(--surface)] shadow-sm text-[#0F1F3D]' : 'text-slate-400'}`}>
                              {s}
                            </button>
                          ))}
                      </div>
                      <input type="text" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder="Search…" className="px-3 py-2 bg-[color:var(--surface)] border border-[color:var(--border)] rounded-xl text-xs w-40 focus:border-[#0F1F3D] outline-none" />
                  </div>
              </div>
              <div className="flex-1 bg-[color:var(--surface)] border border-[#E8ECF2] shadow-sm rounded-2xl overflow-hidden overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left">
                      <thead className="bg-[color:var(--bg)] border-b border-slate-100 sticky top-0">
                          <tr className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                              <th className="px-5 py-3.5">Candidate</th>
                              <th className="px-5 py-3.5">Role</th>
                              <th className="px-5 py-3.5 text-center">Status</th>
                              <th className="px-5 py-3.5 text-right">Action</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredPipeline.map(c => (
                          <tr key={c.id} className="hover:bg-slate-50 cursor-pointer transition-all" onClick={() => navigate(`/advanced-candidate/${c.id}`)}>
                              <td className="px-5 py-4">
                                  <div className="flex items-center gap-2.5">
                                      {c.status==='Applied' ? <span className="w-1.5 h-1.5 bg-[#C8973A] rounded-full shrink-0"></span> : <span className="w-1.5 h-1.5 shrink-0"></span>}
                                      <p className="text-sm font-semibold text-[#0F1F3D]">{c.name}</p>
                                  </div>
                              </td>
                              <td className="px-5 py-4 text-xs text-slate-500">{c.role_applied}</td>
                              <td className="px-5 py-4 text-center">{getStatusBadge(c.status)}</td>
                              <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex gap-1.5 justify-end">
                                      {c.status !== 'HR Round' && c.status !== 'Rejected' && (
                                        <>
                                          <button onClick={() => handleUpdateStatus(c.id, 'HR Round')} className="flex items-center gap-1 px-2.5 py-1.5 bg-teal-50 text-teal-700 border border-teal-100 rounded-lg hover:bg-teal-600 hover:text-white transition-all text-[9px] font-bold uppercase">
                                              <span className="material-symbols-outlined text-sm">check_circle</span> Approve
                                          </button>
                                          <button onClick={() => handleUpdateStatus(c.id, 'Rejected')} className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-500 hover:text-white transition-all text-[9px] font-bold uppercase">
                                              <span className="material-symbols-outlined text-sm">cancel</span> Reject
                                          </button>
                                        </>
                                      )}
                                  </div>
                              </td>
                          </tr>
                        ))}
                        {filteredPipeline.length === 0 && <tr><td colSpan="4" className="py-12 text-center text-sm text-slate-300">No candidates found.</td></tr>}
                      </tbody>
                  </table>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
