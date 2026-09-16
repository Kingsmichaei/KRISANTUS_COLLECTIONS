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
        .select('*')
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
      <section className="page-shell py-14 sm:py-18 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="section-label">Our capabilities</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.07em] text-[var(--brand-ink)] sm:text-5xl lg:text-6xl">
              Services built for visibility and lasting impact.
            </h1>
          </div>

          <p className="max-w-xl text-lg leading-8 text-[rgba(23,20,18,0.72)]">
            We combine strategy, production, and finishing to shape strong visual experiences for businesses, events, and personal brands.
          </p>
        </div>
      </section>

      <section className="page-shell pb-16 sm:pb-20 lg:pb-24">
        {loading ? (
          <div className="text-sm text-[rgba(23,20,18,0.7)]">Loading services...</div>
        ) : error ? (
          <div className="text-red-700">{error}</div>
        ) : services.length === 0 ? (
          <div className="border border-dashed border-[var(--brand-line)] bg-white/60 p-10 text-center text-[rgba(23,20,18,0.72)]">
            Services will appear here once the admin adds them.
          </div>
        ) : (
          <div className="space-y-8">
            {services.map((service, index) => {
              const image = service.image_url || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80'
              const isReverse = index % 2 !== 0

              return (
                <article
                  key={service.id}
                  className="overflow-hidden border border-[var(--brand-line)] bg-white"
                >
                  <div className={`grid lg:grid-cols-2 ${isReverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                    <div className="relative overflow-hidden">
                      <img src={image} alt={service.name} className="h-[20rem] w-full object-cover lg:h-full" />
                    </div>

                    <div className="flex items-center p-6 sm:p-8 lg:p-12">
                      <div className="max-w-xl">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[var(--brand-olive)]">
                          {service.category}
                        </p>
                        <h2 className="mt-4 text-3xl font-black tracking-[-0.06em] text-[var(--brand-ink)] sm:text-4xl">
                          {service.name}
                        </h2>
                        <p className="mt-5 text-base leading-8 text-[rgba(23,20,18,0.72)]">
                          {service.description}
                        </p>
                        <div className="mt-8">
                          <Link to="/contact" className="brand-button">
                            Request this service
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

export default Services