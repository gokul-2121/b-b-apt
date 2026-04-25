'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './login.module.css'

export default function AdminLoginPage() {
  const router = useRouter()
  const [nextPath, setNextPath] = useState('/admin')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const requestedPath = params.get('next')

    if (requestedPath && requestedPath.startsWith('/admin')) {
      setNextPath(requestedPath)
    }
  }, [])

  useEffect(() => {
    let active = true

    async function checkSession() {
      try {
        const response = await fetch('/api/admin/session', {
          credentials: 'include',
          cache: 'no-store',
        })

        if (active && response.ok) {
          router.replace('/admin')
        }
      } catch {
        // Ignore session check errors
      }
    }

    checkSession()
    return () => {
      active = false
    }
  }, [router])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        const retryHint =
          typeof data.retryAfterSeconds === 'number' && data.retryAfterSeconds > 0
            ? ` Please try again in ${data.retryAfterSeconds}s.`
            : ''

        throw new Error(`${data.error || 'Login failed'}${retryHint}`)
      }

      router.replace(nextPath)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.loginPage}>
      <div className={styles.loginPanel}>
        <p className={styles.eyebrow}>B&B Apartments</p>
        <h1 className={styles.title}>Admin CMS</h1>
        <p className={styles.subtitle}>Sign in to manage News and Gallery content</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Username</span>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label className={styles.field}>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </main>
  )
}
