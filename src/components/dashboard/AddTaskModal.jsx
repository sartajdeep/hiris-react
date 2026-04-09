import { useEffect, useRef, useState } from 'react'
export default function AddTaskModal({ onClose, onAdd }) {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState('High')
  const [due, setDue] = useState('')
  const inputRef = useRef(null)
  useEffect(() => {
    inputRef.current?.focus()
    const h = e => { if (e.key==='Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [onClose])
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/20 backdrop-blur-[2px] p-4">
      <div className="w-full max-w-sm rounded-[16px] bg-white shadow-xl ring-1 ring-[#0F172A]/5">
        <div className="flex items-center justify-between border-b border-[#F1F5F9] px-6 py-4">
          <h4 className="text-sm font-semibold text-[#0F172A]">Add a Task</h4>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-[#0F172A] transition-colors p-1 rounded-md hover:bg-[#F1F5F9]">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1.5">Task Description</label>
            <input ref={inputRef} type="text" value={text} onChange={e=>setText(e.target.value)} placeholder="What needs to be done?"
              className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-xs font-medium text-[#0F172A] focus:border-[#28666E] focus:shadow-[0_0_0_3px_rgba(40,102,110,0.1)] bg-[#F8FAFC] focus:bg-white outline-none transition-all duration-150" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1.5">Priority</label>
              <select value={priority} onChange={e=>setPriority(e.target.value)}
                className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-xs font-medium text-[#0F172A] focus:border-[#28666E] bg-[#F8FAFC] focus:bg-white outline-none transition-all duration-150">
                <option>High</option><option>Medium</option><option>Low</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1.5">Due Date</label>
              <input type="date" value={due} onChange={e=>setDue(e.target.value)}
                className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-xs font-medium text-[#0F172A] focus:border-[#28666E] bg-[#F8FAFC] focus:bg-white outline-none transition-all duration-150" />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button onClick={onClose} className="py-2 px-4 text-xs font-semibold rounded-lg text-[#475569] hover:bg-[#F1F5F9] transition-colors">Cancel</button>
            <button onClick={() => onAdd({text,priority,due})} className="py-2 px-5 text-xs font-bold rounded-lg bg-[#28666E] text-white hover:bg-[#28666E]/90 active:scale-[0.98] transition-all duration-150 focus:ring-2 focus:ring-offset-1 focus:ring-[#28666E]/30">Add Task</button>
          </div>
        </div>
      </div>
    </div>
  )
}
