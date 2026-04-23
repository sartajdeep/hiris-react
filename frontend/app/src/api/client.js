const BASE = 'http://localhost:3001/api'

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options)
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
  return res.json()
}

// Dashboard
export const getDashboardStats  = () => req('/dashboard/stats')

// Hiring Requests
export const getHiringRequests  = (params = {}) => req('/hiring-requests?' + new URLSearchParams(params))
export const updateRequestStatus = (id, status) => req(`/hiring-requests/${id}/status`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({status}) })
export const createHiringRequest = (data) => req('/hiring-requests', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) })

// Tasks
export const getTasks    = ()           => req('/tasks')
export const createTask  = (data)       => req('/tasks', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) })
export const completeTask = (id)        => req(`/tasks/${id}/complete`, { method:'PATCH' })
export const deleteTask  = (id)         => req(`/tasks/${id}`, { method:'DELETE' })

// Agenda
export const getAgenda   = (date)       => req(`/agenda?date=${date || new Date().toISOString().split('T')[0]}`)

// Active Openings
export const getActiveOpenings  = (params = {}) => req('/active-openings?' + new URLSearchParams(params))
export const closeOpening       = (id)           => req(`/active-openings/${id}/close`, { method:'PATCH' })

// Candidates
export const getCandidates       = (params = {}) => req('/candidates?' + new URLSearchParams(params))
export const getCandidate        = (id)           => req(`/candidates/${id}`)
export const updateCandidateStatus = (id, status) => req(`/candidates/${id}/status`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({status}) })

// Admissions
export const getAdmissions      = (opening_id)   => req(`/admissions?opening_id=${opening_id}`)
export const getAdmissionsStats = (opening_id)   => req(`/admissions/stats?opening_id=${opening_id}`)
export const updateAdmissionStage = (id, stage)  => req(`/admissions/${id}/stage`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({stage}) })

// Applications (public)
export const submitApplication  = (formData)     => fetch(`${BASE}/applications`, { method:'POST', body: formData }).then(r => r.json())
export const getApplicationByToken = (token)     => req(`/applications/token/${token}`)

// Departments
export const getDepartments     = ()             => req('/departments')
export const addDepartment      = (data)         => req('/departments', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) })

// CHRO-specific
export const getChroKpis          = () => req('/chro/kpis')
export const getChroApprovals     = () => req('/chro/approvals')
export const getDeptPipeline      = () => req('/chro/department_pipeline')

export const api = {
  get:   (path)         => req(path),
  post:  (path, body)   => req(path, { method: 'POST',  headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  patch: (path, body)   => req(path, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  del:   (path)         => req(path, { method: 'DELETE' }),
}

// ── AI Endpoints ─────────────────────────────────────────────────────────────
const AI_BASE = 'http://localhost:3001/api/ai'

async function aiReq(path, body) {
  const res = await fetch(`${AI_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`AI API error ${res.status}`)
  return res.json()
}

export const generateJobDescription   = (data)   => aiReq('/generate-jd', data)
export const sendAiChatMessage        = (data)   => aiReq('/chat-response', data)
export const completeAiChat           = ()        => aiReq('/complete-chat', {})
export const getInterviewSuggestion   = (data)   => aiReq('/interview-suggestion', data)
export const generateCandidateSummary = (data)   => aiReq('/candidate-summary', data)

// ── Organisations ─────────────────────────────────────────────────────────────
export const registerOrganisation = (org, users) =>
  req('/organisations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ org, users }) })


