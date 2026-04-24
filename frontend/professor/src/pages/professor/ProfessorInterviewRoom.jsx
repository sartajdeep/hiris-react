import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function ProfessorInterviewRoom() {
  const { roleId } = useParams()
  const navigate = useNavigate()
  
  const [candidate, setCandidate] = useState({
    name: 'Candidate',
    role: 'Faculty Candidate',
    status: '',
    email: '',
    location: '',
  })
  const [loadingCandidate, setLoadingCandidate] = useState(true)

  // States: 'standby', 'active', 'review'
  const [phase, setPhase] = useState('standby') 
  const [timer, setTimer] = useState(0)
  const [notes, setNotes] = useState('')
  const timerRef = useRef(null)

  const [manualScores, setManualScores] = useState({
    "Academic Qualifications": 0,
    "Research Output": 0,
    "Teaching Demo": 0,
    "Communication Skills": 0,
    "Culture Fit": 0
  })

  const [traitComments, setTraitComments] = useState({
    "Academic Qualifications": "",
    "Research Output": "",
    "Teaching Demo": "",
    "Communication Skills": "",
    "Culture Fit": ""
  })

  const API = 'http://localhost:3001/api'
  const CHRO_APP_URL = 'http://localhost:5175/?tab=candidates'

  useEffect(() => {
    fetch(`${API}/candidates/${roleId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setCandidate({
            name: data.name,
            role: data.role_applied,
            status: data.status,
            email: data.email,
            location: data.location,
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoadingCandidate(false))
  }, [API, roleId])

  // Start interview
  const startInterview = () => {
    setPhase('active')
    timerRef.current = setInterval(() => {
      setTimer(p => p + 1)
    }, 1000)
  }

  // End interview and move to review
  const endInterview = () => {
    clearInterval(timerRef.current)
    setPhase('review')
  }

  const submitVerdict = async (verdict) => {
    try {
      const newStatus = verdict === 'proceed' ? 'HR Round' : 'Rejected'
      // Update candidate status — candidateId comes from roleId param (prof route: /interview/:roleId)
      await fetch(`${API}/candidates/${roleId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      // Save interview scores
      await fetch(`${API}/interview-sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate_id: roleId,
          manual_scores: manualScores,
          manual_overall: (Object.values(manualScores).reduce((a, b) => a + Number(b), 0) / Object.keys(manualScores).length).toFixed(1),
          status: newStatus
        })
      })
    } catch (e) {
      console.error('Failed to submit verdict', e)
    }
    window.location.href = `${CHRO_APP_URL}&candidateId=${roleId}`
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds/60).toString().padStart(2,'0')
    const s = (seconds%60).toString().padStart(2,'0')
    return `${m}:${s}`
  }

  const evaluationTraits = [
    "Academic Qualifications",
    "Research Output",
    "Teaching Demo",
    "Communication Skills",
    "Culture Fit"
  ]

  return (
    <div className="bg-[color:var(--bg)] text-[color:var(--text-primary)] min-h-screen flex flex-col font-sans">
      

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto p-8 flex flex-col">
        
        {/* PHASE 1: STANDBY */}
        {phase === 'standby' && (
          <div className="flex-1 flex flex-col items-center justify-center animate-[fadeIn_0.3s_ease-out]">
             <div className="bg-[color:var(--surface)] border border-[color:var(--border)] shadow-sm rounded-2xl p-10 max-w-lg w-full text-center">
                <div className="w-20 h-20 bg-[#024e56]/10 text-[#024e56] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-4xl">supervisor_account</span>
                </div>
                <h1 className="text-2xl font-bold text-[color:var(--text-primary)] mb-2 tracking-tight">Interview Room</h1>
                <p className="text-[color:var(--text-secondary)] text-[13px] mb-8">
                  You are about to start the interview for <strong className="text-[color:var(--text-primary)]">Dr. Ananya Roy</strong>.<br/>
                  Click below to begin the assessment and enable real-time HIRIS insights.
                </p>
                <button onClick={startInterview}
                  className="w-full py-3.5 bg-[#024e56] hover:bg-[#028272] text-white text-[13px] font-bold uppercase tracking-wider rounded-xl transition shadow-sm flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-lg">play_circle</span>
                  Start Interview
                </button>
                <button onClick={() => navigate('/')} className="mt-4 text-[color:var(--text-secondary)] text-[12px] font-semibold hover:text-[#024e56] transition underline">
                  Return to Dashboard
                </button>
             </div>
          </div>
        )}


        {/* PHASE 2: ACTIVE INTERVIEW */}
        {phase === 'active' && (
          <div className="flex-1 flex flex-col animate-[fadeIn_0.3s_ease-out]">
            {/* Header info */}
            <div className="flex items-center justify-between bg-[color:var(--surface)] border border-[color:var(--border)] rounded-xl px-6 py-4 shadow-sm mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-50 text-red-500 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                </div>
                <div>
                  <h2 className="text-[color:var(--text-primary)] text-[15px] font-bold tracking-tight">Interview in Progress</h2>
                  <p className="text-[color:var(--text-secondary)] text-[12px] font-medium mt-0.5">Time Elapsed: <span className="font-mono text-[#024e56] font-bold ml-1">{formatTime(timer)}</span></p>
                </div>
              </div>
              <button onClick={endInterview}
                className="px-6 py-2.5 bg-red-50 text-red-600 border border-red-200 hover:bg-red-500 hover:text-white text-[12px] font-bold uppercase tracking-wider rounded-lg transition-all shadow-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-base">stop_circle</span>
                End Interview
              </button>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Col: Notes */}
              <div className="md:col-span-2 bg-[color:var(--surface)] rounded-xl border border-[color:var(--border)] shadow-sm flex flex-col overflow-hidden">
                <div className="px-5 py-4 border-b border-[color:var(--border)] bg-[color:var(--bg)]">
                  <h3 className="text-[13px] font-bold text-[color:var(--text-primary)] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#024e56] text-[18px]">edit_note</span>
                    Interview Notes
                  </h3>
                </div>
                <div className="flex-1 p-5">
                  <textarea 
                    autoFocus
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Type your observations and feedback here..."
                    className="w-full h-full min-h-[300px] resize-none border-0 focus:ring-0 text-[color:var(--text-secondary)] text-[14px] leading-relaxed p-0 placeholder-[#94A3B8]"
                  ></textarea>
                </div>
              </div>

              {/* Right Col: Live AI Scores */}
              <div className="bg-[color:var(--surface)] rounded-xl border border-[color:var(--border)] shadow-sm flex flex-col overflow-hidden">
                <div className="px-5 py-4 border-b border-[color:var(--border)] bg-[color:var(--bg)] flex justify-between items-center">
                  <h3 className="text-[13px] font-bold text-[color:var(--text-primary)] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#024e56] text-[18px]">rule_folder</span>
                    Trait Evaluation
                  </h3>
                </div>
                <div className="p-0 overflow-y-auto custom-scrollbar flex-1">
                  <div className="divide-y divide-[#F1F5F9]">
                    {evaluationTraits.map(trait => (
                      <div key={trait} className="p-5 hover:bg-[color:var(--bg)] transition">
                        <label className="text-[12px] font-bold text-[color:var(--text-secondary)] uppercase tracking-wider block mb-2">{trait}</label>
                        <textarea 
                          value={traitComments[trait]}
                          onChange={(e) => setTraitComments(prev => ({...prev, [trait]: e.target.value}))}
                          placeholder={`Notes on ${trait.toLowerCase()}...`}
                          className="w-full bg-[color:var(--surface)] border border-[color:var(--border)] text-[color:var(--text-secondary)] text-[13px] p-3 rounded outline-none focus:border-[#024e56] focus:ring-1 focus:ring-[#024e56] shadow-sm transition resize-y min-h-[60px]"
                        ></textarea>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PHASE 3: REVIEW / FINAL EVALUATION */}
        {phase === 'review' && (
          <div className="flex-1 flex flex-col items-center justify-center py-10 animate-[fadeIn_0.4s_ease-out]">
            <div className="w-full max-w-3xl bg-[color:var(--surface)] rounded-2xl border border-[color:var(--border)] shadow-xl overflow-hidden relative">
              {/* HIRIS Watermark */}
              <div className="absolute -right-8 -top-8 text-[120px] font-black text-[#F1F5F9] opacity-70 tracking-tighter pointer-events-none select-none z-0">
                HIRIS
              </div>
              
              <div className="relative z-10">
                <div className="px-8 py-6 border-b border-[color:var(--border)] flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-[color:var(--text-primary)] tracking-tight">Your Final Evaluation</h2>
                    <p className="text-[color:var(--text-secondary)] text-[13px] mt-1">Please provide your final manual scores based on the interview.</p>
                  </div>
                  <span className="material-symbols-outlined text-[36px] text-[#024e56] opacity-30">verified</span>
                </div>

                <div className="p-8 space-y-6 bg-[#F8FAFC]/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 relative">
                    {Object.keys(manualScores).map(metric => (
                      <div key={metric} className="flex flex-col gap-2">
                        <label className="text-[12px] font-bold text-[color:var(--text-secondary)] uppercase tracking-wider">{metric}</label>
                        <select 
                          className="bg-[color:var(--surface)] border border-[color:var(--border)] text-[color:var(--text-primary)] text-[13px] font-semibold px-4 py-2.5 rounded-lg outline-none focus:border-[#024e56] focus:ring-2 focus:ring-[#024e56]/10 shadow-sm transition"
                          value={manualScores[metric]} 
                          onChange={(e) => setManualScores(prev => ({...prev, [metric]: e.target.value}))}
                        >
                          <option value="0" disabled>Select rating...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </select>
                      </div>
                    ))}
                  </div>

                  {/* Notes summary */}
                  <div className="mt-8 border-t border-[color:var(--border)] pt-6">
                    <label className="text-[12px] font-bold text-[color:var(--text-secondary)] uppercase tracking-wider block mb-2">Final Remarks</label>
                    <textarea 
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Add any final conclusive thoughts here..."
                      className="w-full bg-[color:var(--surface)] border border-[color:var(--border)] text-[color:var(--text-secondary)] text-[13px] p-4 rounded-lg outline-none focus:border-[#024e56] focus:ring-2 focus:ring-[#024e56]/10 shadow-sm transition min-h-[120px] resize-y"
                    ></textarea>
                  </div>
                </div>

                <div className="px-8 py-6 bg-[color:var(--surface)] border-t border-[color:var(--border)] flex items-center justify-end gap-4">
                  <button onClick={() => submitVerdict('reject')} className="px-6 py-2.5 text-[#EF4444] font-bold text-[12px] uppercase tracking-wider hover:bg-red-50 rounded-lg transition border border-transparent hover:border-red-100">
                    Reject Candidate
                  </button>
                  <button onClick={() => submitVerdict('proceed')} className="px-8 py-2.5 bg-[#024e56] hover:bg-[#028272] text-white font-bold text-[12px] uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg transition flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    Approve & Proceed
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      
    </div>
  )
}
