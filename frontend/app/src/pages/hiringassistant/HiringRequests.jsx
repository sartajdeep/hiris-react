import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getHiringRequests } from '../../api/client'

const COLS = ['Pending Review', 'Sent for Approval', 'Approved']

export default function HiringRequests() {
  const [requests, setRequests] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getHiringRequests().then(data => {
      const mapped = data.map(r => ({
        ...r,
        requestedBy: r.requested_by,
        jobType: r.job_type,
        positions: `${r.positions} ${r.positions === 1 ? 'Vacancy' : 'Vacancies'}`,
        startDate: r.start_date,
        deadlineDisplay: r.deadline
          ? new Date(r.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : '—'
      }))
      setRequests(mapped)
    }).catch(console.error)
  }, [])

  const getColStyle = (col) => {
    if (col === 'Pending Review') return { dot: 'bg-amber-400', badge: 'bg-amber-50 text-amber-700 border-amber-200', header: 'text-amber-700' }
    if (col === 'Sent for Approval') return { dot: 'bg-blue-400', badge: 'bg-blue-50 text-blue-700 border-blue-200', header: 'text-blue-700' }
    return { dot: 'bg-emerald-400', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', header: 'text-emerald-700' }
  }

  const handleCardClick = (col, r) => {
    if (col === 'Pending Review') navigate(`/job-posting-builder?requestId=${r.id}`)
    if (col === 'Approved') navigate(`/publish?requestId=${r.id}`)
  }

  return (
    <div className="bg-[var(--bg)] text-[var(--text-primary)] antialiased flex flex-col min-h-screen">
      
      
      <main className="flex-grow w-full max-w-[1400px] mx-auto px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Hiring Requests</h1>
            <p className="text-xs font-medium text-[var(--text-muted)] mt-1">
              Manage and track faculty hiring requisitions. Click <strong>Pending Review</strong> to build a JD, or <strong>Approved</strong> to publish.
            </p>
          </div>
        </div>

        <div className="w-full overflow-x-auto custom-scrollbar pb-4">
          <div className="grid grid-cols-3 gap-5 min-w-[1000px] items-start">
            {COLS.map(col => {
              const colReqs = requests.filter(r => r.status === col)
              const style = getColStyle(col)
              const isClickable = col === 'Pending Review' || col === 'Approved'
              return (
                <div key={col} className="bg-[var(--surface)] rounded-xl border border-[var(--border)] shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[var(--border)] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
                      <h2 className={`text-xs font-bold uppercase tracking-wider ${style.header}`}>{col}</h2>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full ${style.badge}`}>{colReqs.length}</span>
                  </div>

                  <div className="p-3 space-y-2">
                    {colReqs.length === 0 && (
                      <p className="text-center text-xs text-slate-300 py-8">No requests</p>
                    )}
                    {colReqs.map(r => (
                      <div
                        key={r.id}
                        onClick={() => isClickable && handleCardClick(col, r)}
                        className={`p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] space-y-3 shadow-sm transition-all group ${isClickable ? 'cursor-pointer hover:border-[#28666E] hover:shadow-md' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h3 className={`text-sm font-semibold text-[var(--text-primary)] leading-tight ${isClickable ? 'group-hover:text-[#28666E] transition-colors' : ''}`}>
                            {r.title}
                          </h3>
                          <span className={`text-[9px] font-bold px-2 py-0.5 border rounded-full shrink-0 ${style.badge}`}>{r.id}</span>
                        </div>

                        {r.description && (
                          <p className="text-[11px] text-slate-500 italic line-clamp-2">"{r.description}"</p>
                        )}

                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] text-[var(--text-muted)]">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-slate-400">person</span>
                            {r.requestedBy}
                          </span>
                          {r.location && (
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm text-slate-400">location_on</span>
                              {r.location}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-red-400">event</span>
                            {r.deadlineDisplay}
                          </span>
                        </div>

                        {col === 'Pending Review' && (
                          <div className="pt-2 border-t border-slate-100">
                            <span className="text-[9px] font-bold text-[#28666E] uppercase tracking-widest group-hover:underline flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">edit_document</span> Click to Build JD →
                            </span>
                          </div>
                        )}
                        {col === 'Approved' && (
                          <div className="pt-2 border-t border-slate-100">
                            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest group-hover:underline flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">rocket_launch</span> Click to Publish →
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
      
    </div>
  )
}
