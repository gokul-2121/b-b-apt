import { NextResponse } from 'next/server'
import { clearAuthCookies } from '../../../../src/lib/auth'

export const runtime = 'nodejs'

export async function POST() {
  const response = NextResponse.json(
    { ok: true },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  )

  clearAuthCookies(response)
  return response
}
