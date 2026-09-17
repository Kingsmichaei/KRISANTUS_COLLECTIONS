import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { uploadFileToBucket } from '../lib/content'
import type { BusinessSettings, Service } from '../types'

const defaultSettings: BusinessSettings = {
  business_name: 'Krisantus Collection',
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
  const [loading, setLoading] = useState(true)

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
      setLoading(false)
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
      <section className="page-shell py-10 sm:py-14 lg:py-16">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="section-label">Get in touch</p>
            <h1 className="display-heading mt-4 text-[2.25rem] sm:text-5xl lg:text-6xl">
              Tell us about your next project.
            </h1>
          </div>

          <p className="max-w-xl text-base leading-7 text-[rgba(16,18,22,0.72)] sm:text-lg sm:leading-8">
            We&rsquo;d love to understand your goals, timeline, and the kind of work you want to bring to life.
          </p>
        </div>
      </section>

      <section className="page-shell pb-12 sm:pb-16 lg:pb-20">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border border-[var(--brand-line)] bg-white p-5 sm:p-8">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--brand-olive)]">
              Contact details
            </p>
            <h2 className="mt-4 font-display text-2xl font-semibold tracking-[-0.01em] text-[var(--brand-ink)] sm:text-3xl">
            {loading ? '\u00A0' : settings.business_name}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[rgba(16,18,22,0.74)] sm:text-base sm:leading-8"> 
            {loading ? '\u00A0' : settings.description}</p>
        
            <div className="mt-6 space-y-3.5 text-sm leading-7 text-[rgba(16,18,22,0.78)] sm:mt-8">
              {settings.phone && (
                <p className="break-words">
                  <span className="font-semibold text-[var(--brand-ink)]">Phone:</span> {settings.phone}
                </p>
              )}
              {settings.email && (
                <p className="break-words">
                  <span className="font-semibold text-[var(--brand-ink)]">Email:</span> {settings.email}
                </p>
              )}
              {settings.address && (
                <p className="break-words">
                  <span className="font-semibold text-[var(--brand-ink)]">Address:</span> {settings.address}
                </p>
              )}
              {settings.opening_hours && (
                <p className="break-words">
                  <span className="font-semibold text-[var(--brand-ink)]">Opening Hours:</span> {settings.opening_hours}
                </p>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="border border-[var(--brand-line)] bg-white p-5 sm:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="full-name" className="field-label">
                  Full Name
                </label>
                <input
                  id="full-name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                  className="field-input"
                />
              </div>

              <div>
                <label htmlFor="phone" className="field-label">
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                  className="field-input"
                />
              </div>

              <div>
                <label htmlFor="email" className="field-label">
                  Email (optional)
                </label>
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="field-input"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="service-required" className="field-label">
                  Service Required
                </label>
                <select
                  id="service-required"
                  value={selectedServiceId}
                  onChange={(event) => setSelectedServiceId(event.target.value)}
                  className="field-select"
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
                <label htmlFor="preferred-contact" className="field-label">
                  Preferred Contact Method
                </label>
                <select
                  id="preferred-contact"
                  value={preferredContact}
                  onChange={(event) => setPreferredContact(event.target.value)}
                  className="field-select"
                >
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Phone">Phone</option>
                  <option value="Email">Email</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="message" className="field-label">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  required
                  className="field-textarea"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="reference-image" className="field-label">
                  Reference Image (optional)
                </label>
                <input
                  id="reference-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="field-file"
                />
              </div>
            </div>

            {error && <div className="mt-5 banner-error">{error}</div>}
            {success && <div className="mt-5 banner-success">{success}</div>}

            <button
              type="submit"
              disabled={submitting}
              className="brand-button mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60"
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
