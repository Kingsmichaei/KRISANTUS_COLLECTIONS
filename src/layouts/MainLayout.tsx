import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--brand-paper)] text-[var(--brand-ink)]">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-[var(--brand-line)] bg-[var(--brand-olive)] text-[rgba(255,255,255,0.72)]">
        <div className="page-shell grid py-5 sm:py-5 md:grid-cols-[1.15fr_0.85fr] md:items-end lg:py-3">
          <div>
           
            <h3 className="mt-4 font-display text-2xl font-semibold leading-tight tracking-[-0.01em] text-white sm:text-3xl lg:text-4xl">
              Crafted for brands with a point of view.
            </h3>
            <Link
              to="/contact"
              className="mt-6 inline-flex min-h-11 items-center border border-[rgba(255,255,255,0.3)] px-5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-white hover:text-[var(--brand-ink)]"
            >
              Start a project
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm leading-7 sm:grid-cols-2 md:text-right">
            <div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[rgba(255,255,255,0.45)]">Studio</p>
              <div className="mt-3 flex flex-col gap-2">
                <Link to="/services" className="hover:text-white">Services</Link>
                <Link to="/showcase" className="hover:text-white">Showcase</Link>
                <Link to="/about" className="hover:text-white">About</Link>
              </div>
            </div>
            <div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[rgba(255,255,255,0.45)]">Connect</p>
              <div className="mt-3 flex flex-col gap-2">
                <Link to="/contact" className="hover:text-white">Contact</Link>
                <Link to="/admin/login" className="hover:text-white">Admin</Link>
              </div>
            </div>
            {/* <div className="col-span-2 sm:col-span-1">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[rgba(255,255,255,0.45)]">Service</p>
              <p className="mt-3 leading-6 text-[rgba(255,255,255,0.6)]">
                Print, branding, and creative customization.
              </p>
            </div> */}
          </div>
        </div>

        <div className="border-t border-[rgba(255,255,255,0.1)]">
          <div className="page-shell flex flex-col gap-2 py-5 text-xs text-[rgba(255,255,255,0.45)] sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; {new Date().getFullYear()} Krisantus Collection. All rights reserved.</p>
            <p>Creative printing &middot; branding &middot; customization</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout
