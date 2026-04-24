import RequestCard from './RequestCard'
const META = {
  'Pending Review':    'bg-[#FFF7ED] text-[#C2410C] border border-[#FFEDD5]',
  'Sent for Approval': 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#DBEAFE]',
  'Approved':          'bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7]',
}
export default function KanbanColumn({ title, requests }) {
  return (
    <div className="flex flex-col bg-[color:var(--bg)] rounded-xl border border-[color:var(--border)] p-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-[color:var(--border)]">
        <h3 className="text-xs font-bold text-[color:var(--text-secondary)] tracking-wide">{title}</h3>
        <span className={`text-[10px] font-bold px-2 py-px rounded-full ${META[title]}`}>{requests.length}</span>
      </div>
      <div className="flex flex-col gap-3">
        {requests.map(r => <RequestCard key={r.id} request={r} />)}
      </div>
    </div>
  )
}
