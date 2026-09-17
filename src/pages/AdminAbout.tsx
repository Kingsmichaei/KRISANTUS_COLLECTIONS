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

  async function handleDeleteImage() {
  if (!about.id || !about.image_url) {
    return
  }

  const confirmed = window.confirm(
    'Are you sure you want to delete the About image?'
  )

  if (!confirmed) {
    return
  }

  setSaving(true)
  setError('')
  setSuccess('')

  try {
    await deleteFileFromBucket('showcase', about.image_url)

    const { error: updateError } = await supabase
      .from('about_content')
      .update({ image_url: null })
      .eq('id', about.id)

    if (updateError) {
      throw new Error(updateError.message)
    }

    setAbout((current) => ({
      ...current,
      image_url: '',
    }))

    setSelectedFile(null)
    setSuccess('About image deleted successfully.')
  } catch (deleteError) {
    setError(
      deleteError instanceof Error
        ? deleteError.message
        : 'Unable to delete the About image.'
    )
  } finally {
    setSaving(false)
  }
}

  if (loading) {
    return <div className="studio-card p-10 text-center text-sm text-[rgba(16,18,22,0.68)]">...</div>
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <p className="section-label">Site content</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.01em] sm:text-4xl">About</h1>
        <p className="mt-3 text-sm text-[rgba(16,18,22,0.68)]">Manage the story, values, and image displayed publicly on the About page.</p>
      </div>

      {error && <div className="banner-error">{error}</div>}
      {success && <div className="banner-success">{success}</div>}

      <form onSubmit={handleSubmit} className="border border-[var(--brand-line)] bg-white p-5 sm:p-8">
        <div className="grid gap-5">
          <div>
            <label htmlFor="about-heading" className="field-label">Heading</label>
            <input
              id="about-heading"
              value={about.heading}
              onChange={(event) => setAbout((current) => ({ ...current, heading: event.target.value }))}
              required
              className="field-input"
            />
          </div>

          <div>
            <label htmlFor="about-content" className="field-label">Content</label>
            <textarea
              id="about-content"
              rows={8}
              value={about.content}
              onChange={(event) => setAbout((current) => ({ ...current, content: event.target.value }))}
              required
              className="field-textarea"
            />
          </div>

          <div>
            <label htmlFor="about-image" className="field-label">About Image</label>
            <input
              id="about-image"
              type="file"
              accept="image/*"
              onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
              className="field-file"
            />
          </div>

         {about.image_url && (
  <div>
    <img
      src={about.image_url}
      alt={about.heading || 'About'}
      className="h-48 w-full object-cover sm:h-64"
    />

    <button
      type="button"
      onClick={handleDeleteImage}
      disabled={saving}
      className="mt-3 border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {saving ? 'Deleting...' : 'Delete Image'}
    </button>
  </div>
)}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
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
