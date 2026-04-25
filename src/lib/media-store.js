import path from 'node:path'
import crypto from 'node:crypto'
import { promises as fs } from 'node:fs'

const MAX_FILE_SIZE = 20 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/heic',
  'image/heif',
  'image/bmp',
])

const MIME_ALIASES = new Map([
  ['image/jpg', 'image/jpeg'],
  ['image/pjpeg', 'image/jpeg'],
  ['image/jfif', 'image/jpeg'],
  ['image/x-png', 'image/png'],
  ['image/heic-sequence', 'image/heic'],
  ['image/heif-sequence', 'image/heif'],
  ['image/x-ms-bmp', 'image/bmp'],
])

const EXTENSION_TO_MIME = new Map([
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.jfif', 'image/jpeg'],
  ['.png', 'image/png'],
  ['.webp', 'image/webp'],
  ['.gif', 'image/gif'],
  ['.avif', 'image/avif'],
  ['.heic', 'image/heic'],
  ['.heif', 'image/heif'],
  ['.bmp', 'image/bmp'],
])

// Try multiple env var name patterns that Vercel may use
function getBlobToken() {
  return (
    process.env.BLOB_READ_WRITE_TOKEN ||
    process.env.bb_blob_BLOB_READ_WRITE_TOKEN ||
    process.env.b_b_blob_BLOB_READ_WRITE_TOKEN ||
    ''
  ).trim() || null
}

async function getBlobModule() {
  try {
    return await import('@vercel/blob')
  } catch {
    return null
  }
}

function sanitizeSegment(value, fallback = 'general') {
  const sanitized = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')

  return sanitized || fallback
}

function fileExtensionFromType(mimeType) {
  if (mimeType === 'image/png') return '.png'
  if (mimeType === 'image/webp') return '.webp'
  if (mimeType === 'image/gif') return '.gif'
  if (mimeType === 'image/avif') return '.avif'
  if (mimeType === 'image/heic') return '.heic'
  if (mimeType === 'image/heif') return '.heif'
  if (mimeType === 'image/bmp') return '.bmp'
  return '.jpg'
}

function resolveMimeType(file) {
  const declared = String(file?.type || '').trim().toLowerCase()
  const aliased = MIME_ALIASES.get(declared) || declared

  if (aliased) {
    return aliased
  }

  const ext = path.extname(String(file?.name || '')).toLowerCase()
  return EXTENSION_TO_MIME.get(ext) || ''
}

function isManagedLocalUpload(url) {
  return typeof url === 'string' && url.startsWith('/uploads/')
}

function isManagedBlobUpload(url) {
  return typeof url === 'string' && /blob\.vercel-storage\.com/.test(url)
}

export async function uploadImageFile(file, { folder = 'general' } = {}) {
  if (!file || typeof file.arrayBuffer !== 'function') {
    throw new Error('A valid image file is required.')
  }

  const declaredType = String(file?.type || '').trim().toLowerCase()
  const mimeType = resolveMimeType(file)

  if (!ALLOWED_IMAGE_TYPES.has(mimeType)) {
    throw new Error(
      `Unsupported image format (${declaredType || 'unknown'}). Use JPG, PNG, WEBP, GIF, AVIF, HEIC, HEIF, or BMP.`
    )
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Image is too large. Maximum size is 20 MB.')
  }

  const safeFolder = sanitizeSegment(folder)
  const safeExtension = fileExtensionFromType(mimeType)
  const fileName = `${Date.now()}-${crypto.randomUUID()}${safeExtension}`
  const token = getBlobToken()

  if (token) {
    const blob = await getBlobModule()
    if (blob) {
      try {
        const result = await blob.put(`cms/${safeFolder}/${fileName}`, file, {
          token,
          access: 'public',
          contentType: mimeType,
        })
        return { url: result.url }
      } catch (error) {
        if (process.env.VERCEL) {
          throw new Error(
            error instanceof Error
              ? `Upload failed: ${error.message}`
              : 'Upload failed with Blob storage.'
          )
        }
        // Fall through to local upload
      }
    }
  }

  if (process.env.VERCEL) {
    throw new Error(
      'Image upload requires BLOB_READ_WRITE_TOKEN. ' +
      'Go to Vercel Dashboard → Storage → Connect your Blob store to this project.'
    )
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', safeFolder)
  await fs.mkdir(uploadDir, { recursive: true })

  const fullPath = path.join(uploadDir, fileName)
  const bytes = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(fullPath, bytes)

  return { url: `/uploads/${safeFolder}/${fileName}` }
}

export async function deleteManagedImage(url) {
  if (!url) {
    return
  }

  const token = getBlobToken()

  if (isManagedBlobUpload(url) && token) {
    const blob = await getBlobModule()
    if (blob) {
      try {
        await blob.del(url, { token })
      } catch {
        // Ignore deletion failures for orphan cleanup.
      }
    }
    return
  }

  if (isManagedLocalUpload(url) && !process.env.VERCEL) {
    const relativePath = url.replace(/^\//, '')
    const fullPath = path.join(process.cwd(), 'public', relativePath)

    try {
      await fs.unlink(fullPath)
    } catch {
      // Ignore deletion failures for orphan cleanup.
    }
  }
}
