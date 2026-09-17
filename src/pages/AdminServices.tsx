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
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="section-label">Public content</p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.01em] sm:text-4xl">Services</h1>
          <p className="mt-3 text-sm text-[rgba(16,18,22,0.68)]">Manage the services displayed publicly on the website.</p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm()
            setShowForm((current) => !current)
          }}
          className="brand-button w-full sm:w-auto"
        >
          {showForm ? 'Cancel' : 'Add Service'}
        </button>
      </div>

      {error && <div className="banner-error">{error}</div>}
      {success && <div className="banner-success">{success}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-[var(--brand-line)] bg-white p-5 sm:p-8">
          <h2 className="font-display text-xl font-semibold text-[var(--brand-ink)]">{editingId ? 'Edit service' : 'Add a new service'}</h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="service-name" className="field-label">Service Name</label>
              <input
                id="service-name"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                required
                className="field-input"
              />
            </div>

            <div>
              <label htmlFor="service-category" className="field-label">Category</label>
              <input
                id="service-category"
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                required
                className="field-input"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="service-description" className="field-label">Description</label>
              <textarea
                id="service-description"
                rows={5}
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                required
                className="field-textarea"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="service-image" className="field-label">Image</label>
              <input
                id="service-image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="field-file"
              />
            </div>
          </div>

          {previewUrl && (
            <div className="mt-6">
              <img src={previewUrl} alt={form.name || 'Service preview'} className="h-44 w-full object-cover sm:h-52" />
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="submit"
              disabled={saving}
              className="brand-button disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingId ? 'Update Service' : 'Save Service'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="studio-card p-10 text-center text-sm text-[rgba(16,18,22,0.68)]">
          Loading services...
        </div>
      ) : services.length === 0 ? (
        <div className="border border-dashed border-[var(--brand-line-strong)] bg-white p-10 text-center">
          <h2 className="font-display text-lg font-semibold text-[var(--brand-ink)]">No services yet</h2>
          <p className="mt-2 text-sm text-[rgba(16,18,22,0.68)]">Add your first service to begin displaying it on the public website.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {services.map((service) => (
            <div key={service.id} className="studio-card overflow-hidden">
              {service.image_url && (
                <img src={service.image_url} alt={service.name} className="h-44 w-full object-cover sm:h-52" />
              )}

              <div className="p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-olive)]">{service.category}</p>
                <h2 className="mt-2 font-display text-xl font-semibold text-[var(--brand-ink)] sm:text-2xl">{service.name}</h2>
                <p className="mt-3 text-sm leading-6 text-[rgba(16,18,22,0.68)] sm:leading-7">{service.description}</p>

                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(service)}
                    className="flex min-h-11 flex-1 items-center justify-center border border-[var(--brand-line)] px-3 text-sm font-medium text-[var(--brand-ink)] hover:bg-[var(--brand-paper)]"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(service)}
                    className="flex min-h-11 flex-1 items-center justify-center border border-red-200 px-3 text-sm font-medium text-red-600 hover:bg-red-50"
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
