import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/showcase', label: 'Showcase' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header sticky top-0 z-50 border-b border-[var(--brand-line)] bg-[rgba(245,241,234,0.9)] backdrop-blur-sm">
      <div className="page-shell flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3 text-[var(--brand-ink)]">
          <span className="flex h-10 w-10 items-center justify-center border border-[var(--brand-ink)] bg-[var(--brand-paper-strong)] text-xs font-black tracking-[0.28em]">
            KC
          </span>
          <span className="text-left">
            <span className="block text-[0.64rem] font-semibold uppercase tracking-[0.32em] text-[var(--brand-olive)]">
              Creative Studio
            </span>
            <span className="block text-base font-black tracking-[0.16em] sm:text-lg">
              KRISANTUS
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-[0.7rem] font-semibold uppercase tracking-[0.24em] transition-colors ${
                  isActive ? 'text-[var(--brand-ink)]' : 'text-[rgba(23,20,18,0.68)] hover:text-[var(--brand-ink)]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/contact" className="brand-button">
            Get a Quote
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="flex h-10 w-10 items-center justify-center border border-[var(--brand-line)] bg-white text-sm font-semibold text-[var(--brand-ink)] md:hidden"
          aria-label="Toggle menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {open && (
        <div className="border-t border-[var(--brand-line)] bg-[var(--brand-paper)] md:hidden">
          <div className="page-shell flex flex-col gap-2 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] ${
                    isActive ? 'bg-[var(--brand-ink)] text-white' : 'text-[var(--brand-ink)] hover:bg-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link to="/contact" onClick={() => setOpen(false)} className="brand-button mt-2 w-full">
              Get a Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar