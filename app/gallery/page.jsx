import GalleryPage from '../../src/views/GalleryPage'
import { getGalleryItems } from '../../src/lib/cms-store'

export const revalidate = 60

export default async function Page() {
  const galleryItems = await getGalleryItems({ onlyVisible: true })
  return <GalleryPage galleryItems={galleryItems} />
}
