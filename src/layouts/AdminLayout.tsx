import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
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
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    await signOut()
    navigate('/admin/login')
  }

  function navClassName({ isActive }: { isActive: boolean }) {
    return `block border-l-2 px-4 py-3 text-sm font-medium transition-colors ${
      isActive
        ? 'border-[var(--brand-olive)] bg-[var(--brand-paper-strong)] text-[var(--brand-ink)]'
        : 'border-transparent text-[rgba(23,20,18,0.68)] hover:border-[var(--brand-stone)] hover:bg-[var(--brand-paper)] hover:text-[var(--brand-ink)]'
    }`
  }

  return (
    <div className="min-h-screen bg-[var(--brand-paper)] text-[var(--brand-ink)]">
      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-[var(--brand-line)] bg-white md:block">
        <div className="border-b border-[var(--brand-line)] px-6 py-7">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[var(--brand-olive)]">Studio CMS</p>
          <h1 className="mt-3 text-xl font-black tracking-[-0.04em]">KRISANTUS COLLECTION</h1>
          <p className="mt-1 text-xs text-[rgba(23,20,18,0.56)]">Content management</p>
        </div>

        <nav className="p-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={navClassName}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="mt-8 border-t border-[var(--brand-line)] pt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left text-sm font-medium text-red-700 hover:bg-red-50"
            >
              Sign Out
            </button>
          </div>
        </nav>
      </aside>

      <div className="md:ml-72">
        <header className="border-b border-[var(--brand-line)] bg-white px-4 py-4 md:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen((current) => !current)}
                className="border border-[var(--brand-line)] p-2 text-[var(--brand-ink)] md:hidden"
                aria-label="Toggle navigation"
              >
                ☰
              </button>
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-[var(--brand-olive)]">Workspace</p>
                <h2 className="text-lg font-black tracking-[-0.03em]">Admin Panel</h2>
              </div>
            </div>
          </div>

          {mobileOpen && (
            <nav className="mt-4 space-y-2 md:hidden">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={navClassName}
                >
                  {item.label}
                </NavLink>
              ))}

              <button
                type="button"
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left text-sm font-medium text-red-700 hover:bg-red-50"
              >
                Sign Out
              </button>
            </nav>
          )}
        </header>

        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout