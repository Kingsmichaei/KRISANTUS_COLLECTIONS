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
    return <div className="page-shell py-20 text-sm text-[rgba(23,20,18,0.7)]">Loading company information...</div>
  }

  if (error) {
    return <div className="page-shell py-20 text-red-700">{error}</div>
  }

  if (!about) {
    return (
      <div className="page-shell py-20 text-center">
        <h1 className="text-3xl font-black tracking-[-0.06em] text-[var(--brand-ink)]">About</h1>
        <p className="mt-4 text-[rgba(23,20,18,0.72)]">
          Information about the business will appear here once it is added from the admin panel.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-[var(--brand-paper)]">
      <section className="page-shell py-14 sm:py-18 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="section-label">About us</p>
            <h1 className="mt-4 max-w-2xl text-4xl font-black tracking-[-0.07em] text-[var(--brand-ink)] sm:text-5xl lg:text-6xl">
              {about.heading}
            </h1>
          </div>

          <p className="max-w-md text-lg leading-8 text-[rgba(23,20,18,0.72)]">
            We create thoughtful design and production work that helps businesses show up clearly and confidently.
          </p>
        </div>
      </section>

      <section className="page-shell pb-16 sm:pb-20 lg:pb-24">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          {about.image_url && (
            <div className="overflow-hidden border border-[var(--brand-line)] bg-white">
              <img src={about.image_url} alt={about.heading} className="h-[26rem] w-full object-cover lg:h-[40rem]" />
            </div>
          )}

          <div className="space-y-5 pt-2 text-lg leading-8 text-[rgba(23,20,18,0.8)]">
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
