import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'http://localhost:3001/api'

const SAMPLE_REQUESTS = [
  { 
    id: 'REQ-PROF-002', 
    title: 'Postdoctoral Fellow – Neuroscience Lab', 
    status: 'Sent for Approval', 
    department: 'Dept of Neuroscience', 
    job_type: 'Full-time', 
    location: 'on-campus', 
    requested_by: 'Dr. Julian Sterling', 
    description: 'The Department of Neuroscience is seeking a highly motivated Postdoctoral Fellow to lead a pioneering neural pathway mapping initiative. Funded by a recently awarded R01 grant from the NIH, this project focuses on high-resolution functional imaging and sim-to-real transfer to map the mammalian motor cortex. You will be responsible for designing novel in-vivo imaging protocols, guiding a small team of graduate students, and establishing robust analytical pipelines combining machine learning with classic electrophysiology. The ideal candidate will have extensive experience in two-photon microscopy, Python-based data analysis (e.g., Suite2p, CaImAn), and a demonstrated track record of disseminating rigorous scientific results in top-tier journals. This role provides an exceptional opportunity to conduct interdisciplinary research at the intersection of computational neurobiology and neural engineering within a world-class facility.', 
    deadline: new Date(Date.now() + 60 * 86400000).toISOString() 
  },
  { 
    id: 'REQ-PROF-001', 
    title: 'Graduate Research Assistant – Computational Biology', 
    status: 'Pending Review', 
    department: 'Dept of Biology', 
    job_type: 'Full-time', 
    location: 'on-campus', 
    requested_by: 'Dr. Julian Sterling', 
    description: 'Seeking a graduate student or research associate to support computational modelling work in the Biology lab. Strong Python skills required.', 
    deadline: new Date(Date.now() + 75 * 86400000).toISOString() 
  },
]



