import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function JobPosted() {
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    const shareUrl = window.location.origin + '/job/REQ-XYZ'
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="bg-[var(--bg)] text-[var(--text-primary)] antialiased min-h-screen flex flex-col">
      
      
      
      <main className="flex-grow flex items-center justify-center p-5">
        <div className="max-w-2xl w-full">
          <div className="bg-[var(--surface)] rounded-xl shadow-card p-5 md:p-12 text-center border border-[var(--border)] hover:shadow-md hover:-translate-y-px transition-all duration-150">
            <div className="mb-8 flex justify-center">
              <div className="h-24 w-24 rounded-full bg-[#28666E]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#28666E] text-6xl">check_circle</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold font-heading text-[var(--text-primary)] mb-4">Job Successfully Posted</h1>
            <p className="text-[13px] text-[var(--text-muted)] mb-10 max-w-md mx-auto">
              The job is now live and visible to students across all selected channels. You can now start receiving and managing applications.
            </p>
            <div className="flex justify-center">
              <Link to="/" className="bg-[#28666E] hover:bg-[#28666E]/90 text-white font-bold py-3 px-8 rounded-lg transition-all duration-150 shadow-sm active:scale-[0.98]">
                Return to Homepage
              </Link>
            </div>
          </div>
          
          <div className="mt-12">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-6 text-center">Next Steps</h2>
            <div className="flex justify-center">
              <div onClick={handleShare} className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)] flex items-start gap-4 hover:border-[#28666E]/30 transition-colors cursor-pointer group max-w-sm w-full hover:shadow-md hover:-translate-y-px duration-150">
                <div className={`p-2 rounded-lg transition-colors ${copied ? 'bg-green-100' : 'bg-[#F1F5F9] group-hover:bg-[#28666E]/10'}`}>
                  <span className={`material-symbols-outlined ${copied ? 'text-green-600' : 'text-[var(--text-muted)] group-hover:text-[#28666E]'}`}>{copied ? 'check' : 'share'}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[var(--text-primary)]">{copied ? 'Link Copied!' : 'Share with Faculty'}</h3>
                  <p className="text-xs font-medium text-[var(--text-muted)]">{copied ? 'Copied to clipboard.' : 'Distribute this listing to specific department heads.'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
    </div>
  )
}
