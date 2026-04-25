import NewsPage from '../../src/views/NewsPage'
import { getPublishedNews } from '../../src/lib/cms-store'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Page() {
  const newsItems = await getPublishedNews()
  return <NewsPage newsItems={newsItems} />
}
