import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import LoginPage from './auth/LoginPage'
import OnboardingWizard from './auth/OnboardingWizard'
import ProtectedRoute from './auth/ProtectedRoute'
import Dashboard from './pages/hiringassistant/Dashboard'
import HiringRequests from './pages/hiringassistant/HiringRequests'
import Publish from './pages/hiringassistant/Publish'
import JobPostingBuilder from './pages/hiringassistant/JobPostingBuilder'
import ActiveOpenings from './pages/hiringassistant/ActiveOpenings'
import CandidateProfile from './pages/hiringassistant/CandidateProfile'
import Admissions from './pages/hiringassistant/Admissions'
import AdmissionsEditPosting from './pages/hiringassistant/AdmissionsEditPosting'
import ApplicationDetails from './pages/hiringassistant/ApplicationDetails'
import ApprovalSubmitted from './pages/hiringassistant/ApprovalSubmitted'
import JobPosted from './pages/hiringassistant/JobPosted'
import AiChat from './pages/candidateapplicationform/AiChat'
import ApplicationForm from './pages/candidateapplicationform/ApplicationForm'
import ThankYouForApplying from './pages/candidateapplicationform/ThankYouForApplying'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingWizard />} />

        {/* Protected portal routes */}
        <Route path="/" element={<ProtectedRoute requiredRole="hiring-assistant"><Dashboard /></ProtectedRoute>} />
        <Route path="/hiring-requests" element={<ProtectedRoute requiredRole="hiring-assistant"><HiringRequests /></ProtectedRoute>} />
        <Route path="/publish" element={<ProtectedRoute requiredRole="hiring-assistant"><Publish /></ProtectedRoute>} />
        <Route path="/job-posting-builder" element={<ProtectedRoute requiredRole="hiring-assistant"><JobPostingBuilder /></ProtectedRoute>} />
        <Route path="/active-openings" element={<ProtectedRoute requiredRole="hiring-assistant"><ActiveOpenings /></ProtectedRoute>} />
        <Route path="/candidate-profile" element={<ProtectedRoute requiredRole="hiring-assistant"><CandidateProfile /></ProtectedRoute>} />
        <Route path="/admissions" element={<ProtectedRoute requiredRole="hiring-assistant"><Admissions /></ProtectedRoute>} />
        <Route path="/admissions/edit" element={<ProtectedRoute requiredRole="hiring-assistant"><AdmissionsEditPosting /></ProtectedRoute>} />
        <Route path="/ai-chat" element={<ProtectedRoute requiredRole="hiring-assistant"><AiChat /></ProtectedRoute>} />
        <Route path="/application-details" element={<ProtectedRoute requiredRole="hiring-assistant"><ApplicationDetails /></ProtectedRoute>} />
        <Route path="/application-form" element={<ProtectedRoute requiredRole="hiring-assistant"><ApplicationForm /></ProtectedRoute>} />
        <Route path="/approval-submitted" element={<ProtectedRoute requiredRole="hiring-assistant"><ApprovalSubmitted /></ProtectedRoute>} />
        <Route path="/job-posted" element={<ProtectedRoute requiredRole="hiring-assistant"><JobPosted /></ProtectedRoute>} />
        <Route path="/thank-you" element={<ProtectedRoute requiredRole="hiring-assistant"><ThankYouForApplying /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}
