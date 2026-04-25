import { NextResponse } from 'next/server'
import { requireAdminSession } from '../../../../../src/lib/auth'
import { newsUpdateSchema } from '../../../../../src/lib/cms-schemas'
import { deleteNews, getAdminNews, updateNews } from '../../../../../src/lib/cms-store'
import { deleteManagedImage } from '../../../../../src/lib/media-store'

export const runtime = 'nodejs'

export async function PATCH(request, { params }) {
  const { id } = await params

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

  const parsed = newsUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid data' }, { status: 400 })
  }

  const item = await updateNews(id, parsed.data)
  if (!item) {
    return NextResponse.json({ error: 'News item not found' }, { status: 404 })
  }

  return NextResponse.json({ item }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function DELETE(request, { params }) {
  const { id } = await params

  const session = await requireAdminSession(request, { requireCsrf: true })
  if (!session.ok) {
    return NextResponse.json({ error: session.error }, { status: session.status })
  }

  const removed = await deleteNews(id)

  if (!removed) {
    return NextResponse.json({ error: 'News item not found' }, { status: 404 })
  }

  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } })
}
