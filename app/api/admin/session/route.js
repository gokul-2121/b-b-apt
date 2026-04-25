import { NextResponse } from 'next/server'
import { requireAdminSession } from '../../../../src/lib/auth'

export const runtime = 'nodejs'

export async function GET(request) {
  const session = await requireAdminSession(request)

  if (!session.ok) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401, headers: { 'Cache-Control': 'no-store' } }
    )
  }

  return NextResponse.json(
    {
      authenticated: true,
      username: session.payload.sub,
    },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
