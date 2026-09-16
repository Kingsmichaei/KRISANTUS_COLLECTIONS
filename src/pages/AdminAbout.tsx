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
    return <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-600">Loading About content...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">About</h1>
        <p className="mt-2 text-sm text-gray-600">Manage the story, values, and image displayed publicly on the About page.</p>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {success && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div>}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5">
          <div>
            <label htmlFor="about-heading" className="mb-2 block text-sm font-medium text-gray-700">Heading</label>
            <input
              id="about-heading"
              value={about.heading}
              onChange={(event) => setAbout((current) => ({ ...current, heading: event.target.value }))}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label htmlFor="about-content" className="mb-2 block text-sm font-medium text-gray-700">Content</label>
            <textarea
              id="about-content"
              rows={8}
              value={about.content}
              onChange={(event) => setAbout((current) => ({ ...current, content: event.target.value }))}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label htmlFor="about-image" className="mb-2 block text-sm font-medium text-gray-700">About Image</label>
            <input
              id="about-image"
              type="file"
              accept="image/*"
              onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700"
            />
          </div>

          {about.image_url && (
            <div>
              <img src={about.image_url} alt={about.heading || 'About'} className="h-64 w-full rounded-xl object-cover" />
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save About Content'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminAbout
