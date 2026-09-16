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
    <div className="space-y-10">
      <section className="border-b border-[var(--brand-line)] pb-8">
        <p className="section-label">Overview</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.07em] sm:text-5xl">Good morning, studio.</h1>
        <p className="mt-3 max-w-xl text-[rgba(23,20,18,0.68)]">Keep the public-facing work sharp, current, and ready for the next client conversation.</p>
      </section>

      <section className="grid gap-px border border-[var(--brand-line)] bg-[var(--brand-line)] sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Services', counts.services, '/admin/services'],
          ['Showcase items', counts.showcase, '/admin/showcase'],
          ['New inquiries', counts.newInquiries, '/admin/inquiries'],
          ['Completed', counts.completed, '/admin/inquiries'],
        ].map(([label, value, path]) => (
          <Link key={label} to={path as string} className="bg-white p-6 transition-colors hover:bg-[var(--brand-paper-strong)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-olive)]">{label}</p>
            <p className="mt-4 text-4xl font-black tracking-[-0.06em]">{loading ? '—' : value}</p>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-[rgba(23,20,18,0.54)]">Open section →</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="border border-[var(--brand-line)] bg-white p-6 sm:p-8">
          <p className="section-label">Content workflow</p>
          <h2 className="mt-4 text-3xl font-black tracking-[-0.06em]">Your studio, kept current.</h2>
          <p className="mt-4 max-w-xl leading-7 text-[rgba(23,20,18,0.68)]">Update services, upload finished work, and respond to customer inquiries from one focused workspace.</p>
        </div>
        <div className="border border-[var(--brand-line)] bg-[var(--brand-paper-strong)] p-6 sm:p-8">
          <p className="section-label">Quick actions</p>
          <div className="mt-6 space-y-4">
            <Link to="/admin/services" className="flex items-center justify-between border-b border-[var(--brand-line)] pb-4 text-sm font-semibold">Add a service <span>→</span></Link>
            <Link to="/admin/showcase" className="flex items-center justify-between border-b border-[var(--brand-line)] pb-4 text-sm font-semibold">Upload recent work <span>→</span></Link>
            <Link to="/admin/business" className="flex items-center justify-between text-sm font-semibold">Edit business details <span>→</span></Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AdminDashboard