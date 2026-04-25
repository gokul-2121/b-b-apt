import { NextResponse } from 'next/server'
import { getGalleryItems } from '../../../src/lib/cms-store'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const gallery = await getGalleryItems({ onlyVisible: true })
    return NextResponse.json(
      { gallery },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch {
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 })
  }
}
