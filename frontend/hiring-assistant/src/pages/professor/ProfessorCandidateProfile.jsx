import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

export default function ProfessorCandidateProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [candidate, setCandidate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeDoc, setActiveDoc] = useState('resume')

  useEffect(() => {
    fetch(`http://localhost:3001/api/candidates/${id || 1}`)
      .then(res => res.json())
      .then(data => {
        setCandidate({
          ...data,
          skills: data.skills || ["Python","PyTorch","JAX","Bayesian Inference","LLM Fine-tuning","LoRA","Causal ML","Research Writing"],
          education_details: data.education_details || [{ inst:"Universitat Politècnica de Catalunya", degree:"Ph.D. Computational Statistics", detail:"Bayesian Methods · Class of 2020" }],
          qa_responses: data.qa_responses || [
            { q:"Describe a research project where your data science work led to a tangible impact.", a:"My doctoral research on causal inference for clinical trial analysis was adopted by a pharmaceutical company..." }
          ],
          ai_summary: data.ai_summary || "Elena is an exceptionally strong candidate. Her depth in Bayesian methods and causal inference is rare...",
          ai_match: data.ai_match || "Exceptional Match",
          resume_highlights: data.resume_highlights || [
            "Staff Data Scientist at Spotify: led Contextual Bandits personalisation system",
            "6 publications including NeurIPS 2023 spotlight paper"
          ]
        })
        setLoading(false)
      })
  }, [id])

  const handleStatusUpdate = async (newStatus) => {
    await fetch(`http://localhost:3001/api/candidates/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
    setCandidate(prev => ({...prev, status: newStatus}))
    setTimeout(() => navigate('/hr-dashboard'), 1200)
  }

  if (loading || !candidate) return <div>Loading...</div>

  const getStatusBadge = () => {
    if (candidate.status === 'Shortlisted' || candidate.status === 'Offer' || candidate.status === 'Interview') return <span className="px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border bg-emerald-50 text-emerald-700 border-emerald-100">Shortlisted</span>
    if (candidate.status === 'Rejected') return <span className="px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border bg-red-50 text-red-600 border-red-100">Rejected</span>
    if (candidate.status === 'Approved' || candidate.status === 'HR Round') return <span className="px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border bg-[#0F1F3D]/5 text-[#0F1F3D] border-[#0F1F3D]/10">Approved</span>
    return <span className="px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border bg-amber-50 text-amber-700 border-amber-200">Pending</span>
  }

  return (
    <div className="bg-[#F4F6FA] text-[#1A2B4A] antialiased min-h-screen flex flex-col font-sans">
      
      
      {/* BREADCRUMB */}
      <nav className="bg-[color:var(--surface)] border-b border-slate-200 px-8 py-3 flex items-center gap-2 text-[11px] text-[#6B7A99] font-medium shrink-0">
          <Link to="/hr-dashboard" className="flex items-center gap-1 hover:text-[#0F1F3D] transition-colors">
              <span className="material-symbols-outlined text-sm">home</span> Dashboard
          </Link>
          <span className="material-symbols-outlined text-xs text-slate-300">chevron_right</span>
          <span className="text-[#0F1F3D] font-semibold">Candidate Profile</span>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 flex flex-col gap-5 pb-16">
          <div className="bg-[color:var(--surface)] rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-[fadeIn_0.3s_ease-out]">
              <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#0F1F3D] flex items-center justify-center text-white font-bold text-xl shrink-0">
                    {candidate.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                  </div>
                  <div>
                      <h1 className="text-xl font-bold text-[#0F1F3D] font-heading">{candidate.name}</h1>
                      <p className="text-xs text-[#6B7A99] font-medium mt-0.5">{candidate.role_applied} Candidate</p>
                      <p className="text-[10px] text-[#6B7A99] mt-1">Applied <span className="font-semibold text-[#1A2B4A]">{new Date(candidate.applied_date).toLocaleDateString()}</span> · Ref: <span className="font-semibold text-[#1A2B4A]">{candidate.ref_id}</span></p>
                  </div>
              </div>
              <div className="flex items-center gap-3">
                  {getStatusBadge()}
                  <button onClick={() => handleStatusUpdate('Rejected')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-[#6B7A99] text-xs font-bold uppercase tracking-wider hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all">
                      <span className="material-symbols-outlined text-base">cancel</span> Reject
                  </button>
                  <button onClick={() => handleStatusUpdate('Shortlisted')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F1F3D] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#162847] transition-all shadow-sm">
                      <span className="material-symbols-outlined text-base">check_circle</span> Accept
                  </button>
              </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-5 flex-1 min-h-[600px]">
              {/* LEFT INFO */}
              <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4 animate-[fadeIn_0.4s_ease-out]">
                  <section className="bg-[color:var(--surface)] rounded-2xl border border-slate-200 shadow-sm p-6">
                      <div className="flex items-center gap-2 mb-5">
                          <div className="w-7 h-7 rounded-lg bg-[rgba(15,31,61,.06)] flex items-center justify-center">
                              <span className="material-symbols-outlined text-[#0F1F3D] text-base">person</span>
                          </div>
                          <h3 className="text-sm font-bold text-[#0F1F3D] uppercase tracking-wider">Personal Information</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="flex flex-col gap-1">
                              <span className="text-[9px] font-bold text-[#6B7A99] uppercase tracking-[.15em]">Email</span>
                              <span className="text-sm text-[#1A2B4A] font-medium">{candidate.email}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                              <span className="text-[9px] font-bold text-[#6B7A99] uppercase tracking-[.15em]">Phone</span>
                              <span className="text-sm text-[#1A2B4A] font-medium">{candidate.phone || 'N/A'}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                              <span className="text-[9px] font-bold text-[#6B7A99] uppercase tracking-[.15em]">Location</span>
                              <span className="text-sm text-[#1A2B4A] font-medium">{candidate.location || 'N/A'}</span>
                          </div>
                      </div>
                  </section>
                  
                  <section className="bg-[color:var(--surface)] rounded-2xl border border-slate-200 shadow-sm p-6">
                      <div className="flex items-center gap-2 mb-5">
                          <div className="w-7 h-7 rounded-lg bg-[rgba(15,31,61,.06)] flex items-center justify-center">
                              <span className="material-symbols-outlined text-[#0F1F3D] text-base">school</span>
                          </div>
                          <h3 className="text-sm font-bold text-[#0F1F3D] uppercase tracking-wider">Academic Background</h3>
                      </div>
                      <div className="space-y-3">
                          {candidate.education_details.map((e,i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-xl bg-[#F4F6FA] border border-slate-200">
                                <div className="w-9 h-9 rounded-xl bg-[#0F1F3D] flex items-center justify-center text-white shrink-0">
                                    <span className="material-symbols-outlined text-base">school</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#0F1F3D] text-sm">{e.inst}</h4>
                                    <p className="text-xs text-[#C8973A] font-semibold mt-0.5">{e.degree}</p>
                                    <p className="text-xs text-[#6B7A99] mt-0.5">{e.detail}</p>
                                </div>
                            </div>
                          ))}
                      </div>
                  </section>

                  <section className="bg-[color:var(--surface)] rounded-2xl border border-slate-200 shadow-sm p-6">
                      <div className="flex items-center gap-2 mb-5">
                          <div className="w-7 h-7 rounded-lg bg-[rgba(15,31,61,.06)] flex items-center justify-center">
                              <span className="material-symbols-outlined text-[#0F1F3D] text-base">psychology</span>
                          </div>
                          <h3 className="text-sm font-bold text-[#0F1F3D] uppercase tracking-wider">Skills</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.map(s => <span key={s} className="inline-flex items-center px-3 py-1 bg-[#EEF1F8] rounded-full text-[11px] font-bold text-[#1A2B4A]">{s}</span>)}
                      </div>
                  </section>
                  
                  <section className="bg-[color:var(--surface)] rounded-2xl border border-slate-200 shadow-sm p-6">
                      <div className="flex items-center gap-2 mb-5">
                          <div className="w-7 h-7 rounded-lg bg-[rgba(15,31,61,.06)] flex items-center justify-center">
                              <span className="material-symbols-outlined text-[#0F1F3D] text-base">quiz</span>
                          </div>
                          <h3 className="text-sm font-bold text-[#0F1F3D] uppercase tracking-wider">Screening Questions</h3>
                      </div>
                      <div className="space-y-5">
                        {candidate.qa_responses.map((q,i) => (
                            <div key={i}>
                                <p className="text-xs font-bold text-[#6B7A99] uppercase tracking-wider mb-1.5">Question {i+1}</p>
                                <p className="text-sm font-semibold text-[#0F1F3D] italic mb-2">"{q.q}"</p>
                                <div className="p-4 rounded-xl border-l-4 border-[#C8973A] bg-[#F5E9D0]/40 text-sm text-[#1A2B4A] leading-relaxed">{q.a}</div>
                            </div>
                        ))}
                      </div>
                  </section>

                  <section className="rounded-2xl border border-[#0F1F3D]/10 shadow-sm p-6 bg-gradient-to-br from-[#0F1F3D]/5 to-[#C8973A]/5">
                      <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-[#C8973A] text-lg">smart_toy</span>
                              <h3 className="text-sm font-bold text-[#0F1F3D] uppercase tracking-wider">AI Interview Summary</h3>
                          </div>
                          <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-lg border bg-emerald-50 text-emerald-700 border-emerald-200">{candidate.ai_match}</span>
                      </div>
                      <p className="text-sm text-[#1A2B4A] leading-relaxed mb-5">{candidate.ai_summary}</p>
                  </section>
              </div>

              {/* RIGHT: Document Viewer */}
              <div className="w-full lg:w-[48%] bg-[color:var(--surface)] rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden animate-[fadeIn_0.4s_ease-out]">
                  <div className="px-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/60 h-14 shrink-0">
                      <div className="flex h-full">
                          <button onClick={() => setActiveDoc('resume')} className={`flex items-center gap-1.5 px-4 h-full text-xs uppercase tracking-wider transition-all border-b-2 ${activeDoc==='resume'?'border-[#C8973A] text-[#0F1F3D] font-bold':'border-transparent text-[#6B7A99] font-semibold'}`}>
                              <span className="material-symbols-outlined text-base">description</span> Resume
                          </button>
                          <button onClick={() => setActiveDoc('cv')} className={`flex items-center gap-1.5 px-4 h-full text-xs uppercase tracking-wider transition-all border-b-2 ${activeDoc==='cv'?'border-[#C8973A] text-[#0F1F3D] font-bold':'border-transparent text-[#6B7A99] font-semibold'}`}>
                              <span className="material-symbols-outlined text-base">article</span> CV
                          </button>
                      </div>
                  </div>
                  <div className="flex-1 bg-slate-100 overflow-y-auto custom-scrollbar p-6 flex justify-center">
                      <div className="w-full max-w-2xl bg-[color:var(--surface)] shadow-xl min-h-[900px] p-10 flex flex-col gap-6 rounded-lg text-sm text-[#1A2B4A]">
                          {activeDoc === 'resume' && (
                            <>
                              <div className="border-b border-slate-200 pb-6 mb-6">
                                  <h2 className="text-2xl font-bold text-[#0F1F3D] font-heading">{candidate.name}</h2>
                                  <p className="text-sm text-[#C8973A] font-semibold mt-1">{candidate.role_applied}</p>
                                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-[#6B7A99]">
                                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">email</span>{candidate.email}</span>
                                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">phone</span>{candidate.phone}</span>
                                  </div>
                              </div>
                              <div className="mb-6">
                                  <h3 className="text-[10px] font-bold text-[#6B7A99] uppercase tracking-[.2em] mb-3">Highlights</h3>
                                  <ul className="space-y-2">
                                    {candidate.resume_highlights.map((h,i) => <li key={i} className="flex items-start gap-2 text-sm text-[#1A2B4A]"><span className="w-1.5 h-1.5 rounded-full bg-[#C8973A] mt-1.5 shrink-0"></span>{h}</li>)}
                                  </ul>
                              </div>
                            </>
                          )}
                          {activeDoc === 'cv' && (
                            <>
                              <div className="border-b border-slate-200 pb-6 mb-6">
                                  <h2 className="text-2xl font-bold text-[#0F1F3D] font-heading">{candidate.name} — Curriculum Vitae</h2>
                                  <p className="text-sm text-[#6B7A99] mt-1">{candidate.role_applied} · {candidate.location}</p>
                              </div>
                            </>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      </main>
    </div>
  )
}
