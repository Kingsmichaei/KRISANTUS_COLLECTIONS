import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { signOut } from '../lib/auth'

function AdminLayout() {
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-gray-200 bg-white md:block">
        <div className="border-b border-gray-200 px-6 py-5">
          <h1 className="text-lg font-bold text-gray-900">
            KRISANTUS COLLECTION
          </h1>

          <p className="mt-1 text-xs text-gray-500">
            Admin Panel
          </p>
        </div>

        <nav className="p-4">
          <div className="space-y-1">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `block rounded-lg px-4 py-3 text-sm font-medium ${
                  isActive
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/admin/services"
              className={({ isActive }) =>
                `block rounded-lg px-4 py-3 text-sm font-medium ${
                  isActive
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              Services
            </NavLink>

            <NavLink
              to="/admin/showcase"
              className={({ isActive }) =>
                `block rounded-lg px-4 py-3 text-sm font-medium ${
                  isActive
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              Showcase
            </NavLink>

            <NavLink
              to="/admin/inquiries"
              className={({ isActive }) =>
                `block rounded-lg px-4 py-3 text-sm font-medium ${
                  isActive
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              Inquiries
            </NavLink>

            <NavLink
              to="/admin/business"
              className={({ isActive }) =>
                `block rounded-lg px-4 py-3 text-sm font-medium ${
                  isActive
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              Business Information
            </NavLink>

            <NavLink
              to="/admin/about"
              className={({ isActive }) =>
                `block rounded-lg px-4 py-3 text-sm font-medium ${
                  isActive
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              About
            </NavLink>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-4">
            <button
              onClick={handleLogout}
              className="w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Sign Out
            </button>
          </div>
        </nav>
      </aside>

      <div className="md:ml-64">
        <header className="border-b border-gray-200 bg-white px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Admin Panel
          </h2>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout