import React from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../../components/landing-layout/Navbar'
import Footer from '../../components/shared/Footer'

export default function PlaceholderPage({ title }) {
  const { pageId } = useParams()
  const displayTitle = title || (pageId ? pageId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Page Not Found')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 80 }}>
        <div style={{ textAlign: 'center', maxWidth: 600, padding: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--teal-10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--teal)', fontSize: 32 }}>construction</span>
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: 16, color: 'var(--text-primary)' }}>{displayTitle}</h1>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            This page is currently under construction. We are working hard to bring you comprehensive details about our platform's {displayTitle.toLowerCase()}.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
