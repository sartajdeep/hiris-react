import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'
import PortalLayout from './components/shared/PortalLayout'
import './index.css'

// -- Landing --
import HomePage from './pages/landing/HomePage'
import PricingPage from './pages/landing/PricingPage'
import LoginPage from './pages/landing/LoginPage'
import OrgSignup from './pages/landing/onboarding/OrgSignup'
import PlaceholderPage from './pages/landing/PlaceholderPage'

// -- CHRO --
import CHRODashboard     from './pages/chro/CHRODashboard'
import InterviewRoomCHRO from './pages/chro/InterviewRoomCHRO'
import HiringRequestsCHRO from './pages/chro/HiringRequests'
import HiringPolicies    from './pages/chro/HiringPolicies'
import JobRoles          from './pages/chro/JobRoles'
import TeamManagement    from './pages/chro/TeamManagement'
import Analytics         from './pages/chro/Analytics'

// -- Hiring Assistant --
import AssistantDashboard from './pages/hiringassistant/Dashboard'
import HiringRequestsHA   from './pages/hiringassistant/HiringRequests'
import Publish            from './pages/hiringassistant/Publish'
import JobPostingBuilder  from './pages/hiringassistant/JobPostingBuilder'
import ActiveOpenings     from './pages/hiringassistant/ActiveOpenings'
import CandidateProfileHA from './pages/hiringassistant/CandidateProfile'
import Admissions         from './pages/hiringassistant/Admissions'
import AdmissionsEdit     from './pages/hiringassistant/AdmissionsEditPosting'
import ApplicationDetails from './pages/hiringassistant/ApplicationDetails'
import ApprovalSubmitted  from './pages/hiringassistant/ApprovalSubmitted'
import JobPosted          from './pages/hiringassistant/JobPosted'

// Candidate Forms
import AiChat             from './pages/candidate/AiChat'
import ApplicationForm    from './pages/candidate/ApplicationForm'
import ThankYouForApplying from './pages/candidate/ThankYouForApplying'

// -- Professor --
import ProfessorDashboard        from './pages/professor/ProfessorDashboard'
import ProfessorCandidateProfile from './pages/professor/ProfessorCandidateProfile'
import ProfessorJDReview         from './pages/professor/ProfessorJDReview'
import ProfessorInterviewRoom    from './pages/professor/ProfessorInterviewRoom'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              {/* === Landing === */}
              <Route path="/"        element={<HomePage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/login"   element={<LoginPage />} />
              <Route path="/signup"  element={<OrgSignup />} />
              
              {/* Footer Pages */}
              <Route path="/features" element={<PlaceholderPage title="Features" />} />
              <Route path="/how-it-works" element={<PlaceholderPage title="How It Works" />} />
              <Route path="/security" element={<PlaceholderPage title="Security" />} />
              <Route path="/about" element={<PlaceholderPage title="About Us" />} />
              <Route path="/careers" element={<PlaceholderPage title="Careers" />} />
              <Route path="/blog" element={<PlaceholderPage title="Blog" />} />
              <Route path="/contact" element={<PlaceholderPage title="Contact" />} />
              <Route path="/documentation" element={<PlaceholderPage title="Documentation" />} />
              <Route path="/api" element={<PlaceholderPage title="API Reference" />} />
              <Route path="/status" element={<PlaceholderPage title="System Status" />} />
              <Route path="/help" element={<PlaceholderPage title="Help Centre" />} />
              <Route path="/privacy" element={<PlaceholderPage title="Privacy Policy" />} />
              <Route path="/terms" element={<PlaceholderPage title="Terms of Service" />} />
              <Route path="/cookies" element={<PlaceholderPage title="Cookie Policy" />} />

              {/* === CHRO Portal === */}
              <Route path="/chro/*" element={
                <ProtectedRoute requiredRole="chro">
                  <PortalLayout portalLabel="CHRO Portal">
                    <Routes>
                      <Route path="/" element={<CHRODashboard />} />
                      <Route path="/interview-room/:candidateId" element={<InterviewRoomCHRO />} />
                      <Route path="/requests"        element={<HiringRequestsCHRO />} />
                      <Route path="/policies"        element={<HiringPolicies />} />
                      <Route path="/job-roles"       element={<JobRoles />} />
                      <Route path="/team-management" element={<TeamManagement />} />
                      <Route path="/analytics"       element={<Analytics />} />
                      <Route path="*"                element={<Navigate to="/chro" replace />} />
                    </Routes>
                  </PortalLayout>
                </ProtectedRoute>
              } />

              {/* === Hiring Assistant Portal === */}
              <Route path="/assistant/*" element={
                <ProtectedRoute requiredRole="hiring-assistant">
                  <PortalLayout portalLabel="Hiring Assistant">
                    <Routes>
                      <Route path="/" element={<AssistantDashboard />} />
                      <Route path="/hiring-requests" element={<HiringRequestsHA />} />
                      <Route path="/publish"         element={<Publish />} />
                      <Route path="/job-posting-builder" element={<JobPostingBuilder />} />
                      <Route path="/active-openings" element={<ActiveOpenings />} />
                      <Route path="/candidate-profile" element={<CandidateProfileHA />} />
                      <Route path="/admissions"      element={<Admissions />} />
                      <Route path="/admissions/edit" element={<AdmissionsEdit />} />
                      <Route path="/ai-chat"         element={<AiChat />} />
                      <Route path="/application-details" element={<ApplicationDetails />} />
                      <Route path="/application-form" element={<ApplicationForm />} />
                      <Route path="/approval-submitted" element={<ApprovalSubmitted />} />
                      <Route path="/job-posted"      element={<JobPosted />} />
                      <Route path="/thank-you"       element={<ThankYouForApplying />} />
                      <Route path="*"                element={<Navigate to="/assistant" replace />} />
                    </Routes>
                  </PortalLayout>
                </ProtectedRoute>
              } />

              {/* === Faculty Portal === */}
              <Route path="/faculty/*" element={
                <ProtectedRoute requiredRole="professor">
                  <PortalLayout portalLabel="Faculty Portal">
                    <Routes>
                      <Route path="/"                  element={<ProfessorDashboard />} />
                      <Route path="/candidate/:id"     element={<ProfessorCandidateProfile />} />
                      <Route path="/jd-review"         element={<ProfessorJDReview />} />
                      <Route path="/jd-review/:roleId" element={<ProfessorJDReview />} />
                      <Route path="/interview/:roleId" element={<ProfessorInterviewRoom />} />
                      <Route path="*"                  element={<Navigate to="/faculty" replace />} />
                    </Routes>
                  </PortalLayout>
                </ProtectedRoute>
              } />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
