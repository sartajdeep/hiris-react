import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getActiveOpenings } from '../../api/client'

export default function ActiveOpenings() {
  const [view, setView] = useState('grid')
  const [activeOpenings, setActiveOpenings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getActiveOpenings().then(setActiveOpenings).catch(console.error).finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-[color:var(--bg)] text-[color:var(--text-primary)] antialiased min-h-screen flex flex-col font-sans">
      
      
      <main className="flex-1 px-4 md:px-10 lg:px-40 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-[color:var(--text-primary)] text-2xl font-bold font-heading tracking-tight">Active Postings</h1>
            <p className="text-[color:var(--text-secondary)] text-sm">Manage faculty recruitment and staff acquisition cycles.</p>
          </div>
        </div>

        <div className="mb-8 flex items-center justify-between border-b border-[color:var(--border)]">
          <div className="flex gap-5">
            <div className="border-b-2 border-primary text-[#28666E] px-2 pb-4 text-sm font-bold flex items-center gap-2">
              All Postings <span className="bg-[#28666E]/10 px-2 py-0.5 rounded text-xs">{activeOpenings.length}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 pb-2">
            <button onClick={() => setView('grid')} className={`p-1.5 rounded transition-colors ${view === 'grid' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}>
              <span className="material-symbols-outlined text-[20px]">grid_view</span>
            </button>
            <button onClick={() => setView('list')} className={`p-1.5 rounded transition-colors ${view === 'list' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}>
              <span className="material-symbols-outlined text-[20px]">view_list</span>
            </button>
          </div>
        </div>

        <div id="job-container" className={view === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5" : "flex flex-col gap-5"}>
          {loading ? (
            <div className="col-span-full py-12 flex justify-center items-center">
              <div className="w-8 h-8 rounded-full border-4 border-[#28666E]/20 border-t-[#28666E] animate-spin"></div>
            </div>
          ) : activeOpenings.map(job => (
            <div key={job.id} className="job-card flex flex-col bg-[color:var(--surface)] border border-[color:var(--border)] rounded-xl overflow-hidden shadow-card hover:shadow-md hover:-translate-y-px transition-all duration-150">
              <div className="card-top p-5 border-b border-[color:var(--border)] bg-[#F8FAFC]/50">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-[#28666E] text-white w-fit mb-3 uppercase">{job.tag}</span>
                <h3 className="text-[color:var(--text-primary)] text-sm font-semibold leading-tight">{job.title}</h3>
                <p className="text-[color:var(--text-secondary)] text-xs font-medium mt-1">{job.department}</p>
              </div>
              
              <div className="card-bottom p-5 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-[color:var(--text-muted)] text-[10px] font-bold uppercase tracking-wider">Job ID</span>
                  <span className="text-[color:var(--text-primary)] text-xs font-mono font-semibold">#{job.id}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-t border-[#E2E8F0]/50 mt-1">
                  <div className="flex items-center gap-5">
                    <div className="flex flex-col">
                      <span className="text-[color:var(--text-secondary)] text-[10px] font-bold uppercase tracking-wider">Candidates</span>
                      <span className="text-[#28666E] text-2xl font-black font-heading leading-none">{job.candidates}</span>
                    </div>
                    <div className="flex flex-col border-l border-[color:var(--border)] pl-5">
                      <span className="text-[color:var(--text-muted)] text-[10px] font-bold uppercase tracking-wider">Unopened</span>
                      <span className="text-[#EF4444] text-2xl font-black font-heading leading-none">{Math.floor(job.candidates / 3)}</span>
                    </div>
                  </div>
                  <Link to={`/admissions?opening_id=${job.id}`} className="p-2 rounded-lg bg-[color:var(--bg)] text-[#28666E] border border-[color:var(--border)] hover:bg-[#28666E] hover:border-[#28666E] hover:text-white transition-all duration-150 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      
    </div>
  )
}
