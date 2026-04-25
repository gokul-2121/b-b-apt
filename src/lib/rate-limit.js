// Simple in-memory rate limiter. No external dependencies.
// State resets on serverless cold starts, which is fine for a simple site.

const WINDOW_SECONDS = 15 * 60
const MAX_ATTEMPTS = 10
const LOCKOUT_AFTER_FAILURES = 6
const LOCKOUT_SECONDS = 60

const memoryStore = new Map()

function getEntry(key) {
  const entry = memoryStore.get(key)
  if (!entry) return null
  if (entry.expiresAt <= Date.now()) {
    memoryStore.delete(key)
    return null
  }
  return entry
}

function setEntry(key, value, ttlSeconds) {
  memoryStore.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  })
}

function incrementEntry(key, ttlSeconds) {
  const existing = getEntry(key)
  const count = (existing ? existing.value : 0) + 1

  if (existing) {
    memoryStore.set(key, { value: count, expiresAt: existing.expiresAt })
  } else {
    setEntry(key, count, ttlSeconds)
  }

  return count
}

export async function evaluateLoginAttempt(clientKey) {
  const lockoutEntry = getEntry(`lockout:${clientKey}`)
  if (lockoutEntry) {
    const remaining = Math.max(1, Math.ceil((lockoutEntry.expiresAt - Date.now()) / 1000))
    return { allowed: false, reason: 'lockout', retryAfterSeconds: remaining }
  }

  const attempts = incrementEntry(`attempts:${clientKey}`, WINDOW_SECONDS)
  if (attempts > MAX_ATTEMPTS) {
    const remaining = Math.max(1, Math.ceil(
      ((getEntry(`attempts:${clientKey}`)?.expiresAt || Date.now()) - Date.now()) / 1000
    ))
    return { allowed: false, reason: 'rate-limit', retryAfterSeconds: remaining }
  }

  return { allowed: true, reason: 'ok', retryAfterSeconds: 0 }
}

export async function registerFailedLogin(clientKey) {
  const failures = incrementEntry(`failures:${clientKey}`, 24 * 60 * 60)

  if (failures >= LOCKOUT_AFTER_FAILURES) {
    setEntry(`lockout:${clientKey}`, true, LOCKOUT_SECONDS)
    return { failureCount: failures, locked: true, retryAfterSeconds: LOCKOUT_SECONDS }
  }

  return { failureCount: failures, locked: false, retryAfterSeconds: 0 }
}

export async function clearLoginGuardState(clientKey) {
  memoryStore.delete(`attempts:${clientKey}`)
  memoryStore.delete(`failures:${clientKey}`)
  memoryStore.delete(`lockout:${clientKey}`)
}
