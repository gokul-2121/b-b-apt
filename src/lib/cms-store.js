import path from 'node:path'
import crypto from 'node:crypto'
import { promises as fs } from 'node:fs'
import { buildDefaultCmsData } from './cms-defaults'

const LOCAL_DATA_DIR = path.join(process.cwd(), 'data')
const LOCAL_DATA_FILE = path.join(LOCAL_DATA_DIR, 'cms.json')
const BLOB_PREFIX = 'cms/content/'

let cachedBlobUrl = null

// Dynamically import @vercel/blob only when needed (prevents build issues)
async function getBlobModule() {
  try {
    return await import('@vercel/blob')
  } catch {
    return null
  }
}

// Try multiple env var name patterns that Vercel may use
function getBlobToken() {
  return (
    process.env.BLOB_READ_WRITE_TOKEN ||
    process.env.bb_blob_BLOB_READ_WRITE_TOKEN ||
    process.env.b_b_blob_BLOB_READ_WRITE_TOKEN ||
    ''
  ).trim() || null
}

function nowIso() {
  return new Date().toISOString()
}

function cloneDefaults() {
  return JSON.parse(JSON.stringify(buildDefaultCmsData()))
}

function convertDriveUrl(url) {
  const str = String(url || '').trim()
  if (str.includes('lh3.googleusercontent.com/d/')) {
    const id = str.split('/d/')[1]
    return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`
  }
  return str
}

function normalizeNewsItem(item) {
  const createdAt = item.createdAt || nowIso()
  const updatedAt = item.updatedAt || createdAt
  return {
    id: item.id || crypto.randomUUID(),
    title: String(item.title || '').trim(),
    date: String(item.date || '').trim(),
    excerpt: String(item.excerpt || '').trim(),
    content: String(item.content || '').trim(),
    imageUrls: Array.isArray(item.imageUrls)
  ? item.imageUrls.map(convertDriveUrl)
  : [convertDriveUrl(item.imageUrl)],
    published: Boolean(item.published),
    createdAt,
    updatedAt,
  }
}

function normalizeGalleryItem(item) {
  const createdAt = item.createdAt || nowIso()
  const updatedAt = item.updatedAt || createdAt
  const layout = ['normal', 'large', 'tall'].includes(item.layout) ? item.layout : 'normal'
  return {
    id: item.id || crypto.randomUUID(),
    title: String(item.title || '').trim(),
    alt: String(item.alt || '').trim(),
    category: String(item.category || '').trim(),
    caption: String(item.caption || '').trim(),
    imageUrl: convertDriveUrl(item.imageUrl),
    layout,
    visible: item.visible !== false,
    featured: Boolean(item.featured),
    createdAt,
    updatedAt,
  }
}

function normalizeCmsData(raw) {
  const base = raw && typeof raw === 'object' ? raw : {}
  const defaults = cloneDefaults()
  const news = Array.isArray(base.news) ? base.news : defaults.news
  const gallery = Array.isArray(base.gallery) ? base.gallery : defaults.gallery

  return {
    news: news.map(normalizeNewsItem),
    gallery: gallery.map(normalizeGalleryItem),
  }
}

async function ensureLocalFile() {
  try {
    await fs.mkdir(LOCAL_DATA_DIR, { recursive: true })
    try {
      await fs.access(LOCAL_DATA_FILE)
    } catch {
      await fs.writeFile(LOCAL_DATA_FILE, JSON.stringify(cloneDefaults(), null, 2), 'utf8')
    }
  } catch {
    // On Vercel, filesystem is read-only — this is expected to fail
  }
}

async function readLocalData() {
  await ensureLocalFile()
  try {
    const file = await fs.readFile(LOCAL_DATA_FILE, 'utf8')
    const parsed = JSON.parse(file)
    return normalizeCmsData(parsed)
  } catch {
    // If file doesn't exist or can't be read, return defaults
    return normalizeCmsData(cloneDefaults())
  }
}

async function writeLocalData(data) {
  await fs.mkdir(LOCAL_DATA_DIR, { recursive: true })
  await fs.writeFile(LOCAL_DATA_FILE, JSON.stringify(data, null, 2), 'utf8')
}

async function readBlobData(token) {
  const blob = await getBlobModule()
  if (!blob) {
    throw new Error('Blob module not available')
  }

  let blobUrl = cachedBlobUrl

  if (!blobUrl) {
    const { blobs } = await blob.list({
      token,
      prefix: BLOB_PREFIX,
      limit: 1000,
    })

    if (!blobs.length) {
      const defaults = cloneDefaults()
      await writeBlobData(defaults, token)
      return defaults
    }

    const latestBlob = [...blobs].sort((a, b) => {
      return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    })[0]

    blobUrl = latestBlob.url
    cachedBlobUrl = blobUrl
  }

  const response = await fetch(blobUrl, { cache: 'no-store' })
  if (!response.ok) {
    throw new Error('Failed to read CMS blob data.')
  }

  const raw = await response.json()
  return normalizeCmsData(raw)
}

async function writeBlobData(data, token) {
  const blob = await getBlobModule()
  if (!blob) {
    throw new Error('Blob module not available')
  }

  const key = `${BLOB_PREFIX}${Date.now()}-${crypto.randomUUID()}.json`
  const result = await blob.put(key, JSON.stringify(data), {
    token,
    access: 'public',
    contentType: 'application/json',
  })

  cachedBlobUrl = result.url
}

async function loadData() {
  const token = getBlobToken()

  // If we have a blob token, use Vercel Blob storage
  if (token) {
    try {
      return await readBlobData(token)
    } catch (err) {
      console.error('[CMS] Blob read failed, falling back to defaults:', err.message)
      return normalizeCmsData(cloneDefaults())
    }
  }

  // On Vercel without a token — return defaults gracefully (no crash)
  if (process.env.VERCEL) {
    console.warn('[CMS] No BLOB_READ_WRITE_TOKEN set. Using default CMS data.')
    return normalizeCmsData(cloneDefaults())
  }

  // Local development — use filesystem
  return readLocalData()
}

async function persistData(data) {
  const token = getBlobToken()

  if (token) {
    return writeBlobData(data, token)
  }

  if (process.env.VERCEL) {
    throw new Error(
      'Cannot save CMS data: BLOB_READ_WRITE_TOKEN is not set. ' +
      'Go to Vercel Dashboard → Storage → Connect your Blob store to this project.'
    )
  }

  return writeLocalData(data)
}

function sortNews(items) {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return dateB - dateA
  })
}

function sortGallery(items) {
  return [...items].sort((a, b) => {
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1
    }

    const dateA = new Date(a.updatedAt).getTime()
    const dateB = new Date(b.updatedAt).getTime()
    return dateB - dateA
  })
}

export async function getPublishedNews() {
  const data = await loadData()
  return sortNews(data.news.filter((item) => item.published))
}

export async function getAdminNews() {
  const data = await loadData()
  return sortNews(data.news)
}

export async function createNews(payload) {
  const data = await loadData()
  const createdAt = nowIso()

  const item = normalizeNewsItem({
    ...payload,
    id: crypto.randomUUID(),
    createdAt,
    updatedAt: createdAt,
  })

  data.news.push(item)
  await persistData(data)
  return item
}

export async function updateNews(id, updates) {
  const data = await loadData()
  const index = data.news.findIndex((item) => item.id === id)

  if (index === -1) {
    return null
  }

  const updatedItem = normalizeNewsItem({
    ...data.news[index],
    ...updates,
    id,
    updatedAt: nowIso(),
  })

  data.news[index] = updatedItem
  await persistData(data)
  return updatedItem
}

export async function deleteNews(id) {
  const data = await loadData()
  const beforeLength = data.news.length
  data.news = data.news.filter((item) => item.id !== id)

  if (data.news.length === beforeLength) {
    return false
  }

  await persistData(data)
  return true
}

export async function getGalleryItems({ limit, onlyVisible = false } = {}) {
  const data = await loadData()
  const filtered = onlyVisible ? data.gallery.filter((item) => item.visible) : data.gallery
  const sorted = sortGallery(filtered)

  if (typeof limit === 'number') {
    return sorted.slice(0, limit)
  }

  return sorted
}

export async function getAdminGalleryItems() {
  const data = await loadData()
  return sortGallery(data.gallery)
}

export async function createGalleryItem(payload) {
  const data = await loadData()
  const createdAt = nowIso()

  const item = normalizeGalleryItem({
    ...payload,
    id: crypto.randomUUID(),
    createdAt,
    updatedAt: createdAt,
  })

  data.gallery.push(item)
  await persistData(data)
  return item
}

export async function updateGalleryItem(id, updates) {
  const data = await loadData()
  const index = data.gallery.findIndex((item) => item.id === id)

  if (index === -1) {
    return null
  }

  const updatedItem = normalizeGalleryItem({
    ...data.gallery[index],
    ...updates,
    id,
    updatedAt: nowIso(),
  })

  data.gallery[index] = updatedItem
  await persistData(data)
  return updatedItem
}

export async function deleteGalleryItem(id) {
  const data = await loadData()
  const beforeLength = data.gallery.length
  data.gallery = data.gallery.filter((item) => item.id !== id)

  if (beforeLength === data.gallery.length) {
    return false
  }

  await persistData(data)
  return true
}
