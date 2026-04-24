import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function ProfessorJDReview() {
  const { roleId } = useParams()
  const [role, setRole] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [activeFlag, setActiveFlag] = useState(null)
  const [toast, setToast] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app we'd fetch the opening. For now we use local mock to mirror the legacy state exactly
    const mockRoles = {
      'CS-2026-001': {
        title: "Lead Data Scientist", dept: "Computer Science", type: "Full-Time", positions: 1, requestedBy: "Prof. Arpan Kar",
        deadline: "Aug 15, 2026", start: "Sept 1, 2026", location: "On-campus · IIT Delhi",
        summary: "We are seeking a highly motivated Lead Data Scientist to spearhead research initiatives...",
        responsibilities: [
            "Lead the design and implementation of advanced ML pipelines.",
            "Collaborate with cross-functional teams.",
            "Publish findings in top-tier venues."
        ],
        skills: ["Python","PyTorch","TensorFlow","Research Writing"],
        stages: ["Screening","Technical Interview I","HR Round"],
        requirements: ["Resume (PDF)","Research Publications List"],
        questions: [{ q: "Describe a research project...", type: "Long Answer" }]
      }
    }
    setRole(mockRoles[roleId] || mockRoles['CS-2026-001'])
    setLoading(false)
  }, [roleId])

  const submitFeedback = async () => {
    if (!feedback.trim()) return
    await fetch(`http://localhost:3001/api/jd-reviews/${roleId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedback, flags: [activeFlag].filter(Boolean), reviewer_name: 'Prof. Anupam Sobti' })
    })
    setToast(true)
    setFeedback('')
    setActiveFlag(null)
    setTimeout(() => setToast(false), 4000)
  }

  if (loading || !role) return <div>Loading...</div>

  return (
    <div className="bg-[color:var(--bg)] text-[#1A2B4A] antialiased min-h-screen flex flex-col font-sans">
      
      
      {/* BREADCRUMB */}
      <nav className="bg-[color:var(--surface)] border-b border-slate-200 px-8 py-3 flex items-center gap-2 text-[11px] text-[#6B7A99] font-medium shrink-0">
          <Link to="/hr-dashboard" className="flex items-center gap-1 hover:text-[#0F1F3D] transition-colors">
              <span className="material-symbols-outlined text-sm">home</span> Dashboard
          </Link>
          <span className="material-symbols-outlined text-xs text-slate-300">chevron_right</span>
          <span className="text-[#0F1F3D] font-semibold">{role.title}</span>
      </nav>

      <main className="max-w-5xl w-full mx-auto px-6 py-8 space-y-6 pb-20 flex-1">
          {/* REQUISITION CARD */}
          <div className="bg-[color:var(--surface)] rounded-2xl p-7 border border-slate-200 shadow-sm animate-[fadeIn_0.3s_ease-out]">
              <div className="flex items-start justify-between">
                  <div className="space-y-4">
                      <div>
                          <h1 className="text-2xl font-bold text-[#0F1F3D] font-heading">{role.title}</h1>
                          <p className="text-xs text-[#6B7A99] mt-1 uppercase tracking-wider">{role.dept}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0F1F3D]/5 text-[#0F1F3D] rounded-lg text-[10px] font-bold uppercase tracking-wider">
                              <span className="material-symbols-outlined text-sm">badge</span>{role.type}
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                              <span className="material-symbols-outlined text-sm">group</span>{role.positions} Position(s)
                          </span>
                      </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0 ml-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                          <span className="material-symbols-outlined text-sm">schedule</span> Deadline: <span>{role.deadline}</span>
                      </span>
                  </div>
              </div>
          </div>

          {/* JOB DESCRIPTION (READ-ONLY) */}
          <div className="bg-[color:var(--surface)] rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-[fadeIn_0.4s_ease-out]">
              <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#0F1F3D]/5 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#0F1F3D] text-lg">description</span>
                      </div>
                      <div>
                          <h2 className="text-sm font-bold text-[#0F1F3D] uppercase tracking-wider">Job Description</h2>
                          <p className="text-[10px] text-[#6B7A99] mt-0.5">Submitted by the Hiring Manager — read-only</p>
                      </div>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 bg-slate-100 text-[#6B7A99] rounded-lg">Read Only</span>
              </div>
              <div className="px-7 py-7 space-y-7">
                  <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#6B7A99] text-sm">location_on</span>
                      <span className="text-xs font-bold text-[#0F1F3D] uppercase tracking-wider">{role.location}</span>
                  </div>
                  <div>
                      <p className="text-[10px] font-bold text-[#6B7A99] uppercase tracking-[.15em] mb-3">Role Summary</p>
                      <p className="text-sm text-[#1A2B4A] leading-relaxed">{role.summary}</p>
                  </div>
                  <div>
                      <p className="text-[10px] font-bold text-[#6B7A99] uppercase tracking-[.15em] mb-3">Responsibilities</p>
                      <ul className="space-y-2">
                        {role.responsibilities.map((r,i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-[#1A2B4A] leading-relaxed">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C8973A] shrink-0 mt-2"></span> {r}
                          </li>
                        ))}
                      </ul>
                  </div>
                  <div>
                      <p className="text-[10px] font-bold text-[#6B7A99] uppercase tracking-[.15em] mb-3">Required Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {role.skills.map(s => <span key={s} className="inline-flex items-center px-3 py-1 bg-[#EEF1F8] rounded-full text-[11px] font-bold text-[#1A2B4A]">{s}</span>)}
                      </div>
                  </div>
                  <div>
                      <p className="text-[10px] font-bold text-[#6B7A99] uppercase tracking-[.15em] mb-3">Application Stages</p>
                      <div className="flex flex-wrap gap-2">
                        {role.stages.map(s => <span key={s} className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-[rgba(15,31,61,.2)] bg-[rgba(15,31,61,.06)] text-[#0F1F3D]">{s}</span>)}
                      </div>
                  </div>
              </div>
          </div>

          {/* PROFESSOR FEEDBACK */}
          <div className="bg-[color:var(--surface)] rounded-2xl border border-slate-200 shadow-sm animate-[fadeIn_0.5s_ease-out]">
              <div className="px-7 py-5 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#C8973A]/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#C8973A] text-lg">rate_review</span>
                  </div>
                  <div>
                      <h2 className="text-sm font-bold text-[#0F1F3D] uppercase tracking-wider">Professor's Feedback</h2>
                      <p className="text-[10px] text-[#6B7A99] mt-0.5">Your remarks will be sent back to the Hiring Manager</p>
                  </div>
              </div>
              <div className="px-7 py-7 space-y-5">
                  <div>
                      <label className="text-[10px] font-bold text-[#6B7A99] uppercase tracking-[.15em] block mb-2">Feedback / Remarks</label>
                      <textarea rows="5" value={feedback} onChange={e => setFeedback(e.target.value.substring(0, 1000))}
                          placeholder="e.g. The responsibilities section needs more specificity around the ML Engineering sub-domain..."
                          className="w-full p-4 bg-[#F4F6FA] border border-slate-200 rounded-xl text-sm text-[#1A2B4A] focus:outline-none focus:border-[#0F1F3D] transition-colors resize-none placeholder:text-slate-400"
                      />
                      <div className="flex items-center justify-between mt-2">
                          <p className="text-[10px] text-[#6B7A99]">Your feedback will be logged with timestamp and your name.</p>
                          <span className="text-[10px] text-[#6B7A99] font-medium">{feedback.length} / 1000</span>
                      </div>
                  </div>
                  <div>
                      <label className="text-[10px] font-bold text-[#6B7A99] uppercase tracking-[.15em] block mb-3">Flag Priority</label>
                      <div className="flex flex-wrap gap-2">
                          {['Needs Revision','Approved','Expand Scope','Reduce Scope','Clarification Required'].map(f => (
                            <button key={f} onClick={() => setActiveFlag(activeFlag === f ? null : f)}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all
                              ${activeFlag === f ? 'bg-[rgba(15,31,61,.06)] border-[rgba(15,31,61,.2)] text-[#0F1F3D]' : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                            >
                              {f}
                            </button>
                          ))}
                      </div>
                  </div>
                  <div className="flex gap-3 pt-3 border-t border-slate-100">
                      <button onClick={submitFeedback} className="flex-1 py-3.5 bg-[#0F1F3D] text-white font-bold rounded-xl hover:bg-[#162847] transition-all text-sm flex items-center justify-center gap-2 shadow-sm">
                          <span className="material-symbols-outlined text-base">send</span> Send Feedback
                      </button>
                      <Link to="/hr-dashboard" className="px-6 py-3.5 border border-slate-200 text-[#6B7A99] font-bold rounded-xl hover:bg-slate-50 transition-all text-sm flex items-center gap-2">
                          <span className="material-symbols-outlined text-base">arrow_back</span> Back
                      </Link>
                  </div>
                  {toast && (
                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-3.5 rounded-xl text-sm font-semibold animate-[fadeIn_0.2s]">
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                        <span>Feedback sent successfully. The Hiring Manager has been notified.</span>
                    </div>
                  )}
              </div>
          </div>
      </main>
    </div>
  )
}
