import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { BusinessSettings, PortfolioItem, Service } from '../types'

const defaultSettings: BusinessSettings = {
  business_name: 'KRISANTUS COLLECTION',
  description:
    'Creative printing, design, branding, and customization services for businesses and personal projects.',
  phone: '',
  whatsapp: '',
  email: '',
  address: '',
  opening_hours: '',
  social_links: {},
}

function Home() {
  const [settings, setSettings] = useState<BusinessSettings>(defaultSettings)
  const [services, setServices] = useState<Service[]>([])
  const [showcase, setShowcase] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchHomeContent() {
      const [businessResult, servicesResult, showcaseResult] = await Promise.all([
        supabase.from('business_settings').select('*').maybeSingle(),
        supabase.from('services').select('*').order('created_at', { ascending: false }).limit(3),
        supabase.from('portfolio_items').select('*').order('created_at', { ascending: false }).limit(3),
      ])

      if (businessResult.error) {
        setError(businessResult.error.message)
        setLoading(false)
        return
      }

      if (servicesResult.error) {
        setError(servicesResult.error.message)
        setLoading(false)
        return
      }

      if (showcaseResult.error) {
        setError(showcaseResult.error.message)
        setLoading(false)
        return
      }

      if (businessResult.data) {
        setSettings({ ...defaultSettings, ...businessResult.data, social_links: businessResult.data.social_links || {} })
      }

      setServices(servicesResult.data || [])
      setShowcase(showcaseResult.data || [])
      setLoading(false)
    }

    fetchHomeContent()
  }, [])

  return (
    <div className="bg-[var(--brand-paper)]">
      <section className="border-b border-[var(--brand-line)] bg-[var(--brand-paper)]">
        <div className="page-shell grid gap-8 py-8 md:py-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-6 pt-4 lg:pt-10">
            <p className="section-label">Creative printing · branding · customization</p>

            <h1 className="max-w-3xl text-5xl font-black tracking-[-0.08em] text-[var(--brand-ink)] sm:text-6xl lg:text-[5.2rem] lg:leading-[0.9]">
              {settings.business_name}
            </h1>

            <p className="max-w-xl text-lg leading-8 text-[rgba(23,20,18,0.72)] sm:text-xl">
              {settings.description || 'We turn ideas into polished, professional print and design work that stands out.'}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/services" className="brand-button">
                Explore Services
              </Link>
              <Link to="/contact" className="brand-button--ghost">
                Start a Project
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden border border-[var(--brand-line)] bg-[var(--brand-paper-strong)] p-4 sm:p-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(88,106,78,0.16),transparent_42%)]" />
            <div className="relative grid gap-4">
              <div className="overflow-hidden border border-[var(--brand-line)] bg-white">
                <img
                  src={services[0]?.image_url || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80'}
                  alt={services[0]?.name || 'Creative workspace'}
                  className="h-[18rem] w-full object-cover sm:h-[22rem]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="space-y-2">
                  <p className="section-label">Studio Focus</p>
                  <h2 className="text-2xl font-black tracking-[-0.05em] text-[var(--brand-ink)]">
                    Transforming ideas into real-world presence.
                  </h2>
                </div>

                <div className="border border-[var(--brand-line)] bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-olive)]">
                  {settings.opening_hours || 'Mon–Sat'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-16 sm:py-20 lg:py-24">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="section-label">What we do</p>
            <h2 className="mt-3 section-title">Designed for brands that want to stand out.</h2>
          </div>

          <p className="max-w-2xl section-copy">
            From print production to brand storytelling, we create work that feels considered, memorable, and commercially effective.
          </p>
        </div>

        {loading ? (
          <div className="text-sm text-[rgba(23,20,18,0.7)]">Loading services...</div>
        ) : error ? (
          <div className="text-red-700">{error}</div>
        ) : services.length === 0 ? (
          <div className="border border-dashed border-[var(--brand-line)] bg-white/50 p-8 text-center text-[rgba(23,20,18,0.72)]">
            Services will appear here once the admin adds them.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <article className="group relative overflow-hidden border border-[var(--brand-line)] bg-white">
              <img src={services[0].image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'} alt={services[0].name} className="h-[30rem] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(23,20,18,0.72)] via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[rgba(255,255,255,0.76)]">
                  {services[0].category}
                </p>
                <h3 className="mt-3 text-3xl font-black tracking-[-0.06em]">{services[0].name}</h3>
                <p className="mt-3 max-w-lg text-sm leading-7 text-[rgba(255,255,255,0.82)]">
                  {services[0].description}
                </p>
              </div>
            </article>

            <div className="grid gap-6">
              {services.slice(1).map((service) => (
                <article key={service.id} className="overflow-hidden border border-[var(--brand-line)] bg-white">
                  <div className="grid min-h-[12rem] grid-cols-[0.9fr_1.1fr]">
                    <img src={service.image_url || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80'} alt={service.name} className="h-full w-full object-cover" />
                    <div className="flex flex-col justify-center p-6">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--brand-olive)]">
                        {service.category}
                      </p>
                      <h3 className="mt-3 text-2xl font-black tracking-[-0.05em] text-[var(--brand-ink)]">{service.name}</h3>
                      <p className="mt-3 text-sm leading-7 text-[rgba(23,20,18,0.72)]">{service.description}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="border-y border-[var(--brand-line)] bg-[var(--brand-paper-strong)]">
        <div className="page-shell py-16 sm:py-20">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="section-label">Selected work</p>
              <h2 className="mt-3 section-title">Recent projects with real presence.</h2>
            </div>
            <Link to="/showcase" className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--brand-ink)]">
              View all work
            </Link>
          </div>

          {showcase.length === 0 ? (
            <div className="border border-dashed border-[var(--brand-line)] bg-white/40 p-8 text-center text-[rgba(23,20,18,0.72)]">
              Showcase items will appear here once the admin uploads them.
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              {showcase.map((item, index) => (
                <article
                  key={item.id}
                  className={`group overflow-hidden border border-[var(--brand-line)] bg-white ${index % 2 === 1 ? 'lg:translate-y-10' : ''}`}
                >
                  <img src={item.image_url} alt={item.title} className="h-[22rem] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                  <div className="space-y-3 p-6">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--brand-olive)]">
                      {item.category || 'Project'}
                    </p>
                    <h3 className="text-2xl font-black tracking-[-0.05em] text-[var(--brand-ink)]">{item.title}</h3>
                    {item.description && <p className="text-sm leading-7 text-[rgba(23,20,18,0.72)]">{item.description}</p>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="page-shell py-16 sm:py-20 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="border border-[var(--brand-line)] bg-white p-6 sm:p-8">
            <p className="section-label">Why clients choose us</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.06em] text-[var(--brand-ink)] sm:text-5xl">
              Thoughtful creative direction, consistently delivered.
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="border border-[var(--brand-line)] bg-[var(--brand-paper-strong)] p-6">
              <p className="text-3xl font-black tracking-[-0.06em] text-[var(--brand-ink)]">Print</p>
              <p className="mt-3 text-sm leading-7 text-[rgba(23,20,18,0.72)]">Business materials, branded packaging, and visual assets designed with precision.</p>
            </div>
            <div className="border border-[var(--brand-line)] bg-white p-6">
              <p className="text-3xl font-black tracking-[-0.06em] text-[var(--brand-ink)]">Brand</p>
              <p className="mt-3 text-sm leading-7 text-[rgba(23,20,18,0.72)]">Identity work that gives your business a confident and recognizable presence.</p>
            </div>
            <div className="border border-[var(--brand-line)] bg-white p-6">
              <p className="text-3xl font-black tracking-[-0.06em] text-[var(--brand-ink)]">Design</p>
              <p className="mt-3 text-sm leading-7 text-[rgba(23,20,18,0.72)]">Visual systems, layouts, and assets that communicate clearly and sell effectively.</p>
            </div>
            <div className="border border-[var(--brand-line)] bg-[var(--brand-paper-strong)] p-6">
              <p className="text-3xl font-black tracking-[-0.06em] text-[var(--brand-ink)]">Custom</p>
              <p className="mt-3 text-sm leading-7 text-[rgba(23,20,18,0.72)]">Tailored execution for events, gifting, merchandise, and customer-facing experiences.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home