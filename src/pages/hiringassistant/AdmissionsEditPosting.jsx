import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../../components/layout/Header'
import Breadcrumb from '../../components/layout/Breadcrumb'
import Footer from '../../components/layout/Footer'

export default function AdmissionsEditPosting() {
  const navigate = useNavigate()

  const [skills, setSkills] = useState(['Python', 'NLP', 'PyTorch'])

  const handleAddSkill = () => {
    const skillName = window.prompt("Enter a skill to add:")
    if (skillName && skillName.trim() !== "") {
      setSkills([...skills, skillName.trim()])
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove))
  }

  const handleSave = () => {
    navigate('/admissions')
  }

  return (
    <div className="bg-[#F8FAFC] text-[#0F172A] antialiased min-h-screen flex flex-col font-sans">
      <Header />
      <Breadcrumb items={[
        { label: 'Home', to: '/' },
        { label: 'Dashboard', to: '/' },
        { label: 'Admissions', to: '/admissions' },
        { label: 'Edit Posting' }
      ]} />

      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-5 w-full">
        <section className="w-full space-y-8 pb-20 lg:w-full">
          {/* Card 1: Requisition Information Overview */}
          <div className="bg-white rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-[#E2E8F0] overflow-hidden relative hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-px transition-all duration-150">
            <div className="absolute top-0 right-0 p-4">
              <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">New Request</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-[#94A3B8] font-medium">Requested by:</span>
                    <span className="font-semibold">Prof. Arpan Kar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#94A3B8] font-medium">Dept:</span>
                    <span className="font-semibold">Computer Science</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#94A3B8] font-medium">Type:</span>
                    <span className="font-semibold px-2 py-0.5 bg-[#F1F5F9] rounded text-xs uppercase tracking-wider">Internship</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#94A3B8] font-medium">Positions:</span>
                    <span className="font-semibold">2</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#94A3B8] font-medium">Start Date:</span>
                    <span className="font-semibold text-[#28666E]">Sept 1, 2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#94A3B8] font-medium">Deadline:</span>
                    <span className="font-semibold text-red-500">Aug 15, 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Job Description Builder */}
          <div className="bg-white rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-[#E2E8F0] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-px transition-all duration-150">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#28666E] bg-[#28666E]/10 p-2 rounded-xl">description</span>
                <h2 className="text-xl font-bold">Job Description Builder</h2>
              </div>
            </div>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#334155]">Job Title</label>
                  <input className="w-full px-4 py-3 bg-[#F8FAFC] border-[#E2E8F0] rounded-xl text-sm focus:ring-[#28666E]/20 transition-all duration-150" type="text" defaultValue="Graduate Research Intern - AI & Ethics" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#334155]">Department</label>
                  <select className="w-full px-4 py-3 bg-[#F8FAFC] border-[#E2E8F0] rounded-xl text-sm focus:ring-[#28666E]/20 transition-all duration-150" defaultValue="CS-01">
                    <option value="CS-01">Computer Science</option>
                    <option value="DS-02">Data Science</option>
                    <option value="LA-03">Liberal Arts</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#334155]">Location</label>
                <div className="flex flex-wrap gap-3">
                  <label className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-[#28666E]/10 border-2 border-[#28666E] rounded-xl text-[#28666E] text-sm font-bold">
                    <input defaultChecked className="hidden" name="loc" type="radio" />
                    <span className="material-symbols-outlined text-lg">apartment</span> On-campus
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-[#F8FAFC] border-2 border-transparent rounded-xl text-[#475569] text-sm font-bold hover:border-[#E2E8F0]">
                    <input className="hidden" name="loc" type="radio" />
                    <span className="material-symbols-outlined text-lg">public</span> Remote
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-[#F8FAFC] border-2 border-transparent rounded-xl text-[#475569] text-sm font-bold hover:border-[#E2E8F0]">
                    <input className="hidden" name="loc" type="radio" />
                    <span className="material-symbols-outlined text-lg">diversity_3</span> Hybrid
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#334155]">Summary</label>
                <div className="flex items-center gap-1 mb-2 p-1 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] w-fit">
                  <button className="p-1.5 hover:bg-slate-200 rounded transition-colors text-[#475569]" type="button">
                    <span className="material-symbols-outlined text-lg">format_bold</span>
                  </button>
                  <button className="p-1.5 hover:bg-slate-200 rounded transition-colors text-[#475569]" type="button">
                    <span className="material-symbols-outlined text-lg">format_italic</span>
                  </button>
                  <div className="w-px h-4 bg-slate-200 mx-1"></div>
                  <button className="p-1.5 hover:bg-slate-200 rounded transition-colors text-[#475569]" type="button">
                    <span className="material-symbols-outlined text-lg">format_list_bulleted</span>
                  </button>
                  <button className="p-1.5 hover:bg-slate-200 rounded transition-colors text-[#475569]" type="button">
                    <span className="material-symbols-outlined text-lg">format_list_numbered</span>
                  </button>
                </div>
                <textarea className="w-full px-4 py-3 bg-[#F8FAFC] border-[#E2E8F0] rounded-xl text-sm focus:ring-[#28666E]/20 transition-all duration-150" placeholder="Brief overview of the role..." rows="3"></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#334155]">Responsibilities</label>
                <div className="flex items-center gap-1 mb-2 p-1 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] w-fit">
                  <button className="p-1.5 hover:bg-slate-200 rounded transition-colors text-[#475569]" type="button">
                    <span className="material-symbols-outlined text-lg">format_bold</span>
                  </button>
                  <button className="p-1.5 hover:bg-slate-200 rounded transition-colors text-[#475569]" type="button">
                    <span className="material-symbols-outlined text-lg">format_italic</span>
                  </button>
                  <div className="w-px h-4 bg-slate-200 mx-1"></div>
                  <button className="p-1.5 hover:bg-slate-200 rounded transition-colors text-[#475569]" type="button">
                    <span className="material-symbols-outlined text-lg">format_list_bulleted</span>
                  </button>
                  <button className="p-1.5 hover:bg-slate-200 rounded transition-colors text-[#475569]" type="button">
                    <span className="material-symbols-outlined text-lg">format_list_numbered</span>
                  </button>
                </div>
                <textarea className="w-full px-4 py-3 bg-[#F8FAFC] border-[#E2E8F0] rounded-xl text-sm focus:ring-[#28666E]/20 transition-all duration-150" placeholder="List key duties..." rows="5"></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#334155]">Required Skills</label>
                <div className="flex flex-wrap gap-2">
                  {skills.map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-[#F1F5F9] rounded-full text-xs font-medium flex items-center gap-2">
                      {skill} 
                      <span className="material-symbols-outlined text-xs cursor-pointer" onClick={() => handleRemoveSkill(skill)}>close</span>
                    </span>
                  ))}
                  <button type="button" onClick={handleAddSkill} className="px-3 py-1.5 border-2 border-dashed border-[#CBD5E1] rounded-full text-xs font-medium text-[#94A3B8] flex items-center gap-1 hover:border-[#28666E] hover:text-[#28666E] transition-all">
                    <span className="material-symbols-outlined text-xs">add</span> Add Skill
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Card 3: Application Form Builder */}
          <div className="bg-white rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-[#E2E8F0] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-px transition-all duration-150">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-[#28666E] bg-[#28666E]/10 p-2 rounded-xl">checklist</span>
              <h2 className="text-xl font-bold">Application Form Builder</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-4">
                <p className="text-sm font-bold text-[#334155]">Basic Requirements</p>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-xl cursor-default">
                    <span className="text-sm font-medium border-transparent">Full Name</span>
                    <input defaultChecked disabled type="checkbox" className="rounded text-[#28666E] focus:ring-[#28666E]/20 transition-all duration-150" />
                  </label>
                  <label className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-xl cursor-default">
                    <span className="text-sm font-medium border-transparent">Email Address</span>
                    <input defaultChecked disabled type="checkbox" className="rounded text-[#28666E] focus:ring-[#28666E]/20 transition-all duration-150" />
                  </label>
                  <label className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-xl cursor-pointer">
                    <span className="text-sm font-medium border-transparent">Upload Resume (PDF)</span>
                    <input defaultChecked type="checkbox" className="rounded text-[#28666E] border-[#CBD5E1] focus:ring-[#28666E]/20 transition-all duration-150" />
                  </label>
                  <label className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-xl cursor-pointer">
                    <span className="text-sm font-medium border-transparent">LinkedIn Profile URL</span>
                    <input type="checkbox" className="rounded text-[#28666E] border-[#CBD5E1] focus:ring-[#28666E]/20 transition-all duration-150" />
                  </label>
                  <label className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-xl cursor-pointer">
                    <span className="text-sm font-medium border-transparent">GitHub Profile URL</span>
                    <input type="checkbox" className="rounded text-[#28666E] border-[#CBD5E1] focus:ring-[#28666E]/20 transition-all duration-150" />
                  </label>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-[#334155]">Custom Questions</p>
                  <button className="text-[#28666E] text-xs font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">add_circle</span> Add Question
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                    <p className="text-xs text-[#94A3B8] mb-1 border-transparent">Question 1</p>
                    <p className="text-sm font-medium mb-3 border-transparent">Why are you interested in AI Ethics research?</p>
                    <div className="flex items-center justify-between text-xs font-bold text-[#94A3B8]">
                      <span className="uppercase tracking-wider">Short Answer</span>
                      <button type="button" className="text-red-500 material-symbols-outlined text-sm">delete</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="button" onClick={handleSave} className="px-8 py-3 bg-[#28666E] text-white font-bold rounded-xl hover:bg-[#28666E]/90 transition-colors shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              Save Changes
            </button>
          </div>

        </section>
      </main>

      <Footer />
    </div>
  )
}
