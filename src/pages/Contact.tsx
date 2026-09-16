import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { uploadFileToBucket } from '../lib/content'
import type { BusinessSettings, Service } from '../types'

const defaultSettings: BusinessSettings = {
  business_name: 'KRISANTUS COLLECTION',
  description: '',
  phone: '',
  whatsapp: '',
  email: '',
  address: '',
  opening_hours: '',
  social_links: {},
}

function Contact() {
  const [settings, setSettings] = useState<BusinessSettings>(defaultSettings)
  const [services, setServices] = useState<Service[]>([])
  const [selectedServiceId, setSelectedServiceId] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [preferredContact, setPreferredContact] = useState('WhatsApp')
  const [referenceFile, setReferenceFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchContactData() {
      const [businessResult, servicesResult] = await Promise.all([
        supabase.from('business_settings').select('*').maybeSingle(),
        supabase.from('services').select('*').order('created_at', { ascending: false }),
      ])

      if (businessResult.data) {
        setSettings({ ...defaultSettings, ...businessResult.data, social_links: businessResult.data.social_links || {} })
      }

      if (servicesResult.data) {
        setServices(servicesResult.data)
        if (servicesResult.data[0]) {
          setSelectedServiceId(servicesResult.data[0].id)
        }
      }
    }

    fetchContactData()
  }, [])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setReferenceFile(event.target.files?.[0] || null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setSuccess('')
    setError('')

    try {
      let referenceImageUrl = null as string | null

      if (referenceFile) {
        const uploadedPath = await uploadFileToBucket('references', referenceFile, 'inquiries')
        referenceImageUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/references/${uploadedPath}`
      }

      const { error: insertError } = await supabase.from('inquiries').insert([
        {
          name: fullName,
          phone,
          email: email || null,
          service_id: selectedServiceId || null,
          message,
          preferred_contact: preferredContact,
          reference_image_url: referenceImageUrl,
          status: 'NEW',
        },
      ])

      if (insertError) {
        throw new Error(insertError.message)
      }

      setSuccess('Your inquiry has been sent successfully. We will get back to you soon.')
      setFullName('')
      setPhone('')
      setEmail('')
      setMessage('')
      setPreferredContact('WhatsApp')
      setReferenceFile(null)
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : 'Unable to send the inquiry. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-[var(--brand-paper)]">
      <section className="page-shell py-14 sm:py-18 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="section-label">Get in touch</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.07em] text-[var(--brand-ink)] sm:text-5xl lg:text-6xl">
              Tell us about your next project.
            </h1>
          </div>

          <p className="max-w-xl text-lg leading-8 text-[rgba(23,20,18,0.72)]">
            We’d love to understand your goals, timeline, and the kind of work you want to bring to life.
          </p>
        </div>
      </section>

      <section className="page-shell pb-16 sm:pb-20 lg:pb-24">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border border-[var(--brand-line)] bg-white p-6 sm:p-8">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[var(--brand-olive)]">
              Contact details
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.06em] text-[var(--brand-ink)]">
              {settings.business_name}
            </h2>
            <p className="mt-5 text-base leading-8 text-[rgba(23,20,18,0.74)]">{settings.description}</p>

            <div className="mt-8 space-y-4 text-sm leading-7 text-[rgba(23,20,18,0.78)]">
              {settings.phone && <p>Phone: {settings.phone}</p>}
              {settings.email && <p>Email: {settings.email}</p>}
              {settings.address && <p>Address: {settings.address}</p>}
              {settings.opening_hours && <p>Opening Hours: {settings.opening_hours}</p>}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="border border-[var(--brand-line)] bg-white p-6 sm:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="full-name" className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[var(--brand-olive)]">
                  Full Name
                </label>
                <input
                  id="full-name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                  className="w-full border border-[var(--brand-line)] bg-[var(--brand-paper)] px-4 py-3 text-[var(--brand-ink)] outline-none focus:border-[var(--brand-ink)]"
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[var(--brand-olive)]">
                  Phone
                </label>
                <input
                  id="phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                  className="w-full border border-[var(--brand-line)] bg-[var(--brand-paper)] px-4 py-3 text-[var(--brand-ink)] outline-none focus:border-[var(--brand-ink)]"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[var(--brand-olive)]">
                  Email (optional)
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full border border-[var(--brand-line)] bg-[var(--brand-paper)] px-4 py-3 text-[var(--brand-ink)] outline-none focus:border-[var(--brand-ink)]"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="service-required" className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[var(--brand-olive)]">
                  Service Required
                </label>
                <select
                  id="service-required"
                  value={selectedServiceId}
                  onChange={(event) => setSelectedServiceId(event.target.value)}
                  className="w-full border border-[var(--brand-line)] bg-[var(--brand-paper)] px-4 py-3 text-[var(--brand-ink)] outline-none focus:border-[var(--brand-ink)]"
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="preferred-contact" className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[var(--brand-olive)]">
                  Preferred Contact Method
                </label>
                <select
                  id="preferred-contact"
                  value={preferredContact}
                  onChange={(event) => setPreferredContact(event.target.value)}
                  className="w-full border border-[var(--brand-line)] bg-[var(--brand-paper)] px-4 py-3 text-[var(--brand-ink)] outline-none focus:border-[var(--brand-ink)]"
                >
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Phone">Phone</option>
                  <option value="Email">Email</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="message" className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[var(--brand-olive)]">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  required
                  className="w-full border border-[var(--brand-line)] bg-[var(--brand-paper)] px-4 py-3 text-[var(--brand-ink)] outline-none focus:border-[var(--brand-ink)]"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="reference-image" className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[var(--brand-olive)]">
                  Reference Image (optional)
                </label>
                <input
                  id="reference-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full border border-[var(--brand-line)] bg-[var(--brand-paper)] px-3 py-2 text-sm text-[var(--brand-ink)]"
                />
              </div>
            </div>

            {error && <div className="mt-5 border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            {success && <div className="mt-5 border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full border border-[var(--brand-ink)] bg-[var(--brand-ink)] px-4 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white hover:bg-[var(--brand-ink-soft)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Sending inquiry...' : 'Send Inquiry'}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default Contact