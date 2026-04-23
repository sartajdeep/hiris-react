import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import AgendaTimeline from '../../components/dashboard/AgendaTimeline'
import TaskItem from '../../components/dashboard/TaskItem'
import AddTaskModal from '../../components/dashboard/AddTaskModal'
import { Link } from 'react-router-dom'
import { useLiveClock } from '../../hooks/useLiveClock'
import { useState, useEffect } from 'react'
import { getDashboardStats, getTasks, createTask, completeTask as completeTaskApi, getAgenda } from '../../api/client'

export default function Dashboard() {
  const { currentDate, liveTimeText, indicatorTop } = useLiveClock()

  const [stats, setStats] = useState({ unopened_apps:0, jd_requests:0, approvals:0, pending_requests:0, active_openings:0 })
  const [tasks, setTasks] = useState([])
  const [agenda, setAgenda] = useState([])
  const [modalOpen, setModalOpen] = useState(false)

  const fetchTasks = () => getTasks().then(setTasks).catch(console.error)

  useEffect(() => {
    getDashboardStats().then(setStats).catch(console.error)
    fetchTasks()
    getAgenda().then(setAgenda).catch(console.error)
  }, [])

  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)

  const addTask = async ({ text, priority, due }) => {
    if (!text.trim()) return
    try {
      await createTask({ text, priority, due_date: due || null })
      fetchTasks()
      closeModal()
    } catch (e) { console.error('Error creating task', e) }
  }

  const completeTask = async (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completing: true } : t))
    try {
      await completeTaskApi(id)
      setTimeout(() => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: true } : t))
        setTimeout(() => setTasks(prev => prev.filter(t => t.id !== id)), 500)
      }, 800)
    } catch (e) {
      console.error('Complete error', e)
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completing: false } : t))
    }
  }

  return (
    <div className="bg-[#F8FAFC] text-[#0F172A] antialiased flex flex-col min-h-screen">
      <Header showSearch={false} />
      {/* Dashboard breadcrumb: Home only, no Dashboard link */}
      <nav className="h-[40px] px-8 flex items-center bg-white border-b border-[#F1F5F9] text-[11px] font-medium text-[#94A3B8]">
        <ol className="inline-flex items-center gap-1.5">
          <li className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">home</span> Home</li>
        </ol>
      </nav>
      <main className="dashboard-container flex flex-1">
        {/* LEFT: w-2/3 */}
        <aside className="w-2/3 scrollable-content border-r border-[#E2E8F0] px-8 py-8 flex flex-col gap-6">
          {/* Welcome */}
          <div>
            <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wide mb-1">Wednesday, 18 March 2026</p>
            <h1 className="text-2xl font-heading font-bold text-[#0F172A]">Good morning, Sartajdeep</h1>
            <p className="text-xs font-medium text-[#475569] mt-1">Here's what's on your plate today.</p>
          </div>
          {/* Quick Nav Cards */}
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5 hover:shadow-md hover:-translate-y-px transition-all duration-150 flex flex-col justify-between min-h-[140px]">
              <div className="w-10 h-10 bg-[#28666E]/5 rounded-lg flex items-center justify-center text-[#28666E]">
                <span className="material-symbols-outlined text-[20px]">inbox</span>
              </div>
              <div className="flex items-end justify-between mt-4">
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A]">Hiring Requests</h3>
                  <p className="text-xs font-medium text-[#475569] mt-0.5">{stats.pending_requests} pending approvals</p>
                </div>
                <Link to="/hiring-requests" className="py-2 px-4 text-xs font-semibold rounded-lg border border-[#E2E8F0] text-[#0F172A] hover:border-[#28666E] hover:text-[#28666E] transition-all duration-150 bg-white">View →</Link>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5 hover:shadow-md hover:-translate-y-px transition-all duration-150 flex flex-col justify-between min-h-[140px]">
              <div className="w-10 h-10 bg-[#28666E]/5 rounded-lg flex items-center justify-center text-[#28666E]">
                <span className="material-symbols-outlined text-[20px]">groups</span>
              </div>
              <div className="flex items-end justify-between mt-4">
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A]">Active Postings</h3>
                  <p className="text-xs font-medium text-[#475569] mt-0.5">{stats.active_openings} active</p>
                </div>
                <Link to="/active-openings" className="py-2 px-4 text-xs font-bold rounded-lg bg-[#28666E] text-white hover:bg-[#28666E]/90 transition-colors duration-150">Manage</Link>
              </div>
            </div>
          </div>
          {/* Analytics */}
          <div>
            <h3 className="text-sm font-semibold text-[#1E293B] mb-4">Analytics Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
              {/* KPI Tiles — col-span-2, max h-[60px] each */}
              <div className="col-span-2 space-y-3">
                {[
                  { label:'Unopened', value: stats.unopened_apps, color:'text-[#EF4444]', icon:'inbox', to:'/active-openings' },
                  { label:'JD Requests', value: stats.jd_requests, color:'text-[#28666E]', icon:'description', to:'/hiring-requests' },
                  { label:'Approvals', value: stats.approvals, color:'text-[#22C55E]', icon:'check_circle', to:'/hiring-requests' },
                ].map(tile => (
                  <Link key={tile.label} to={tile.to} className="flex items-center justify-between bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 shadow-sm hover:shadow-md hover:-translate-y-px transition-all duration-150 h-[60px]">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#94A3B8]">{tile.label}</p>
                      <p className={`text-2xl font-black leading-none mt-1 font-heading ${tile.color}`}>{tile.value}</p>
                    </div>
                    <span className={`material-symbols-outlined text-[18px] opacity-50 ${tile.color}`}>{tile.icon}</span>
                  </Link>
                ))}
              </div>
              {/* Tasks Panel — col-span-3 */}
              <div className="col-span-3">
                <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm flex flex-col h-[204px]">
                  <div className="flex border-b border-[#F1F5F9] bg-[#F8FAFC] px-1 pt-1 rounded-t-xl">
                    <div className="px-4 py-2 text-[11px] font-bold text-[#28666E] border-b-[3px] border-[#28666E]">Tasks</div>
                    <div className="ml-auto px-2 flex items-center">
                      <button onClick={openModal} className="text-[10px] font-bold text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] px-2 py-1.5 rounded-lg flex items-center gap-1 transition-colors duration-150">
                        <span className="material-symbols-outlined text-[14px]">add</span> Add Task
                      </button>
                    </div>
                  </div>
                  <div id="todoContainer" className="p-2 space-y-1 flex-1 overflow-y-auto custom-scrollbar">
                    {tasks.map(t => {
                      const COLORS = { High:'bg-[#EF4444]', Medium:'bg-[#F59E0B]', Low:'bg-[#3B82F6]' }
                      const dueDisplay = t.due_date ? new Date(t.due_date).toLocaleDateString('en-US',{month:'short',day:'numeric'}) : null
                      return <TaskItem key={t.id} task={{...t, priorityColor: COLORS[t.priority], due: dueDisplay}} onComplete={completeTask} />
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
        {/* RIGHT: w-1/3 */}
        <section className="w-1/3 bg-white px-8 py-8 relative border-l border-[#E2E8F0] shadow-sm z-10 scrollable-content">
          <AgendaTimeline currentDate={currentDate} liveTimeText={liveTimeText} indicatorTop={indicatorTop} events={agenda} />
        </section>
      </main>
      <Footer />
      {modalOpen && <AddTaskModal onClose={closeModal} onAdd={addTask} />}
    </div>
  )
}
