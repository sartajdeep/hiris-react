const BASE = 'http://localhost:3001/api'

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options)
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
  return res.json()
}

export const api = {
  get:   (path)         => req(path),
  post:  (path, body)   => req(path, { method: 'POST',  headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  patch: (path, body)   => req(path, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  del:   (path)         => req(path, { method: 'DELETE' }),
}

// Candidates
export const getCandidates        = (params = {}) => req('/candidates?' + new URLSearchParams(params))
export const getCandidate         = (id)           => req(`/candidates/${id}`)
export const updateCandidateStatus = (id, status) => req(`/candidates/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })

// Hiring requests
export const getHiringRequests    = (params = {}) => req('/hiring-requests?' + new URLSearchParams(params))
export const updateRequestStatus  = (id, status)  => req(`/hiring-requests/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })

// CHRO-specific
export const getChroKpis          = () => req('/chro/kpis')
export const getChroApprovals     = () => req('/chro/approvals')
export const getDeptPipeline      = () => req('/chro/department_pipeline')
