import { NextResponse } from 'next/server'
import { requireAdminSession } from '../../../../src/lib/auth'
import { galleryInputSchema } from '../../../../src/lib/cms-schemas'
import { createGalleryItem, getAdminGalleryItems } from '../../../../src/lib/cms-store'

export const runtime = 'nodejs'

export async function GET(request) {
  const session = await requireAdminSession(request)
  if (!session.ok) {
    return NextResponse.json({ error: session.error }, { status: session.status })
  }

  const gallery = await getAdminGalleryItems()
  return NextResponse.json({ gallery }, { headers: { 'Cache-Control': 'no-store' } })
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

  const parsed = galleryInputSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid data' }, { status: 400 })
  }

  const item = await createGalleryItem(parsed.data)
  return NextResponse.json({ item }, { status: 201, headers: { 'Cache-Control': 'no-store' } })
}
