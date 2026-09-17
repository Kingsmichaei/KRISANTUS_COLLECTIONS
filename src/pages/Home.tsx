import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { BusinessSettings, PortfolioItem, Service } from '../types'

const defaultSettings: BusinessSettings = {
  business_name: 'Krisantus Collection',
  description: 'Creative printing, design, branding, and customization services for businesses and personal projects.',
  phone: '', whatsapp: '', email: '', address: '', opening_hours: '', social_links: {},
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
        supabase.from('services').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('portfolio_items').select('*').order('created_at', { ascending: false }).limit(5),
      ])
      const failure = businessResult.error || servicesResult.error || showcaseResult.error
      if (failure) { setError(failure.message); setLoading(false); return }
      if (businessResult.data) setSettings({ ...defaultSettings, ...businessResult.data, social_links: businessResult.data.social_links || {} })
      setServices(servicesResult.data || [])
      setShowcase(showcaseResult.data || [])
      setLoading(false)
    }
    fetchHomeContent()
  }, [])

  const featuredImage = showcase[0]?.image_url || services[0]?.image_url || ''

  return (
    <div className="bg-[var(--brand-paper)]">
      <section className="overflow-hidden border-b border-[var(--brand-line)]">
        <div className="page-shell grid gap-8 py-10 sm:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12 lg:py-16">
          <div className="order-2 space-y-5 lg:order-1 sm:space-y-6">
            <p className="section-label">Printing · Design · Branding</p>
            <h1 className="display-heading max-w-xl text-[2.65rem] sm:text-6xl lg:text-[4.35rem]">
              Creative Solutions<br />for <span className="text-[var(--brand-olive)]">Your Brand</span>
            </h1>
            <p className="max-w-lg text-sm leading-6 text-[rgba(16,18,22,0.72)] sm:text-base sm:leading-7">
              {loading ? ' ' : settings.description || 'From eye-catching prints to powerful designs, we bring your ideas to life.'}
            </p>
            <Link to="/contact" className="brand-button">Get a Quote</Link>
          </div>
          <div className="order-1 relative min-h-[18rem] overflow-hidden bg-[var(--brand-ink)] lg:order-2 lg:min-h-[27rem]">
            {featuredImage ? (
              <img src={featuredImage} alt="Featured Krisantus Collection work" className="h-full min-h-[18rem] w-full object-cover lg:min-h-[27rem]" />
            ) : (
              <div className="h-full min-h-[18rem] bg-[linear-gradient(135deg,var(--brand-olive),var(--brand-ink))] lg:min-h-[27rem]" />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/45 via-transparent to-[var(--brand-olive)]/20" />
            <div className="absolute bottom-4 left-4 border-l-2 border-white pl-3 text-xs font-semibold uppercase tracking-[0.18em] text-white sm:bottom-6 sm:left-6">
              Make it memorable
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-10 sm:py-14 lg:py-16">
        <div className="mb-8 grid gap-5 sm:mb-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="section-label">Our services</p>
            <h2 className="mt-2 section-title">What We Do Best</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[rgba(16,18,22,0.65)]">
            We offer a complete range of creative services to help individuals and businesses stand out with quality, creativity and attention to detail.
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-[rgba(16,18,22,0.7)]">Loading services...</p>
        ) : error ? (
          <div className="banner-error">{error}</div>
        ) : services.length === 0 ? (
          <div className="border border-dashed border-[var(--brand-line)] p-8 text-center">
            Services will appear here once the admin adds them.
          </div>
        ) : (
          <div className="grid gap-0 border-y border-[var(--brand-line)] sm:grid-cols-2 lg:grid-cols-5">
            {services.map((service, index) => (
              <article
                key={service.id}
                className="group relative border-b border-[var(--brand-line)] px-5 py-7 sm:border-r sm:last:border-r-0 lg:border-b-0 lg:px-4"
              >
                <span className="font-display text-xs font-semibold text-[var(--brand-olive)]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 font-display text-base font-bold">{service.name}</h3>
                <p className="mt-2 text-xs leading-5 text-[rgba(16,18,22,0.62)]">{service.description}</p>
                <span className="mt-4 block h-0.5 w-8 bg-[var(--brand-olive)] transition-all duration-300 group-hover:w-12" />
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="border-y border-[var(--brand-line)] bg-white">
        <div className="page-shell py-10 sm:py-14 lg:py-16">
          <div className="mb-7 flex items-end justify-between gap-4 sm:mb-9">
            <div>
              <p className="section-label">Our work</p>
              <h2 className="mt-2 section-title">Featured Showcase</h2>
            </div>
            <Link to="/showcase" className="hidden text-xs font-semibold text-[var(--brand-olive)] sm:inline">
              View All Projects&nbsp;→
            </Link>
          </div>
          {showcase.length === 0 ? (
            <div className="border border-dashed border-[var(--brand-line)] p-8 text-center">
              Showcase items will appear here once the admin uploads them.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {showcase.map((item) => (
                <Link to="/showcase" key={item.id} className="group block overflow-hidden bg-[var(--brand-paper-strong)]">
                  <img src={item.image_url} alt={item.title} className="aspect-square h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="page-shell grid gap-8 py-10 sm:py-14 lg:grid-cols-[1fr_1fr] lg:items-center lg:py-16">
        <div className="overflow-hidden bg-[var(--brand-paper-strong)]">
          <img src={showcase[1]?.image_url || featuredImage || undefined} alt="Krisantus creative work" className="aspect-[1.35] w-full object-cover" />
        </div>
        <div>
          <p className="section-label">About us</p>
          <h2 className="mt-2 section-title">Your Vision, Our Creativity</h2>
          <p className="mt-4 max-w-lg text-sm leading-6 text-[rgba(16,18,22,0.68)]">
            Krisantus Collection is a creative printing and design studio committed to delivering high-quality, innovative and affordable solutions. We help individuals and businesses build strong brands through professional design, print and customization services.
          </p>
          <Link to="/about" className="brand-button brand-button--sm mt-6">Learn More</Link>
        </div>
      </section>

      <section className="bg-[var(--brand-olive)] text-white">
        <div className="page-shell flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-9">
          <div>
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-white/80">Let's create something amazing</p>
            <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Ready to Bring Your Ideas to Life?</h2>
            <p className="mt-1 text-sm text-white/80">Get in touch with us today for a free consultation or quote.</p>
          </div>
          <Link to="/contact" className="brand-button--light shrink-0">Get a Quote</Link>
        </div>
      </section>
    </div>
  )
}

export default Home