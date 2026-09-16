import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

function MainLayout() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
          <p className="font-semibold text-gray-900">KRISANTUS COLLECTION</p>
          <p>Creative printing, design, branding, and customization.</p>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout