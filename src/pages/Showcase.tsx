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
        .limit(30)

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
      <section className="page-shell py-10 sm:py-14 lg:py-16">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="section-label">Selected work</p>

            <h1 className="display-heading mt-4 text-[2rem] sm:text-3xl lg:text-4xl">
              Creative work shaped to feel personal and memorable.
            </h1>
          </div>

          <p className="max-w-xl text-base leading-7 text-[rgba(16,18,22,0.72)] sm:text-lg sm:leading-8">
            Explore selected print, design, branding, and customization
            projects created for people and businesses with something to say.
          </p>
        </div>
      </section>

      <section className="page-shell pb-12 sm:pb-16 lg:pb-20">
        {loading ? (
          <div className="text-sm text-[rgba(16,18,22,0.7)]">
            Loading showcase...
          </div>
        ) : error ? (
          <div className="banner-error">{error}</div>
        ) : items.length === 0 ? (
          <div className="border border-dashed border-[var(--brand-line)] bg-white/60 p-10 text-center text-[rgba(16,18,22,0.72)]">
            No showcase items have been uploaded yet.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden border border-[var(--brand-line)] bg-white"
              >
                <div className="group overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title || 'Portfolio item'}
                    width="800"
                    height="500"
                    loading="lazy"
                    decoding="async"
                    className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] sm:h-48"
                  />
                </div>

                <div className="p-5">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--brand-olive)]">
                    {item.category || 'Project'}
                  </p>

                  <h2 className="mt-2 font-display text-lg font-semibold tracking-[-0.01em] text-[var(--brand-ink)] sm:text-xl">
                    {item.title}
                  </h2>

                  {item.description && (
                    <p className="mt-2 text-sm leading-6 text-[rgba(16,18,22,0.72)]">
                      {item.description}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Showcase