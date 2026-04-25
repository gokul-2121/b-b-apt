import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { AUTH_COOKIE_NAME } from './src/lib/auth-constants'
import { getJwtSecret } from './src/lib/security-env'

const encoder = new TextEncoder()

async function isValidAdminToken(token) {
  if (!token) return false

  try {
    const secret = encoder.encode(getJwtSecret())
    const result = await jwtVerify(token, secret)
    return result.payload.role === 'admin'
  } catch {
    return false
  }
}

function applySecurityHeaders(response) {
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  return response
}

export async function middleware(request) {
  try {
    const { pathname } = request.nextUrl
    const isAdminPage = pathname.startsWith('/admin')
    const isAdminApi = pathname.startsWith('/api/admin')
    const isLoginPage = pathname === '/admin/login'
    const isLoginApi = pathname === '/api/admin/login'
    const authToken = request.cookies.get(AUTH_COOKIE_NAME)?.value

    if (isAdminApi && !isLoginApi) {
      console.log(`[Middleware] ${pathname} - authToken present:`, !!authToken)
    }

    // Protect admin pages and APIs (except login)
    if ((isAdminPage && !isLoginPage) || (isAdminApi && !isLoginApi)) {
      const authorized = await isValidAdminToken(authToken)

      if (isAdminApi && !isLoginApi) {
        console.log(`[Middleware] ${pathname} - authorized:`, authorized)
      }

      if (!authorized) {
        if (isAdminApi) {
          console.error(`[Middleware] ${pathname} - Unauthorized API request`)
          return applySecurityHeaders(
            NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
          )
        }

        const loginUrl = request.nextUrl.clone()
        loginUrl.pathname = '/admin/login'
        loginUrl.searchParams.set('next', pathname)
        return applySecurityHeaders(NextResponse.redirect(loginUrl))
      }
    }

    // Redirect from login page if already authenticated
    if (isLoginPage) {
      const authorized = await isValidAdminToken(authToken)
      if (authorized) {
        const adminUrl = request.nextUrl.clone()
        adminUrl.pathname = '/admin'
        return applySecurityHeaders(NextResponse.redirect(adminUrl))
      }
    }

    return applySecurityHeaders(NextResponse.next())
  } catch (err) {
    console.error('[Middleware] Error:', err)
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
