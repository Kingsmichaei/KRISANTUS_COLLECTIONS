import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getCurrentUser } from '../lib/auth'

type ProtectedRouteProps = {
  children: React.ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      const user = await getCurrentUser()

      setAuthenticated(!!user)
      setLoading(false)
    }

    checkAuth()
  }, [])

  if (loading) {
    return <p>Checking authentication...</p>
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default ProtectedRoute