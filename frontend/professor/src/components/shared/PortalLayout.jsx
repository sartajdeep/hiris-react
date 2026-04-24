import GlobalHeader from './GlobalHeader'
import Breadcrumbs from './Breadcrumbs'
import Footer from './Footer'

export default function PortalLayout({ children, portalLabel = 'Portal' }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[color:var(--bg)] text-[color:var(--text-primary)] font-body">
      <GlobalHeader portalLabel={portalLabel} />
      <Breadcrumbs />
      <main className="flex-1 overflow-hidden relative flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  )
}
