import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { deleteFileFromBucket, resolvePublicUrl } from '../lib/content'
import type { Inquiry } from '../types'

function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function fetchInquiries() {
    const { data, error: fetchError } = await supabase
      .from('inquiries')
      .select('*, services(name)')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
      setLoading(false)
      return
    }

    setInquiries((data || []) as Inquiry[])
    setLoading(false)
  }

  useEffect(() => {
    fetchInquiries()
  }, [])

  async function updateStatus(inquiryId: string, status: Inquiry['status']) {
    const { error: updateError } = await supabase
      .from('inquiries')
      .update({ status })
      .eq('id', inquiryId)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setSuccess('Inquiry status updated.')
    await fetchInquiries()
    setSelectedInquiry((current) => (current ? { ...current, status } : current))
  }

  async function handleDelete(id: string, referenceImageUrl?: string | null) {
    const confirmed = window.confirm('Delete this inquiry? This action cannot be undone.')

    if (!confirmed) {
      return
    }

    try {
      if (referenceImageUrl) {
        await deleteFileFromBucket('references', referenceImageUrl)
      }

      const { error: deleteError } = await supabase.from('inquiries').delete().eq('id', id)

      if (deleteError) {
        throw new Error(deleteError.message)
      }

      setSuccess('Inquiry deleted.')
      setSelectedInquiry(null)
      await fetchInquiries()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete the inquiry.')
    }
  }

  const selectedService = selectedInquiry?.services && typeof selectedInquiry.services === 'object'
    ? (selectedInquiry.services as { name?: string | null }).name
    : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Inquiries</h1>
        <p className="mt-2 text-sm text-gray-600">Review and manage customer messages and new requests.</p>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {success && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div>}

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-600">
          Loading inquiries...
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.1fr_1.4fr]">
          <div className="space-y-4">
            {inquiries.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600">
                No inquiries yet.
              </div>
            ) : (
              inquiries.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedInquiry(item)}
                  className={`w-full rounded-2xl border p-4 text-left shadow-sm transition ${
                    selectedInquiry?.id === item.id
                      ? 'border-black bg-gray-900 text-white'
                      : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className={`text-sm ${selectedInquiry?.id === item.id ? 'text-gray-200' : 'text-gray-600'}`}>
                        {item.phone || item.email || 'No contact info'}
                      </p>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${selectedInquiry?.id === item.id ? 'bg-white text-black' : 'bg-gray-100 text-gray-700'}`}>
                      {item.status}
                    </span>
                  </div>

                  <div className={`mt-3 text-sm ${selectedInquiry?.id === item.id ? 'text-gray-200' : 'text-gray-600'}`}>
                    {selectedService ?? 'Service not specified'}
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            {selectedInquiry ? (
              <div className="space-y-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Inquiry Details</p>
                    <h2 className="mt-2 text-2xl font-bold text-gray-900">{selectedInquiry.name}</h2>
                  </div>

                  <select
                    value={selectedInquiry.status}
                    onChange={(event) => updateStatus(selectedInquiry.id, event.target.value as Inquiry['status'])}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:border-black"
                  >
                    <option value="NEW">NEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Phone</p>
                    <p className="mt-2 text-sm text-gray-700">{selectedInquiry.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Email</p>
                    <p className="mt-2 text-sm text-gray-700">{selectedInquiry.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Service</p>
                    <p className="mt-2 text-sm text-gray-700">{selectedService || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Preferred Contact</p>
                    <p className="mt-2 text-sm text-gray-700">{selectedInquiry.preferred_contact || 'Not provided'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Message</p>
                    <p className="mt-2 whitespace-pre-line text-sm leading-7 text-gray-700">{selectedInquiry.message}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Date</p>
                    <p className="mt-2 text-sm text-gray-700">{new Date(selectedInquiry.created_at || Date.now()).toLocaleString()}</p>
                  </div>
                </div>

                {selectedInquiry.reference_image_url && (
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Reference Image</p>
                    <img
                      src={resolvePublicUrl('references', selectedInquiry.reference_image_url)}
                      alt="Reference image for inquiry"
                      className="max-h-72 rounded-xl border border-gray-200 object-contain"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleDelete(selectedInquiry.id, selectedInquiry.reference_image_url)}
                  className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Delete Inquiry
                </button>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-600">
                Select an inquiry to view details.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminInquiries
