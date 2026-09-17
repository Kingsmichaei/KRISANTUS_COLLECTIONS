import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function AdminDashboard() {
  const [counts, setCounts] = useState({ services: 0, showcase: 0, newInquiries: 0, completed: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCounts() {
      const [services, showcase, newInquiries, completed] = await Promise.all([
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('portfolio_items').select('*', { count: 'exact', head: true }),
        supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'NEW'),
        supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'COMPLETED'),
      ])

      setCounts({
        services: services.count || 0,
        showcase: showcase.count || 0,
        newInquiries: newInquiries.count || 0,
        completed: completed.count || 0,
      })
      setLoading(false)
    }

    fetchCounts()
  }, [])

  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="border-b border-[var(--brand-line)] pb-6 sm:pb-8">
        <p className="section-label">Overview</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.01em] sm:text-4xl lg:text-5xl">Good morning, studio.</h1>
        <p className="mt-3 max-w-xl text-sm text-[rgba(16,18,22,0.68)] sm:text-base">Keep the public-facing work sharp, current, and ready for the next client conversation.</p>
      </section>

      <section className="grid grid-cols-1 gap-px border border-[var(--brand-line)] bg-[var(--brand-line)] sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Services', counts.services, '/admin/services'],
          ['Showcase items', counts.showcase, '/admin/showcase'],
          ['New inquiries', counts.newInquiries, '/admin/inquiries'],
          ['Completed', counts.completed, '/admin/inquiries'],
        ].map(([label, value, path]) => (
          <Link key={label} to={path as string} className="bg-white p-5 transition-colors hover:bg-[var(--brand-paper-strong)] sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-olive)]">{label}</p>
            <p className="mt-3 font-display text-3xl font-semibold tracking-[-0.01em] sm:mt-4 sm:text-4xl">{loading ? '—' : value}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-[rgba(16,18,22,0.5)]">Open section &rarr;</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-5 sm:gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="border border-[var(--brand-line)] bg-white p-5 sm:p-8">
          <p className="section-label">Content workflow</p>
          <h2 className="mt-4 font-display text-2xl font-semibold tracking-[-0.01em] sm:text-3xl">Your studio, kept current.</h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-[rgba(16,18,22,0.68)] sm:leading-7">Update services, upload finished work, and respond to customer inquiries from one focused workspace.</p>
        </div>
        <div className="border border-[var(--brand-line)] bg-[var(--brand-paper-strong)] p-5 sm:p-8">
          <p className="section-label">Quick actions</p>
          <div className="mt-5 space-y-1 sm:mt-6">
            <Link to="/admin/services" className="flex min-h-11 items-center justify-between border-b border-[var(--brand-line)] py-3 text-sm font-semibold">Add a service <span>&rarr;</span></Link>
            <Link to="/admin/showcase" className="flex min-h-11 items-center justify-between border-b border-[var(--brand-line)] py-3 text-sm font-semibold">Upload recent work <span>&rarr;</span></Link>
            <Link to="/admin/business" className="flex min-h-11 items-center justify-between py-3 text-sm font-semibold">Edit business details <span>&rarr;</span></Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AdminDashboard
