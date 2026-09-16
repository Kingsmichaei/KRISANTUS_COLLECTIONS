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
    return `block rounded-lg px-4 py-3 text-sm font-medium ${
      isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
    }`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-gray-200 bg-white md:block">
        <div className="border-b border-gray-200 px-6 py-5">
          <h1 className="text-lg font-bold text-gray-900">KRISANTUS COLLECTION</h1>
          <p className="mt-1 text-xs text-gray-500">Admin Panel</p>
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

          <div className="mt-8 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Sign Out
            </button>
          </div>
        </nav>
      </aside>

      <div className="md:ml-64">
        <header className="border-b border-gray-200 bg-white px-4 py-4 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen((current) => !current)}
                className="rounded-lg border border-gray-300 p-2 text-gray-700 md:hidden"
                aria-label="Toggle navigation"
              >
                ☰
              </button>
              <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
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
                className="w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            </nav>
          )}
        </header>

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout