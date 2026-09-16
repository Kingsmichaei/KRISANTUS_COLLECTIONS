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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Showcase / Our Work</h1>
          <p className="mt-2 text-sm text-gray-600">
            Upload and manage the projects and creative work you want customers to see.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm()
            setShowForm((current) => !current)
          }}
          className="rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
        >
          {showForm ? 'Cancel' : 'Add Work'}
        </button>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {success && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">{editingId ? 'Edit work item' : 'Add a new work item'}</h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="showcase-title" className="mb-2 block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                id="showcase-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="showcase-description" className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="showcase-description"
                rows={4}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label htmlFor="showcase-category" className="mb-2 block text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                id="showcase-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label htmlFor="showcase-image" className="mb-2 block text-sm font-medium text-gray-700">
                Image
              </label>
              <input
                id="showcase-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700"
              />
            </div>
          </div>

          {previewUrl && (
            <div className="mt-6">
              <img src={previewUrl} alt={title || 'Selected work'} className="h-52 w-full rounded-xl object-cover" />
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingId ? 'Update Item' : 'Save Item'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-600">
          Loading work items...
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-gray-900">No work items yet</h2>
          <p className="mt-2 text-sm text-gray-600">Add your first project or branded work to show on the public showcase.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <img src={item.image_url} alt={item.title} className="h-56 w-full object-cover" />

              <div className="space-y-3 p-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">{item.category || 'General'}</p>
                  <h3 className="mt-2 text-xl font-semibold text-gray-900">{item.title}</h3>
                </div>

                {item.description && <p className="text-sm leading-6 text-gray-600">{item.description}</p>}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
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

export default AdminShowcase
