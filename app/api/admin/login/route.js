import { NextResponse } from 'next/server'
import { z } from 'zod'
import {
  createAuthToken,
  createCsrfToken,
  setAuthCookies,
  verifyAdminCredentials,
} from '../../../../src/lib/auth'
import {
  clearLoginGuardState,
  evaluateLoginAttempt,
  registerFailedLogin,
} from '../../../../src/lib/rate-limit'

const loginSchema = z.object({
  username: z.string().trim().min(1).max(80),
  password: z.string().min(1).max(200),
})

function getClientKey(request) {
  const cfIp = request.headers.get('cf-connecting-ip')
  if (cfIp) return cfIp.trim()

  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp.trim()

  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0].trim()

  return 'unknown'
}

export const runtime = 'nodejs'

export async function POST(request) {
  const clientKey = getClientKey(request)
  const guard = await evaluateLoginAttempt(clientKey)

  if (!guard.allowed) {
    return NextResponse.json(
      {
        error: guard.reason === 'lockout'
          ? 'Too many failed attempts. Account access is temporarily locked.'
          : 'Too many login attempts. Try again later.',
        retryAfterSeconds: guard.retryAfterSeconds,
      },
      {
        status: 429,
        headers: { 'Retry-After': String(guard.retryAfterSeconds) },
      }
    )
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 })
  }

  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    await registerFailedLogin(clientKey)
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 400 })
  }

  const isValid = verifyAdminCredentials(parsed.data.username, parsed.data.password)
  if (!isValid) {
    const failureState = await registerFailedLogin(clientKey)
    return NextResponse.json(
      {
        error: 'Invalid username or password',
        retryAfterSeconds: failureState.retryAfterSeconds,
      },
      { status: 401 }
    )
  }

  await clearLoginGuardState(clientKey)

  const token = await createAuthToken(parsed.data.username)
  const csrfToken = createCsrfToken()

  const response = NextResponse.json(
    { ok: true },
    { headers: { 'Cache-Control': 'no-store' } }
  )

  setAuthCookies(response, { token, csrfToken })
  return response
}
