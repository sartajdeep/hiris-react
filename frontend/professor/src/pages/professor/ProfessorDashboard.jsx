import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import dummyCandidates from '../../data/dummy_candidates.json'

const API = 'http://localhost:3001/api'

// ─── Helpers ─────────────────────────────────────────────────────────────────
function initials(name = '') {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}
function fmtDate(d) {
  if (!d) return '—'
  const p = new Date(d)
  if (isNaN(p)) return d
  return p.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
function fmtDeadline(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}
function fmtInterviewFull(iso) {
  if (!iso) return 'Scheduled'
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}
function fmtInterviewShort(iso) {
  if (!iso) return '—'
  const d    = new Date(iso)
  const diff = Math.round((new Date(iso).setHours(0,0,0,0) - new Date().setHours(0,0,0,0)) / 86400000)
  const time = new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  if (diff === 0) return `Today · ${time}`
  if (diff === 1) return `Tomorrow · ${time}`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ` · ${time}`
}
function minsUntil(iso) {
  if (!iso) return null
  return Math.round((new Date(iso) - Date.now()) / 60000)
}

function StatusPill({ status }) {
  const s = (status || '').toLowerCase()
  if (s === 'professor review')
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-100">Pending Review</span>
  if (['interview scheduled', 'shortlisted', 'interview', 'final round', 'offer'].includes(s))
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">Shortlisted</span>
  if (['approved', 'hr round'].includes(s))
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-[#e0f5ff] text-[#0369a1] border border-[#bae6fd]">Approved</span>
  if (s === 'rejected')
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-red-50 text-red-600 border border-red-100">Rejected</span>
  return <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-100 text-slate-500">{status}</span>
}

function ReqPill({ status }) {
  const s = (status || '').toLowerCase()
  if (s === 'pending review')    return <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-100">In Progress</span>
  if (s === 'sent for approval') return <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-100">Awaiting Review</span>
  if (s === 'approved')          return <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">Approved</span>
  if (s === 'rejected')          return <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-red-50 text-red-600 border border-red-100">Rejected</span>
  return <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-100 text-slate-500">{status}</span>
}

// ─── Hire Request Modal ───────────────────────────────────────────────────────
function HireModal({ onClose, onSubmit }) {
  const [title, setTitle]       = useState('')
  const [description, setDesc]  = useState('')
  const [location, setLocation] = useState('on-campus')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const submit = async () => {
    if (!title.trim()) return
    setLoading(true); setError(null)
    try {
      await onSubmit({ title: title.trim(), description: description.trim(), location })
      onClose()
    } catch {
      setError('Could not reach the server. Please ensure the API is running on port 3001.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/25 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border border-[#E2E8F0]">
        <div className="bg-[#024e56] px-6 py-5 flex items-start justify-between">
          <div>
            <p className="text-white font-bold text-[13px]">Initiate Hire Request</p>
            <p className="text-[#9ee8d8] text-[11px] mt-0.5">The Hiring Office will build the full JD from your brief.</p>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white transition mt-0.5">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1.5">Position Title *</label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder='e.g. "Graduate Research Intern – AI Ethics"'
              className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-lg text-[13px] text-[#0F172A] focus:border-[#024e56] focus:ring-2 focus:ring-[#024e56]/10 outline-none bg-[#F8FAFC] transition" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1.5">
              Brief Description <span className="text-[#CBD5E1] normal-case font-normal tracking-normal">(optional)</span>
            </label>
            <textarea value={description} onChange={e => setDesc(e.target.value)} rows={4}
              placeholder="Key responsibilities and what kind of candidate you need. The Hiring Office will build the formal JD."
              className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-lg text-[13px] text-[#0F172A] focus:border-[#024e56] focus:ring-2 focus:ring-[#024e56]/10 outline-none bg-[#F8FAFC] transition resize-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-2">Work Location</label>
            <div className="flex gap-2">
              {[
                { key: 'on-campus', label: 'On-Campus', icon: 'apartment' },
                { key: 'remote',    label: 'Remote',    icon: 'public' },
                { key: 'hybrid',    label: 'Hybrid',    icon: 'diversity_3' },
              ].map(o => (
                <button key={o.key} onClick={() => setLocation(o.key)} type="button"
                  className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold border transition flex items-center justify-center gap-1.5
                    ${location === o.key ? 'bg-[#024e56] text-white border-[#024e56] shadow-sm' : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-[#024e56]/40'}`}>
                  <span className="material-symbols-outlined text-sm">{o.icon}</span>{o.label}
                </button>
              ))}
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <span className="material-symbols-outlined text-red-500 text-base">error</span>
              <p className="text-[11px] text-red-600">{error}</p>
            </div>
          )}
        </div>
        <div className="px-6 pb-5 flex gap-2">
          <button onClick={submit} disabled={!title.trim() || loading}
            className="flex-1 py-2.5 bg-[#024e56] hover:bg-[#028272] text-white font-bold text-[13px] rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm">
            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <span className="material-symbols-outlined text-base">send</span>}
            {loading ? 'Submitting…' : 'Submit to Hiring Office'}
          </button>
          <button onClick={onClose} disabled={loading}
            className="px-5 py-2.5 border border-[#E2E8F0] text-[#475569] font-semibold rounded-lg hover:bg-[#F8FAFC] text-[13px] transition disabled:opacity-50">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Sample data ──────────────────────────────────────────────────────────────
const SAMPLE_REQUESTS = [
  { id: 'REQ-PROF-002', title: 'Postdoctoral Fellow – Neuroscience Lab', status: 'Sent for Approval', department: 'Dept of Neuroscience', job_type: 'Full-time', location: 'on-campus', requested_by: 'Dr. Julian Sterling', description: 'Lead the neural pathway mapping initiative in the Neuroscience Lab.', deadline: new Date(Date.now() + 60 * 86400000).toISOString(), created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'REQ-PROF-001', title: 'Graduate Research Assistant – Computational Biology', status: 'Pending Review', department: 'Dept of Biology', job_type: 'Full-time', location: 'on-campus', requested_by: 'Dr. Julian Sterling', description: 'Support computational modelling work in the Biology lab.', deadline: new Date(Date.now() + 75 * 86400000).toISOString(), created_at: new Date(Date.now() - 172800000).toISOString() },
]
const SAMPLE_REVIEW = dummyCandidates.filter(c => c.hmVerdict === 'Recommended').map(c => ({
  id: c.id,
  name: c.name,
  role_applied: c.role,
  applied_date: 'Oct 20, 2023',
  status: 'Professor Review'
}))
const SAMPLE_INTERVIEWS = [
  { id: 9005, name: 'Dr. Ananya Roy',       role_applied: 'Graduate Research Assistant – Computational Biology', interview_at: new Date(Date.now() + 12 * 60000).toISOString() },
  { id: 9006, name: 'Victor Sokolov',       role_applied: 'Lab Technician III – Genetics', interview_at: new Date(Date.now() + 90 * 60000).toISOString() },
  { id: 9007, name: 'Dr. Fatima Al-Rashid', role_applied: 'Postdoctoral Fellow – Neuroscience Lab', interview_at: new Date(Date.now() + 26 * 3600000).toISOString() },
]

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProfessorDashboard() {
  const navigate  = useNavigate()
  // Tabs: overview | approvals | requests | schedule
  const [tab, setTab]     = useState('overview')
  const [modal, setModal] = useState(false)
  const [toast, setToast] = useState(null)

  const [myReqs,    setMyReqs]    = useState(SAMPLE_REQUESTS)
  const [forReview, setForReview] = useState(SAMPLE_REVIEW)
  const [scheduled, setScheduled] = useState(SAMPLE_INTERVIEWS)
  const [apiLive,   setApiLive]   = useState(false)
  const [approvalSort, setApprovalSort] = useState('default')

  const fetchAll = async () => {
    try {
      const [rR, cR, sR] = await Promise.all([
        fetch(`${API}/hiring-requests`),
        fetch(`${API}/candidates?status=Professor Review`),
        fetch(`${API}/candidates?status=Interview Scheduled`),
      ])
      if (rR.ok && cR.ok && sR.ok) {
        const [reqs, cands, scheds] = await Promise.all([rR.json(), cR.json(), sR.json()])
        const mine = reqs.filter(r =>
          (r.requested_by || '').toLowerCase().includes('julian') ||
          (r.requested_by || '').toLowerCase().includes('sterling') ||
          (r.id || '').startsWith('REQ-PROF')
        )
        if (mine.length  > 0) setMyReqs(mine)
        if (cands.length > 0) setForReview(cands)
        if (scheds.length > 0) setScheduled(scheds)
        setApiLive(true)
      }
    } catch {}
  }

  useEffect(() => { fetchAll() }, [])
  useEffect(() => { const id = setInterval(fetchAll, 10000); return () => clearInterval(id) }, [])

  const showToast = (msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 4000) }

  const submitRequest = async data => {
    const res = await fetch(`${API}/hiring-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, requested_by: 'Dr. Julian Sterling' }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const newR = await res.json()
    setMyReqs(prev => [newR, ...prev])
    showToast('Request submitted — Hiring Office notified.')
  }

  const updateStatus = async (id, status) => {
    if (apiLive) {
      await fetch(`${API}/candidates/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
    }
    setForReview(prev => prev.filter(c => c.id !== id))
    showToast(`Status updated to "${status}".`)
  }

  const sentForApproval = myReqs.filter(r => (r.status || '').toLowerCase() === 'sent for approval')
  const sortedSched      = [...scheduled].sort((a, b) => new Date(a.interview_at || 0) - new Date(b.interview_at || 0))

  const sortedForReview = [...forReview].sort((a, b) => {
    if (approvalSort === 'role') return (a.role_applied || '').localeCompare(b.role_applied || '')
    if (approvalSort === 'date') return new Date(b.applied_date || 0) - new Date(a.applied_date || 0)
    return 0
  })

  const dateStr  = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const hour     = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'

  // 4 tabs
  const TABS = [
    { id: 'overview',  label: 'Overview' },
    { id: 'approvals', label: 'Approvals',         badge: forReview.length },
    { id: 'requests',  label: 'My Requests',        badge: sentForApproval.length > 0 ? sentForApproval.length : 0, badgeColor: 'bg-amber-500' },
    { id: 'schedule',  label: 'Interview Schedule', badge: scheduled.length },
  ]

  return (
    // Full-viewport, no outer scroll
    <div className="h-screen flex flex-col overflow-hidden bg-[#F8FAFC] text-[#0F172A] antialiased font-sans">
      

      {/* ── Sub-nav tabs ─────────────────────────────────── */}
      <div className="h-[44px] shrink-0 bg-white border-b border-[#E2E8F0] px-8 flex items-center gap-1">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`relative h-[44px] px-4 text-[12px] font-medium border-b-2 flex items-center gap-2 transition-all
              ${tab === t.id
                ? 'text-[#024e56] border-[#024e56] font-semibold'
                : 'text-[#64748B] border-transparent hover:text-[#024e56] hover:border-slate-200'}`}>
            {t.label}
            {t.badge > 0 && (
              <span className={`min-w-[16px] h-4 ${t.badgeColor || 'bg-red-500'} text-white text-[9px] font-black rounded-full flex items-center justify-center px-1`}>
                {t.badge}
              </span>
            )}
          </button>
        ))}

        {/* Sample data pill */}
        {!apiLive && (
          <span className="ml-auto text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg font-semibold">
            Sample data — start API server
          </span>
        )}
      </div>

      {/* ── Body — fixed height, no scroll ───────────────── */}
      <div className="flex flex-1 overflow-hidden">



        {/* ── Main content — internally scrollable ─── */}
        <main className="flex-1 flex flex-col overflow-hidden">

          {/* ══════════════════════════════════
              TAB: OVERVIEW
          ══════════════════════════════════ */}
          {tab === 'overview' && (
            <div className="flex-1 overflow-y-auto p-7">
              <div className="max-w-[1100px] mx-auto space-y-6">

                {/* Heading row with inline action buttons */}
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-medium text-[#94A3B8]">{dateStr}</p>
                    <h1 className="text-[22px] font-bold text-[#0F172A] mt-0.5 tracking-tight">
                      {greeting}, Dr. Julian Sterling
                    </h1>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => setModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#024e56] hover:bg-[#028272] text-white text-[12px] font-bold rounded-lg shadow-sm transition-all active:scale-[0.97]">
                      <span className="material-symbols-outlined text-[17px]">add_task</span>
                      Post New JD
                    </button>
                    {sentForApproval.length > 0 && (
                      <button onClick={() => setTab('requests')}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-amber-200 text-amber-700 text-[12px] font-semibold rounded-lg shadow-sm hover:bg-amber-50 transition-all active:scale-[0.97]">
                        <span className="material-symbols-outlined text-[17px]">rate_review</span>
                        Review JD ({sentForApproval.length})
                      </button>
                    )}
                  </div>
                </div>

                {/* KPI row */}
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: 'Hire Requests',  value: myReqs.length,          icon: 'description',  bg: 'bg-slate-50',    fg: 'text-slate-500',   tag: null },
                    { label: 'JDs Awaiting',   value: sentForApproval.length, icon: 'rate_review',  bg: 'bg-amber-50',    fg: 'text-amber-500',   tag: sentForApproval.length > 0 ? 'Action required' : null, tagColor: 'text-red-500' },
                    { label: 'For Approval',   value: forReview.length,        icon: 'group',        bg: 'bg-[#f0faf9]',   fg: 'text-[#024e56]',   tag: null },
                    { label: 'Interviews',     value: scheduled.length,        icon: 'calendar_month', bg: 'bg-violet-50', fg: 'text-violet-500',  tag: null },
                  ].map(k => (
                    <div key={k.label} className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${k.bg} ${k.fg}`}>
                          <span className="material-symbols-outlined text-lg">{k.icon}</span>
                        </div>
                        {k.tag && <span className={`text-[10px] font-bold ${k.tagColor || 'text-[#94A3B8]'}`}>{k.tag}</span>}
                      </div>
                      <p className="text-[28px] font-bold text-[#0F172A] leading-none">{k.value}</p>
                      <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mt-1.5">{k.label}</p>
                    </div>
                  ))}
                </div>

                {/* JD review banner */}
                {sentForApproval.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-amber-500 text-xl">notification_important</span>
                      <div>
                        <p className="text-[13px] font-bold text-amber-800">Job Description Ready for Your Review</p>
                        <p className="text-[12px] text-amber-600 mt-0.5">
                          Hiring Office prepared the JD for: <strong>{sentForApproval[0].title}</strong>
                        </p>
                      </div>
                    </div>
                    <button onClick={() => setTab('requests')}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold rounded-lg transition flex items-center gap-1.5 whitespace-nowrap shadow-sm">
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                      Review Now
                    </button>
                  </div>
                )}

                {/* Two-col: candidates preview + interview preview */}
                <div className="grid grid-cols-2 gap-5">
                  {/* Candidates for review */}
                  <div className="flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-[14px] font-bold text-[#0F172A] tracking-tight">Candidates for Review</h2>
                      {forReview.length > 0 && (
                        <button onClick={() => setTab('approvals')}
                          className="text-[11px] font-semibold text-[#024e56] hover:underline flex items-center gap-0.5">
                          View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                      )}
                    </div>
                    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden flex-1">
                      {forReview.length === 0 ? (
                        <div className="py-10 text-center">
                          <span className="material-symbols-outlined text-4xl text-[#E2E8F0] block mb-2">done_all</span>
                          <p className="text-[12px] font-semibold text-[#94A3B8]">No candidates pending review.</p>
                        </div>
                      ) : forReview.slice(0, 3).map(c => (
                        <div key={c.id} onClick={() => navigate(`/candidate/${c.id}`)}
                          className="flex items-center gap-3 px-4 py-3.5 border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] cursor-pointer group transition-all">
                          <div className="w-8 h-8 rounded-lg bg-[#024e56]/10 text-[#024e56] font-bold text-xs flex items-center justify-center shrink-0">
                            {initials(c.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-semibold text-[#0F172A] group-hover:text-[#024e56] transition-colors truncate">{c.name}</p>
                            <p className="text-[10px] text-[#94A3B8] truncate">{c.role_applied}</p>
                          </div>
                          <StatusPill status={c.status} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interview schedule */}
                  <div className="flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-[14px] font-bold text-[#0F172A] tracking-tight">Upcoming Interviews</h2>
                      {scheduled.length > 0 && (
                        <button onClick={() => setTab('schedule')}
                          className="text-[11px] font-semibold text-[#024e56] hover:underline flex items-center gap-0.5">
                          View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                      )}
                    </div>
                    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden flex-1">
                      {scheduled.length === 0 ? (
                        <div className="py-10 text-center">
                          <span className="material-symbols-outlined text-4xl text-[#E2E8F0] block mb-2">calendar_today</span>
                          <p className="text-[12px] font-semibold text-[#94A3B8]">No scheduled interviews.</p>
                        </div>
                      ) : sortedSched.slice(0, 3).map(c => {
                        const mins     = minsUntil(c.interview_at)
                        const imminent = mins !== null && mins >= 0 && mins <= 15
                        return (
                          <div key={c.id}
                            className={`flex items-center gap-3 px-4 py-3.5 border-b border-[#F1F5F9] last:border-0 transition-all
                              ${imminent ? 'bg-amber-50/50' : 'hover:bg-[#F8FAFC]'}`}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0
                              ${imminent ? 'bg-amber-500' : 'bg-[#024e56]'}`}>
                              {initials(c.name)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] font-semibold text-[#0F172A] truncate">{c.name}</p>
                              <p className={`text-[10px] font-medium ${imminent ? 'text-amber-600' : 'text-[#94A3B8]'}`}>
                                {imminent ? `Starting in ${mins} min` : fmtInterviewShort(c.interview_at)}
                              </p>
                            </div>
                            <Link to={`/interview/${c.id}`}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition shrink-0
                                ${imminent ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-[#024e56] text-white hover:bg-[#028272]'}`}>
                              <span className="material-symbols-outlined text-sm">videocam</span>
                              {imminent ? 'Join' : 'Start'}
                            </Link>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════
              TAB: APPROVALS
          ══════════════════════════════════ */}
          {tab === 'approvals' && (
            <div className="flex-1 overflow-hidden flex flex-col p-7">
              <div className="shrink-0 mb-5 flex items-end justify-between gap-4">
                <div>
                  <h1 className="text-[20px] font-bold text-[#0F172A] tracking-tight">Candidates for Review</h1>
                  <p className="text-[12px] font-medium text-[#475569] mt-0.5">
                    Forwarded by the Hiring Office — awaiting your decision.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Sort by</span>
                  <select
                    value={approvalSort}
                    onChange={e => setApprovalSort(e.target.value)}
                    className="text-[12px] font-medium text-[#334155] border border-[#E2E8F0] rounded-lg px-3 py-1.5 bg-white focus:border-[#024e56] focus:ring-2 focus:ring-[#024e56]/10 outline-none cursor-pointer transition">
                    <option value="default">Default</option>
                    <option value="role">Role Applied</option>
                    <option value="date">Date Applied</option>
                  </select>
                </div>
              </div>
              <div className="flex-1 overflow-hidden bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col">
                <div className="overflow-y-auto flex-1">
                  <table className="w-full text-left">
                    <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] sticky top-0 z-10">
                      <tr className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">
                        <th className="px-5 py-3.5">Candidate</th>
                        <th className="px-5 py-3.5">Role Applied</th>
                        <th className="px-5 py-3.5">Applied</th>
                        <th className="px-5 py-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                      {sortedForReview.map(c => (
                        <tr key={c.id} className="hover:bg-[#F8FAFC] transition-all">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate(`/candidate/${c.id}`)}>
                              <div className="w-9 h-9 rounded-lg bg-[#024e56]/10 text-[#024e56] font-bold text-xs flex items-center justify-center shrink-0">
                                {initials(c.name)}
                              </div>
                              <div>
                                <p className="text-[13px] font-semibold text-[#0F172A] group-hover:text-[#024e56] transition-colors">{c.name}</p>
                                <StatusPill status={c.status} />
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-[12px] text-[#475569]">{c.role_applied}</td>
                          <td className="px-5 py-4 text-[12px] text-[#94A3B8]">{fmtDate(c.applied_date)}</td>
                          <td className="px-5 py-4 text-right">
                            <button onClick={() => navigate(`/candidate/${c.id}`)}
                              className="px-3.5 py-2 bg-[#024e56] hover:bg-[#028272] text-white text-[10px] font-bold uppercase rounded-lg transition shadow-sm">
                              View Profile
                            </button>
                          </td>
                        </tr>
                      ))}

                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════
              TAB: MY REQUESTS
          ══════════════════════════════════ */}
          {tab === 'requests' && (
            <div className="flex-1 overflow-hidden flex flex-col p-7">
              <div className="shrink-0 mb-5">
                <h1 className="text-[20px] font-bold text-[#0F172A] tracking-tight">My Hire Requests</h1>
                <p className="text-[12px] font-medium text-[#475569] mt-0.5">
                  All JD requests you have initiated. Click <strong>Awaiting Review</strong> cards to approve or send feedback.
                </p>
              </div>

              {/* Kanban columns — 2 col, fixed height */}
              <div className="flex-1 overflow-hidden">
                <div className="grid grid-cols-2 gap-5 h-full">
                  {[
                    { type: 'sent',   label: 'Sent',           dot: 'bg-blue-400',   badge: 'bg-blue-50 text-blue-700 border-blue-200',     actionable: false },
                    { type: 'review', label: 'Pending Review', dot: 'bg-amber-400',  badge: 'bg-amber-50 text-amber-700 border-amber-200',  actionable: true  },
                  ].map(({ type, label, dot, badge, actionable }) => {
                    const colReqs = myReqs.filter(r => type === 'sent' ? r.status === 'Pending Review' : r.status === 'Sent for Approval')
                    return (
                      <div key={type} className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col">
                        <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center justify-between shrink-0">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${dot}`} />
                            <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#475569]">{label}</h2>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full ${badge}`}>{colReqs.length}</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                          {colReqs.length === 0 && (
                            <p className="text-center text-xs text-[#CBD5E1] py-10 italic">No requests here</p>
                          )}
                          {colReqs.map(r => (
                            <div key={r.id}
                              onClick={() => actionable ? navigate('/jd-review') : undefined}
                              className={`p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-3 shadow-sm transition-all group
                                ${actionable ? 'cursor-pointer hover:border-[#024e56] hover:shadow-md' : ''}`}>
                              <div className="flex items-start justify-between gap-2">
                                <h3 className={`text-[13px] font-semibold text-[#0F172A] leading-tight ${actionable ? 'group-hover:text-[#024e56] transition-colors' : ''}`}>
                                  {r.title}
                                </h3>
                                <span className={`text-[9px] font-bold px-2 py-0.5 border rounded-full shrink-0 ${badge}`}>{r.id}</span>
                              </div>
                              {r.description && (
                                <p className="text-[11px] text-[#64748B] italic line-clamp-2">"{r.description}"</p>
                              )}
                              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[#475569]">
                                {r.department && r.department !== 'TBD' && (
                                  <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm text-[#94A3B8]">corporate_fare</span>{r.department}
                                  </span>
                                )}
                                {r.deadline && (
                                  <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm text-red-400">event</span>
                                    {fmtDeadline(r.deadline)}
                                  </span>
                                )}
                              </div>

                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════
              TAB: INTERVIEW SCHEDULE
          ══════════════════════════════════ */}
          {tab === 'schedule' && (
            <div className="flex-1 overflow-hidden flex flex-col p-7">
              <div className="shrink-0 mb-5">
                <h1 className="text-[20px] font-bold text-[#0F172A] tracking-tight">Interview Schedule</h1>
                <p className="text-[12px] font-medium text-[#475569] mt-0.5">
                  All confirmed interviews, sorted by time. Times shown in your local timezone.
                </p>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3">
                {scheduled.length === 0 ? (
                  <div className="bg-white rounded-xl border border-[#E2E8F0] py-20 text-center">
                    <span className="material-symbols-outlined text-5xl text-[#E2E8F0] block mb-3">event_busy</span>
                    <p className="text-[13px] font-semibold text-[#94A3B8]">No interviews scheduled.</p>
                  </div>
                ) : sortedSched.map(c => {
                  const mins     = minsUntil(c.interview_at)
                  const imminent = mins !== null && mins >= 0 && mins <= 15
                  return (
                    <div key={c.id}
                      className={`bg-white rounded-xl border px-5 py-4 flex items-center justify-between gap-6 shadow-sm transition-all
                        ${imminent ? 'border-amber-200 bg-amber-50/30' : 'border-[#E2E8F0] hover:shadow-md hover:border-[#024e56]/20'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm text-white shrink-0
                          ${imminent ? 'bg-amber-500' : 'bg-[#024e56]'}`}>
                          {initials(c.name)}
                        </div>
                        <div>
                          <p className="font-bold text-[#0F172A] text-[13px]">{c.name}</p>
                          <p className="text-[11px] text-[#475569]">{c.role_applied}</p>
                          <p className={`text-[11px] font-medium mt-0.5 flex items-center gap-1.5 ${imminent ? 'text-amber-600' : 'text-[#94A3B8]'}`}>
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            {imminent ? `Starting in ${mins} minute${mins !== 1 ? 's' : ''}` : fmtInterviewFull(c.interview_at)}
                          </p>
                        </div>
                      </div>
                      <Link to={`/interview/${c.id}`}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all shadow-sm
                          ${imminent ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-[#024e56] hover:bg-[#028272] text-white'}`}>
                        <span className="material-symbols-outlined text-base">videocam</span>
                        {imminent ? 'Join Now' : 'Start Interview'}
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </main>

        {/* ── Right panel: Interview timeline — only on Overview ─── */}
        {tab === 'overview' && (
          <aside className="w-[240px] shrink-0 bg-white border-l border-[#E2E8F0] flex flex-col overflow-hidden">
            <div className="px-5 pt-5 pb-4 border-b border-[#F1F5F9] flex items-center gap-2 shrink-0">
              <span className="material-symbols-outlined text-[#024e56] text-xl">calendar_month</span>
              <h2 className="text-[12px] font-bold text-[#0F172A]">Up Next</h2>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
              {scheduled.length === 0 ? (
                <div className="py-8 text-center">
                  <span className="material-symbols-outlined text-3xl text-[#E2E8F0] block mb-2">event_busy</span>
                  <p className="text-[11px] font-semibold text-[#CBD5E1]">No interviews scheduled.</p>
                </div>
              ) : sortedSched.map((c, i) => {
                const mins     = minsUntil(c.interview_at)
                const imminent = mins !== null && mins >= 0 && mins <= 15
                return (
                  <div key={c.id} className={`relative pl-3.5 border-l-2 py-0.5 ${i === 0 ? 'border-[#024e56]' : 'border-[#E2E8F0]'}`}>
                    <p className={`text-[9px] font-bold uppercase tracking-widest ${i === 0 ? 'text-[#024e56]' : 'text-[#94A3B8]'}`}>
                      {imminent ? `● ${mins} min away` : fmtInterviewShort(c.interview_at)}
                    </p>
                    <h4 className="text-[12px] font-bold text-[#0F172A] mt-0.5 leading-tight">{c.name}</h4>
                    <p className="text-[10px] text-[#94A3B8] truncate">{c.role_applied}</p>
                    {i === 0 && (
                      <Link to={`/interview/${c.id}`}
                        className="mt-2.5 flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-[11px] font-bold text-white bg-[#024e56] hover:bg-[#028272] transition shadow-sm">
                        {imminent ? 'Join Now' : 'Start Interview'}
                        <span className="material-symbols-outlined text-sm">videocam</span>
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          </aside>
        )}
      </div>

      {/* Footer */}
      



      {modal && <HireModal onClose={() => setModal(false)} onSubmit={submitRequest} />}

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
