import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="text-xl font-bold tracking-wide text-gray-900"
        >
          KRISANTUS COLLECTION
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            Home
          </Link>

          <Link
            to="/services"
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            Services
          </Link>

          <Link
            to="/showcase"
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            Showcase
          </Link>

          <Link
            to="/contact"
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar