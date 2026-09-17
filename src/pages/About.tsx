import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { AboutContent } from '../types'

function About() {
  const [about, setAbout] = useState<AboutContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchAbout() {
      const { data, error: fetchError } = await supabase.from('about_content').select('*').maybeSingle()

      if (fetchError) {
        setError(fetchError.message)
        setLoading(false)
        return
      }

      setAbout(data)
      setLoading(false)
    }

    fetchAbout()
  }, [])

  if (loading) {
    return <div className="page-shell py-16 text-sm text-[rgba(16,18,22,0.7)] sm:py-20">Loading company information...</div>
  }

  if (error) {
    return <div className="page-shell py-16 sm:py-20"><div className="banner-error">{error}</div></div>
  }

  if (!about) {
    return (
      <div className="page-shell py-16 text-center sm:py-20">
        <h1 className="font-display text-3xl font-semibold tracking-[-0.01em] text-[var(--brand-ink)]">About</h1>
        <p className="mt-4 text-[rgba(16,18,22,0.72)]">
          Information about the business will appear here once it is added from the admin panel.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-[var(--brand-paper)]">
      <section className="page-shell py-10 sm:py-14 lg:py-16">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="section-label">About us</p>
            <h1 className="display-heading mt-4 max-w-2xl text-[2.25rem] sm:text-5xl lg:text-6xl">
              {about.heading}
            </h1>
          </div>

          {/* <p className="max-w-md text-base leading-7 text-[rgba(16,18,22,0.72)] sm:text-lg sm:leading-8">
            We create thoughtful design and production work that helps businesses show up clearly and confidently.
          </p> */}
        </div>
      </section>

      <section className="page-shell pb-12 sm:pb-16 lg:pb-20">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          {about.image_url && (
            <div className="overflow-hidden border border-[var(--brand-line)] bg-white">
              <img src={about.image_url} alt={about.heading} className="h-64 w-full object-cover sm:h-96 lg:h-[40rem]" />
            </div>
          )}

          <div className="space-y-4 pt-1 text-base leading-7 text-[rgba(16,18,22,0.8)] sm:space-y-5 sm:text-lg sm:leading-8">
            {about.content.split('\n').map((paragraph, index) => (
              <p key={`${paragraph}-${index}`}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
