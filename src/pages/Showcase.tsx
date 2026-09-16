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

  return (
    <div className="bg-[var(--brand-paper)]">
      <section className="page-shell py-14 sm:py-18 lg:py-20">
        <div className="max-w-4xl">
          <p className="section-label">Selected work</p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.07em] text-[var(--brand-ink)] sm:text-5xl lg:text-6xl">
            Creative work shaped to feel premium, personal, and memorable.
          </h1>
        </div>
      </section>

      <section className="page-shell pb-16 sm:pb-20 lg:pb-24">
        {loading ? (
          <div className="text-sm text-[rgba(23,20,18,0.7)]">Loading showcase...</div>
        ) : error ? (
          <div className="text-red-700">{error}</div>
        ) : items.length === 0 ? (
          <div className="border border-dashed border-[var(--brand-line)] bg-white/60 p-10 text-center text-[rgba(23,20,18,0.72)]">
            No showcase items have been uploaded yet.
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-12">
            {items.map((item, index) => {
              const position = index % 4
              const tall = position === 0 || position === 3
              const wide = position === 1 || position === 2

              return (
                <article
                  key={item.id}
                  className={`${
                    tall ? 'lg:col-span-5' : wide ? 'lg:col-span-7' : 'lg:col-span-4'
                  } overflow-hidden border border-[var(--brand-line)] bg-white`}
                >
                  <div className="group relative overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title || 'Portfolio item'}
                      className={`w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] ${
                        tall ? 'h-[28rem] lg:h-[36rem]' : 'h-[22rem] lg:h-[28rem]'
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(23,20,18,0.6)] via-transparent to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[rgba(255,255,255,0.76)]">
                        {item.category || 'Project'}
                      </p>
                      <h2 className="mt-3 text-2xl font-black tracking-[-0.05em] sm:text-3xl">{item.title}</h2>
                      {item.description && (
                        <p className="mt-3 max-w-lg text-sm leading-7 text-[rgba(255,255,255,0.82)]">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

export default Showcase