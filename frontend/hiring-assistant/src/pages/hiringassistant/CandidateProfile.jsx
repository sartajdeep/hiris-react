import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getCandidate, updateCandidateStatus } from '../../api/client'

export default function CandidateProfile() {
  const [activeTab, setActiveTab] = useState('resume')
  const [stage, setStage] = useState('review')

  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const [candidate, setCandidate] = useState(null)

  useEffect(() => {
    if (id) {
      getCandidate(id).then(data => {
        setCandidate(data)
        const activeStatuses = ['Applied', 'Screening', 'Under Review', 'HR Round', 'Task Round', 'Interview']
        setStage(activeStatuses.includes(data.status) ? 'review' : data.status.toLowerCase())
      }).catch(console.error)
    }
  }, [id])

  async function handleProceed() {
    try {
      await updateCandidateStatus(id, 'Professor Review')
      setStage('proceeded')
      setCandidate(prev => ({ ...prev, status: 'Professor Review' }))
    } catch (err) { console.error(err) }
  }

  async function handleReject() {
    try {
      await updateCandidateStatus(id, 'Rejected')
      setStage('rejected')
      setCandidate(prev => ({ ...prev, status: 'Rejected' }))
    } catch (err) { console.error(err) }
  }

  if (!candidate) return (
    <div className="bg-[color:var(--bg)] min-h-screen flex flex-col font-sans relative">
      
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-[#28666E]/20 border-t-[#28666E] animate-spin"></div>
      </div>
      
    </div>
  )

  return (
    <div className="bg-[color:var(--bg)] text-[color:var(--text-primary)] antialiased min-h-screen flex flex-col font-sans">
      
      
      
      <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-6 py-6 gap-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-[color:var(--surface)] p-5 rounded-xl shadow-card border border-[color:var(--border)] hover:shadow-md hover:-translate-y-px transition-all duration-150">
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold font-heading text-[color:var(--text-primary)]">{candidate.name}</h1>
            </div>
            <p className="text-[color:var(--text-secondary)] text-xs font-medium">{candidate.role_applied}</p>
            <p className="text-[11px] text-[color:var(--text-secondary)] font-medium mt-1">
              Applied on <span className="font-semibold">{candidate.applied_date}</span> • Ref: {candidate.ref_id}
            </p>
          </div>
          
          <div className="flex gap-3">
            {stage === 'review' && (
              <button onClick={handleReject} className="flex items-center gap-2 px-5 py-2 rounded-lg border border-red-500 text-red-600 font-semibold text-xs shadow-sm hover:bg-red-50 transition-all duration-150">
                <span className="material-symbols-outlined text-[16px]">close</span> Reject Application
              </button>
            )}
            {stage !== 'review' && (
              <span className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-[10px] font-bold uppercase tracking-wider ${stage === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                <span className={`w-2 h-2 rounded-full ${stage === 'rejected' ? 'bg-red-500' : 'bg-blue-500'}`}></span> Current Stage: {candidate.status}
              </span>
            )}
            {stage === 'review' && (
              <button onClick={handleProceed} className="flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-xs shadow-sm transition-all duration-150 bg-[#28666E] text-white hover:bg-[#28666E]/90 active:scale-[0.98]">
                <span className="material-symbols-outlined text-[16px]">check</span> Proceed with Application
              </button>
            )}
            {stage !== 'review' && (
              <button disabled className="flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-xs shadow-sm transition-all duration-150 bg-slate-300 text-white cursor-not-allowed">
                <span className="material-symbols-outlined text-[16px]">check</span> Action Taken
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-5 h-[calc(100vh-280px)] min-h-[600px]">
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-5">
            <section className="bg-[color:var(--surface)] p-5 rounded-xl shadow-card border border-[color:var(--border)] hover:shadow-md hover:-translate-y-px transition-all duration-150">
              <div className="flex items-center gap-2 mb-6 text-[#28666E]">
                <span className="material-symbols-outlined text-[20px]">person</span>
                <h3 className="text-sm font-semibold text-[color:var(--text-primary)]">Personal Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[color:var(--text-muted)] uppercase tracking-wider">Email Address</span>
                  <span className="text-[color:var(--text-secondary)] text-xs font-semibold flex items-center gap-2">
                    {candidate.email}
                    <span className="material-symbols-outlined text-[14px] text-[color:var(--text-muted)] cursor-pointer">content_copy</span>
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[color:var(--text-muted)] uppercase tracking-wider">Phone Number</span>
                  <span className="text-[color:var(--text-secondary)] text-xs font-semibold">{candidate.phone}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[color:var(--text-muted)] uppercase tracking-wider">Current Location</span>
                  <span className="text-[color:var(--text-secondary)] text-xs font-semibold">{candidate.location}</span>
                </div>
              </div>
            </section>

            <section className="bg-[color:var(--surface)] p-5 rounded-xl shadow-card border border-[color:var(--border)] hover:shadow-md hover:-translate-y-px transition-all duration-150">
              <div className="flex items-center gap-2 mb-6 text-[#28666E]">
                <span className="material-symbols-outlined text-[20px]">school</span>
                <h3 className="text-sm font-semibold text-[color:var(--text-primary)]">Academic Background</h3>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 rounded-lg bg-[color:var(--bg)] border border-[color:var(--border)]">
                  <div className="bg-[#28666E]/10 flex items-center justify-center p-3 rounded-lg self-start text-[#28666E]"><span className="material-symbols-outlined text-[20px]">school</span></div>
                  <div>
                    <h4 className="font-semibold text-sm text-[color:var(--text-primary)] leading-tight mb-1">Stanford University</h4>
                    <p className="text-xs text-[#28666E] font-bold">Master of Education (M.Ed.)</p>
                    <p className="text-[11px] text-[color:var(--text-secondary)] font-medium mt-1">Higher Education Administration • Class of 2018</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-[color:var(--surface)] p-5 rounded-xl shadow-card border border-[color:var(--border)] mb-6 hover:shadow-md hover:-translate-y-px transition-all duration-150">
              <div className="flex items-center gap-2 mb-6 text-[#28666E]">
                <span className="material-symbols-outlined text-[20px]">quiz</span>
                <h3 className="text-sm font-semibold text-[color:var(--text-primary)]">Additional Questions</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-[color:var(--text-primary)] mb-2 italic">"Why are you interested in this role at Your Organization?"</h4>
                  <div className="p-4 rounded-lg bg-[color:var(--bg)] border-l-4 border-primary text-[color:var(--text-secondary)] text-xs font-medium leading-relaxed">
                    Your Organization represents a paradigm shift in technical education. Having worked in traditional admissions, I am eager to contribute to a system that emphasizes interdisciplinary learning and real-world problem solving.
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[color:var(--text-primary)] mb-2 italic">"Describe a time you handled a difficult situation with a student or parent."</h4>
                  <div className="p-4 rounded-lg bg-[color:var(--bg)] border-l-4 border-primary text-[color:var(--text-secondary)] text-xs font-medium leading-relaxed">
                    Last year, I handled an appeal from a highly qualified candidate who was initially waitlisted... By maintaining transparent communication, we resolved the issue.
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-[color:var(--bg)] p-5 rounded-xl shadow-sm border border-[#28666E]/20 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[#28666E]">
                  <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                  <h3 className="text-sm font-semibold text-[color:var(--text-primary)]">AI Interview Summary</h3>
                </div>
                <span className="px-2 py-0.5 bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7] text-[10px] font-bold rounded uppercase tracking-wider">Strong Match</span>
              </div>
              
              <div className="space-y-4">
                <p className="text-[color:var(--text-secondary)] text-xs font-medium leading-relaxed">
                  The candidate demonstrated a deep understanding of admissions workflows and emphasized proactive communication methodologies. When tested via the chatbot on crisis management scenarios, James logically broke down his problem-solving steps, aligning well with the department's core competency requirements.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-[color:var(--surface)] p-3 rounded-lg border border-[color:var(--border)]">
                    <p className="text-[10px] text-[color:var(--text-secondary)] font-bold uppercase mb-1.5">Communication</p>
                    <div className="w-full bg-[#E2E8F0] rounded-full h-1"><div className="bg-[#28666E] h-1 rounded-full" style={{width:'90%'}}></div></div>
                  </div>
                  <div className="bg-[color:var(--surface)] p-3 rounded-lg border border-[color:var(--border)]">
                    <p className="text-[10px] text-[color:var(--text-secondary)] font-bold uppercase mb-1.5">Situational Judgment</p>
                    <div className="w-full bg-[#E2E8F0] rounded-full h-1"><div className="bg-[#28666E] h-1 rounded-full" style={{width:'85%'}}></div></div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="flex-1 h-full flex flex-col bg-[color:var(--surface)] rounded-xl shadow-card border border-[color:var(--border)] overflow-hidden hover:shadow-md hover:-translate-y-px transition-all duration-150">
            <div className="px-5 border-b border-[color:var(--border)] flex items-center justify-between bg-[color:var(--surface)] pt-2">
              <div className="flex h-full gap-4">
                <button onClick={() => setActiveTab('resume')} className={`flex items-center gap-1.5 px-2 pb-2 text-xs transition-all ${activeTab === 'resume' ? 'border-b-2 border-[#28666E] text-[#28666E] font-bold' : 'border-b-2 border-transparent text-[color:var(--text-secondary)] hover:text-[color:var(--text-secondary)] font-semibold'}`}>
                  <span className="material-symbols-outlined text-[16px]">description</span> Resume
                </button>
                <button onClick={() => setActiveTab('cv')} className={`flex items-center gap-1.5 px-2 pb-2 text-xs transition-all ${activeTab === 'cv' ? 'border-b-2 border-[#28666E] text-[#28666E] font-bold' : 'border-b-2 border-transparent text-[color:var(--text-secondary)] hover:text-[color:var(--text-secondary)] font-semibold'}`}>
                  <span className="material-symbols-outlined text-[16px]">article</span> CV
                </button>
                <button onClick={() => setActiveTab('chat')} className={`flex items-center gap-1.5 px-2 pb-2 text-xs transition-all ${activeTab === 'chat' ? 'border-b-2 border-[#28666E] text-[#28666E] font-bold' : 'border-b-2 border-transparent text-[color:var(--text-secondary)] hover:text-[color:var(--text-secondary)] font-semibold'}`}>
                  <span className="material-symbols-outlined text-[16px]">smart_toy</span> Chatbot
                </button>
              </div>
            </div>
            
            <div className="flex-1 bg-[color:var(--surface)] overflow-y-auto p-5 flex justify-center custom-scrollbar">
              <div className="w-full max-w-2xl bg-[color:var(--surface)] shadow-xl min-h-[800px] p-12 flex flex-col gap-5 border border-[color:var(--border)]">
                {activeTab === 'resume' && (
                  <>
                    <div className="flex flex-col items-center gap-2 text-center border-b border-[color:var(--border)] pb-8">
                      <h1 className="text-2xl font-bold font-heading text-[color:var(--text-primary)] uppercase tracking-wider">{candidate.name}</h1>
                      <p className="text-xs font-semibold text-[color:var(--text-secondary)]">{candidate.location} • {candidate.phone}</p>
                    </div>
                    <div className="flex flex-col gap-4 mt-4">
                      <h2 className="text-xs font-bold text-[color:var(--text-primary)] border-b-2 border-[#0F172A] pb-1 w-fit uppercase tracking-wider">Professional Summary</h2>
                      <p className="text-xs font-medium text-[color:var(--text-secondary)] leading-relaxed">Dedicated Higher Education Professional with over 7 years of experience in admissions.</p>
                    </div>
                  </>
                )}
                
                {activeTab === 'cv' && (
                  <>
                    <div className="flex flex-col items-center gap-2 text-center border-b border-[color:var(--border)] pb-8">
                      <h1 className="text-2xl font-bold font-heading text-[color:var(--text-primary)] uppercase tracking-wider">Curriculum Vitae</h1>
                    </div>
                    <div className="flex flex-col gap-4 mt-4 text-xs">
                      <h2 className="font-bold text-[color:var(--text-primary)] border-b-2 border-[#0F172A] pb-1 w-fit uppercase tracking-wider">Academic History</h2>
                      <p className="text-[color:var(--text-secondary)] font-medium leading-relaxed">Detailed research and education history.</p>
                    </div>
                  </>
                )}
                
                {activeTab === 'chat' && (
                  <div>
                    <h2 className="text-sm font-bold text-[color:var(--text-primary)] mb-6">AI Interview Chat Transcript</h2>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#28666E] flex items-center justify-center text-white shrink-0"><span className="material-symbols-outlined text-[16px]">smart_toy</span></div>
                        <div className="bg-[color:var(--bg)] p-3 rounded-lg border border-[color:var(--border)] text-xs font-medium text-[color:var(--text-secondary)]">Hello James, could you tell me about your experience dealing with difficult cases in admissions?</div>
                      </div>
                      <div className="flex gap-4 flex-row-reverse">
                        <div className="w-8 h-8 rounded-full bg-[#E2E8F0] flex items-center justify-center text-[color:var(--text-secondary)] shrink-0 font-bold text-[10px]">JA</div>
                        <div className="bg-[color:var(--surface)] p-3 rounded-lg border border-[color:var(--border)] text-xs font-medium text-[color:var(--text-secondary)]">Certainly. I typically approach cases with a de-escalation framework and try to prioritize empathy...</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
    </div>
  )
}
