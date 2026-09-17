import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { deleteFileFromBucket, resolvePublicUrl, uploadFileToBucket } from '../lib/content'
import type { PortfolioItem } from '../types'

function AdminShowcase() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')

  async function fetchItems() {
    const { data, error: fetchError } = await supabase
      .from('portfolio_items')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
      setLoading(false)
      return
    }

    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchItems()
  }, [])

  function resetForm() {
    setTitle('')
    setDescription('')
    setCategory('')
    setImageFile(null)
    setPreviewUrl('')
    setEditingId(null)
    setShowForm(false)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      let nextImageUrl = ''
      let nextStoragePath = ''

      if (imageFile) {
        nextStoragePath = await uploadFileToBucket('showcase', imageFile, 'portfolio')
        nextImageUrl = resolvePublicUrl('showcase', nextStoragePath)
      }

      if (editingId) {
        const currentItem = items.find((item) => item.id === editingId)
        const previousItem = currentItem || null

        if (imageFile && previousItem?.storage_path) {
          await deleteFileFromBucket('showcase', previousItem.storage_path)
        }

        const { error: updateError } = await supabase
          .from('portfolio_items')
          .update({
            title,
            description,
            category: category || null,
            image_url: nextImageUrl || previousItem?.image_url,
            storage_path: nextStoragePath || previousItem?.storage_path,
          })
          .eq('id', editingId)

        if (updateError) {
          throw new Error(updateError.message)
        }
      } else {
        const { error: insertError } = await supabase.from('portfolio_items').insert([
          {
            title,
            description,
            category: category || null,
            image_url: nextImageUrl,
            storage_path: nextStoragePath,
          },
        ])

        if (insertError) {
          throw new Error(insertError.message)
        }
      }

      setSuccess(editingId ? 'Work item updated successfully.' : 'Work item added successfully.')
      resetForm()
      await fetchItems()
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Something went wrong while saving the work item.'
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleEdit(item: PortfolioItem) {
    setEditingId(item.id)
    setTitle(item.title)
    setDescription(item.description || '')
    setCategory(item.category || '')
    setPreviewUrl(item.image_url)
    setShowForm(true)
    setError('')
    setSuccess('')
  }

  async function handleDelete(item: PortfolioItem) {
    const confirmed = window.confirm('Delete this showcase item? This cannot be undone.')

    if (!confirmed) {
      return
    }

    try {
      if (item.storage_path) {
        await deleteFileFromBucket('showcase', item.storage_path)
      }

      const { error: deleteError } = await supabase.from('portfolio_items').delete().eq('id', item.id)

      if (deleteError) {
        throw new Error(deleteError.message)
      }

      setSuccess('Work item deleted.')
      await fetchItems()
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : 'Unable to delete the work item.'
      )
    }
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) {
      setImageFile(null)
      setPreviewUrl('')
      return
    }

    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="section-label">Public content</p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.01em] sm:text-4xl">Showcase / Our Work</h1>
          <p className="mt-3 text-sm text-[rgba(16,18,22,0.68)]">
            Upload and manage the projects and creative work you want customers to see.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm()
            setShowForm((current) => !current)
          }}
          className="brand-button w-full sm:w-auto"
        >
          {showForm ? 'Cancel' : 'Add Work'}
        </button>
      </div>

      {error && <div className="banner-error">{error}</div>}
      {success && <div className="banner-success">{success}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-[var(--brand-line)] bg-white p-5 sm:p-8">
          <h2 className="font-display text-xl font-semibold text-[var(--brand-ink)]">{editingId ? 'Edit work item' : 'Add a new work item'}</h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="showcase-title" className="field-label">
                Title
              </label>
              <input
                id="showcase-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                className="field-input"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="showcase-description" className="field-label">
                Description
              </label>
              <textarea
                id="showcase-description"
                rows={4}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="field-textarea"
              />
            </div>

            <div>
              <label htmlFor="showcase-category" className="field-label">
                Category
              </label>
              <input
                id="showcase-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="field-input"
              />
            </div>

            <div>
              <label htmlFor="showcase-image" className="field-label">
                Image
              </label>
              <input
                id="showcase-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="field-file"
              />
            </div>
          </div>

          {previewUrl && (
            <div className="mt-6">
              <img src={previewUrl} alt={title || 'Selected work'} className="h-44 w-full object-cover sm:h-52" />
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="submit"
              disabled={saving}
              className="brand-button disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingId ? 'Update Item' : 'Save Item'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="studio-card p-10 text-center text-sm text-[rgba(16,18,22,0.68)]">
          Loading work items...
        </div>
      ) : items.length === 0 ? (
        <div className="border border-dashed border-[var(--brand-line-strong)] bg-white p-10 text-center">
          <h2 className="font-display text-lg font-semibold text-[var(--brand-ink)]">No work items yet</h2>
          <p className="mt-2 text-sm text-[rgba(16,18,22,0.68)]">Add your first project or branded work to show on the public showcase.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="studio-card overflow-hidden">
              <img src={item.image_url} alt={item.title} className="h-48 w-full object-cover sm:h-56" />

              <div className="space-y-3 p-4 sm:p-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--brand-olive)]">{item.category || 'General'}</p>
                  <h3 className="mt-2 font-display text-xl font-semibold text-[var(--brand-ink)]">{item.title}</h3>
                </div>

                {item.description && <p className="text-sm leading-6 text-[rgba(16,18,22,0.68)]">{item.description}</p>}

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="flex min-h-11 flex-1 items-center justify-center border border-[var(--brand-line)] px-3 text-sm font-medium text-[var(--brand-ink)] hover:bg-[var(--brand-paper)]"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
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

export default AdminShowcase
