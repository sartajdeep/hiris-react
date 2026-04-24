import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './components/ToastContext'
import { AuthProvider } from './auth/AuthContext'
const LANDING_LOGIN_URL = 'http://localhost:5176/login'
import { ThemeProvider } from './components/ThemeContext'
import PortalLayout from './components/shared/PortalLayout'
import ProtectedRoute from './auth/ProtectedRoute'
import './index.css'

import CHRODashboard     from './pages/chro/CHRODashboard'
import InterviewRoomCHRO from './pages/chro/InterviewRoomCHRO'
import HiringRequests    from './pages/chro/HiringRequests'
import HiringPolicies    from './pages/chro/HiringPolicies'
import JobRoles          from './pages/chro/JobRoles'
import TeamManagement    from './pages/chro/TeamManagement'
import Analytics         from './pages/chro/Analytics'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <Routes>
            {/* Public auth routes */}
            <Route path="/login"      element={<ExternalRedirect to={LANDING_LOGIN_URL} />} />
    
            {/* Protected CHRO routes wrapped in PortalLayout */}
            <Route path="*" element={
              <ProtectedRoute requiredRole="chro">
                <PortalLayout portalLabel="CHRO Portal">
                  <Routes>
                    <Route path="/" element={<CHRODashboard />} />
                    <Route path="/chro/interview-room/:candidateId" element={<InterviewRoomCHRO />} />
                    <Route path="/chro/requests"        element={<HiringRequests />} />
                    <Route path="/chro/policies"        element={<HiringPolicies />} />
                    <Route path="/chro/job-roles"       element={<JobRoles />} />
                    <Route path="/chro/team-management" element={<TeamManagement />} />
                    <Route path="/chro/analytics"       element={<Analytics />} />
                    <Route path="*"                     element={<Navigate to="/" replace />} />
                  </Routes>
                </PortalLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
    </ThemeProvider>
  )
}

function ExternalRedirect({ to }) {
  window.location.replace(to)
  return null
}
