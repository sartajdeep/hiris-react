import RequestCard from './RequestCard'
const META = {
  'Pending Review':    'bg-[#FFF7ED] text-[#C2410C] border border-[#FFEDD5]',
  'Sent for Approval': 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#DBEAFE]',
  'Approved':          'bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7]',
}
export default function KanbanColumn({ title, requests }) {
  return (
    <div className="flex flex-col bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#E2E8F0]">
        <h3 className="text-xs font-bold text-[#334155] tracking-wide">{title}</h3>
        <span className={`text-[10px] font-bold px-2 py-px rounded-full ${META[title]}`}>{requests.length}</span>
      </div>
      <div className="flex flex-col gap-3">
        {requests.map(r => <RequestCard key={r.id} request={r} />)}
      </div>
    </div>
  )
}
