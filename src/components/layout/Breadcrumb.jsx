import { Link } from 'react-router-dom'
export default function Breadcrumb({ items }) {
  return (
    <nav className="h-[40px] px-8 flex items-center bg-white border-b border-[#F1F5F9] text-[11px] font-medium text-[#94A3B8]">
      <ol className="inline-flex items-center gap-1.5">
        {items.map((item, i) => (
          <li key={i} className="inline-flex items-center gap-1.5">
            {i > 0 && <span className="material-symbols-outlined text-[#CBD5E1] text-[14px]">chevron_right</span>}
            {item.to
              ? <Link to={item.to} className="flex items-center gap-1 hover:text-[#28666E] transition-colors duration-100">
                  {i===0 && <span className="material-symbols-outlined text-[14px]">home</span>}
                  {item.label}
                </Link>
              : <span className="text-[#334155]">{item.label}</span>
            }
          </li>
        ))}
      </ol>
    </nav>
  )
}
