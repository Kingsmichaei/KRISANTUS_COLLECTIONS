import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { deleteFileFromBucket, resolvePublicUrl, uploadFileToBucket } from '../lib/content'
import type { AboutContent } from '../types'

const emptyAbout: AboutContent = {
  heading: '',
  content: '',
  image_url: '',
}

function AdminAbout() {
  const [about, setAbout] = useState<AboutContent>(emptyAbout)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  async function fetchAbout() {
    const { data, error: fetchError } = await supabase.from('about_content').select('*').maybeSingle()

    if (fetchError) {
      setError(fetchError.message)
      setLoading(false)
      return
    }

    if (data) {
      setAbout(data)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchAbout()
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      let imageUrl = about.image_url || ''
      let storagePath = ''

      if (selectedFile) {
        storagePath = await uploadFileToBucket('showcase', selectedFile, 'about')
        imageUrl = resolvePublicUrl('showcase', storagePath)
      }

      const payload = {
        heading: about.heading,
        content: about.content,
        image_url: imageUrl || null,
      }

      if (about.id) {
        if (selectedFile && about.image_url) {
          await deleteFileFromBucket('showcase', about.image_url)
        }

        const { error: updateError } = await supabase.from('about_content').update(payload).eq('id', about.id)

        if (updateError) {
          throw new Error(updateError.message)
        }
      } else {
        const { data, error: insertError } = await supabase.from('about_content').insert([payload]).select().single()

        if (insertError) {
          throw new Error(insertError.message)
        }

        setAbout((current) => ({ ...current, id: data.id }))
      }

      setSuccess('About content saved successfully.')
      await fetchAbout()
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : 'Unable to save the About content.'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="border border-[var(--brand-line)] bg-white p-10 text-center text-sm text-[rgba(23,20,18,0.68)]">Loading About content...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="section-label">Site content</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.07em]">About</h1>
        <p className="mt-3 text-sm text-[rgba(23,20,18,0.68)]">Manage the story, values, and image displayed publicly on the About page.</p>
      </div>

      {error && <div className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {success && <div className="border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div>}

      <form onSubmit={handleSubmit} className="border border-[var(--brand-line)] bg-white p-6 sm:p-8">
        <div className="grid gap-5">
          <div>
            <label htmlFor="about-heading" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-olive)]">Heading</label>
            <input
              id="about-heading"
              value={about.heading}
              onChange={(event) => setAbout((current) => ({ ...current, heading: event.target.value }))}
              required
              className="w-full border border-[var(--brand-line)] bg-[var(--brand-paper)] px-4 py-3 outline-none focus:border-[var(--brand-ink)]"
            />
          </div>

          <div>
            <label htmlFor="about-content" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-olive)]">Content</label>
            <textarea
              id="about-content"
              rows={8}
              value={about.content}
              onChange={(event) => setAbout((current) => ({ ...current, content: event.target.value }))}
              required
              className="w-full border border-[var(--brand-line)] bg-[var(--brand-paper)] px-4 py-3 outline-none focus:border-[var(--brand-ink)]"
            />
          </div>

          <div>
            <label htmlFor="about-image" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-olive)]">About Image</label>
            <input
              id="about-image"
              type="file"
              accept="image/*"
              onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
              className="block w-full border border-[var(--brand-line)] bg-[var(--brand-paper)] px-3 py-2 text-sm text-[var(--brand-ink)]"
            />
          </div>

          {about.image_url && (
            <div>
              <img src={about.image_url} alt={about.heading || 'About'} className="h-64 w-full object-cover" />
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="brand-button disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save About Content'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminAbout
