import { NextResponse } from 'next/server'
import { getPublishedNews } from '../../../src/lib/cms-store'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const news = await getPublishedNews()
    return NextResponse.json(
      { news },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
  }
}
