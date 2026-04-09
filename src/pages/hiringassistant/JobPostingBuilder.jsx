import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Header from '../../components/layout/Header'
import Breadcrumb from '../../components/layout/Breadcrumb'
import Footer from '../../components/layout/Footer'

export default function JobPostingBuilder() {
  const [searchParams] = useSearchParams()
  const requestId = searchParams.get('requestId')
  const [requestData, setRequestData] = useState(null)
  const [department, setDepartment] = useState('CS-01')
  const [departments, setDepartments] = useState([
    { id: 'CS-01', name: 'Computer Science (CS-01)' },
    { id: 'DS-02', name: 'Data Science (DS-02)' },
    { id: 'LA-03', name: 'Liberal Arts (LA-03)' }
  ])
  const [skills, setSkills] = useState(['Python', 'NLP', 'PyTorch'])
  const [stages, setStages] = useState([
    { id: 1, name: 'Screening', checked: true },
    { id: 2, name: 'Tech Interview 1', checked: true },
    { id: 3, name: 'Tech Interview 2', checked: false },
    { id: 4, name: 'HR Round 1', checked: true },
    { id: 5, name: 'HR Round 2', checked: false },
    { id: 6, name: 'General Interaction', checked: false }
  ])
  const [location, setLocation] = useState('on-campus')
  const [questions, setQuestions] = useState([{ id: 1, text: 'Why are you interested in AI Ethics research?' }])
  const [isAddingQuestion, setIsAddingQuestion] = useState(false)
  const [newQuestion, setNewQuestion] = useState('')
  const [draggedIdx, setDraggedIdx] = useState(null)
  const [summaryRef, setSummaryRef] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (requestId) {
      fetch(`http://localhost:3001/api/hiring-requests/${requestId}`)
        .then(r => r.json()).then(data => {
          setRequestData(data)
          if (data.location) setLocation(data.location)
        }).catch(console.error)
    }
  }, [requestId])

  const handleDragStart = (idx) => setDraggedIdx(idx)
  const handleDragOver = (e, idx) => {
    e.preventDefault()
    if (draggedIdx === null || draggedIdx === idx) return
    const newStages = [...stages]
    const draggedItem = newStages[draggedIdx]
    newStages.splice(draggedIdx, 1)
    newStages.splice(idx, 0, draggedItem)
    setDraggedIdx(idx)
    setStages(newStages)
  }
  const handleDrop = () => setDraggedIdx(null)

  const handleSendApproval = async () => {
    try {
      if (requestId) {
        // Mark request as Sent for Approval so it appears on Professor's Review JD button
        await fetch(`http://localhost:3001/api/hiring-requests/${requestId}/status`, {
          method: 'PATCH', headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ status: 'Sent for Approval' })
        })
      }
      navigate('/approval-submitted')
    } catch(err) { console.error(err) }
  }

  const handleDepartmentChange = (e) => {
    if (e.target.value === 'add_new') {
      const deptName = window.prompt("Enter new department name:")
      const deptId = window.prompt("Enter new department ID (e.g. ENG-04):")
      if (deptName && deptId) {
        setDepartments([...departments, { id: deptId, name: `${deptName} (${deptId})` }])
        setDepartment(deptId)
      }
    } else {
      setDepartment(e.target.value)
    }
  }

  const handleAddSkill = () => {
    const skillName = window.prompt("Enter a skill to add:")
    if (skillName && skillName.trim() !== "") {
      setSkills([...skills, skillName.trim()])
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove))
  }

  const handleAddStage = () => {
    const stageName = window.prompt("Enter a custom stage name:")
    if (stageName && stageName.trim() !== "") {
      setStages([...stages, { id: Date.now(), name: stageName.trim(), checked: true }])
    }
  }

  const toggleStage = (id) => {
    setStages(stages.map(stage => 
      stage.id === id ? { ...stage, checked: !stage.checked } : stage
    ))
  }

  return (
    <div className="bg-[#F8FAFC] text-[#0F172A] antialiased min-h-screen flex flex-col font-sans">
      <Header />
      <Breadcrumb items={[
        { label: 'Home', to: '/' },
        { label: 'Dashboard', to: '/' },
        { label: 'Hiring Requests', to: '/hiring-requests' },
        { label: 'Job Posting Builder' }
      ]} />

      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-5 w-full">
        <section className="w-full space-y-8 pb-20">
          <div className="bg-white rounded-xl p-5 shadow-card border border-[#E2E8F0] overflow-hidden relative hover:shadow-md hover:-translate-y-px transition-all duration-150">
            <div className="absolute top-0 right-0 p-4">
              <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold tracking-wider rounded-full uppercase">{requestId ? 'From Professor' : 'New Request'}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mt-2">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-[#94A3B8] font-bold uppercase tracking-wider text-[10px]">Requested by:</span>
                    <span className="text-[#0F172A] font-semibold text-xs">{requestData?.requested_by || 'Prof. Arpan Kar'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#94A3B8] font-bold uppercase tracking-wider text-[10px]">Dept:</span>
                    <span className="text-[#0F172A] font-semibold text-xs">Computer Science</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#94A3B8] font-bold uppercase tracking-wider text-[10px]">Type:</span>
                    <span className="font-bold px-2 py-0.5 bg-[#F1F5F9] text-[#475569] rounded text-[10px] uppercase tracking-wider">Internship</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#94A3B8] font-bold uppercase tracking-wider text-[10px]">Positions:</span>
                    <span className="text-[#0F172A] font-semibold text-xs">2</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#94A3B8] font-bold uppercase tracking-wider text-[10px]">Start Date:</span>
                    <span className="font-semibold text-xs text-[#28666E]">Sept 1, 2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#94A3B8] font-bold uppercase tracking-wider text-[10px]">Deadline:</span>
                    <span className="font-semibold text-xs text-[#EF4444]">Aug 15, 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-card border border-[#E2E8F0] hover:shadow-md hover:-translate-y-px transition-all duration-150">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#28666E] bg-[#28666E]/10 p-2 rounded-xl text-[20px]">description</span>
                <h2 className="text-lg font-bold text-[#0F172A]">Job Description Builder</h2>
              </div>
            </div>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#475569] uppercase tracking-wider">Job Title</label>
                  <input className="w-full px-4 py-3 bg-[#F8FAFC] border-[#E2E8F0] rounded-xl text-sm font-medium text-[#0F172A] focus:border-[#28666E] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(40,102,110,0.1)] focus:bg-white outline-none transition-all duration-150" type="text" defaultValue="Graduate Research Intern - AI & Ethics"/>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#475569] uppercase tracking-wider">Department</label>
                  <select value={department} onChange={handleDepartmentChange} className="w-full px-4 py-3 bg-[#F8FAFC] border-[#E2E8F0] rounded-xl text-sm font-medium text-[#0F172A] focus:border-[#28666E] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(40,102,110,0.1)] focus:bg-white outline-none transition-all duration-150">
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    <option value="add_new" className="font-bold text-[#28666E] bg-[#28666E]/10">+ Add New Department</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#475569] uppercase tracking-wider">Location</label>
                <div className="flex flex-wrap gap-3">
                  <label className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${location === 'on-campus' ? 'bg-[#F0FDF4] border border-[#22C55E]/30 text-[#15803D] scale-[1.02]' : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:border-[#CBD5E1] hover:bg-[#F1F5F9]'}`}>
                    <input className="hidden" name="loc" type="radio" checked={location === 'on-campus'} onChange={() => setLocation('on-campus')}/>
                    <span className="material-symbols-outlined text-[18px]">apartment</span> On-campus
                  </label>
                  <label className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${location === 'remote' ? 'bg-[#F0FDF4] border border-[#22C55E]/30 text-[#15803D] scale-[1.02]' : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:border-[#CBD5E1] hover:bg-[#F1F5F9]'}`}>
                    <input className="hidden" name="loc" type="radio" checked={location === 'remote'} onChange={() => setLocation('remote')}/>
                    <span className="material-symbols-outlined text-[18px]">public</span> Remote
                  </label>
                  <label className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${location === 'hybrid' ? 'bg-[#F0FDF4] border border-[#22C55E]/30 text-[#15803D] scale-[1.02]' : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:border-[#CBD5E1] hover:bg-[#F1F5F9]'}`}>
                    <input className="hidden" name="loc" type="radio" checked={location === 'hybrid'} onChange={() => setLocation('hybrid')}/>
                    <span className="material-symbols-outlined text-[18px]">diversity_3</span> Hybrid
                  </label>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#475569] uppercase tracking-wider">Summary</label>
                {requestData?.description && (
                  <p className="text-[10px] text-[#28666E] font-semibold bg-[#28666E]/5 px-3 py-2 rounded-lg border border-[#28666E]/20">
                    💡 Professor's notes: "{requestData.description}"
                  </p>
                )}
                <div className="flex items-center gap-1 mb-2 p-1 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] w-fit shadow-sm">
                  <button onClick={() => document.execCommand('bold')} className="p-1 hover:bg-[#E2E8F0] rounded transition-colors text-[#64748B] hover:text-[#334155]" type="button"><span className="material-symbols-outlined text-[16px]">format_bold</span></button>
                  <button onClick={() => document.execCommand('italic')} className="p-1 hover:bg-[#E2E8F0] rounded transition-colors text-[#64748B] hover:text-[#334155]" type="button"><span className="material-symbols-outlined text-[16px]">format_italic</span></button>
                  <div className="w-px h-4 bg-[#CBD5E1] mx-1"></div>
                  <button onClick={() => document.execCommand('insertUnorderedList')} className="p-1 hover:bg-[#E2E8F0] rounded transition-colors text-[#64748B] hover:text-[#334155]" type="button"><span className="material-symbols-outlined text-[16px]">format_list_bulleted</span></button>
                  <button onClick={() => document.execCommand('insertOrderedList')} className="p-1 hover:bg-[#E2E8F0] rounded transition-colors text-[#64748B] hover:text-[#334155]" type="button"><span className="material-symbols-outlined text-[16px]">format_list_numbered</span></button>
                </div>
                <div contentEditable="true" suppressContentEditableWarning className="w-full min-h-[80px] px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-medium text-[#0F172A] focus:border-[#28666E] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(40,102,110,0.1)] focus:bg-white outline-none transition-all duration-150">Brief overview of the role...</div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#475569] uppercase tracking-wider">Responsibilities</label>
                <div className="flex items-center gap-1 mb-2 p-1 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] w-fit shadow-sm">
                  <button onClick={() => document.execCommand('bold')} className="p-1 hover:bg-[#E2E8F0] rounded transition-colors text-[#64748B] hover:text-[#334155]" type="button"><span className="material-symbols-outlined text-[16px]">format_bold</span></button>
                  <button onClick={() => document.execCommand('italic')} className="p-1 hover:bg-[#E2E8F0] rounded transition-colors text-[#64748B] hover:text-[#334155]" type="button"><span className="material-symbols-outlined text-[16px]">format_italic</span></button>
                  <div className="w-px h-4 bg-[#CBD5E1] mx-1"></div>
                  <button onClick={() => document.execCommand('insertUnorderedList')} className="p-1 hover:bg-[#E2E8F0] rounded transition-colors text-[#64748B] hover:text-[#334155]" type="button"><span className="material-symbols-outlined text-[16px]">format_list_bulleted</span></button>
                  <button onClick={() => document.execCommand('insertOrderedList')} className="p-1 hover:bg-[#E2E8F0] rounded transition-colors text-[#64748B] hover:text-[#334155]" type="button"><span className="material-symbols-outlined text-[16px]">format_list_numbered</span></button>
                </div>
                <div contentEditable="true" suppressContentEditableWarning className="w-full min-h-[120px] px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-medium text-[#0F172A] focus:border-[#28666E] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(40,102,110,0.1)] focus:bg-white outline-none transition-all duration-150">List key duties...</div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#475569] uppercase tracking-wider">Required Skills</label>
                <div className="flex flex-wrap gap-2">
                  {skills.map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-[#F1F5F9] border border-[#E2E8F0] rounded-full text-[11px] font-bold text-[#334155] flex items-center gap-1.5 shadow-sm">
                      {skill} 
                      <span onClick={() => handleRemoveSkill(skill)} className="material-symbols-outlined text-[14px] cursor-pointer text-[#94A3B8] hover:text-[#EF4444] transition-colors bg-white rounded-full">close</span>
                    </span>
                  ))}
                  <button type="button" onClick={handleAddSkill} className="px-3 py-1.5 bg-white border border-dashed border-[#CBD5E1] rounded-full text-[11px] font-bold text-[#64748B] flex items-center gap-1 hover:border-[#28666E] hover:text-[#28666E] hover:bg-[#F8FAFC] transition-all duration-150">
                    <span className="material-symbols-outlined text-[14px]">add</span> Add Skill
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-card border border-[#E2E8F0] hover:shadow-md hover:-translate-y-px transition-all duration-150">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-[#28666E] bg-[#28666E]/10 p-2 rounded-xl text-[20px]">checklist</span>
              <h2 className="text-lg font-bold text-[#0F172A]">Application Form Builder</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-xs font-bold text-[#475569] uppercase tracking-wider">Basic Requirements</p>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl cursor-default opacity-80 shadow-sm">
                    <span className="text-[13px] font-semibold text-[#0F172A]">Full Name</span>
                    <input defaultChecked disabled type="checkbox" className="w-5 h-5 rounded text-[#28666E] border-gray-300 focus:ring-[#28666E] focus:ring-offset-1 disabled:opacity-50"/>
                  </label>
                  <label className="flex items-center justify-between p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl cursor-default opacity-80 shadow-sm">
                    <span className="text-[13px] font-semibold text-[#0F172A]">Email Address</span>
                    <input defaultChecked disabled type="checkbox" className="w-5 h-5 rounded text-[#28666E] border-gray-300 focus:ring-[#28666E] focus:ring-offset-1 disabled:opacity-50"/>
                  </label>
                  <label className="flex items-center justify-between p-3.5 bg-white border border-[#E2E8F0] rounded-xl cursor-pointer hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all shadow-sm">
                    <span className="text-[13px] font-semibold text-[#0F172A]">Upload Resume (PDF)</span>
                    <input defaultChecked type="checkbox" className="w-5 h-5 rounded text-[#28666E] border-gray-300 focus:ring-[#28666E] focus:ring-offset-1"/>
                  </label>
                  <label className="flex items-center justify-between p-3.5 bg-white border border-[#E2E8F0] rounded-xl cursor-pointer hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all shadow-sm">
                    <span className="text-[13px] font-semibold text-[#0F172A]">LinkedIn Profile URL</span>
                    <input type="checkbox" className="w-5 h-5 rounded text-[#28666E] border-gray-300 focus:ring-[#28666E] focus:ring-offset-1"/>
                  </label>
                  <label className="flex items-center justify-between p-3.5 bg-white border border-[#E2E8F0] rounded-xl cursor-pointer hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all shadow-sm">
                    <span className="text-[13px] font-semibold text-[#0F172A]">GitHub Profile URL</span>
                    <input type="checkbox" className="w-5 h-5 rounded text-[#28666E] border-gray-300 focus:ring-[#28666E] focus:ring-offset-1"/>
                  </label>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-[#475569] uppercase tracking-wider">Custom Questions</p>
                  <button type="button" onClick={() => setIsAddingQuestion(true)} className="text-[#28666E] text-[11px] font-bold flex items-center gap-1.5 hover:underline bg-[#28666E]/5 px-2 py-1 rounded-md transition-all">
                    <span className="material-symbols-outlined text-[14px]">add_circle</span> Add Question
                  </button>
                </div>
                <div className="space-y-3">
                  {questions.map((q, idx) => (
                    <div key={q.id} className="p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-sm relative group hover:border-[#CBD5E1] transition-all">
                      <p className="text-[10px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider">Question {idx + 1}</p>
                      <p className="text-[13px] font-semibold text-[#0F172A] mb-4 pr-6 leading-snug">{q.text}</p>
                      <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-3 mt-1">
                        <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Short Answer</span>
                        <button type="button" onClick={() => setQuestions(questions.filter(x => x.id !== q.id))} className="text-[#94A3B8] hover:text-[#EF4444] transition-colors flex items-center justify-center bg-[#F8FAFC] w-6 h-6 rounded-md group-hover:bg-red-50 group-hover:text-red-500">
                          <span className="material-symbols-outlined text-[14px]">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                  {isAddingQuestion && (
                    <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col gap-2">
                       <input autoFocus type="text" value={newQuestion} onChange={e => setNewQuestion(e.target.value)} placeholder="Type question..." className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-[#28666E]"/>
                       <div className="flex justify-end gap-2 mt-2">
                         <button type="button" onClick={() => { setIsAddingQuestion(false); setNewQuestion(''); }} className="px-3 py-1 text-xs font-bold text-gray-500">Cancel</button>
                         <button type="button" onClick={() => { if(newQuestion.trim()){ setQuestions([...questions, { id: Date.now(), text: newQuestion.trim() }]); setNewQuestion(''); setIsAddingQuestion(false); } }} className="px-3 py-1 bg-[#28666E] text-white text-xs font-bold rounded-lg hover:bg-[#28666E]/90">Save</button>
                       </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-[#E2E8F0] pt-8">
              <div className="flex justify-between items-center mb-5">
                <p className="text-xs font-bold text-[#475569] uppercase tracking-wider">Application Stages</p>
                <button type="button" onClick={handleAddStage} className="px-3 py-1.5 bg-white border border-[#E2E8F0] text-[#0F172A] font-bold rounded-lg text-[11px] flex items-center gap-1.5 hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">add</span> Add Custom Stage
                </button>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {stages.map((stage, idx) => (
                  <label key={stage.id} 
                    draggable 
                    onDragStart={() => handleDragStart(idx)} 
                    onDragOver={(e) => handleDragOver(e, idx)} 
                    onDrop={handleDrop} 
                    className="cursor-pointer"
                  >
                    <input type="checkbox" className="peer hidden" checked={stage.checked} onChange={() => toggleStage(stage.id)} />
                    <div className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${stage.checked ? 'bg-[#F0FDF4] text-[#15803D] border border-[#22C55E]/30 scale-[1.02]' : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#CBD5E1]'}`}>
                      <span className="material-symbols-outlined text-[14px] align-middle mr-1 text-opacity-50 cursor-grab">drag_indicator</span>
                      {stage.name}
                    </div>
                  </label>
                ))}
              </div>
              <p className="text-[11px] font-medium text-[#94A3B8] mt-4 flex items-start gap-1.5 leading-tight"><span className="material-symbols-outlined text-[14px] text-[#CBD5E1]">info</span> *Stages defined here will dictate exactly how candidates progress internally through the ATS.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-card border border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-5 hover:shadow-md hover:-translate-y-px transition-all duration-150">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-[#10B981] bg-[#10B981]/10 p-2.5 rounded-xl text-[24px]">verified_user</span>
              <div>
                <h2 className="text-lg font-bold text-[#0F172A] leading-tight font-heading">Submit to Faculty for Review</h2>
                <p className="text-[#475569] text-xs font-medium mt-0.5">Send the prepared JD to the Professor for final sign-off.</p>
              </div>
            </div>
            <button onClick={handleSendApproval} className="px-8 py-3 bg-[#0F172A] text-white rounded-xl font-bold text-sm hover:bg-[#1E293B] hover:shadow-lg transition-all flex items-center gap-2 justify-center shrink-0 active:scale-[0.98]">
              <span className="material-symbols-outlined text-[18px]">send</span> Send to Professor
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
