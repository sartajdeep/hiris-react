import { Routes, Route } from 'react-router-dom'
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
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/hiring-requests" element={<HiringRequests />} />
      <Route path="/publish" element={<Publish />} />
      <Route path="/job-posting-builder" element={<JobPostingBuilder />} />
      <Route path="/active-openings" element={<ActiveOpenings />} />
      <Route path="/candidate-profile" element={<CandidateProfile />} />
      <Route path="/admissions" element={<Admissions />} />
      <Route path="/admissions/edit" element={<AdmissionsEditPosting />} />
      <Route path="/ai-chat" element={<AiChat />} />
      <Route path="/application-details" element={<ApplicationDetails />} />
      <Route path="/application-form" element={<ApplicationForm />} />
      <Route path="/approval-submitted" element={<ApprovalSubmitted />} />
      <Route path="/job-posted" element={<JobPosted />} />
      <Route path="/thank-you" element={<ThankYouForApplying />} />
    </Routes>
  )
}
