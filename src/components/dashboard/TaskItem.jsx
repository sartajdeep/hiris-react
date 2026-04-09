export default function TaskItem({ task, onComplete }) {
  const { id, text, due, priorityColor, completing } = task
  return (
    <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#F8FAFC] transition-all duration-150 task-item ${completing ? 'opacity-0 translate-x-4 duration-500' : ''}`}>
      <input type="checkbox" onChange={() => onComplete(id)} className="w-3.5 h-3.5 rounded-[4px] border-[#CBD5E1] text-[#28666E] focus:ring-[#28666E]/20 cursor-pointer" />
      <span className={`text-xs font-medium flex-1 ml-1 pt-px truncate transition-colors ${completing ? 'line-through text-[#94A3B8]' : 'text-[#475569]'}`}>{text}</span>
      {due && <span className="text-[9px] text-[#94A3B8] font-mono whitespace-nowrap px-1 tracking-wide uppercase">{due}</span>}
      <span className={`w-[6px] h-[6px] rounded-full shrink-0 ${priorityColor}`}></span>
    </div>
  )
}
