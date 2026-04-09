import { Link } from 'react-router-dom'
const BADGE = {
  'Pending Review':    'bg-[#FFF7ED] text-[#C2410C] border border-[#FFEDD5]',
  'Sent for Approval': 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#DBEAFE]',
  'Approved':          'bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7]',
}
const LABEL = { 'Pending Review':'Pending', 'Sent for Approval':'Sent', 'Approved':'Approved' }
export default function RequestCard({ request }) {
  const { id, status, title, requestedBy, department, jobType, positions, startDate, deadlineDisplay } = request
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-card hover:shadow-md hover:-translate-y-px transition-all duration-150">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-bold text-[#475569] font-mono tracking-wider bg-[#F1F5F9] px-2 py-0.5 rounded">{id}</span>
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${BADGE[status]}`}>
          <span className="w-[6px] h-[6px] rounded-full bg-current"></span>{LABEL[status]}
        </span>
      </div>
      <h3 className="text-sm font-semibold text-[#0F172A] leading-[1.4] mb-1">{title}</h3>
      <p className="text-[11px] text-[#94A3B8] font-medium mb-3">{requestedBy} · {department}</p>
      <div className="w-full border-b border-[#F1F5F9] mb-3"></div>
      <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mb-3.5">
        {[['Job Type',jobType],['Positions',positions],['Start Date',startDate],['Deadline',deadlineDisplay]].map(([label,value])=>(
          <div key={label}>
            <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">{label}</p>
            <p className={`text-xs font-semibold mt-0.5 ${label==='Deadline'?'text-[#EF4444]':'text-[#334155]'}`}>{value}</p>
          </div>
        ))}
      </div>
      {status==='Pending Review' && (
        <Link to="/job-posting-builder" className="block w-full text-center py-2 text-xs font-bold text-white bg-[#28666E] hover:bg-[#28666E]/90 rounded-lg transition-all duration-150">Take Action</Link>
      )}
      {status==='Sent for Approval' && (
        <div className="flex items-center justify-center gap-1.5 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg mt-3.5">
          <span className="material-symbols-outlined text-[#64748B] text-[14px]">schedule</span>
          <span className="text-xs font-semibold text-[#64748B]">Awaiting Approval</span>
        </div>
      )}
      {status==='Approved' && (
        <Link to="/publish" className="flex w-full mt-3.5 items-center justify-center gap-1.5 py-2 text-xs font-bold text-white bg-[#28666E] hover:bg-[#28666E]/90 rounded-lg transition-all duration-150">
          Publish to Boards <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </Link>
      )}
    </div>
  )
}
