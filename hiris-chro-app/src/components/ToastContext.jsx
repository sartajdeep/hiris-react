import { createContext, useContext, useState, useCallback } from 'react'

const ToastCtx = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((msg, type = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, msg, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  const COLOR = { success: '#16A34A', error: '#DC2626', info: 'var(--teal)', warning: '#D97706' }
  const BG    = { success: '#F0FDF4', error: '#FEF2F2', info: 'rgba(40,102,110,.06)', warning: '#FFFBEB' }

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div style={{ position: 'fixed', bottom: 20, right: 20, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 9999 }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: BG[t.type] || BG.info,
            border: `1px solid ${COLOR[t.type] || COLOR.info}30`,
            color: COLOR[t.type] || COLOR.info,
            borderRadius: 10, padding: '10px 16px',
            fontSize: 13, fontWeight: 600,
            boxShadow: '0 4px 20px rgba(0,0,0,.12)',
            animation: 'slideUp .2s ease-out',
          }}>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)
