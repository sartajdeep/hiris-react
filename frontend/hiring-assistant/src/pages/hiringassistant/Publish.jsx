import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Publish() {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const linkValue = "plaksha.edu/careers/j/ai-ethics-2026"

  const handleCopy = () => {
    navigator.clipboard.writeText(linkValue).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handlePublish = () => {
    navigate('/job-posted')
  }

  return (
    <div className="bg-[color:var(--bg)] text-[color:var(--text-primary)] antialiased flex flex-col min-h-screen">
      
      
      <main className="flex-grow flex items-center justify-center px-8 py-10 bg-[color:var(--bg)]">
        <div className="w-full max-w-3xl bg-[color:var(--surface)] rounded-xl shadow-md border border-[color:var(--border)] overflow-hidden">
          <div className="bg-[color:var(--bg)] border-b border-[color:var(--border)] p-6 relative overflow-hidden flex items-center gap-4 isolate">
            <div className="absolute -right-8 -top-8 w-48 h-48 bg-[#28666E]/5 rounded-full blur-3xl -z-10"></div>
            <div className="w-12 h-12 bg-[color:var(--surface)] rounded-xl shadow-sm border border-[color:var(--border)] flex items-center justify-center text-[#28666E] shrink-0">
              <span className="material-symbols-outlined text-[24px]">rocket_launch</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[color:var(--text-primary)] font-heading leading-tight">Publish &amp; Distribute</h1>
              <p className="text-xs font-medium text-[color:var(--text-secondary)] mt-1 max-w-md">Finalize your job posting and sync it across university integration channels.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-6 border-r border-[color:var(--border)]">
              <h3 className="text-sm font-semibold text-[color:var(--text-primary)] mb-4">Choose Channels</h3>
              <div className="space-y-1">
                {[
                  { id: 'linkedin', name: 'LinkedIn Jobs', defaultChecked: true, icon: <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>, iconColor: 'text-[#0966C2]' },
                  { id: 'website', name: 'Institute Website', defaultChecked: true, icon: <span className="material-symbols-outlined text-[14px]">language</span>, iconColor: 'text-[#28666E]' },
                  { id: 'email', name: 'Internal Email List', defaultChecked: false, icon: <span className="material-symbols-outlined text-[14px]">mail</span>, iconColor: 'text-[color:var(--text-secondary)]' },
                ].map(channel => (
                  <div key={channel.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-[color:var(--bg)] transition-colors duration-150 cursor-default group">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded bg-[color:var(--bg)] flex items-center justify-center border border-[color:var(--border)] shadow-sm ${channel.iconColor}`}>
                        {channel.icon}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-[color:var(--text-primary)]">{channel.name}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input defaultChecked={channel.defaultChecked} className="sr-only peer" type="checkbox"/>
                      <div className="w-9 h-5 bg-[#E2E8F0] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#28666E]/20 rounded-full peer peer-checked:after:translate-x-[16px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[color:var(--surface)] after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#28666E] shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 bg-[color:var(--surface)]">
              <h3 className="text-sm font-semibold text-[color:var(--text-primary)] mb-2">Application Link</h3>
              <p className="text-xs font-medium text-[color:var(--text-secondary)] mb-4">Use this direct reference link in customized communications.</p>
              
              <div className="space-y-4">
                <div className="relative flex items-center">
                  <input readOnly className="w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--bg)] px-3 py-2 pr-9 text-[13px] font-medium text-[color:var(--text-primary)] focus:border-[#28666E] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(40,102,110,0.1)] focus:bg-[color:var(--surface)] outline-none transition-all duration-150" type="text" value={linkValue}/>
                  <button onClick={handleCopy} className="absolute right-2 p-1 text-[color:var(--text-muted)] hover:text-[#28666E] hover:bg-[color:var(--surface)] rounded transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#28666E]/20" title="Copy to clipboard">
                    <span className="material-symbols-outlined text-[16px]">{copied ? 'check' : 'content_copy'}</span>
                  </button>
                </div>
                
                <div className="flex items-start gap-2 bg-[#EFF6FF] border border-[#DBEAFE] rounded-lg p-3">
                  <span className="material-symbols-outlined text-[#3B82F6] text-[16px]">info</span>
                  <p className="text-[11px] font-medium text-[#1D4ED8] mt-px leading-snug">
                    Applicant tracking analytics will activate fully once the primary job posting goes live.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t border-[color:var(--border)] bg-[color:var(--bg)] flex flex-col items-center">
            <button onClick={handlePublish} className="w-full max-w-xs bg-[#28666E] text-white py-3 px-8 text-sm font-bold rounded-lg shadow-sm hover:bg-[#28666E]/90 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#28666E]/30 active:scale-[0.98] transition-all duration-150">
              Publish Campaign
            </button>
            <p className="text-[10px] font-medium text-[color:var(--text-muted)] mt-3">By publishing, you confirm adherence to university HR guidelines.</p>
          </div>
        </div>
      </main>
      
    </div>
  )
}