export default function ProfessorJDReview() {
  const navigate = useNavigate()
  const [requests, setRequests]         = useState(SAMPLE_REQUESTS)
  const [selected, setSelected]         = useState(null)
  const [feedback, setFeedback]         = useState('')
  const [activeFlag, setActiveFlag]     = useState(null)
  const [submitting, setSubmitting]     = useState(false)
  const [toast, setToast]               = useState(null)

  const showToast = (msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 4000) }

  useEffect(() => {
    fetch(`${API}/hiring-requests`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && data.length > 0) {
          const mine = data.filter(r =>
            (r.requested_by || '').toLowerCase().includes('julian') ||
            (r.requested_by || '').toLowerCase().includes('sterling') ||
            r.id.startsWith('REQ-PROF')
          )
          if (mine.length > 0) setRequests(mine)
        }
      })
      .catch(() => {})
  }, [])

  const handleApprove = async (req) => {
    setSubmitting(true)
    try {
      await fetch(`${API}/hiring-requests/${req.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Approved' }),
      })
    } catch { /* offline */ }
    setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'Approved' } : r))
    setSelected(null)
    showToast('JD approved. The Hiring Office can now publish the posting.')
    setSubmitting(false)
  }

  const handleSendBack = async (req) => {
    if (!feedback.trim()) { showToast('Please add feedback before sending back.', false); return }
    setSubmitting(true)
    try {
      await fetch(`${API}/hiring-requests/${req.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Pending Review' }),
      })
    } catch { /* offline */ }
    setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'Pending Review' } : r))
    setSelected(null)
    setFeedback('')
    setActiveFlag(null)
    showToast('Feedback sent. The Hiring Office has been notified.')
    setSubmitting(false)
  }

  const fmtDeadline = (d) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="bg-[var(--bg)] text-[var(--text-primary)] antialiased flex flex-col min-h-screen font-sans">
      
      

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[22px] font-bold text-[var(--text-primary)] tracking-tight">My Job Requests</h1>
            <p className="text-[12px] font-medium text-[var(--text-muted)] mt-1">
              All JD requests you have initiated. Click <strong>Awaiting Your Review</strong> to approve or request changes.
            </p>
          </div>
          <button onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-4 py-2 border border-[var(--border)] rounded-lg text-[12px] font-semibold text-[var(--text-muted)] hover:bg-[var(--surface)] transition shadow-sm">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Dashboard
          </button>
        </div>

        {/* 3-column kanban — same pattern as HiringRequests.jsx */}
        <div className="w-full overflow-x-auto custom-scrollbar pb-4">
          <div className="grid grid-cols-2 gap-5 min-w-[600px] items-start">
            {[
              { type: 'sent',   label: 'Sent',           filters: ['Pending Review'],      dot: 'bg-blue-400',   badge: 'bg-blue-50 text-blue-700 border-blue-200',     actionable: false },
              { type: 'review', label: 'Pending Review', filters: ['Sent for Approval'],   dot: 'bg-amber-400',  badge: 'bg-amber-50 text-amber-700 border-amber-200',  actionable: true  },
            ].map(({ type, label, filters, dot, badge, actionable }) => {
              const colReqs = requests.filter(r => filters.includes(r.status))
              return (
                <div key={type} className="bg-[var(--surface)] rounded-xl border border-[var(--border)] shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[var(--border)] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${dot}`} />
                      <h2 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{label}</h2>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full ${badge}`}>{colReqs.length}</span>
                  </div>
                  <div className="p-3 space-y-2">
                    {colReqs.length === 0 && (
                      <p className="text-center text-xs text-[#CBD5E1] py-10 italic">No requests in this stage</p>
                    )}
                    {colReqs.map(r => (
                      <div key={r.id}
                        onClick={() => actionable ? setSelected(r) : null}
                        className={`p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] space-y-3 shadow-sm transition-all group
                          ${actionable ? 'cursor-pointer hover:border-[#024e56] hover:shadow-md' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h3 className={`text-[13px] font-semibold text-[var(--text-primary)] leading-tight ${actionable ? 'group-hover:text-[#024e56] transition-colors' : ''}`}>
                            {r.title}
                          </h3>
                          <span className={`text-[9px] font-bold px-2 py-0.5 border rounded-full shrink-0 ${badge}`}>{r.id}</span>
                        </div>
                        {r.description && (
                          <p className="text-[11px] text-[#64748B] italic line-clamp-2">"{r.description}"</p>
                        )}
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] text-[var(--text-muted)]">
                          {r.department && r.department !== 'TBD' && (
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm text-[#94A3B8]">corporate_fare</span>
                              {r.department}
                            </span>
                          )}
                          {r.location && (
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm text-[#94A3B8]">location_on</span>
                              {r.location}
                            </span>
                          )}
                          {r.deadline && (
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm text-red-400">event</span>
                              {fmtDeadline(r.deadline)}
                            </span>
                          )}
                        </div>
                        {actionable && (
                          <div className="pt-2 border-t border-[var(--border)]">
                            <span className="text-[9px] font-bold text-[#024e56] uppercase tracking-widest group-hover:underline flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">rate_review</span>
                              Click to Review JD →
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

      

      {/* ── JD Review slider modal ── */}
      {/* ── JD Review Full-Page Modal ── */}
      {selected && (
        <div className="fixed inset-0 z-[998] flex items-center justify-center p-6 bg-[#0F172A]/80 backdrop-blur-sm transition-all duration-300">
          <div className="w-full h-full max-w-6xl bg-[var(--surface)] shadow-2xl rounded-2xl flex overflow-hidden animate-[fadeIn_0.3s_ease-out]">
            
            {/* Left Panel: Fully-Rendered JD Preview */}
            <div className="flex-1 overflow-y-auto bg-[var(--surface)] border-r border-[var(--border)] custom-scrollbar">
              <div className="px-12 py-10">
                {/* Header branding */}
                <div className="flex items-center gap-3 mb-10">
                  <span className="material-symbols-outlined text-[32px] text-[#024e56]">school</span>
                  <div>
                    <h1 className="text-[20px] font-black text-[var(--text-primary)] tracking-tighter leading-none">University Hiring Office</h1>
                    <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.15em] mt-1">Official Job Description Preview</p>
                  </div>
                </div>

                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h2 className="text-[28px] font-extrabold text-[var(--text-primary)] leading-tight tracking-tight">{selected.title}</h2>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="flex items-center gap-1.5 text-[12px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                        <span className="material-symbols-outlined text-sm text-[#024e56]">corporate_fare</span>
                        {selected.department || 'TBD'}
                      </span>
                      <span className="flex items-center gap-1.5 text-[12px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                        <span className="material-symbols-outlined text-sm text-[#024e56]">location_on</span>
                        {selected.location || 'On-Campus'}
                      </span>
                      <span className="flex items-center gap-1.5 text-[12px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                        <span className="material-symbols-outlined text-sm text-[#024e56]">badge</span>
                        {selected.job_type || 'Full-time'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[.15em] mb-1">Target Application Deadline</p>
                    <p className="text-[14px] font-bold text-[var(--text-primary)]">{fmtDeadline(selected.deadline) || 'Open Until Filled'}</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <section>
                    <h3 className="text-[14px] font-bold text-[#024e56] uppercase tracking-widest border-b-2 border-[#024e56] pb-2 mb-4 inline-block">Position Overview</h3>
                    <p className="text-[14px] leading-relaxed text-[#334155]">
                      {selected.description || 'We are seeking an outstanding individual to join our department. In this role, you will lead innovative research and collaborate with a highly driven academic community. You will be expected to push the boundaries of current methodologies and contribute fundamentally to our core strategic objectives.'}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-[14px] font-bold text-[#024e56] uppercase tracking-widest border-b-2 border-[#024e56] pb-2 mb-4 inline-block">Key Responsibilities</h3>
                    <ul className="space-y-3">
                      {[
                        `Lead and execute defining research strategies aligned with the goals of the ${selected.department || 'department'}.`,
                        'Formulate advanced methodologies and manage multi-disciplinary project teams.',
                        'Publish findings in top-tier conferences and peer-reviewed journals.',
                        'Mentor graduate students and junior researchers within the laboratory.'
                      ].map((item, idx) => (
                        <li key={idx} className="flex gap-3 text-[14px] leading-relaxed text-[#334155]">
                          <span className="material-symbols-outlined text-[18px] text-[#024e56] shrink-0">arrow_right</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-[14px] font-bold text-[#024e56] uppercase tracking-widest border-b-2 border-[#024e56] pb-2 mb-4 inline-block">Required Qualifications</h3>
                    <ul className="space-y-3">
                      {[
                        'Ph.D. or equivalent terminal degree in a strictly relevant academic field.',
                        'Proven track record of high-impact publications and academic excellence.',
                        'Exceptional analytical and problem-solving skills.',
                        'Demonstrated ability to communicate complex concepts clearly to broad audiences.'
                      ].map((item, idx) => (
                        <li key={idx} className="flex gap-3 text-[14px] leading-relaxed text-[#334155]">
                          <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0">check_circle</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                  
                  <section className="bg-[var(--bg)] p-6 rounded-xl border border-[var(--border)]">
                    <h3 className="text-[12px] font-bold text-[var(--text-primary)] uppercase tracking-widest mb-3">Compensation & Benefits</h3>
                    <p className="text-[13px] leading-relaxed text-[var(--text-muted)]">
                      Salary is highly competitive and commensurate with experience. The institution offers a comprehensive benefits package including full medical/dental coverage, generous retirement contributions, conference travel stipends, and access to all premier campus facilities.
                    </p>
                  </section>
                </div>
              </div>
            </div>

            {/* Right Panel: Professor's Decision Center */}
            <div className="w-[380px] shrink-0 bg-[var(--bg)] flex flex-col">
              {/* Sidebar Header */}
              <div className="bg-[#0F172A] px-6 py-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400">rate_review</span>
                  <h3 className="text-[14px] font-bold text-white uppercase tracking-wider">Your Decision</h3>
                </div>
                <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white transition">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Sidebar Body */}
              <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
                <div>
                  <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest mb-1.5">Action Required</p>
                  <p className="text-[13px] font-medium text-[var(--text-primary)] leading-relaxed">
                    Please review the JD prepared by the Hiring Office. If it accurately reflects your requirements, approve it to let them publish immediately. Discrepancies? Send it back.
                  </p>
                </div>

                <div className="flex-1">
                  <label className="text-[11px] font-bold text-[#024e56] uppercase tracking-[.15em] block mb-2">
                    Feedback / Remarks
                  </label>
                  <textarea 
                    value={feedback} 
                    onChange={e => setFeedback(e.target.value.slice(0, 1000))}
                    placeholder="Type feedback here if revisions are needed (e.g. 'Add python requirement')."
                    className="w-full h-[180px] p-4 bg-[var(--surface)] border border-[#CBD5E1] rounded-xl text-[13px] text-[var(--text-primary)] focus:outline-none focus:border-[#024e56] focus:ring-2 focus:ring-[#024e56]/10 shadow-sm transition resize-none placeholder:text-[#94A3B8]"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-[#94A3B8] font-bold">* Required for sending back</span>
                    <span className="text-[10px] text-[#94A3B8] font-bold">{feedback.length}/1000</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border)]">
                  <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-[.15em] block mb-3">Quick Flags</label>
                  <div className="flex flex-wrap gap-2">
                    {['Needs Revision', 'Expand Scope', 'Clarification Required', 'Approved as-is'].map(f => (
                      <button key={f} onClick={() => setActiveFlag(activeFlag === f ? null : f)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all shadow-sm
                          ${activeFlag === f ? 'bg-[#024e56] text-white border-[#024e56]' : 'bg-[var(--surface)] text-[var(--text-muted)] border-[#CBD5E1] hover:border-[#024e56]/40'}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar Footer Actions */}
              <div className="p-6 bg-[var(--surface)] border-t border-[var(--border)] space-y-3 shrink-0">
                <button onClick={() => handleApprove(selected)} disabled={submitting}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition text-[13px] flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(5,150,105,0.2)] disabled:opacity-60 disabled:shadow-none">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span> Approve & Publish
                </button>
                <button onClick={() => handleSendBack(selected)} disabled={submitting}
                  className="w-full py-3.5 bg-[var(--surface)] border-2 border-[#0F172A] hover:bg-[#0F172A] hover:text-white text-[var(--text-primary)] font-bold rounded-xl transition text-[13px] flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 disabled:hover:bg-[var(--surface)] disabled:hover:text-[var(--text-primary)]">
                  <span className="material-symbols-outlined text-[18px]">reply</span> Send Back to HR
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-[13px] font-semibold
          ${toast.ok ? 'bg-[#024e56] text-white' : 'bg-red-500 text-white'}`}>
          <span className="material-symbols-outlined text-lg">{toast.ok ? 'check_circle' : 'error'}</span>
          {toast.msg}
        </div>
      )}
    </div>
  )
}
