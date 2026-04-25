import HomePage from '../src/views/HomePage'
import { getGalleryItems } from '../src/lib/cms-store'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const galleryItems = await getGalleryItems({ limit: 9, onlyVisible: true })
  return <HomePage galleryItems={galleryItems} />
}
