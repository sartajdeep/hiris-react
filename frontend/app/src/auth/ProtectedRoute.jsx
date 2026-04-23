import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

/**
 * Wraps routes that require authentication.
 * @param {string} requiredRole - 'chro' | 'hiring-assistant' | 'professor'
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    // User is logged in but to the wrong portal
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F1F5F9',
        fontFamily: "'Inter', sans-serif",
        padding: 24,
        textAlign: 'center',
      }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: 28 }}>🔒</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', fontFamily: "'Manrope', sans-serif", marginBottom: 8 }}>Wrong Portal</h2>
        <p style={{ fontSize: 14, color: '#64748B', marginBottom: 24, maxWidth: 360, lineHeight: 1.6 }}>
          You're signed in as <strong>{user.name}</strong> ({user.portal}). This page belongs to a different portal.
        </p>
        <a
          href={user.portalUrl}
          style={{ padding: '10px 24px', background: '#28666E', color: 'white', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 700 }}
        >
          Go to {user.portal} →
        </a>
      </div>
    )
  }

  return children
}
