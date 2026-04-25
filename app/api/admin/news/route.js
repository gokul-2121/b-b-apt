import { NextResponse } from 'next/server'
import { requireAdminSession } from '../../../../src/lib/auth'
import { newsInputSchema } from '../../../../src/lib/cms-schemas'
import { createNews, getAdminNews } from '../../../../src/lib/cms-store'

export const runtime = 'nodejs'

export async function GET(request) {
  const session = await requireAdminSession(request)
  if (!session.ok) {
    return NextResponse.json({ error: session.error }, { status: session.status })
  }

  const news = await getAdminNews()
  return NextResponse.json({ news }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(request) {
  const session = await requireAdminSession(request, { requireCsrf: true })
  if (!session.ok) {
    return NextResponse.json({ error: session.error }, { status: session.status })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 })
  }

  console.log('[News API] Received body:', JSON.stringify(body, null, 2))

  const parsed = newsInputSchema.safeParse(body)
  if (!parsed.success) {
    console.error('[News API] Validation failed:', parsed.error.issues)
    return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid data' }, { status: 400 })
  }

  console.log('[News API] Parsed data:', JSON.stringify(parsed.data, null, 2))

  const item = await createNews(parsed.data)
  console.log('[News API] Saved item:', JSON.stringify(item, null, 2))
  
  return NextResponse.json({ item }, { status: 201, headers: { 'Cache-Control': 'no-store' } })
}
