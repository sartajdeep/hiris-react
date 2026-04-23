import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const API = 'http://localhost:3001/api'

// Fallback sample data keyed by known sample IDs
const SAMPLE_CANDIDATES = {
  9001: { id: 9001, name: 'Elena Sokolov, PhD', role_applied: 'Postdoctoral Fellow – Neuroscience Lab', applied_date: 'Oct 20, 2023', ref_id: '#NEU-PROF-001', email: 'elena.sokolov@stanford.edu', phone: '+1 (650) 555-0192', location: 'Stanford, CA', status: 'Professor Review' },
  9002: { id: 9002, name: 'Marcus Aris',        role_applied: 'Graduate Research Assistant – Computational Biology', applied_date: 'Oct 18, 2023', ref_id: '#BIO-PROF-001', email: 'marcus.aris@mit.edu', phone: '+1 (617) 555-0328', location: 'Cambridge, MA', status: 'Professor Review' },
  9003: { id: 9003, name: 'Linda Liao',         role_applied: 'Graduate Research Assistant – Computational Biology', applied_date: 'Oct 16, 2023', ref_id: '#BIO-PROF-002', email: 'linda.liao@oxford.ac.uk', phone: '+44 7700 012345', location: 'Oxford, UK', status: 'Professor Review' },
  9004: { id: 9004, name: 'Dr. Robert Kim',     role_applied: 'Postdoctoral Fellow – Neuroscience Lab', applied_date: 'Oct 14, 2023', ref_id: '#NEU-PROF-002', email: 'r.kim@caltech.edu', phone: '+1 (626) 555-0177', location: 'Pasadena, CA', status: 'Professor Review' },
  9005: { id: 9005, name: 'Dr. Ananya Roy',     role_applied: 'Graduate Research Assistant – Computational Biology', applied_date: 'Oct 10, 2023', ref_id: '#BIO-PROF-003', email: 'ananya.roy@iitb.ac.in', phone: '+91 98200 11223', location: 'Mumbai, India', status: 'Interview Scheduled' },
  9006: { id: 9006, name: 'Victor Sokolov',     role_applied: 'Lab Technician III – Genetics', applied_date: 'Oct 8, 2023', ref_id: '#GEN-PROF-001', email: 'v.sokolov@genetics.edu', phone: '+1 (424) 555-0099', location: 'Los Angeles, CA', status: 'Interview Scheduled' },
  9007: { id: 9007, name: 'Dr. Fatima Al-Rashid', role_applied: 'Postdoctoral Fellow – Neuroscience Lab', applied_date: 'Oct 5, 2023', ref_id: '#NEU-PROF-003', email: 'f.alrashid@uae.ac.ae', phone: '+971 50 111 2233', location: 'Abu Dhabi, UAE', status: 'Interview Scheduled' },
}

