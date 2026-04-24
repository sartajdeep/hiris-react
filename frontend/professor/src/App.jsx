import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
const LANDING_LOGIN_URL = 'http://localhost:5176/login'
import { ThemeProvider } from './components/ThemeContext'
import PortalLayout from './components/shared/PortalLayout'
import ProtectedRoute from './auth/ProtectedRoute'
import ProfessorDashboard        from './pages/professor/ProfessorDashboard'
import ProfessorCandidateProfile from './pages/professor/ProfessorCandidateProfile'
import ProfessorJDReview         from './pages/professor/ProfessorJDReview'
import ProfessorInterviewRoom    from './pages/professor/ProfessorInterviewRoom'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
        {/* Public auth routes */}
        <Route path="/login"      element={<ExternalRedirect to={LANDING_LOGIN_URL} />} />

        {/* Protected Professor routes wrapped in PortalLayout */}
        <Route path="*" element={
          <ProtectedRoute requiredRole="professor">
            <PortalLayout portalLabel="Faculty Portal">
              <Routes>
                <Route path="/"                  element={<ProfessorDashboard />} />
        <Route path="/candidate/:id"     element={<ProtectedRoute requiredRole="professor"><ProfessorCandidateProfile /></ProtectedRoute>} />
        <Route path="/jd-review"         element={<ProtectedRoute requiredRole="professor"><ProfessorJDReview /></ProtectedRoute>} />
        <Route path="/jd-review/:roleId" element={<ProtectedRoute requiredRole="professor"><ProfessorJDReview /></ProtectedRoute>} />
                <Route path="/interview/:roleId" element={<ProfessorInterviewRoom />} />
                <Route path="*"                  element={<Navigate to="/" replace />} />
              </Routes>
            </PortalLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
    </ThemeProvider>
  )
}

function ExternalRedirect({ to }) {
  window.location.replace(to)
  return null
}
