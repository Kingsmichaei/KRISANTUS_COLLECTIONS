import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/showcase', label: 'Showcase' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // Close the mobile menu on route change and lock body scroll while open.
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--brand-line)] bg-[rgba(8, 6, 0, 0.92)] backdrop-blur-sm">
      <div className="page-shell flex h-16 items-center justify-between gap-3 sm:h-20">
        <Link to="/" className="flex min-w-0 items-center gap-2.5 text-[var(--brand-ink)] sm:gap-3">
          {/* <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-[var(--brand-ink)] bg-[var(--brand-paper-strong)] font-display text-xs font-bold sm:h-10 sm:w-10">
            KC
          </span> */}
          <span className="min-w-0 text-left leading-tight">
            {/* <span className="block truncate text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-[var(--brand-olive)]">
              Creative Studio
            </span> */}
            <span className="block truncate font-display text-base font-semibold tracking-[0.02em] sm:text-lg">
              Krisantus Collection
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `text-[0.7rem] font-semibold uppercase tracking-[0.16em] transition-colors ${
                  isActive ? 'text-[var(--brand-ink)]' : 'text-[rgba(16,18,22,0.62)] hover:text-[var(--brand-ink)]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden shrink-0 lg:block">
          <Link to="/contact" className="brand-button brand-button--sm">
            Get a Quote
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="flex h-11 w-11 shrink-0 items-center justify-center border border-[var(--brand-line)] bg-white text-[var(--brand-ink)] lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-[1.5px] w-full bg-current transition-transform duration-200 ${open ? 'translate-y-[7px] rotate-45' : ''}`}
            />
            <span
              className={`absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-current transition-opacity duration-150 ${open ? 'opacity-0' : 'opacity-100'}`}
            />
            <span
              className={`absolute bottom-0 left-0 h-[1.5px] w-full bg-current transition-transform duration-200 ${open ? '-translate-y-[7px] -rotate-45' : ''}`}
            />
          </span>
        </button>
      </div>

      {/* Mobile menu: full-height overlay, comfortable 48px+ tap targets */}
      <div
        id="mobile-nav"
        className={`fixed inset-x-0 top-16 bottom-0 z-40 bg-[var(--brand-paper)] transition-opacity duration-200 sm:top-20 lg:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <nav className="page-shell flex flex-col gap-1 py-6" aria-label="Mobile">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex min-h-[52px] items-center border-b border-[var(--brand-line)] px-1 text-base font-semibold ${
                  isActive ? 'text-[var(--brand-ink)]' : 'text-[rgba(16,18,22,0.68)]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link to="/contact" className="brand-button mt-6 w-full">
            Get a Quote
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
