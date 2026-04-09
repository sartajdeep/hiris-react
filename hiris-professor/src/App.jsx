import { Routes, Route } from 'react-router-dom'
import ProfessorDashboard        from './pages/professor/ProfessorDashboard'
import ProfessorCandidateProfile from './pages/professor/ProfessorCandidateProfile'
import ProfessorJDReview         from './pages/professor/ProfessorJDReview'
import ProfessorInterviewRoom    from './pages/professor/ProfessorInterviewRoom'

export default function App() {
  return (
    <Routes>
      <Route path="/"                element={<ProfessorDashboard />} />
      <Route path="/candidate/:id"   element={<ProfessorCandidateProfile />} />
      <Route path="/jd-review"       element={<ProfessorJDReview />} />
      <Route path="/jd-review/:roleId" element={<ProfessorJDReview />} />
      <Route path="/interview/:roleId" element={<ProfessorInterviewRoom />} />
    </Routes>
  )
}
