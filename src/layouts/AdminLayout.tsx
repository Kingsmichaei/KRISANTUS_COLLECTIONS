import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { signOut } from '../lib/auth'

const navItems = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/services', label: 'Services' },
  { to: '/admin/showcase', label: 'Showcase' },
  { to: '/admin/inquiries', label: 'Inquiries' },
  { to: '/admin/business', label: 'Business Information' },
  { to: '/admin/about', label: 'About' },
]

function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  async function handleLogout() {
    await signOut()
    navigate('/admin/login')
  }

  function navClassName({ isActive }: { isActive: boolean }) {
    return `flex min-h-11 items-center border-l-2 px-4 py-3 text-sm font-medium transition-colors ${
      isActive
        ? 'border-[var(--brand-olive)] bg-[var(--brand-paper-strong)] text-[var(--brand-ink)]'
        : 'border-transparent text-[rgba(16,18,22,0.66)] hover:border-[var(--brand-stone)] hover:bg-[var(--brand-paper)] hover:text-[var(--brand-ink)]'
    }`
  }

  const sidebarContent = (
    <>
      <div className="border-b border-[var(--brand-line)] px-6 py-7">
        <p className="text-[0.64rem] font-semibold uppercase tracking-[0.22em] text-[var(--brand-olive)]">Studio CMS</p>
        <h1 className="mt-3 font-display text-xl font-semibold tracking-[-0.01em]">Krisantus Collection</h1>
        <p className="mt-1 text-xs text-[rgba(16,18,22,0.54)]">Content management</p>
      </div>

      <nav className="p-3">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navClassName}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="mt-6 border-t border-[var(--brand-line)] pt-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex min-h-11 w-full items-center px-4 text-left text-sm font-medium text-red-700 hover:bg-red-50"
          >
            Sign Out
          </button>
        </div>
      </nav>
    </>
  )

  return (
    <div className="min-h-screen bg-[var(--brand-paper)] text-[var(--brand-ink)]">
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 overflow-y-auto border-r border-[var(--brand-line)] bg-white lg:block xl:w-72">
        {sidebarContent}
      </aside>

      {/* Mobile drawer + overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 lg:hidden ${
          drawerOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-[min(85vw,20rem)] overflow-y-auto bg-white shadow-2xl transition-transform duration-[250ms] ease-out lg:hidden ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Admin navigation"
      >
        <div className="flex items-center justify-between border-b border-[var(--brand-line)] px-4 py-4">
          <p className="text-[0.64rem] font-semibold uppercase tracking-[0.22em] text-[var(--brand-olive)]">Studio CMS</p>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="flex h-10 w-10 items-center justify-center text-xl text-[var(--brand-ink)]"
            aria-label="Close navigation"
          >
            &times;
          </button>
        </div>
        <nav className="p-3">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={navClassName}>
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="mt-6 border-t border-[var(--brand-line)] pt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="flex min-h-11 w-full items-center px-4 text-left text-sm font-medium text-red-700 hover:bg-red-50"
            >
              Sign Out
            </button>
          </div>
        </nav>
      </aside>

      <div className="lg:ml-64 xl:ml-72">
        <header className="sticky top-0 z-30 border-b border-[var(--brand-line)] bg-white/95 px-4 py-3 backdrop-blur-sm sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex h-11 w-11 shrink-0 items-center justify-center border border-[var(--brand-line)] text-[var(--brand-ink)] lg:hidden"
              aria-label="Open navigation"
            >
              <span className="relative block h-3.5 w-5">
                <span className="absolute left-0 top-0 h-[1.5px] w-full bg-current" />
                <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-current" />
                <span className="absolute bottom-0 left-0 h-[1.5px] w-full bg-current" />
              </span>
            </button>
            <div className="min-w-0">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--brand-olive)]">Workspace</p>
              <h2 className="truncate font-display text-base font-semibold tracking-[-0.01em] sm:text-lg">Admin Panel</h2>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
