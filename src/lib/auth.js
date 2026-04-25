import crypto from 'node:crypto'
import { jwtVerify, SignJWT } from 'jose'
import {
  AUTH_COOKIE_NAME,
  CSRF_COOKIE_NAME,
  AUTH_SESSION_SECONDS,
} from './auth-constants'
import { getJwtSecret } from './security-env'

// Hardcoded admin credentials
const ADMIN_USERNAME = 'Admin@'
const ADMIN_PASSWORD = 'Admin123!'

const encoder = new TextEncoder()

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left))
  const rightBuffer = Buffer.from(String(right))

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer)
}

function isSameOriginRequest(request) {
  const origin = request.headers.get('origin')
  const host = request.headers.get('host')

  if (!origin || !host) {
    return true
  }

  try {
    const url = new URL(origin)
    return url.host === host
  } catch {
    return false
  }
}

export function verifyAdminCredentials(username, password) {
  const usernameMatch = safeEqual(String(username || ''), ADMIN_USERNAME)
  const passwordMatch = safeEqual(String(password || ''), ADMIN_PASSWORD)
  return usernameMatch && passwordMatch
}

export async function createAuthToken(username) {
  const secret = encoder.encode(getJwtSecret())

  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(username)
    .setIssuedAt()
    .setExpirationTime(`${AUTH_SESSION_SECONDS}s`)
    .sign(secret)
}

export async function verifyAuthToken(token) {
  if (!token) {
    return null
  }

  try {
    const secret = encoder.encode(getJwtSecret())
    const result = await jwtVerify(token, secret)
    return result.payload
  } catch {
    return null
  }
}

export function createCsrfToken() {
  return crypto.randomBytes(24).toString('hex')
}

function baseCookieOptions() {
  return {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  }
}

export function setAuthCookies(response, { token, csrfToken }) {
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    ...baseCookieOptions(),
    httpOnly: true,
    maxAge: AUTH_SESSION_SECONDS,
  })

  response.cookies.set(CSRF_COOKIE_NAME, csrfToken, {
    ...baseCookieOptions(),
    httpOnly: false,
    maxAge: AUTH_SESSION_SECONDS,
  })
}

export function clearAuthCookies(response) {
  response.cookies.set(AUTH_COOKIE_NAME, '', {
    ...baseCookieOptions(),
    httpOnly: true,
    maxAge: 0,
  })

  response.cookies.set(CSRF_COOKIE_NAME, '', {
    ...baseCookieOptions(),
    httpOnly: false,
    maxAge: 0,
  })
}

export async function requireAdminSession(request, { requireCsrf = false } = {}) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  const payload = await verifyAuthToken(token)

  if (!payload || payload.role !== 'admin') {
    return { ok: false, status: 401, error: 'Unauthorized' }
  }

  if (!requireCsrf) {
    return { ok: true, payload }
  }

  if (!isSameOriginRequest(request)) {
    return { ok: false, status: 403, error: 'Invalid request origin' }
  }

  const cookieCsrfToken = request.cookies.get(CSRF_COOKIE_NAME)?.value
  const headerCsrfToken = request.headers.get('x-csrf-token')

  if (!cookieCsrfToken || !headerCsrfToken || !safeEqual(cookieCsrfToken, headerCsrfToken)) {
    return { ok: false, status: 403, error: 'Invalid CSRF token' }
  }

  return { ok: true, payload }
}
