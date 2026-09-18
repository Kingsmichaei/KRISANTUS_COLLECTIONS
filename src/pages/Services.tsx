import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Service } from '../types'

function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchServices() {
      const { data, error: fetchError } = await supabase
  .from('services')
  .select('id, image_url, category, name, description')
  .order('created_at', { ascending: false })

      if (fetchError) {
        setError(fetchError.message)
        setLoading(false)
        return
      }

      setServices(data || [])
      setLoading(false)
    }

    fetchServices()
  }, [])

  return (
    <div className="bg-[var(--brand-paper)]">
      <section className="page-shell py-10 sm:py-14 lg:py-16">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="section-label">Our capabilities</p>
            <h1 className="display-heading mt-4 text-[2rem] sm:text-3xl lg:text-4xl">
              Services built for visibility and lasting impact.
            </h1>
          </div>

          <p className="max-w-xl text-base leading-7 text-[rgba(16,18,22,0.72)] sm:text-lg sm:leading-8">
            We combine strategy, production, and finishing to shape strong visual experiences for businesses, events, and personal brands.
          </p>
        </div>
      </section>

      <section className="page-shell pb-12 sm:pb-16 lg:pb-20">
        {loading ? (
          <div className="text-sm text-[rgba(16,18,22,0.7)]">Loading services...</div>
        ) : error ? (
          <div className="banner-error">{error}</div>
        ) : services.length === 0 ? (
          <div className="border border-dashed border-[var(--brand-line)] bg-white/60 p-10 text-center text-[rgba(16,18,22,0.72)]">
            Services will appear here once the admin adds them.
          </div>
       ) : (
  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
  {services.map((service) => (
    <article
      key={service.id}
      className="overflow-hidden border border-[var(--brand-line)] bg-white"
    >
      <img
        src={service.image_url ?? undefined}
        alt={service.name}
        width="800"
        height="500"
        loading="lazy"
        decoding="async"
        className="h-44 w-full object-cover sm:h-48"
      />

      <div className="p-5">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--brand-olive)]">
          {service.category}
        </p>

        <h2 className="mt-2 font-display text-lg font-semibold tracking-[-0.01em] text-[var(--brand-ink)] sm:text-xl">
          {service.name}
        </h2>

        <p className="mt-2 text-sm leading-6 text-[rgba(16,18,22,0.72)]">
          {service.description}
        </p>

        <div className="mt-4">
          <Link to="/contact" className="brand-button brand-button--sm">
            Request this service
          </Link>
        </div>
      </div>
    </article>
  ))}
</div>
)}
      </section>
    </div>
  )
}

export default Services
