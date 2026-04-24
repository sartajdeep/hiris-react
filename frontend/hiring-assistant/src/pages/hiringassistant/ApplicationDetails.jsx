import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ApplicationDetails() {
  const navigate = useNavigate()
  
  const programData = {
    roleTitle: "Join our community",
    roleDescription: "Complete your application for the 2024 Research Fellowship Program. Innovation starts here."
  }

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
    resume: { name: '', data: null },
    cv: { name: '', data: null }
  })

  useEffect(() => {
    const resumeName = localStorage.getItem('hiris_resume_name')
    const cvName = localStorage.getItem('hiris_cv_name')
    if (resumeName) setFiles(f => ({ ...f, resume: { ...f.resume, name: resumeName } }))
    if (cvName) setFiles(f => ({ ...f, cv: { ...f.cv, name: cvName } }))
  }, [])

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
      const fileName = file.name
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          localStorage.setItem(`hiris_${key}_file`, event.target.result)
          localStorage.setItem(`hiris_${key}_name`, fileName)
          setFiles(f => ({ ...f, [key]: { name: fileName, data: event.target.result } }))
        } catch (err) {
          console.warn('Unable to store file in localStorage:', err)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e, key) => {
    e.preventDefault()
    handleFileUpload(e, key)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.termsAccepted) {
      alert('Please accept the certification before continuing.')
      return
    }

    const dataToSave = {
      roleTitle: programData.roleTitle,
      roleDescription: programData.roleDescription,
      name: formData.name,
      email: formData.email,
      degrees: formData.degrees.map(({ college, degree, major, year }) => ({ college, degree, major, year })),
      resumeName: localStorage.getItem('hiris_resume_name') || null,
      cvName: localStorage.getItem('hiris_cv_name') || null,
      timestamp: new Date().toISOString()
    }

    localStorage.setItem('hiris_application_data', JSON.stringify(dataToSave))
    navigate('/ai-chat')
  }

  return (
    <div className="bg-[color:var(--bg)] text-[color:var(--text-primary)] antialiased min-h-screen flex flex-col font-sans">
      
      

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 w-full flex-1">
        <div className="mb-12">
          <h2 className="text-2xl font-extrabold tracking-tight text-[color:var(--text-primary)] sm:text-5xl">{programData.roleTitle}</h2>
          <p className="mt-4 text-lg text-[color:var(--text-secondary)]">{programData.roleDescription}</p>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          
          <section className="rounded-xl bg-[color:var(--surface)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] ring-1 ring-[#28666E]/20 transition-all duration-150 sm:p-5">
            <div className="mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#28666E]">person</span>
              <h3 className="text-xl font-bold text-[color:var(--text-primary)]">1. Personal Information</h3>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[color:var(--text-secondary)]">Full Name</label>
                <input required type="text" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full rounded-lg border-[color:var(--border)] bg-[color:var(--bg)] p-3 text-[color:var(--text-primary)] focus:border-[#28666E] focus:ring-[#28666E]/20 transition-all duration-150" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[color:var(--text-secondary)]">Email Address</label>
                <input required type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="w-full rounded-lg border-[color:var(--border)] bg-[color:var(--bg)] p-3 text-[color:var(--text-primary)] focus:border-[#28666E] focus:ring-[#28666E]/20 transition-all duration-150" placeholder="john@example.com" />
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-[color:var(--surface)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] ring-1 ring-[#28666E]/20 transition-all duration-150 sm:p-5">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#28666E]">school</span>
                <h3 className="text-xl font-bold text-[color:var(--text-primary)]">2. Academic Background</h3>
              </div>
              <button type="button" onClick={addNewDegree} className="flex items-center gap-1 text-xs font-bold text-[#28666E] uppercase tracking-wider hover:opacity-80 transition-opacity">
                <span className="material-symbols-outlined text-sm">add_circle</span> Add another degree
              </button>
            </div>
            <div className="space-y-8">
              {formData.degrees.map((degree, index) => (
                <div key={degree.id} className="degree-entry grid grid-cols-1 gap-5 sm:grid-cols-2 pb-6 border-b border-[color:var(--border)] last:border-0 last:pb-0 pt-0 mt-0 first:pt-0 border-t-0 p-[unset] border-slate-100">
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-[color:var(--text-secondary)]">University / College</label>
                    <input type="text" value={degree.college} onChange={e => handleDegreeChange(degree.id, 'college', e.target.value)} className="w-full rounded-lg border-[color:var(--border)] bg-[color:var(--bg)] p-3 text-[color:var(--text-primary)] focus:border-[#28666E] focus:ring-[#28666E]/20 transition-all duration-150" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[color:var(--text-secondary)]">Degree</label>
                    <input type="text" value={degree.degree} onChange={e => handleDegreeChange(degree.id, 'degree', e.target.value)} className="w-full rounded-lg border-[color:var(--border)] bg-[color:var(--bg)] p-3 text-[color:var(--text-primary)] focus:border-[#28666E] focus:ring-[#28666E]/20 transition-all duration-150" placeholder="e.g. Bachelor of Technology" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[color:var(--text-secondary)]">Major / Program</label>
                    <input type="text" value={degree.major} onChange={e => handleDegreeChange(degree.id, 'major', e.target.value)} className="w-full rounded-lg border-[color:var(--border)] bg-[color:var(--bg)] p-3 text-[color:var(--text-primary)] focus:border-[#28666E] focus:ring-[#28666E]/20 transition-all duration-150" placeholder="Computer Science" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[color:var(--text-secondary)]">Year of Completion</label>
                    <input type="number" value={degree.year} onChange={e => handleDegreeChange(degree.id, 'year', e.target.value)} className="w-full rounded-lg border-[color:var(--border)] bg-[color:var(--bg)] p-3 text-[color:var(--text-primary)] focus:border-[#28666E] focus:ring-[#28666E]/20 transition-all duration-150" placeholder="2024" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl bg-[color:var(--surface)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] ring-1 ring-[#28666E]/20 transition-all duration-150 sm:p-5">
            <div className="mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#28666E]">description</span>
              <h3 className="text-xl font-bold text-[color:var(--text-primary)]">3. Documents</h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[color:var(--text-secondary)]">Resume (PDF) <span className="text-[#28666E] text-xs">*Required</span></label>
                <div 
                  className="relative flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#28666E]/20 bg-[#28666E]/5 hover:bg-[#28666E]/10 transition-colors"
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => handleDrop(e, 'resume')}
                >
                  <span className="material-symbols-outlined text-[#28666E] text-2xl font-bold">{files.resume.name ? 'check_circle' : 'upload_file'}</span>
                  <p className={`mt-2 text-sm ${files.resume.name ? 'text-[#28666E] font-bold' : 'text-[color:var(--text-secondary)]'}`}>
                    {files.resume.name ? `Selected: ${files.resume.name}` : 'Click to upload or drag and drop'}
                  </p>
                  <input required={!files.resume.name} type="file" accept=".pdf" onChange={e => handleFileUpload(e, 'resume')} className="absolute inset-0 cursor-pointer opacity-0" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[color:var(--text-secondary)]">CV (PDF) <span className="text-[#28666E] text-xs">*Required</span></label>
                <div 
                  className="relative flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#28666E]/20 bg-[#28666E]/5 hover:bg-[#28666E]/10 transition-colors"
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => handleDrop(e, 'cv')}
                >
                  <span className="material-symbols-outlined text-[#28666E] text-2xl font-bold">{files.cv.name ? 'check_circle' : 'upload_file'}</span>
                  <p className={`mt-2 text-sm ${files.cv.name ? 'text-[#28666E] font-bold' : 'text-[color:var(--text-secondary)]'}`}>
                    {files.cv.name ? `Selected: ${files.cv.name}` : 'Click to upload or drag and drop'}
                  </p>
                  <input required={!files.cv.name} type="file" accept=".pdf" onChange={e => handleFileUpload(e, 'cv')} className="absolute inset-0 cursor-pointer opacity-0" />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-[color:var(--surface)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] ring-1 ring-[#28666E]/20 transition-all duration-150 sm:p-5">
            <div className="mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#28666E]">link</span>
              <h3 className="text-xl font-bold text-[color:var(--text-primary)]">4. Professional Links</h3>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[color:var(--text-secondary)]">LinkedIn</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-[color:var(--text-muted)] text-lg">link</span>
                  <input type="url" value={formData.linkedIn} onChange={e => handleInputChange('linkedIn', e.target.value)} className="w-full rounded-lg border-[color:var(--border)] bg-[color:var(--bg)] py-3 pl-10 pr-3 text-[color:var(--text-primary)] focus:border-[#28666E] focus:ring-[#28666E]/20 transition-all duration-150" placeholder="linkedin.com/in/username" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[color:var(--text-secondary)]">GitHub</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-[color:var(--text-muted)] text-lg">code</span>
                  <input type="url" value={formData.github} onChange={e => handleInputChange('github', e.target.value)} className="w-full rounded-lg border-[color:var(--border)] bg-[color:var(--bg)] py-3 pl-10 pr-3 text-[color:var(--text-primary)] focus:border-[#28666E] focus:ring-[#28666E]/20 transition-all duration-150" placeholder="github.com/username" />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-[color:var(--surface)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] ring-1 ring-[#28666E]/20 transition-all duration-150 sm:p-5">
            <div className="mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#28666E]">quiz</span>
              <h3 className="text-xl font-bold text-[color:var(--text-primary)]">5. Additional Questions</h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[color:var(--text-secondary)]">Why are you interested in AI Ethics research?</label>
                <textarea rows="4" value={formData.motivation} onChange={e => handleInputChange('motivation', e.target.value)} className="w-full rounded-lg border-[color:var(--border)] bg-[color:var(--bg)] p-3 text-[color:var(--text-primary)] focus:border-[#28666E] focus:ring-[#28666E]/20 transition-all duration-150" placeholder="Share your perspective..."></textarea>
              </div>
            </div>
          </section>

          <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-[#28666E]/20 bg-[#28666E]/5 p-5 sm:flex-row">
            <div className="flex items-start gap-3">
              <input type="checkbox" id="terms" checked={formData.termsAccepted} onChange={e => handleInputChange('termsAccepted', e.target.checked)} className="mt-1 rounded border-[color:var(--border)] text-[#28666E] focus:ring-[#28666E]/20 transition-all duration-150" />
              <label htmlFor="terms" className="text-sm text-[color:var(--text-secondary)]">I certify that the information provided is accurate and complete.</label>
            </div>
            <button type="submit" className="w-full shrink-0 rounded-xl bg-[#28666E] px-8 py-4 text-center text-lg font-bold text-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] shadow-[#28666E]/20 hover:bg-[#28666E]/90 transition-all sm:w-auto">
              Next
            </button>
          </div>
        </form>
      </main>
      
    </div>
  )
}
