import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import Header from '../../components/layout/Header'
import Breadcrumb from '../../components/layout/Breadcrumb'
import Footer from '../../components/layout/Footer'
import { getAdmissionsStats, getCandidates, closeOpening } from '../../api/client'

export default function Admissions() {
  const [searchParams] = useSearchParams()
  const openingId = searchParams.get('opening_id') || 'GA-2026-001'
  const navigate = useNavigate()

  const [isApplicationsStopped, setIsApplicationsStopped] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [stats, setStats] = useState({ total: 0, pending_review: 0 })
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getAdmissionsStats(openingId).then(setStats),
      getCandidates({ opening_id: openingId }).then(setCandidates)
    ]).catch(console.error).finally(() => setLoading(false))
  }, [openingId])

  const toggleApplications = async () => {
    try {
      await closeOpening(openingId)
      setIsApplicationsStopped(true)
      setShowPopup(true)
      setTimeout(() => setShowPopup(false), 3000)
    } catch (err) {
      console.error(err)
    }
  }

  const handleEditClick = (e) => {
    if (isApplicationsStopped) {
      e.preventDefault()
    }
  }

  return (
    <div className="bg-[#F8FAFC] text-[#0F172A] antialiased min-h-screen flex flex-col font-sans">
      <Header />
      <Breadcrumb items={[
        { label: 'Home', to: '/' },
        { label: 'Dashboard', to: '/' },
        { label: 'Admissions' }
      ]} />

      <main className="flex-grow flex flex-col items-center px-6 lg:px-20 py-8">
        <div className="w-full max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h1 className="text-[#0F172A] text-2xl font-bold font-heading tracking-tight">Admissions Officer</h1>
                {isApplicationsStopped ? (
                  <span className="bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-[#CBD5E1]">Closed</span>
                ) : (
                  <span className="bg-[#F0FDF4] text-[#15803D] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-[#22C55E]/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">Open</span>
                )}
              </div>
              <p className="text-[#475569] font-semibold text-xs tracking-wider uppercase mt-1">Job ID: #{openingId}</p>
            </div>
            
            <div className="flex gap-3">
              <Link 
                to={isApplicationsStopped ? "#" : "/admissions/edit"} 
                onClick={handleEditClick}
                className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-xl font-bold text-xs shadow-sm transition-all duration-150 ${isApplicationsStopped ? 'bg-white border-[#E2E8F0] text-[#94A3B8] opacity-50 cursor-not-allowed' : 'bg-white border-[#E2E8F0] text-[#334155] hover:bg-[#F8FAFC] hover:shadow-md hover:-translate-y-px hover:border-[#CBD5E1]'}`}>
                <span className="material-symbols-outlined text-[16px]">edit</span> Edit Posting
              </Link>
              <button 
                onClick={isApplicationsStopped ? undefined : toggleApplications} 
                className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-xl font-bold text-xs shadow-sm transition-all duration-150 ${isApplicationsStopped ? 'bg-[#F1F5F9] text-[#94A3B8] border-[#E2E8F0] cursor-not-allowed' : 'bg-white border-[#CBD5E1] text-[#EF4444] hover:bg-[#FEF2F2] hover:border-[#F87171] hover:shadow-md hover:-translate-y-px'}`}>
                <span className="material-symbols-outlined text-[16px]">{isApplicationsStopped ? 'check_circle' : 'block'}</span> 
                {isApplicationsStopped ? 'Accepting Stopped' : 'Stop Accepting Applications'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 mb-8 sm:grid-cols-2">
            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-card flex items-center justify-between hover:shadow-md hover:-translate-y-px transition-all duration-150 group">
              <div>
                <p className="text-[#64748B] text-[11px] font-bold uppercase tracking-wider group-hover:text-[#475569] transition-colors">Total Applicants</p>
                <p className="text-3xl font-black font-heading text-[#0F172A] mt-1.5">{stats.total}</p>
              </div>
              <div className="bg-[#ecfdf5] text-[#059669] text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 border border-[#a7f3d0]">
                <span className="material-symbols-outlined text-[16px]">trending_up</span> 15%
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-card flex items-center justify-between hover:shadow-md hover:-translate-y-px transition-all duration-150 group">
              <div>
                <p className="text-[#64748B] text-[11px] font-bold uppercase tracking-wider group-hover:text-[#475569] transition-colors">Pending Review</p>
                <p className="text-3xl font-black font-heading text-[#0F172A] mt-1.5">{stats.pending_review}</p>
              </div>
              <div className="bg-[#fffbeb] text-[#d97706] text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 border border-[#fde68a]">
                <span className="material-symbols-outlined text-[16px]">schedule</span> High
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-card overflow-hidden hover:shadow-md transition-shadow duration-150">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-[#F8FAFC]/80 border-b border-[#E2E8F0]">
                  <th className="px-6 py-4 text-[#64748B] font-bold text-[10px] uppercase tracking-wider">Candidate ID</th>
                  <th className="px-6 py-4 text-[#64748B] font-bold text-[10px] uppercase tracking-wider">Candidate Name</th>
                  <th className="px-6 py-4 text-[#64748B] font-bold text-[10px] uppercase tracking-wider">Applied On</th>
                  <th className="px-6 py-4 text-[#64748B] font-bold text-[10px] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[#64748B] font-bold text-[10px] uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-[#94A3B8]">
                      <div className="flex justify-center"><div className="w-6 h-6 rounded-full border-4 border-[#28666E]/20 border-t-[#28666E] animate-spin"></div></div>
                    </td>
                  </tr>
                ) : candidates.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-[#94A3B8]">No candidates found.</td>
                  </tr>
                ) : candidates.map(candidate => (
                  <tr key={candidate.id} className="hover:bg-[#F8FAFC] transition-colors group cursor-pointer" onClick={() => navigate(`/candidate-profile?id=${candidate.id}`)}>
                    <td className="px-6 py-4 text-[13px] font-semibold text-[#64748B] font-mono group-hover:text-[#475569] transition-colors">{candidate.ref_id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-[#3B82F6] shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                        <span className="text-[14px] font-bold text-[#0F172A]">{candidate.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] font-medium text-[#64748B]">{candidate.applied_date}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">{candidate.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/candidate-profile?id=${candidate.id}`} className="text-[#28666E] font-bold text-[11px] bg-[#28666E]/5 hover:bg-[#28666E] hover:text-white px-4 py-2 rounded-lg inline-block border border-[#28666E]/10 transition-all uppercase tracking-wider">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center text-xs text-[#64748B] font-medium">
              <span>Showing 1 to 3 of 124 entries</span>
              <div className="flex gap-1">
                <button className="px-3 py-1.5 border border-[#E2E8F0] rounded-md bg-white hover:bg-[#F1F5F9] disabled:opacity-50" disabled>Previous</button>
                <button className="px-3 py-1.5 border border-[#28666E] rounded-md bg-[#28666E] text-white font-bold">1</button>
                <button className="px-3 py-1.5 border border-[#E2E8F0] rounded-md bg-white hover:bg-[#F1F5F9]">2</button>
                <button className="px-3 py-1.5 border border-[#E2E8F0] rounded-md bg-white hover:bg-[#F1F5F9]">3</button>
                <span className="px-2 py-1.5">...</span>
                <button className="px-3 py-1.5 border border-[#E2E8F0] rounded-md bg-white hover:bg-[#F1F5F9]">Next</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className={`fixed inset-0 flex items-center justify-center bg-[#0F172A]/40 z-[100] transition-opacity duration-300 backdrop-blur-sm ${showPopup ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`bg-white rounded-2xl p-6 md:p-8 max-w-sm w-full mx-4 shadow-2xl transform transition-transform duration-300 flex flex-col items-center text-center ${showPopup ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
          <div className="w-16 h-16 bg-[#FEF2F2] border border-[#FECACA] rounded-full flex items-center justify-center text-[#EF4444] mb-5 shadow-sm">
            <span className="material-symbols-outlined text-[32px] font-bold">block</span>
          </div>
          <h3 className="text-xl font-bold font-heading text-[#0F172A] mb-2 tracking-tight">Applications Stopped</h3>
          <p className="text-[#475569] text-sm font-medium leading-relaxed">The application link has been disabled and edit posting is now restricted.</p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
