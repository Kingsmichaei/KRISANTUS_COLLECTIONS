import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function AdminLogin() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    navigate('/admin')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--brand-paper)] px-6 py-12">
      <div className="w-full max-w-md border border-[var(--brand-line)] bg-white p-8 sm:p-10">
        <p className="section-label">Studio CMS</p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.07em]">
          Admin Login
        </h1>

        <p className="mt-3 text-sm text-[rgba(23,20,18,0.68)]">
          Sign in to manage KRISANTUS COLLECTION.
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-olive)]"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full border border-[var(--brand-line)] bg-[var(--brand-paper)] px-4 py-3 outline-none focus:border-[var(--brand-ink)]"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-olive)]"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full border border-[var(--brand-line)] bg-[var(--brand-paper)] px-4 py-3 outline-none focus:border-[var(--brand-ink)]"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="brand-button w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin