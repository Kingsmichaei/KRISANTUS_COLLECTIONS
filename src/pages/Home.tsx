import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { BusinessSettings, PortfolioItem, Service } from '../types'

const defaultSettings: BusinessSettings = {
  business_name: 'Krisantus Collection',
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
      {/* Hero */}
      <section className="border-b border-[var(--brand-line)]">
        <div className="page-shell grid gap-8 py-10 sm:py-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:py-16">
          <div className="space-y-5 sm:space-y-6">
            <p className="section-label">Creative printing &middot; branding &middot; customization</p>

            <h1 className="display-heading max-w-3xl text-[2.5rem] sm:text-6xl lg:text-[4.6rem]">
              {settings.business_name}
            </h1>

            <p className="max-w-xl text-base leading-7 text-[rgba(16,18,22,0.72)] sm:text-lg sm:leading-8">
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

          <div className="relative overflow-hidden border border-[var(--brand-line)] bg-[var(--brand-paper-strong)] p-3.5 sm:p-5">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(29,78,216,0.14),transparent_42%)]" />
            <div className="relative grid gap-4">
              <div className="overflow-hidden border border-[var(--brand-line)] bg-white">
                <img
                  src={services[0]?.image_url || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80'}
                  alt={services[0]?.name || 'Creative workspace'}
                  className="h-56 w-full object-cover sm:h-72 lg:h-80"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="space-y-1.5">
                  <p className="section-label">Studio Focus</p>
                  <h2 className="font-display text-xl font-semibold tracking-[-0.01em] text-[var(--brand-ink)] sm:text-2xl">
                    Transforming ideas into real-world presence.
                  </h2>
                </div>

                <div className="border border-[var(--brand-line)] bg-white px-3.5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-olive)]">
                  {settings.opening_hours || 'Mon&ndash;Sat'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="page-shell py-12 sm:py-16 lg:py-20">
        <div className="mb-8 grid gap-5 sm:mb-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="section-label">What we do</p>
            <h2 className="mt-3 section-title">Designed for brands that want to stand out.</h2>
          </div>

          <p className="max-w-2xl section-copy">
            From print production to brand storytelling, we create work that feels considered, memorable, and commercially effective.
          </p>
        </div>

        {loading ? (
          <div className="text-sm text-[rgba(16,18,22,0.7)]">Loading services...</div>
        ) : error ? (
          <div className="banner-error">{error}</div>
        ) : services.length === 0 ? (
          <div className="border border-dashed border-[var(--brand-line)] bg-white/50 p-8 text-center text-[rgba(16,18,22,0.72)]">
            Services will appear here once the admin adds them.
          </div>
        ) : (
          <div className="grid gap-5 sm:gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <article className="group relative overflow-hidden border border-[var(--brand-line)] bg-white">
              <img
                src={services[0].image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'}
                alt={services[0].name}
                className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] sm:h-96 lg:h-[30rem]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(16,18,22,0.75)] via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[rgba(255,255,255,0.76)]">
                  {services[0].category}
                </p>
                <h3 className="mt-2.5 font-display text-2xl font-semibold tracking-[-0.01em] sm:text-3xl">{services[0].name}</h3>
                <p className="mt-2.5 max-w-lg text-sm leading-6 text-[rgba(255,255,255,0.85)] sm:leading-7">
                  {services[0].description}
                </p>
              </div>
            </article>

            <div className="grid gap-5 sm:gap-6">
              {services.slice(1).map((service) => (
                <article key={service.id} className="overflow-hidden border border-[var(--brand-line)] bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-[0.9fr_1.1fr] sm:min-h-[12rem]">
                    <img
                      src={service.image_url || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80'}
                      alt={service.name}
                      className="h-44 w-full object-cover sm:h-full"
                    />
                    <div className="flex flex-col justify-center p-5 sm:p-6">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[var(--brand-olive)]">
                        {service.category}
                      </p>
                      <h3 className="mt-2 font-display text-xl font-semibold tracking-[-0.01em] text-[var(--brand-ink)]">{service.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-[rgba(16,18,22,0.72)] sm:leading-7">{service.description}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Showcase preview */}
      <section className="border-y border-[var(--brand-line)] bg-[var(--brand-paper-strong)]">
        <div className="page-shell py-12 sm:py-16">
          <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div>
              <p className="section-label">Selected work</p>
              <h2 className="mt-3 section-title">Recent projects with real presence.</h2>
            </div>
            <Link to="/showcase" className="inline-flex min-h-11 items-center text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--brand-ink)]">
              View all work &rarr;
            </Link>
          </div>

          {showcase.length === 0 ? (
            <div className="border border-dashed border-[var(--brand-line)] bg-white/40 p-8 text-center text-[rgba(16,18,22,0.72)]">
              Showcase items will appear here once the admin uploads them.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {showcase.map((item, index) => (
                <article
                  key={item.id}
                  className={`group overflow-hidden border border-[var(--brand-line)] bg-white ${index % 2 === 1 ? 'lg:translate-y-8' : ''}`}
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] sm:h-72"
                  />
                  <div className="space-y-2.5 p-5">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[var(--brand-olive)]">
                      {item.category || 'Project'}
                    </p>
                    <h3 className="font-display text-xl font-semibold tracking-[-0.01em] text-[var(--brand-ink)]">{item.title}</h3>
                    {item.description && <p className="text-sm leading-6 text-[rgba(16,18,22,0.72)]">{item.description}</p>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why us */}
      <section className="page-shell py-12 sm:py-16 lg:py-20">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="border border-[var(--brand-line)] bg-white p-6 sm:p-8">
            <p className="section-label">Why clients choose us</p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-[-0.01em] text-[var(--brand-ink)] sm:text-4xl">
              Thoughtful creative direction, consistently delivered.
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            <div className="border border-[var(--brand-line)] bg-[var(--brand-paper-strong)] p-5 sm:p-6">
              <p className="font-display text-2xl font-semibold tracking-[-0.01em] text-[var(--brand-ink)] sm:text-3xl">Print</p>
              <p className="mt-2.5 text-sm leading-6 text-[rgba(16,18,22,0.72)] sm:leading-7">Business materials, branded packaging, and visual assets designed with precision.</p>
            </div>
            <div className="border border-[var(--brand-line)] bg-white p-5 sm:p-6">
              <p className="font-display text-2xl font-semibold tracking-[-0.01em] text-[var(--brand-ink)] sm:text-3xl">Brand</p>
              <p className="mt-2.5 text-sm leading-6 text-[rgba(16,18,22,0.72)] sm:leading-7">Identity work that gives your business a confident and recognizable presence.</p>
            </div>
            <div className="border border-[var(--brand-line)] bg-white p-5 sm:p-6">
              <p className="font-display text-2xl font-semibold tracking-[-0.01em] text-[var(--brand-ink)] sm:text-3xl">Design</p>
              <p className="mt-2.5 text-sm leading-6 text-[rgba(16,18,22,0.72)] sm:leading-7">Visual systems, layouts, and assets that communicate clearly and sell effectively.</p>
            </div>
            <div className="border border-[var(--brand-line)] bg-[var(--brand-paper-strong)] p-5 sm:p-6">
              <p className="font-display text-2xl font-semibold tracking-[-0.01em] text-[var(--brand-ink)] sm:text-3xl">Custom</p>
              <p className="mt-2.5 text-sm leading-6 text-[rgba(16,18,22,0.72)] sm:leading-7">Tailored execution for events, gifting, merchandise, and customer-facing experiences.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
