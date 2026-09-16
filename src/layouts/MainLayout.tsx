import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

function MainLayout() {
  return (
    <div className="min-h-screen bg-[var(--brand-paper)] text-[var(--brand-ink)]">
      <Navbar />

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-[var(--brand-line)] bg-[var(--brand-ink)] text-[rgba(255,255,255,0.74)]">
        <div className="page-shell grid gap-8 py-12 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[rgba(255,255,255,0.55)]">
              KRISANTUS COLLECTION
            </p>
            <h3 className="mt-4 text-3xl font-black tracking-[-0.06em] text-white">
              Crafted for brands with a point of view.
            </h3>
          </div>

          <div className="space-y-3 text-sm leading-7 md:text-right">
            <p>Creative printing, branding, and customization.</p>
            <p className="text-[rgba(255,255,255,0.6)]">Ideas shaped into materials people remember.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout