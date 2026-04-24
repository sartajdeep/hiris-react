import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getApplicationByToken } from '../../api/client'

export default function ThankYouForApplying() {
  const token = sessionStorage.getItem('hiris_app_token') || '#PLK-2026-X892J'
  const [application, setApplication] = useState(null)

  useEffect(() => {
    if (token && token !== '#PLK-2026-X892J') {
      getApplicationByToken(token).then(setApplication).catch(console.error)
    }
  }, [token])
  
  const handleCopy = () => {
    navigator.clipboard.writeText(token).then(() => alert('Token copied!'))
  }

  return (
    <div className="bg-[color:var(--bg)] text-[color:var(--text-primary)] antialiased min-h-screen flex flex-col font-sans">
      
      
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 flex flex-col items-center flex-grow">
        <div className="relative mb-12 flex items-center justify-center">
          <div className="absolute h-20 w-20 rounded-full bg-[#28666E]/30 animate-pulse-ring"></div>
          <div className="absolute h-20 w-20 rounded-full bg-[#28666E]/20 animate-pulse-ring" style={{animationDelay: '1s'}}></div>
          <div className="relative z-10 flex items-center justify-center bg-[#28666E]/10 rounded-full p-5 text-[#28666E] shadow-sm">
            <span className="material-symbols-outlined text-[60px] font-bold">check_circle</span>
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-[color:var(--text-primary)] text-2xl font-bold md:text-5xl font-heading leading-tight tracking-tight mb-4">Thank You for Applying!</h1>
          <p className="text-[color:var(--text-secondary)] text-lg max-w-2xl mx-auto">
            Your application for the research fellowship has been successfully submitted. We appreciate your interest in joining the Your Organization community.
          </p>
        </div>

        <div className="w-full bg-[color:var(--surface)] p-5 mb-12 shadow-sm ring-1 ring-[#28666E]/20 rounded-xl text-center">
          <p className="text-[color:var(--text-secondary)] text-sm font-semibold uppercase tracking-wider mb-2">Application Token Number</p>
          <p className="text-[#28666E] text-2xl font-bold font-heading">{token}</p>
          <button onClick={handleCopy} className="mt-4 inline-flex items-center gap-2 text-[#28666E] font-bold text-sm hover:underline transition-all duration-150">
            <span className="material-symbols-outlined text-[16px]">content_copy</span> Copy to Clipboard
          </button>
        </div>

        <div className="w-full mb-12">
          <h2 className="text-[color:var(--text-primary)] text-2xl font-bold mb-6 flex items-center gap-2 font-heading">
            <span className="material-symbols-outlined text-[#28666E] text-[24px]">list_alt</span>
            What happens next?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="flex flex-col gap-3 p-5 rounded-xl bg-[color:var(--surface)] ring-1 ring-[#28666E]/20 shadow-sm">
              <span className="text-[#28666E] font-bold text-lg font-heading">01.</span>
              <h3 className="font-semibold text-sm text-[color:var(--text-primary)]">Initial Review</h3>
              <p className="text-xs font-medium text-[color:var(--text-secondary)]">Our HR team will review your credentials against the program requirements.</p>
            </div>
            <div className="flex flex-col gap-3 p-5 rounded-xl bg-[color:var(--surface)] ring-1 ring-[#28666E]/20 shadow-sm">
              <span className="text-[#28666E] font-bold text-lg font-heading">02.</span>
              <h3 className="font-semibold text-sm text-[color:var(--text-primary)]">Shortlisting</h3>
              <p className="text-xs font-medium text-[color:var(--text-secondary)]">Shortlisted candidates will be contacted via email within 2-3 weeks.</p>
            </div>
            <div className="flex flex-col gap-3 p-5 rounded-xl bg-[color:var(--surface)] ring-1 ring-[#28666E]/20 shadow-sm">
              <span className="text-[#28666E] font-bold text-lg font-heading">03.</span>
              <h3 className="font-semibold text-sm text-[color:var(--text-primary)]">Interview</h3>
              <p className="text-xs font-medium text-[color:var(--text-secondary)]">Initial rounds of technical and cultural interviews will be scheduled.</p>
            </div>
          </div>
        </div>
      </main>
      
      
    </div>
  )
}
