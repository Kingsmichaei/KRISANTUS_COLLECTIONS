import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { PortfolioItem } from '../types'

function Showcase() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
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

    fetchItems()
  }, [])

  if (loading) {
    return <div className="mx-auto max-w-7xl px-6 py-20 text-sm text-gray-600">Loading showcase...</div>
  }

  if (error) {
    return <div className="mx-auto max-w-7xl px-6 py-20 text-red-600">{error}</div>
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Our work</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Recent design and print work</h1>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-600">
          No showcase items have been uploaded yet.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <img src={item.image_url} alt={item.title || 'Portfolio item'} className="h-64 w-full object-cover" />
              <div className="space-y-3 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">{item.category || 'Project'}</p>
                <h2 className="text-2xl font-bold text-gray-900">{item.title}</h2>
                {item.description && <p className="text-sm leading-7 text-gray-600">{item.description}</p>}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default Showcase