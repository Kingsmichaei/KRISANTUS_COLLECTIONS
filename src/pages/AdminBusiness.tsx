import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import type { BusinessSettings } from '../types'

const emptySettings: BusinessSettings = {
  business_name: '',
  description: '',
  phone: '',
  whatsapp: '',
  email: '',
  address: '',
  opening_hours: '',
  social_links: {
    facebook: '',
    instagram: '',
    whatsapp: '',
    linkedin: '',
  },
}

function AdminBusiness() {
  const [settings, setSettings] = useState<BusinessSettings>(emptySettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function fetchSettings() {
    const { data, error: fetchError } = await supabase
      .from('business_settings')
      .select('*')
      .maybeSingle()

    if (fetchError) {
      setError(fetchError.message)
      setLoading(false)
      return
    }

    if (data) {
      setSettings({
        ...data,
        social_links: data.social_links || {},
      })
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  function handleFieldChange(key: keyof BusinessSettings, value: string) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }))
  }

  function handleSocialChange(key: string, value: string) {
    setSettings((current) => ({
      ...current,
      social_links: {
        ...(current.social_links || {}),
        [key]: value,
      },
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const payload = {
        business_name: settings.business_name,
        description: settings.description || null,
        phone: settings.phone || null,
        whatsapp: settings.whatsapp || null,
        email: settings.email || null,
        address: settings.address || null,
        opening_hours: settings.opening_hours || null,
        social_links: settings.social_links || {},
      }

      if (settings.id) {
        const { error: updateError } = await supabase
          .from('business_settings')
          .update(payload)
          .eq('id', settings.id)

        if (updateError) {
          throw new Error(updateError.message)
        }
      } else {
        const { data, error: insertError } = await supabase.from('business_settings').insert([payload]).select().single()

        if (insertError) {
          throw new Error(insertError.message)
        }

        setSettings((current) => ({ ...current, id: data.id }))
      }

      setSuccess('Business information saved successfully.')
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'The business information could not be saved.'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="border border-[var(--brand-line)] bg-white p-10 text-center text-sm text-[rgba(23,20,18,0.68)]">
        Loading business information...
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="section-label">Site settings</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.07em]">Business Information</h1>
        <p className="mt-3 text-sm text-[rgba(23,20,18,0.68)]">
          Update the business details customers see across the website.
        </p>
      </div>

      {error && <div className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {success && <div className="border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div>}

      <form onSubmit={handleSubmit} className="border border-[var(--brand-line)] bg-white p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="business-name" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-olive)]">
              Business Name
            </label>
            <input
              id="business-name"
              value={settings.business_name}
              onChange={(event) => handleFieldChange('business_name', event.target.value)}
              required
              className="w-full border border-[var(--brand-line)] bg-[var(--brand-paper)] px-4 py-3 outline-none focus:border-[var(--brand-ink)]"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="business-description" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-olive)]">
              Description
            </label>
            <textarea
              id="business-description"
              rows={5}
              value={settings.description || ''}
              onChange={(event) => handleFieldChange('description', event.target.value)}
              className="w-full border border-[var(--brand-line)] bg-[var(--brand-paper)] px-4 py-3 outline-none focus:border-[var(--brand-ink)]"
            />
          </div>

          <div>
            <label htmlFor="business-phone" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-olive)]">Phone</label>
            <input
              id="business-phone"
              value={settings.phone || ''}
              onChange={(event) => handleFieldChange('phone', event.target.value)}
              className="w-full border border-[var(--brand-line)] bg-[var(--brand-paper)] px-4 py-3 outline-none focus:border-[var(--brand-ink)]"
            />
          </div>

          <div>
            <label htmlFor="business-whatsapp" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-olive)]">WhatsApp</label>
            <input
              id="business-whatsapp"
              value={settings.whatsapp || ''}
              onChange={(event) => handleFieldChange('whatsapp', event.target.value)}
              className="w-full border border-[var(--brand-line)] bg-[var(--brand-paper)] px-4 py-3 outline-none focus:border-[var(--brand-ink)]"
            />
          </div>

          <div>
            <label htmlFor="business-email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-olive)]">Email</label>
            <input
              id="business-email"
              type="email"
              value={settings.email || ''}
              onChange={(event) => handleFieldChange('email', event.target.value)}
              className="w-full border border-[var(--brand-line)] bg-[var(--brand-paper)] px-4 py-3 outline-none focus:border-[var(--brand-ink)]"
            />
          </div>

          <div>
            <label htmlFor="business-hours" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-olive)]">Opening Hours</label>
            <input
              id="business-hours"
              value={settings.opening_hours || ''}
              onChange={(event) => handleFieldChange('opening_hours', event.target.value)}
              className="w-full border border-[var(--brand-line)] bg-[var(--brand-paper)] px-4 py-3 outline-none focus:border-[var(--brand-ink)]"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="business-address" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-olive)]">Address</label>
            <textarea
              id="business-address"
              rows={3}
              value={settings.address || ''}
              onChange={(event) => handleFieldChange('address', event.target.value)}
              className="w-full border border-[var(--brand-line)] bg-[var(--brand-paper)] px-4 py-3 outline-none focus:border-[var(--brand-ink)]"
            />
          </div>

          <div>
            <label htmlFor="social-facebook" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-olive)]">Facebook</label>
            <input
              id="social-facebook"
              value={settings.social_links?.facebook || ''}
              onChange={(event) => handleSocialChange('facebook', event.target.value)}
              className="w-full border border-[var(--brand-line)] bg-[var(--brand-paper)] px-4 py-3 outline-none focus:border-[var(--brand-ink)]"
            />
          </div>

          <div>
            <label htmlFor="social-instagram" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-olive)]">Instagram</label>
            <input
              id="social-instagram"
              value={settings.social_links?.instagram || ''}
              onChange={(event) => handleSocialChange('instagram', event.target.value)}
              className="w-full border border-[var(--brand-line)] bg-[var(--brand-paper)] px-4 py-3 outline-none focus:border-[var(--brand-ink)]"
            />
          </div>

          <div>
            <label htmlFor="social-linkedin" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-olive)]">LinkedIn</label>
            <input
              id="social-linkedin"
              value={settings.social_links?.linkedin || ''}
              onChange={(event) => handleSocialChange('linkedin', event.target.value)}
              className="w-full border border-[var(--brand-line)] bg-[var(--brand-paper)] px-4 py-3 outline-none focus:border-[var(--brand-ink)]"
            />
          </div>

          <div>
            <label htmlFor="social-whatsapp" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-olive)]">WhatsApp Link</label>
            <input
              id="social-whatsapp"
              value={settings.social_links?.whatsapp || ''}
              onChange={(event) => handleSocialChange('whatsapp', event.target.value)}
              className="w-full border border-[var(--brand-line)] bg-[var(--brand-paper)] px-4 py-3 outline-none focus:border-[var(--brand-ink)]"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="brand-button disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Business Information'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminBusiness
