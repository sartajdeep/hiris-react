import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import LoginPage from './auth/LoginPage'
import { ThemeProvider } from './components/ThemeContext'
import ThemeToggle from './components/ThemeToggle'
import ProtectedRoute from './auth/ProtectedRoute'
import ProfessorDashboard        from './pages/professor/ProfessorDashboard'
import ProfessorCandidateProfile from './pages/professor/ProfessorCandidateProfile'
import ProfessorJDReview         from './pages/professor/ProfessorJDReview'
import ProfessorInterviewRoom    from './pages/professor/ProfessorInterviewRoom'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ThemeToggle />
        <Routes>
        {/* Public auth routes */}
        <Route path="/login"      element={<LoginPage />} />


        {/* Protected Professor routes */}
        <Route path="/"                  element={<ProtectedRoute requiredRole="professor"><ProfessorDashboard /></ProtectedRoute>} />
        <Route path="/candidate/:id"     element={<ProtectedRoute requiredRole="professor"><ProfessorCandidateProfile /></ProtectedRoute>} />
        <Route path="/jd-review"         element={<ProtectedRoute requiredRole="professor"><ProfessorJDReview /></ProtectedRoute>} />
        <Route path="/jd-review/:roleId" element={<ProtectedRoute requiredRole="professor"><ProfessorJDReview /></ProtectedRoute>} />
        <Route path="/interview/:roleId" element={<ProtectedRoute requiredRole="professor"><ProfessorInterviewRoom /></ProtectedRoute>} />
        <Route path="*"                  element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
    </ThemeProvider>
  )
}
