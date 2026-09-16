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
    return <div className="mx-auto max-w-7xl px-6 py-20 text-sm text-gray-600">Loading company information...</div>
  }

  if (error) {
    return <div className="mx-auto max-w-7xl px-6 py-20 text-red-600">{error}</div>
  }

  if (!about) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900">About</h1>
        <p className="mt-4 text-gray-600">Information about the business will appear here once it is added from the admin panel.</p>
      </div>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">About us</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">{about.heading}</h1>
          <div className="mt-6 space-y-5 text-lg leading-8 text-gray-700">
            {about.content.split('\n').map((paragraph, index) => (
              <p key={`${paragraph}-${index}`}>{paragraph}</p>
            ))}
          </div>
        </div>

        {about.image_url && (
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <img src={about.image_url} alt={about.heading} className="h-full w-full object-cover" />
          </div>
        )}
      </div>
    </section>
  )
}

export default About