export default function ProfessorCandidateProfile() {
  const { id }         = useParams()
  const navigate       = useNavigate()
  const [activeTab, setActiveTab] = useState('resume')
  const [stage, setStage]         = useState('review')
  const [candidate, setCandidate] = useState(null)
  const [toast, setToast]         = useState(null)

  useEffect(() => {
    // Try API first
    fetch(`${API}/candidates/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setCandidate(data)
          const active = ['Applied', 'Screening', 'Under Review', 'HR Round', 'Task Round', 'Interview', 'Professor Review']
          setStage(active.includes(data.status) ? 'review' : data.status.toLowerCase())
        } else {
          // Try sample fallback
          const sample = SAMPLE_CANDIDATES[Number(id)]
          if (sample) { setCandidate(sample); setStage('review') }
        }
      })
      .catch(() => {
        const sample = SAMPLE_CANDIDATES[Number(id)]
        if (sample) { setCandidate(sample); setStage('review') }
      })
  }, [id])

  const showToast = (msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 4000) }

  const handleProceed = async () => {
    try {
      await fetch(`${API}/candidates/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Interview Scheduled' }),
      })
    } catch { /* offline — update local only */ }
    setStage('proceeded')
    setCandidate(prev => ({ ...prev, status: 'Interview Scheduled' }))
    showToast('Candidate shortlisted for an interview.')
  }

  const handleApprove = async () => {
    try {
      await fetch(`${API}/candidates/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Approved' }),
      })
    } catch { /* offline */ }
    setStage('approved')
    setCandidate(prev => ({ ...prev, status: 'Approved' }))
    showToast('Candidate approved and passed to HR.')
  }

  const handleReject = async () => {
    try {
      await fetch(`${API}/candidates/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Rejected' }),
      })
    } catch { /* offline */ }
    setStage('rejected')
    setCandidate(prev => ({ ...prev, status: 'Rejected' }))
    showToast('Application rejected.')
  }

  if (!candidate) return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col font-sans">
      
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-[#024e56]/20 border-t-[#024e56] animate-spin" />
      </div>
      
    </div>
  )

  const isReview   = stage === 'review'
  const isRejected = stage === 'rejected'
  const isApproved = stage === 'approved' || stage === 'proceeded'

  return (
    <div className="bg-[#F8FAFC] text-[#0F172A] antialiased min-h-screen flex flex-col font-sans">
      
      

      <main className="flex-1 flex flex-col w-full max-w-[1400px] mx-auto px-8 py-6 gap-5">

        {/* ── Hero card ──────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl shadow-sm border border-[#E2E8F0]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#024e56]/10 text-[#024e56] font-bold text-base flex items-center justify-center shrink-0">
              {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-[18px] font-bold text-[#0F172A] leading-tight">{candidate.name}</h1>
              <p className="text-[12px] text-[#475569] font-medium mt-0.5">{candidate.role_applied}</p>
              <p className="text-[11px] text-[#94A3B8] font-medium mt-0.5">
                Applied <strong className="text-[#475569]">{candidate.applied_date}</strong> · Ref: {candidate.ref_id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            {isReview && (
              <>
                <button onClick={() => navigate(-1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#E2E8F0] text-[#475569] font-semibold text-xs hover:bg-[#F8FAFC] transition">
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back
                </button>
                <button onClick={handleReject}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-200 text-red-600 font-semibold text-xs hover:bg-red-50 transition">
                  <span className="material-symbols-outlined text-[16px]">close</span> Reject
                </button>
                <button onClick={handleProceed}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#024e56] text-white font-bold text-xs hover:bg-[#028272] transition shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">bookmark_added</span> Shortlist
                </button>
                <button onClick={handleApprove}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span> Approve
                </button>
              </>
            )}
            {!isReview && (
              <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#E2E8F0] text-[#475569] font-semibold text-xs hover:bg-[#F8FAFC] transition">
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back
                </button>
                <span className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-[10px] font-bold uppercase tracking-wider
                  ${isRejected ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                  <span className={`w-2 h-2 rounded-full ${isRejected ? 'bg-red-500' : 'bg-emerald-500'}`} />
                  {candidate.status}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Body ───────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-5 flex-1 min-h-[600px]">

          {/* Left column — profile cards */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">

            {/* Personal info */}
            <section className="bg-white p-5 rounded-xl shadow-sm border border-[#E2E8F0] hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-5 text-[#024e56]">
                <span className="material-symbols-outlined text-[20px]">person</span>
                <h3 className="text-sm font-semibold text-[#0F172A]">Personal Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">
                {[
                  { label: 'Email Address', value: candidate.email },
                  { label: 'Phone Number',  value: candidate.phone || '—' },
                  { label: 'Location',      value: candidate.location || '—' },
                ].map(f => (
                  <div key={f.label} className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">{f.label}</span>
                    <span className="text-[#334155] text-xs font-semibold">{f.value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Academic background */}
            <section className="bg-white p-5 rounded-xl shadow-sm border border-[#E2E8F0] hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-5 text-[#024e56]">
                <span className="material-symbols-outlined text-[20px]">school</span>
                <h3 className="text-sm font-semibold text-[#0F172A]">Academic Background</h3>
              </div>
              {candidate.education_details ? (
                <div className="space-y-3">
                  {(typeof candidate.education_details === 'string' ? JSON.parse(candidate.education_details) : candidate.education_details).map((e, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                      <div className="bg-[#024e56]/10 flex items-center justify-center p-3 rounded-lg self-start text-[#024e56]">
                        <span className="material-symbols-outlined text-[18px]">school</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-[#0F172A] leading-tight mb-0.5">{e.inst}</h4>
                        <p className="text-xs text-[#024e56] font-bold">{e.degree}</p>
                        <p className="text-[11px] text-[#475569] font-medium mt-0.5">{e.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex gap-4 p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="bg-[#024e56]/10 flex items-center justify-center p-3 rounded-lg self-start text-[#024e56]">
                    <span className="material-symbols-outlined text-[18px]">school</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#0F172A] leading-tight mb-0.5">Research University</h4>
                    <p className="text-xs text-[#024e56] font-bold">Doctorate / Postdoctoral</p>
                    <p className="text-[11px] text-[#475569] font-medium mt-0.5">Advanced Research · Details on file</p>
                  </div>
                </div>
              )}
            </section>

            {/* Skills */}
            {candidate.skills && (
              <section className="bg-white p-5 rounded-xl shadow-sm border border-[#E2E8F0] hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-5 text-[#024e56]">
                  <span className="material-symbols-outlined text-[20px]">psychology</span>
                  <h3 className="text-sm font-semibold text-[#0F172A]">Key Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(typeof candidate.skills === 'string' ? JSON.parse(candidate.skills) : candidate.skills).map(s => (
                    <span key={s} className="px-3 py-1 bg-[#024e56]/8 border border-[#024e56]/15 text-[#024e56] text-xs font-semibold rounded-lg">{s}</span>
                  ))}
                </div>
              </section>
            )}

            {/* Additional questions */}
            <section className="bg-white p-5 rounded-xl shadow-sm border border-[#E2E8F0] hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-5 text-[#024e56]">
                <span className="material-symbols-outlined text-[20px]">quiz</span>
                <h3 className="text-sm font-semibold text-[#0F172A]">Application Questions</h3>
              </div>
              {candidate.qa_responses ? (
                <div className="space-y-5">
                  {(typeof candidate.qa_responses === 'string' ? JSON.parse(candidate.qa_responses) : candidate.qa_responses).map((qa, i) => (
                    <div key={i}>
                      <h4 className="text-xs font-bold text-[#0F172A] mb-2 italic">"{qa.q}"</h4>
                      <div className="p-3.5 rounded-lg bg-[#F8FAFC] border-l-4 border-[#024e56] text-[#475569] text-xs font-medium leading-relaxed">
                        {qa.a}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-5">
                  {[
                    { q: 'Why are you interested in this role?', a: 'I am drawn to this position because it sits at the intersection of my doctoral research and applied institutional work. The opportunity to contribute to cutting-edge research while mentoring the next generation of scholars is a unique and compelling prospect.' },
                    { q: 'Describe your most significant research contribution.',  a: 'My work on neural pathway mapping in mammalian cortex resulted in a Nature Neuroscience publication and was cited in over 40 follow-up studies. The methodology I developed has since been adopted by three independent labs internationally.' },
                  ].map((qa, i) => (
                    <div key={i}>
                      <h4 className="text-xs font-bold text-[#0F172A] mb-2 italic">"{qa.q}"</h4>
                      <div className="p-3.5 rounded-lg bg-[#F8FAFC] border-l-4 border-[#024e56] text-[#475569] text-xs font-medium leading-relaxed">{qa.a}</div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* AI summary */}
            <section className="bg-[#F8FAFC] p-5 rounded-xl shadow-sm border border-[#024e56]/15 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[#024e56]">
                  <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                  <h3 className="text-sm font-semibold text-[#0F172A]">AI Interview Summary</h3>
                </div>
                <span className="px-2 py-0.5 bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7] text-[10px] font-bold rounded uppercase tracking-wider">
                  {candidate.ai_match || 'Strong Match'}
                </span>
              </div>
              <p className="text-[#334155] text-xs font-medium leading-relaxed mb-4">
                {candidate.ai_summary || `${candidate.name} demonstrated exceptional depth in their domain during the initial AI screening. Their research background closely aligns with the lab's current priorities, and their communication style reflects strong academic mentorship capability.`}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Communication',         v: 88 },
                  { label: 'Research Depth',        v: 92 },
                  { label: 'Academic Fit',           v: 85 },
                  { label: 'Situational Judgment',   v: 80 },
                ].map(m => (
                  <div key={m.label} className="bg-white p-3 rounded-lg border border-[#E2E8F0]">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-[10px] text-[#475569] font-bold uppercase">{m.label}</p>
                      <span className="text-[10px] font-bold text-[#024e56]">{m.v}%</span>
                    </div>
                    <div className="w-full bg-[#E2E8F0] rounded-full h-1">
                      <div className="bg-[#024e56] h-1 rounded-full transition-all" style={{ width: `${m.v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right column — resume / cv / chat viewer */}
          <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
            {/* Tab bar */}
            <div className="px-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC] pt-2">
              <div className="flex gap-4">
                {[
                  { id: 'resume', label: 'Resume',  icon: 'description' },
                  { id: 'cv',     label: 'CV',       icon: 'article' },
                  { id: 'chat',   label: 'Chatbot',  icon: 'smart_toy' },
                ].map(t => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-1.5 px-2 pb-2 text-xs transition-all
                      ${activeTab === t.id
                        ? 'border-b-2 border-[#024e56] text-[#024e56] font-bold'
                        : 'border-b-2 border-transparent text-[#64748B] hover:text-[#334155] font-semibold'}`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{t.icon}</span>{t.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1 pb-2">
                <button className="p-1 rounded text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#334155] transition-colors">
                  <span className="material-symbols-outlined text-[16px]">zoom_out</span>
                </button>
                <span className="text-[11px] font-bold px-1 text-[#475569]">100%</span>
                <button className="p-1 rounded text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#334155] transition-colors">
                  <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                </button>
                <div className="w-px h-4 bg-[#CBD5E1] mx-1" />
                <button className="p-1 rounded text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#334155] transition-colors">
                  <span className="material-symbols-outlined text-[16px]">download</span>
                </button>
              </div>
            </div>

            {/* Viewer */}
            <div className="flex-1 bg-[#F1F5F9] overflow-y-auto p-5 flex justify-center custom-scrollbar">
              <div className="w-full max-w-2xl bg-white shadow-xl min-h-[800px] p-12 flex flex-col gap-5 border border-[#E2E8F0]">

                {activeTab === 'resume' && (
                  <>
                    <div className="flex flex-col items-center gap-2 text-center border-b border-[#E2E8F0] pb-8">
                      <h1 className="text-2xl font-bold text-[#0F172A] uppercase tracking-wider">{candidate.name}</h1>
                      <p className="text-xs font-semibold text-[#475569]">{candidate.location} · {candidate.phone}</p>
                      <p className="text-xs text-[#94A3B8]">{candidate.email}</p>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xs font-bold text-[#0F172A] border-b-2 border-[#0F172A] pb-1 w-fit uppercase tracking-wider mb-3">Professional Summary</h2>
                        <p className="text-xs font-medium text-[#475569] leading-relaxed">
                          Highly accomplished researcher and academic professional with extensive experience in advanced scientific inquiry
                          and applied institutional collaboration. Proven track record in cross-disciplinary research, publication, and
                          mentorship of emerging talent.
                        </p>
                      </div>
                      <div>
                        <h2 className="text-xs font-bold text-[#0F172A] border-b-2 border-[#0F172A] pb-1 w-fit uppercase tracking-wider mb-3">Selected Highlights</h2>
                        {(candidate.resume_highlights
                          ? (typeof candidate.resume_highlights === 'string' ? JSON.parse(candidate.resume_highlights) : candidate.resume_highlights)
                          : [
                              'Peer-reviewed publications in high-impact journals',
                              'Invited presentations at international conferences',
                              'Doctoral supervision and mentorship experience',
                              'Grant writing and research management',
                            ]
                        ).map((h, i) => (
                          <p key={i} className="text-xs font-medium text-[#475569] leading-relaxed flex items-start gap-2 mb-2">
                            <span className="mt-1.5 w-1.5 h-1.5 bg-[#024e56] rounded-full shrink-0" />
                            {h}
                          </p>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'cv' && (
                  <>
                    <div className="flex flex-col items-center gap-2 text-center border-b border-[#E2E8F0] pb-8">
                      <h1 className="text-2xl font-bold text-[#0F172A] uppercase tracking-wider">Curriculum Vitae</h1>
                      <p className="text-sm font-semibold text-[#024e56]">{candidate.name}</p>
                    </div>
                    <div className="space-y-6 text-xs">
                      <div>
                        <h2 className="font-bold text-[#0F172A] border-b-2 border-[#0F172A] pb-1 w-fit uppercase tracking-wider mb-3">Academic Appointments</h2>
                        <p className="text-[#475569] font-medium leading-relaxed">Researcher, senior academic and institutional roles documented. Full CV available on request.</p>
                      </div>
                      <div>
                        <h2 className="font-bold text-[#0F172A] border-b-2 border-[#0F172A] pb-1 w-fit uppercase tracking-wider mb-3">Publications</h2>
                        <p className="text-[#475569] font-medium leading-relaxed">Peer-reviewed publications, conference proceedings, and technical reports available from candidate on request.</p>
                      </div>
                      <div>
                        <h2 className="font-bold text-[#0F172A] border-b-2 border-[#0F172A] pb-1 w-fit uppercase tracking-wider mb-3">Research Interests</h2>
                        <p className="text-[#475569] font-medium leading-relaxed">Detailed research interest statement and statement of purpose submitted with application package.</p>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'chat' && (
                  <div>
                    <h2 className="text-sm font-bold text-[#0F172A] mb-6">AI Pre-Interview Chat Transcript</h2>
                    <div className="space-y-4">
                      {[
                        { role: 'ai',        text: `Hello ${candidate.name.split(' ')[0]}, could you briefly introduce your research background and what draws you to this role?` },
                        { role: 'candidate', text: 'Certainly. My research sits at the intersection of computational methods and experimental validation. I have spent the last several years developing novel frameworks that bridge theoretical models with practical laboratory applications.' },
                        { role: 'ai',        text: 'Could you tell me about a significant challenge you encountered in your research and how you overcame it?' },
                        { role: 'candidate', text: 'Early in my postdoctoral work, I faced significant reproducibility issues with a key experimental protocol. I systematically isolated variables, redesigned the control conditions, and ultimately published a methods note that corrected the broader literature.' },
                      ].map((msg, i) => (
                        <div key={i} className={`flex gap-3 ${msg.role === 'candidate' ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 font-bold text-[10px]
                            ${msg.role === 'ai' ? 'bg-[#024e56]' : 'bg-[#E2E8F0] text-[#334155]'}`}>
                            {msg.role === 'ai'
                              ? <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                              : candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0] text-xs font-medium text-[#334155] max-w-[80%] leading-relaxed">
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      

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
