import { FormEvent, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Service = {
  id: string
  name: string
  description: string
  category: string
  image_url: string | null
}

function AdminServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')

  async function fetchServices() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setServices(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchServices()
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setSaving(true)
    setError('')

    const { error } = await supabase
      .from('services')
      .insert({
        name,
        description,
        category,
      })

    if (error) {
      setError(error.message)
      setSaving(false)
      return
    }

    setName('')
    setDescription('')
    setCategory('')
    setShowForm(false)
    setSaving(false)

    await fetchServices()
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Services
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Manage the services displayed on your website.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
        >
          {showForm ? 'Cancel' : 'Add Service'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-xl border border-gray-200 bg-white p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900">
            Add New Service
          </h2>

          <div className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="service-name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Service Name
              </label>

              <input
                id="service-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                placeholder="e.g. Graphic Design"
              />
            </div>

            <div>
              <label
                htmlFor="service-category"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Category
              </label>

              <input
                id="service-category"
                type="text"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                placeholder="e.g. Design"
              />
            </div>

            <div>
              <label
                htmlFor="service-description"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Description
              </label>

              <textarea
                id="service-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
                rows={5}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                placeholder="Describe this service..."
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Service'}
            </button>
          </div>
        </form>
      )}

      {!loading && !error && services.length === 0 && !showForm && (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            No services yet
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Add your first service to start displaying services on the website.
          </p>
        </div>
      )}

      {!loading && !error && services.length > 0 && (
        <div className="mt-8 space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    {service.category}
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-gray-900">
                    {service.name}
                  </h2>

                  <p className="mt-2 text-sm text-gray-600">
                    {service.description}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
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