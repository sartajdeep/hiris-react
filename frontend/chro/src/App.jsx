import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './components/ToastContext'
import { AuthProvider } from './auth/AuthContext'
import LoginPage from './auth/LoginPage'
import OnboardingWizard from './auth/OnboardingWizard'
import ProtectedRoute from './auth/ProtectedRoute'
import './index.css'

import CHRODashboard     from './pages/chro/CHRODashboard'
import InterviewRoomCHRO from './pages/chro/InterviewRoomCHRO'
import HiringRequests    from './pages/chro/HiringRequests'
import HiringPolicies    from './pages/chro/HiringPolicies'
import JobRoles          from './pages/chro/JobRoles'
import AssignManagers    from './pages/chro/AssignManagers'
import Analytics         from './pages/chro/Analytics'
import Settings          from './pages/chro/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public auth routes */}
            <Route path="/login"      element={<LoginPage />} />
            <Route path="/onboarding" element={<OnboardingWizard />} />

            {/* Protected CHRO routes */}
            <Route path="/" element={<ProtectedRoute requiredRole="chro"><CHRODashboard /></ProtectedRoute>} />
            <Route path="/chro/interview-room/:candidateId" element={<ProtectedRoute requiredRole="chro"><InterviewRoomCHRO /></ProtectedRoute>} />
            <Route path="/chro/requests"        element={<ProtectedRoute requiredRole="chro"><HiringRequests /></ProtectedRoute>} />
            <Route path="/chro/policies"        element={<ProtectedRoute requiredRole="chro"><HiringPolicies /></ProtectedRoute>} />
            <Route path="/chro/job-roles"       element={<ProtectedRoute requiredRole="chro"><JobRoles /></ProtectedRoute>} />
            <Route path="/chro/assign-managers" element={<ProtectedRoute requiredRole="chro"><AssignManagers /></ProtectedRoute>} />
            <Route path="/chro/analytics"       element={<ProtectedRoute requiredRole="chro"><Analytics /></ProtectedRoute>} />
            <Route path="/chro/settings"        element={<ProtectedRoute requiredRole="chro"><Settings /></ProtectedRoute>} />
            <Route path="*"                     element={<Navigate to="/login" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
