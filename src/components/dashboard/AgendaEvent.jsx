export default function AgendaEvent({ event }) {
  const { title, subtitle, timeLabel, top, height, variant } = event
  const wrap = { primary:'bg-[#28666E] text-white border border-[#28666E]', default:'bg-white border border-[#E2E8F0]', dashed:'bg-[#F8FAFC] border border-[#CBD5E1] border-dashed' }[variant]
  const titleC = variant==='primary' ? 'text-white' : 'text-[#0F172A]'
  const subC   = variant==='primary' ? 'text-white/70' : 'text-[#94A3B8]'
  const chipC  = variant==='primary' ? 'bg-white/10 text-white' : 'bg-[#F1F5F9] text-[#475569]'
  return (
    <div className={`absolute left-4 right-2 p-3 rounded-xl z-10 hover:-translate-y-px transition-all duration-150 ${wrap}`} style={{top,height}}>
      <div className="flex flex-col h-full justify-between">
        <div>
          <h4 className={`font-semibold text-xs leading-tight mb-1 ${titleC}`}>{title}</h4>
          {subtitle && <p className={`text-[10px] font-medium ${subC}`}>{subtitle}</p>}
        </div>
        <div className="mt-auto flex justify-end">
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded tracking-wider ${chipC}`}>{timeLabel}</span>
        </div>
      </div>
    </div>
  )
}
