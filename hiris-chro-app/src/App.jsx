import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './components/ToastContext'
import './index.css'

import CHRODashboard    from './pages/chro/CHRODashboard'
import InterviewRoomCHRO from './pages/chro/InterviewRoomCHRO'
import HiringRequests   from './pages/chro/HiringRequests'
import HiringPolicies   from './pages/chro/HiringPolicies'
import JobRoles         from './pages/chro/JobRoles'
import AssignManagers   from './pages/chro/AssignManagers'
import Analytics        from './pages/chro/Analytics'
import Settings         from './pages/chro/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/"                   element={<CHRODashboard />} />
          <Route path="/chro/interview-room/:candidateId" element={<InterviewRoomCHRO />} />
          <Route path="/chro/requests"      element={<HiringRequests />} />
          <Route path="/chro/policies"      element={<HiringPolicies />} />
          <Route path="/chro/job-roles"     element={<JobRoles />} />
          <Route path="/chro/assign-managers" element={<AssignManagers />} />
          <Route path="/chro/analytics"     element={<Analytics />} />
          <Route path="/chro/settings"      element={<Settings />} />
          <Route path="*"                   element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}
