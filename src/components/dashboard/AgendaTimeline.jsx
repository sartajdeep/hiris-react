import AgendaEvent from './AgendaEvent'
const timeGridLines = [
  { label: '09:00', top: '0px' },
  { label: '10:00', top: '120px' },
  { label: '11:00', top: '240px' },
  { label: '12:00', top: '360px' },
  { label: '13:00', top: '480px' },
  { label: '14:00', top: '600px' },
  { label: '15:00', top: '720px' },
  { label: '16:00', top: '840px' }
];

export default function AgendaTimeline({ currentDate, liveTimeText, indicatorTop, events = [] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#F1F5F9]">
        <h2 className="text-sm font-semibold text-[#1E293B]">Daily Agenda</h2>
        <div className="text-[10px] font-bold text-[#475569] bg-[#F1F5F9] px-2.5 py-1 rounded-full uppercase tracking-wide">{currentDate}</div>
      </div>
      <div className="relative border-l border-[#E2E8F0] ml-12 mb-8" style={{height:'840px'}}>
        {indicatorTop !== null && (
          <div className="absolute w-full flex items-center z-20 transition-all duration-500" style={{top:indicatorTop}}>
            <div className="w-2 h-2 rounded-full bg-[#EF4444] -ml-[4px] ring-2 ring-white"></div>
            <div className="flex-1 h-[1px] bg-[#EF4444]/40"></div>
            <span className="ml-2 text-[10px] font-bold text-[#EF4444] uppercase tracking-widest bg-white pr-2">{liveTimeText}</span>
          </div>
        )}
        <div className="absolute inset-0">
          {timeGridLines.map(l => (
            <div key={l.label} className="absolute w-full flex" style={{top:l.top}}>
              <span className="absolute -left-[56px] w-[44px] text-right text-[10px] text-[#94A3B8] font-medium font-mono" style={{transform:'translateY(-50%)'}}>{l.label}</span>
              <div className="w-full border-t border-[#F1F5F9]"></div>
            </div>
          ))}
        </div>
        {events.map(e => <AgendaEvent key={e.id} event={{...e, top: e.top_px, height: e.height_px, timeLabel: e.time_label}} />)}
      </div>
    </div>
  )
}
