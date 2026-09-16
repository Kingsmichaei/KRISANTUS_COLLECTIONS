import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { deleteFileFromBucket, resolvePublicUrl, uploadFileToBucket } from '../lib/content'
import type { Service } from '../types'

const emptyForm = {
  name: '',
  category: '',
  description: '',
}

function AdminServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')

  async function fetchServices() {
    const { data, error: fetchError } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
      setLoading(false)
      return
    }

    setServices(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchServices()
  }, [])

  function resetForm() {
    setForm(emptyForm)
    setImageFile(null)
    setPreviewUrl('')
    setEditingId(null)
    setShowForm(false)
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] || null
    setImageFile(nextFile)
    setPreviewUrl(nextFile ? URL.createObjectURL(nextFile) : '')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      let imageUrl = ''
      let storagePath = ''

      if (imageFile) {
        storagePath = await uploadFileToBucket('services', imageFile, 'service-images')
        imageUrl = resolvePublicUrl('services', storagePath)
      }

      if (editingId) {
        const currentService = services.find((service) => service.id === editingId)

        if (imageFile && currentService?.image_url) {
          await deleteFileFromBucket('services', currentService.image_url)
        }

        const { error: updateError } = await supabase
          .from('services')
          .update({
            name: form.name,
            category: form.category,
            description: form.description,
            image_url: imageUrl || currentService?.image_url || null,
          })
          .eq('id', editingId)

        if (updateError) {
          throw new Error(updateError.message)
        }
      } else {
        const { error: insertError } = await supabase.from('services').insert([
          {
            name: form.name,
            category: form.category,
            description: form.description,
            image_url: imageUrl || null,
          },
        ])

        if (insertError) {
          throw new Error(insertError.message)
        }
      }

      setSuccess(editingId ? 'Service updated successfully.' : 'Service added successfully.')
      resetForm()
      await fetchServices()
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'The service could not be saved.'
      )
    } finally {
      setSaving(false)
    }
  }

  function handleEdit(service: Service) {
    setEditingId(service.id)
    setForm({
      name: service.name,
      category: service.category,
      description: service.description,
    })
    setPreviewUrl(service.image_url || '')
    setShowForm(true)
    setError('')
    setSuccess('')
  }

  async function handleDelete(service: Service) {
    const confirmed = window.confirm('Delete this service? This action cannot be undone.')

    if (!confirmed) {
      return
    }

    try {
      if (service.image_url) {
        await deleteFileFromBucket('services', service.image_url)
      }

      const { error: deleteError } = await supabase.from('services').delete().eq('id', service.id)

      if (deleteError) {
        throw new Error(deleteError.message)
      }

      setSuccess('Service deleted successfully.')
      await fetchServices()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete the service.')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="section-label">Public content</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.07em]">Services</h1>
          <p className="mt-3 text-sm text-[rgba(23,20,18,0.68)]">Manage the services displayed publicly on the website.</p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm()
            setShowForm((current) => !current)
          }}
          className="brand-button"
        >
          {showForm ? 'Cancel' : 'Add Service'}
        </button>
      </div>

      {error && <div className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {success && <div className="border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-[var(--brand-line)] bg-white p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-gray-900">{editingId ? 'Edit service' : 'Add a new service'}</h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="service-name" className="mb-2 block text-sm font-medium text-gray-700">Service Name</label>
              <input
                id="service-name"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label htmlFor="service-category" className="mb-2 block text-sm font-medium text-gray-700">Category</label>
              <input
                id="service-category"
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="service-description" className="mb-2 block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="service-description"
                rows={5}
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="service-image" className="mb-2 block text-sm font-medium text-gray-700">Image</label>
              <input
                id="service-image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700"
              />
            </div>
          </div>

          {previewUrl && (
            <div className="mt-6">
              <img src={previewUrl} alt={form.name || 'Service preview'} className="h-48 w-full rounded-xl object-cover" />
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingId ? 'Update Service' : 'Save Service'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-600">
          Loading services...
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-gray-900">No services yet</h2>
          <p className="mt-2 text-sm text-gray-600">Add your first service to begin displaying it on the public website.</p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {services.map((service) => (
            <div key={service.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              {service.image_url && (
                <img src={service.image_url} alt={service.name} className="h-52 w-full object-cover" />
              )}

              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">{service.category}</p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">{service.name}</h2>
                <p className="mt-3 text-sm leading-7 text-gray-600">{service.description}</p>

                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(service)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(service)}
                    className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminServices