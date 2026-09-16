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
    <div>
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                Creative & printing services
              </p>

              <h1 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                {settings.business_name}
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-700">
                {settings.description || 'We turn ideas into polished, professional print and design work that stands out.'}
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/services"
                  className="rounded-lg bg-black px-6 py-3 text-center text-sm font-semibold text-white hover:bg-gray-800"
                >
                  Explore Services
                </Link>
                <Link
                  to="/contact"
                  className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-900 hover:bg-gray-100"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">Let’s build your next project</h2>
              <div className="mt-6 space-y-4 text-sm text-gray-700">
                {settings.phone && <p>Phone: {settings.phone}</p>}
                {settings.email && <p>Email: {settings.email}</p>}
                {settings.address && <p>Address: {settings.address}</p>}
                {settings.opening_hours && <p>Opening Hours: {settings.opening_hours}</p>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Featured services</p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900">What we do best</h2>
          </div>
          <Link to="/services" className="text-sm font-semibold text-gray-900 hover:underline">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="text-sm text-gray-600">Loading services...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : services.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-600">
            Services will appear here once the admin adds them.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <article key={service.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                {service.image_url && <img src={service.image_url} alt={service.name} className="h-52 w-full object-cover" />}
                <div className="space-y-3 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">{service.category}</p>
                  <h3 className="text-2xl font-bold text-gray-900">{service.name}</h3>
                  <p className="text-sm leading-7 text-gray-600">{service.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Our work</p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900">Recent projects</h2>
          </div>

          {showcase.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
              Showcase items will appear here once the admin uploads them.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {showcase.map((item) => (
                <article key={item.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <img src={item.image_url} alt={item.title} className="h-56 w-full object-cover" />
                  <div className="space-y-2 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">{item.category || 'Work'}</p>
                    <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                    {item.description && <p className="text-sm leading-7 text-gray-600">{item.description}</p>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home