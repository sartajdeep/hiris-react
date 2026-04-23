import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PricingPage from './pages/PricingPage'
import LoginPage from './pages/LoginPage'
import OrgSignup from './pages/onboarding/OrgSignup'

export default function App() {
  return (
    <Routes>
      <Route path="/"        element={<HomePage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/login"   element={<LoginPage />} />
      <Route path="/signup"  element={<OrgSignup />} />
      {/* Fallback */}
      <Route path="*"        element={<HomePage />} />
    </Routes>
  )
}
