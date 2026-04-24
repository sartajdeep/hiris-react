import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { getAdmissionsStats, getCandidates, closeOpening } from '../../api/client'

export default function Admissions() {
  const [searchParams] = useSearchParams()
  const openingId = searchParams.get('opening_id') || 'GA-2026-001'
  const navigate = useNavigate()

  const [isApplicationsStopped, setIsApplicationsStopped] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [stats, setStats] = useState({ total: 0, pending_review: 0 })
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getAdmissionsStats(openingId).then(setStats),
      getCandidates({ opening_id: openingId }).then(setCandidates)
    ]).catch(console.error).finally(() => setLoading(false))
  }, [openingId])

  const toggleApplications = async () => {
    try {
      await closeOpening(openingId)
      setIsApplicationsStopped(true)
      setShowPopup(true)
      setTimeout(() => setShowPopup(false), 3000)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="bg-[color:var(--bg)] text-[color:var(--text-primary)] antialiased min-h-screen flex flex-col font-sans">
      
      

      <main className="flex-grow flex flex-col items-center px-6 lg:px-20 py-8">
        <div className="w-full max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h1 className="text-[color:var(--text-primary)] text-2xl font-bold font-heading tracking-tight">Admissions Officer</h1>
                {isApplicationsStopped ? (
                  <span className="bg-[color:var(--surface)] text-[color:var(--text-secondary)] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-[color:var(--border)]">Closed</span>
                ) : (
                  <span className="bg-[#F0FDF4] text-[#15803D] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-[#22C55E]/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">Open</span>
                )}
              </div>
              <p className="text-[color:var(--text-secondary)] font-semibold text-xs tracking-wider uppercase mt-1">Job ID: #{openingId}</p>
            </div>
            
            <div className="flex gap-3">
              {isApplicationsStopped ? (
                <button
                  type="button"
                  disabled
                  className="flex items-center justify-center gap-2 px-4 py-2 border rounded-xl font-bold text-xs shadow-sm bg-[color:var(--surface)] border-[color:var(--border)] text-[color:var(--text-muted)] opacity-50 cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span> Edit Posting
                </button>
              ) : (
                <Link
                  to="/admissions/edit"
                  className="flex items-center justify-center gap-2 px-4 py-2 border rounded-xl font-bold text-xs shadow-sm transition-all duration-150 bg-[color:var(--surface)] border-[color:var(--border)] text-[color:var(--text-secondary)] hover:bg-[color:var(--bg)] hover:shadow-md hover:-translate-y-px hover:border-[color:var(--border)]"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span> Edit Posting
                </Link>
              )}
              <button 
                onClick={toggleApplications}
                disabled={isApplicationsStopped}
                className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-xl font-bold text-xs shadow-sm transition-all duration-150 ${isApplicationsStopped ? 'bg-[color:var(--surface)] text-[color:var(--text-muted)] border-[color:var(--border)] cursor-not-allowed' : 'bg-[color:var(--surface)] border-[color:var(--border)] text-[#EF4444] hover:bg-[#FEF2F2] hover:border-[#F87171] hover:shadow-md hover:-translate-y-px'}`}>
                <span className="material-symbols-outlined text-[16px]">{isApplicationsStopped ? 'check_circle' : 'block'}</span> 
                {isApplicationsStopped ? 'Accepting Stopped' : 'Stop Accepting Applications'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 mb-8 sm:grid-cols-2">
            <div className="bg-[color:var(--surface)] p-5 rounded-xl border border-[color:var(--border)] shadow-card flex items-center justify-between hover:shadow-md hover:-translate-y-px transition-all duration-150 group">
              <div>
                <p className="text-[color:var(--text-secondary)] text-[11px] font-bold uppercase tracking-wider group-hover:text-[color:var(--text-secondary)] transition-colors">Total Applicants</p>
                <p className="text-3xl font-black font-heading text-[color:var(--text-primary)] mt-1.5">{stats.total}</p>
              </div>
              <div className="bg-[#ecfdf5] text-[#059669] text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 border border-[#a7f3d0]">
                <span className="material-symbols-outlined text-[16px]">trending_up</span> 15%
              </div>
            </div>
            
            <div className="bg-[color:var(--surface)] p-5 rounded-xl border border-[color:var(--border)] shadow-card flex items-center justify-between hover:shadow-md hover:-translate-y-px transition-all duration-150 group">
              <div>
                <p className="text-[color:var(--text-secondary)] text-[11px] font-bold uppercase tracking-wider group-hover:text-[color:var(--text-secondary)] transition-colors">Pending Review</p>
                <p className="text-3xl font-black font-heading text-[color:var(--text-primary)] mt-1.5">{stats.pending_review}</p>
              </div>
              <div className="bg-[#fffbeb] text-[#d97706] text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 border border-[#fde68a]">
                <span className="material-symbols-outlined text-[16px]">schedule</span> High
              </div>
            </div>
          </div>

          <div className="bg-[color:var(--surface)] rounded-xl border border-[color:var(--border)] shadow-card overflow-hidden hover:shadow-md transition-shadow duration-150">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-[#F8FAFC]/80 border-b border-[color:var(--border)]">
                  <th className="px-6 py-4 text-[color:var(--text-secondary)] font-bold text-[10px] uppercase tracking-wider">Candidate ID</th>
                  <th className="px-6 py-4 text-[color:var(--text-secondary)] font-bold text-[10px] uppercase tracking-wider">Candidate Name</th>
                  <th className="px-6 py-4 text-[color:var(--text-secondary)] font-bold text-[10px] uppercase tracking-wider">Applied On</th>
                  <th className="px-6 py-4 text-[color:var(--text-secondary)] font-bold text-[10px] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[color:var(--text-secondary)] font-bold text-[10px] uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-[color:var(--text-muted)]">
                      <div className="flex justify-center"><div className="w-6 h-6 rounded-full border-4 border-[#28666E]/20 border-t-[#28666E] animate-spin"></div></div>
                    </td>
                  </tr>
                ) : candidates.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-[color:var(--text-muted)]">No candidates found.</td>
                  </tr>
                ) : candidates.map(candidate => (
                  <tr key={candidate.id} className="hover:bg-[color:var(--bg)] transition-colors group cursor-pointer" onClick={() => navigate(`/candidate-profile?id=${candidate.id}`)}>
                    <td className="px-6 py-4 text-[13px] font-semibold text-[color:var(--text-secondary)] font-mono group-hover:text-[color:var(--text-secondary)] transition-colors">{candidate.ref_id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-[#3B82F6] shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                        <span className="text-[14px] font-bold text-[color:var(--text-primary)]">{candidate.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] font-medium text-[color:var(--text-secondary)]">{candidate.applied_date}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">{candidate.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/candidate-profile?id=${candidate.id}`} className="text-[#28666E] font-bold text-[11px] bg-[#28666E]/5 hover:bg-[#28666E] hover:text-white px-4 py-2 rounded-lg inline-block border border-[#28666E]/10 transition-all uppercase tracking-wider">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="p-4 border-t border-[color:var(--border)] bg-[color:var(--bg)] flex justify-between items-center text-xs text-[color:var(--text-secondary)] font-medium">
              <span>Showing {candidates.length ? `1 to ${candidates.length}` : '0'} entries</span>
            </div>
          </div>
        </div>
      </main>

      <div className={`fixed inset-0 flex items-center justify-center bg-[#0F172A]/40 z-[100] transition-opacity duration-300 backdrop-blur-sm ${showPopup ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`bg-[color:var(--surface)] rounded-2xl p-6 md:p-8 max-w-sm w-full mx-4 shadow-2xl transform transition-transform duration-300 flex flex-col items-center text-center ${showPopup ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
          <div className="w-16 h-16 bg-[#FEF2F2] border border-[#FECACA] rounded-full flex items-center justify-center text-[#EF4444] mb-5 shadow-sm">
            <span className="material-symbols-outlined text-[32px] font-bold">block</span>
          </div>
          <h3 className="text-xl font-bold font-heading text-[color:var(--text-primary)] mb-2 tracking-tight">Applications Stopped</h3>
          <p className="text-[color:var(--text-secondary)] text-sm font-medium leading-relaxed">The application link has been disabled and edit posting is now restricted.</p>
        </div>
      </div>

      
    </div>
  )
}
