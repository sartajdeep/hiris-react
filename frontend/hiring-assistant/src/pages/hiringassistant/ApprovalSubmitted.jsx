import { Link } from 'react-router-dom'

export default function ApprovalSubmitted() {
  return (
    <div className="bg-[color:var(--bg)] text-[color:var(--text-primary)] antialiased min-h-screen flex flex-col font-sans">
      
      
      
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 flex flex-col items-center flex-grow">
        <div className="relative mb-12 flex items-center justify-center">
          <div className="absolute h-20 w-20 rounded-full bg-[#28666E]/30 animate-pulse-ring"></div>
          <div className="absolute h-20 w-20 rounded-full bg-[#28666E]/20 animate-pulse-ring" style={{animationDelay: '1s'}}></div>
          <div className="relative z-10 flex items-center justify-center bg-[#28666E]/10 rounded-full p-5 text-[#28666E] shadow-[0_1px_3px_rgba(0,0,0,0.06)] shadow-primary/10">
            <span className="material-symbols-outlined text-[60px] font-bold">hourglass_empty</span>
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-[color:var(--text-primary)] text-2xl font-bold md:text-5xl font-heading leading-tight tracking-tight mb-4">Sent for Approval</h1>
          <p className="text-[color:var(--text-secondary)] text-lg max-w-2xl mx-auto">
            Your job posting has been successfully submitted to the department head for final approval. You will receive a notification once it is reviewed.
          </p>
        </div>

        <div className="w-full mb-12 flex justify-center">
          <Link to="/" className="px-8 py-3 bg-[#0F172A] text-white rounded-xl font-bold text-sm hover:bg-[#1E293B] transition-colors flex items-center gap-2 inline-flex justify-center shadow-sm">
            Return to Dashboard
          </Link>
        </div>
      </main>
      
      
    </div>
  )
}
