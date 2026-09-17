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
    <div className="flex min-h-screen items-center justify-center bg-[var(--brand-paper)] px-4 py-12 sm:px-6">
      <div className="w-full max-w-md border border-[var(--brand-line)] bg-white p-6 sm:p-10">
        <p className="section-label">Studio CMS</p>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-[-0.01em] sm:text-4xl">
          Admin Login
        </h1>

        <p className="mt-3 text-sm text-[rgba(16,18,22,0.68)]">
          Sign in to manage Krisantus Collection.
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="field-label">
              Email
            </label>

            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="field-input"
            />
          </div>

          <div>
            <label htmlFor="password" className="field-label">
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="field-input"
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
