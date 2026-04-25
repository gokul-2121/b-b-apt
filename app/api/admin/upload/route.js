import { NextResponse } from 'next/server'
import { requireAdminSession } from '../../../../src/lib/auth'
import { uploadImageFile } from '../../../../src/lib/media-store'

export const runtime = 'nodejs'

export async function POST(request) {
  console.log('[Upload API] Request received')
  const session = await requireAdminSession(request, { requireCsrf: false })
  console.log('[Upload API] Session check:', session)
  
  if (!session.ok) {
    console.error('[Upload API] Session failed:', session.error)
    return NextResponse.json({ error: session.error }, { status: session.status })
  }

  let formData
  try {
    formData = await request.formData()
    console.log('[Upload API] Form data received')
  } catch (error) {
    console.error('[Upload API] Form data error:', error)
    return NextResponse.json({ error: 'Invalid form payload' }, { status: 400 })
  }

  const file = formData.get('file')
  const folder = String(formData.get('folder') || 'general')

  console.log('[Upload API] File:', file?.name, 'Folder:', folder)

  if (!file || typeof file.arrayBuffer !== 'function') {
    console.error('[Upload API] No valid file')
    return NextResponse.json({ error: 'Image file is required' }, { status: 400 })
  }

  try {
    const uploaded = await uploadImageFile(file, { folder })
    console.log('[Upload API] Upload success:', uploaded.url)
    return NextResponse.json({ url: uploaded.url }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('[Upload API] Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 400 }
    )
  }
}
