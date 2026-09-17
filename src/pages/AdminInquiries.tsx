import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { deleteFileFromBucket, resolvePublicUrl } from '../lib/content'
import type { Inquiry } from '../types'

function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false)
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
      setMobileDetailOpen(false)
      await fetchInquiries()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete the inquiry.')
    }
  }

  const selectedService = selectedInquiry?.services && typeof selectedInquiry.services === 'object'
    ? (selectedInquiry.services as { name?: string | null }).name
    : null

  const detailPanel = selectedInquiry ? (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgba(16,18,22,0.5)]">Inquiry Details</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-[var(--brand-ink)]">{selectedInquiry.name}</h2>
        </div>

        <select
          value={selectedInquiry.status}
          onChange={(event) => updateStatus(selectedInquiry.id, event.target.value as Inquiry['status'])}
          className="field-select sm:w-auto"
        >
          <option value="NEW">NEW</option>
          <option value="CONTACTED">CONTACTED</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgba(16,18,22,0.5)]">Phone</p>
          <p className="mt-2 break-words text-sm text-[rgba(16,18,22,0.78)]">{selectedInquiry.phone || 'Not provided'}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgba(16,18,22,0.5)]">Email</p>
          <p className="mt-2 break-words text-sm text-[rgba(16,18,22,0.78)]">{selectedInquiry.email || 'Not provided'}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgba(16,18,22,0.5)]">Service</p>
          <p className="mt-2 text-sm text-[rgba(16,18,22,0.78)]">{selectedService || 'Not specified'}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgba(16,18,22,0.5)]">Preferred Contact</p>
          <p className="mt-2 text-sm text-[rgba(16,18,22,0.78)]">{selectedInquiry.preferred_contact || 'Not provided'}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgba(16,18,22,0.5)]">Message</p>
          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[rgba(16,18,22,0.78)] sm:leading-7">{selectedInquiry.message}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgba(16,18,22,0.5)]">Date</p>
          <p className="mt-2 text-sm text-[rgba(16,18,22,0.78)]">{new Date(selectedInquiry.created_at || Date.now()).toLocaleString()}</p>
        </div>
      </div>

      {selectedInquiry.reference_image_url && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[rgba(16,18,22,0.5)]">Reference Image</p>
          <img
            src={resolvePublicUrl('references', selectedInquiry.reference_image_url)}
            alt="Reference image for inquiry"
            className="max-h-72 w-full border border-[var(--brand-line)] object-contain"
          />
        </div>
      )}

      <button
        type="button"
        onClick={() => handleDelete(selectedInquiry.id, selectedInquiry.reference_image_url)}
        className="flex min-h-11 w-full items-center justify-center border border-red-200 px-4 text-sm font-medium text-red-600 hover:bg-red-50 sm:w-auto"
      >
        Delete Inquiry
      </button>
    </div>
  ) : (
    <div className="flex h-full min-h-[16rem] items-center justify-center text-sm text-[rgba(16,18,22,0.6)]">
      Select an inquiry to view details.
    </div>
  )

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <p className="section-label">Client conversations</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.01em] sm:text-4xl">Inquiries</h1>
        <p className="mt-3 text-sm text-[rgba(16,18,22,0.68)]">Review and manage customer messages and new requests.</p>
      </div>

      {error && <div className="banner-error">{error}</div>}
      {success && <div className="banner-success">{success}</div>}

      {loading ? (
        <div className="studio-card p-10 text-center text-sm text-[rgba(16,18,22,0.68)]">
          Loading inquiries...
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.1fr_1.4fr]">
          <div className="space-y-3">
            {inquiries.length === 0 ? (
              <div className="border border-dashed border-[var(--brand-line-strong)] bg-white p-8 text-center text-sm text-[rgba(16,18,22,0.68)]">
                No inquiries yet.
              </div>
            ) : (
              inquiries.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedInquiry(item)
                    setMobileDetailOpen(true)
                  }}
                  className={`w-full border p-4 text-left transition-colors ${
                    selectedInquiry?.id === item.id
                      ? 'border-[var(--brand-ink)] bg-[var(--brand-ink)] text-white'
                      : 'border-[var(--brand-line)] bg-white text-[var(--brand-ink)] hover:border-[var(--brand-line-strong)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{item.name}</p>
                      <p className={`truncate text-sm ${selectedInquiry?.id === item.id ? 'text-white/75' : 'text-[rgba(16,18,22,0.62)]'}`}>
                        {item.phone || item.email || 'No contact info'}
                      </p>
                    </div>
                    <span className={`shrink-0 px-2 py-1 text-xs font-medium ${selectedInquiry?.id === item.id ? 'bg-white text-[var(--brand-ink)]' : 'bg-[var(--brand-paper-strong)] text-[var(--brand-ink)]'}`}>
                      {item.status}
                    </span>
                  </div>

                  <div className={`mt-2 truncate text-sm ${selectedInquiry?.id === item.id ? 'text-white/75' : 'text-[rgba(16,18,22,0.62)]'}`}>
                    {selectedService && selectedInquiry?.id === item.id ? selectedService : 'Tap for details'}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Desktop / tablet: inline detail panel */}
          <div className="hidden border border-[var(--brand-line)] bg-white p-6 xl:block xl:p-8">
            {detailPanel}
          </div>

          {/* Mobile: full-screen detail overlay so the list and detail never fight for space */}
          <div
            className={`fixed inset-0 z-40 bg-[var(--brand-paper)] transition-transform duration-200 xl:hidden ${
              mobileDetailOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-[var(--brand-line)] bg-white px-4 py-3">
                <p className="text-sm font-semibold text-[var(--brand-ink)]">Inquiry details</p>
                <button
                  type="button"
                  onClick={() => setMobileDetailOpen(false)}
                  className="flex h-10 w-10 items-center justify-center text-xl text-[var(--brand-ink)]"
                  aria-label="Back to list"
                >
                  &times;
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">{detailPanel}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminInquiries
