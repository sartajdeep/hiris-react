import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/layout/Header'
import Breadcrumb from '../../components/layout/Breadcrumb'
import Footer from '../../components/layout/Footer'
import { submitApplication } from '../../api/client'

export default function ApplicationForm() {
  const navigate = useNavigate()
  const messagesEndRef = useRef(null)

  const programData = {
    roleTitle: "Join our community",
    roleDescription: "Complete your application for the 2024 Research Fellowship Program. Innovation starts here."
  }

  const [currentStep, setCurrentStep] = useState(1)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    degrees: [{ id: Date.now(), college: '', degree: '', major: '', year: '' }],
    linkedIn: '',
    github: '',
    motivation: '',
    termsAccepted: false
  })

  const [files, setFiles] = useState({
    resume: { name: '', file: null },
    cv: { name: '', file: null }
  })

  // Chat state
  const chatQuestions = [
    { id: 'skill', prompt: 'What is your strongest skill or area of expertise relevant to this role?' },
    { id: 'project', prompt: 'Tell us about a recent project or experience that best matches this position.' },
    { id: 'goal', prompt: 'What is one thing you hope to learn or achieve in this role?' },
  ]
  const [messages, setMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [chatAnswers, setChatAnswers] = useState({})
  const [chatCompleted, setChatCompleted] = useState(false)
  const [isAiChatStarted, setIsAiChatStarted] = useState(false)

  useEffect(() => {
    const resumeName = localStorage.getItem('hiris_resume_name')
    const cvName = localStorage.getItem('hiris_cv_name')
    if (resumeName) setFiles(f => ({ ...f, resume: { ...f.resume, name: resumeName } }))
    if (cvName) setFiles(f => ({ ...f, cv: { ...f.cv, name: cvName } }))
  }, [])

  useEffect(() => {
    if (currentStep === 3 && messages.length === 0 && !isAiChatStarted) {
      setIsAiChatStarted(true)
      setTimeout(() => {
        setMessages([{ speaker: 'assistant', text: chatQuestions[0].prompt }])
      }, 500)
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentStep, messages, isAiChatStarted])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleDegreeChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      degrees: prev.degrees.map(d => d.id === id ? { ...d, [field]: value } : d)
    }))
  }

  const addNewDegree = () => {
    setFormData(prev => ({
      ...prev,
      degrees: [...prev.degrees, { id: Date.now(), college: '', degree: '', major: '', year: '' }]
    }))
  }

  const handleFileUpload = (e, key) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0]
    if (file) {
      setFiles(f => ({ ...f, [key]: { name: file.name, file: file } }))
    }
  }

  const handleDrop = (e, key) => {
    e.preventDefault()
    handleFileUpload(e, key)
  }

  const goToStep = (step) => {
    setCurrentStep(step)
  }

  const handleChatSend = () => {
    const text = chatInput.trim()
    if (!text || chatCompleted) return

    setChatAnswers({ ...chatAnswers, [chatQuestions[currentQuestionIndex].id]: text })
    setMessages(prev => [...prev, { speaker: 'user', text }])
    setChatInput('')

    const nextIndex = currentQuestionIndex + 1
    setCurrentQuestionIndex(nextIndex)

    if (nextIndex < chatQuestions.length) {
      setTimeout(() => {
        setMessages(prev => [...prev, { speaker: 'assistant', text: chatQuestions[nextIndex].prompt }])
      }, 500)
    } else {
      setTimeout(() => {
        setMessages(prev => [...prev, { speaker: 'assistant', text: 'Thanks—everything is set. Please accept the terms and submit your application!' }])
        setChatCompleted(true)
      }, 500)
    }
  }

  const handleChatKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleChatSend()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.termsAccepted) {
      alert('Please accept the certification before continuing.')
      return
    }

    const fd = new FormData()
    fd.append('opening_id', 'GA-2026-001')
    fd.append('full_name', formData.name)
    fd.append('email', formData.email)
    fd.append('phone', '+1 (555) 000-0000') // form doesn't collect phone, using mock
    fd.append('linkedin_url', formData.linkedIn)
    fd.append('github_url', formData.github)
    fd.append('cover_note', chatAnswers['motivation'] || '')
    fd.append('education', JSON.stringify(formData.degrees))
    
    if (files.resume.file) fd.append('resume', files.resume.file)
    if (files.cv.file) fd.append('cv', files.cv.file)

    try {
      const res = await submitApplication(fd)
      sessionStorage.setItem('hiris_app_token', res.token)
      navigate('/thank-you-for-applying')
    } catch (err) {
      console.error(err)
      alert('Error submitting application')
    }
  }

  const isSubmitDisabled = !chatCompleted || !formData.termsAccepted

  return (
    <div className="bg-[#F8FAFC] text-[#0F172A] antialiased min-h-screen flex flex-col font-sans">
      <Header />
      <Breadcrumb items={[
        { label: 'Home', to: '/' },
        { label: 'Dashboard', to: '/' },
        { label: 'Active Openings', to: '/active-openings' },
        { label: 'Application Form' }
      ]} />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 w-full flex-1">
        <div className="mb-12">
          <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-5xl">{programData.roleTitle}</h2>
          <p className="mt-4 text-lg text-[#475569]">{programData.roleDescription}</p>
        </div>

        {/* Stepper UI */}
        <div className="mb-12 flex items-center justify-between">
          <div className="flex flex-col items-center relative z-10 w-12">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full font-bold text-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-colors duration-300 ${currentStep >= 1 ? 'bg-[#28666E] text-white' : 'bg-slate-200 text-[#475569]'}`}>1</div>
            <span className={`absolute top-14 mt-2 text-sm whitespace-nowrap transition-colors duration-300 ${currentStep >= 1 ? 'font-bold text-[#28666E]' : 'font-medium text-[#475569]'}`}>Upload Documents</span>
          </div>
          <div className="h-1 flex-1 bg-slate-200 mx-4 rounded relative z-0 -mt-8">
            <div className="h-1 bg-[#28666E] rounded transition-all duration-500" style={{ width: currentStep >= 2 ? '100%' : '0%' }}></div>
          </div>
          <div className="flex flex-col items-center relative z-10 w-12">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full font-bold text-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-colors duration-300 ${currentStep >= 2 ? 'bg-[#28666E] text-white' : 'bg-slate-200 text-[#475569]'}`}>2</div>
            <span className={`absolute top-14 mt-2 text-sm text-center whitespace-nowrap transition-colors duration-300 ${currentStep >= 2 ? 'font-bold text-[#28666E]' : 'font-medium text-[#475569]'}`}>Candidate Details</span>
          </div>
          <div className="h-1 flex-1 bg-slate-200 mx-4 rounded relative z-0 -mt-8">
            <div className="h-1 bg-[#28666E] rounded transition-all duration-500" style={{ width: currentStep >= 3 ? '100%' : '0%' }}></div>
          </div>
          <div className="flex flex-col items-center relative z-10 w-12">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full font-bold text-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-colors duration-300 ${currentStep >= 3 ? 'bg-[#28666E] text-white' : 'bg-slate-200 text-[#475569]'}`}>3</div>
            <span className={`absolute top-14 mt-2 text-sm whitespace-nowrap transition-colors duration-300 ${currentStep >= 3 ? 'font-bold text-[#28666E]' : 'font-medium text-[#475569]'}`}>AI Chat</span>
          </div>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          
          {/* STEP 1: Documents */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <section className="rounded-xl bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] ring-1 ring-[#28666E]/20 transition-all duration-150 sm:p-5">
                <div className="mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#28666E]">description</span>
                  <h3 className="text-xl font-bold text-[#0F172A]">Documents</h3>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#334155]">Resume (PDF) <span className="text-[#28666E] text-xs">*Required</span></label>
                    <div 
                      className="relative flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#28666E]/20 bg-[#28666E]/5 hover:bg-[#28666E]/10 transition-colors"
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => handleDrop(e, 'resume')}
                    >
                      <span className="material-symbols-outlined text-[#28666E] text-2xl font-bold">{files.resume.name ? 'check_circle' : 'upload_file'}</span>
                      <p className={`mt-2 text-sm ${files.resume.name ? 'text-[#28666E] font-bold' : 'text-[#475569]'}`}>
                        {files.resume.name ? `Selected: ${files.resume.name}` : 'Click to upload or drag and drop'}
                      </p>
                      <input type="file" accept=".pdf" onChange={e => handleFileUpload(e, 'resume')} className="absolute inset-0 cursor-pointer opacity-0" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#334155]">CV (PDF) <span className="text-[#28666E] text-xs">*Required</span></label>
                    <div 
                      className="relative flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#28666E]/20 bg-[#28666E]/5 hover:bg-[#28666E]/10 transition-colors"
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => handleDrop(e, 'cv')}
                    >
                      <span className="material-symbols-outlined text-[#28666E] text-2xl font-bold">{files.cv.name ? 'check_circle' : 'upload_file'}</span>
                      <p className={`mt-2 text-sm ${files.cv.name ? 'text-[#28666E] font-bold' : 'text-[#475569]'}`}>
                        {files.cv.name ? `Selected: ${files.cv.name}` : 'Click to upload or drag and drop'}
                      </p>
                      <input type="file" accept=".pdf" onChange={e => handleFileUpload(e, 'cv')} className="absolute inset-0 cursor-pointer opacity-0" />
                    </div>
                  </div>
                </div>
              </section>
              
              <div className="flex justify-end gap-4 rounded-xl border border-[#28666E]/20 bg-[#28666E]/5 p-5">
                <button type="button" onClick={() => goToStep(2)} className="rounded-xl bg-[#28666E] px-8 py-3 font-bold text-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:bg-[#28666E]/90 transition-all">
                  Next
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Details & Questions */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <section className="rounded-xl bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] ring-1 ring-[#28666E]/20 transition-all duration-150 sm:p-5">
                <div className="mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#28666E]">person</span>
                  <h3 className="text-xl font-bold text-[#0F172A]">Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#334155]">Full Name</label>
                    <input type="text" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full rounded-lg border-[#E2E8F0] bg-[#F8FAFC] p-3 text-[#0F172A] focus:border-[#28666E] focus:ring-[#28666E]/20 transition-all duration-150" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#334155]">Email Address</label>
                    <input type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="w-full rounded-lg border-[#E2E8F0] bg-[#F8FAFC] p-3 text-[#0F172A] focus:border-[#28666E] focus:ring-[#28666E]/20 transition-all duration-150" placeholder="john@example.com" required />
                  </div>
                </div>
              </section>

              <section className="rounded-xl bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] ring-1 ring-[#28666E]/20 transition-all duration-150 sm:p-5">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#28666E]">school</span>
                    <h3 className="text-xl font-bold text-[#0F172A]">Academic Background</h3>
                  </div>
                  <button type="button" onClick={addNewDegree} className="flex items-center gap-1 text-xs font-bold text-[#28666E] uppercase tracking-wider hover:opacity-80 transition-opacity">
                    <span className="material-symbols-outlined text-sm">add_circle</span> Add another degree
                  </button>
                </div>
                <div className="space-y-8">
                  {formData.degrees.map((degree) => (
                    <div key={degree.id} className="degree-entry grid grid-cols-1 gap-5 sm:grid-cols-2 pb-6 border-b border-[#E2E8F0] last:border-0 last:pb-0 pt-0 mt-0 first:pt-0 border-t-0 border-slate-100 p-[unset]">
                      <div className="sm:col-span-2 space-y-2">
                        <label className="text-sm font-semibold text-[#334155]">University / College</label>
                        <input type="text" value={degree.college} onChange={e => handleDegreeChange(degree.id, 'college', e.target.value)} className="w-full rounded-lg border-[#E2E8F0] bg-[#F8FAFC] p-3 text-[#0F172A] focus:border-[#28666E] focus:ring-[#28666E]/20 transition-all duration-150" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#334155]">Degree</label>
                        <input type="text" value={degree.degree} onChange={e => handleDegreeChange(degree.id, 'degree', e.target.value)} className="w-full rounded-lg border-[#E2E8F0] bg-[#F8FAFC] p-3 text-[#0F172A] focus:border-[#28666E] focus:ring-[#28666E]/20 transition-all duration-150" placeholder="e.g. Bachelor of Technology" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#334155]">Major / Program</label>
                        <input type="text" value={degree.major} onChange={e => handleDegreeChange(degree.id, 'major', e.target.value)} className="w-full rounded-lg border-[#E2E8F0] bg-[#F8FAFC] p-3 text-[#0F172A] focus:border-[#28666E] focus:ring-[#28666E]/20 transition-all duration-150" placeholder="Computer Science" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#334155]">Year of Completion</label>
                        <input type="number" value={degree.year} onChange={e => handleDegreeChange(degree.id, 'year', e.target.value)} className="w-full rounded-lg border-[#E2E8F0] bg-[#F8FAFC] p-3 text-[#0F172A] focus:border-[#28666E] focus:ring-[#28666E]/20 transition-all duration-150" placeholder="2024" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-xl bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] ring-1 ring-[#28666E]/20 transition-all duration-150 sm:p-5">
                <div className="mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#28666E]">link</span>
                  <h3 className="text-xl font-bold text-[#0F172A]">Professional Links</h3>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#334155]">LinkedIn</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-3 text-[#94A3B8] text-lg">link</span>
                      <input type="url" value={formData.linkedIn} onChange={e => handleInputChange('linkedIn', e.target.value)} className="w-full rounded-lg border-[#E2E8F0] bg-[#F8FAFC] py-3 pl-10 pr-3 text-[#0F172A] focus:border-[#28666E] focus:ring-[#28666E]/20 transition-all duration-150" placeholder="linkedin.com/in/username" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#334155]">GitHub</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-3 text-[#94A3B8] text-lg">code</span>
                      <input type="url" value={formData.github} onChange={e => handleInputChange('github', e.target.value)} className="w-full rounded-lg border-[#E2E8F0] bg-[#F8FAFC] py-3 pl-10 pr-3 text-[#0F172A] focus:border-[#28666E] focus:ring-[#28666E]/20 transition-all duration-150" placeholder="github.com/username" />
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-xl bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] ring-1 ring-[#28666E]/20 transition-all duration-150 sm:p-5">
                <div className="mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#28666E]">quiz</span>
                  <h3 className="text-xl font-bold text-[#0F172A]">Additional Questions</h3>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#334155]">Why are you interested in AI Ethics research?</label>
                    <textarea rows="4" value={formData.motivation} onChange={e => handleInputChange('motivation', e.target.value)} className="w-full rounded-lg border-[#E2E8F0] bg-[#F8FAFC] p-3 text-[#0F172A] focus:border-[#28666E] focus:ring-[#28666E]/20 transition-all duration-150" placeholder="Share your perspective..."></textarea>
                  </div>
                </div>
              </section>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 rounded-xl border border-[#28666E]/20 bg-[#28666E]/5 p-5">
                <button type="button" onClick={() => goToStep(1)} className="w-full sm:w-auto rounded-xl bg-slate-200 px-8 py-3 font-bold text-[#334155] hover:bg-slate-300 transition-all">
                  Back
                </button>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <span className="text-sm text-[#475569] italic text-center">AI has extracted details from your resume. Review and proceed.</span>
                  <button type="button" onClick={() => goToStep(3)} className="w-full sm:w-auto rounded-xl bg-[#28666E] px-8 py-3 font-bold text-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:bg-[#28666E]/90 transition-all">
                    Proceed
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: AI Chat */}
          {currentStep === 3 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <section className="rounded-xl bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] ring-1 ring-[#28666E]/20 transition-all duration-150 sm:p-5">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#28666E]">smart_toy</span>
                    <h3 className="text-xl font-bold text-[#0F172A]">AI Assistant Chat</h3>
                  </div>
                </div>
                <div className="text-center mb-6">
                  <p className="text-sm text-[#475569]">Answer a few custom questions based on your resume and the role requirements.</p>
                </div>

                <div className="flex flex-col h-[400px] overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {messages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.speaker === 'user' ? 'bg-[#28666E] text-white' : 'bg-slate-100 text-slate-900'}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="border-t border-[#E2E8F0] px-4 py-4 bg-white">
                    <div className="flex items-start gap-3">
                      <textarea 
                        rows="2" 
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        onKeyDown={handleChatKeyDown}
                        className="flex-1 resize-none rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] focus:ring-[#28666E]/20 transition-all duration-150 focus:border-[#28666E] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-px" 
                        placeholder="Type your response... (Press Enter to send)"
                      ></textarea>
                      <button 
                        type="button" 
                        onClick={handleChatSend} 
                        className="inline-flex items-center justify-center rounded-xl bg-[#28666E] px-5 py-3 text-sm font-semibold text-white hover:bg-[#28666E]/90 transition"
                      >
                        <span className="material-symbols-outlined text-white">send</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-[#28666E]/20 bg-[#28666E]/5 p-5 sm:flex-row">
                <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
                  <button type="button" onClick={() => goToStep(2)} className="w-full sm:w-auto rounded-xl bg-slate-200 px-8 py-3 font-bold text-[#334155] hover:bg-slate-300 transition-all">
                    Back
                  </button>
                  <div className="flex items-start gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                    <input type="checkbox" id="terms" checked={formData.termsAccepted} onChange={e => handleInputChange('termsAccepted', e.target.checked)} className="mt-1 rounded border-[#CBD5E1] text-[#28666E] focus:ring-[#28666E]/20 transition-all duration-150" required />
                    <label htmlFor="terms" className="text-sm text-[#475569]">I certify that the information provided is accurate and complete.</label>
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitDisabled}
                  className="w-full shrink-0 rounded-xl bg-[#28666E] px-8 py-4 text-center text-lg font-bold text-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:bg-[#28666E]/90 transition-all sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Application
                </button>
              </div>
            </div>
          )}
        </form>
      </main>
      <Footer />
    </div>
  )
}
