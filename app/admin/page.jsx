'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CSRF_COOKIE_NAME } from '../../src/lib/auth-constants'
import styles from './admin.module.css'

const emptyNewsForm = {
  title: '',
  date: '',
  excerpt: '',
  content: '',
  imageUrl: '',
  published: true,
}

const emptyGalleryForm = {
  title: '',
  alt: '',
  category: 'General',
  caption: '',
  imageUrl: '',
  layout: 'normal',
  visible: true,
  featured: false,
}

function readCookie(name) {
  if (typeof document === 'undefined') {
    return ''
  }

  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${name}=`))

  if (!cookie) {
    return ''
  }

  return decodeURIComponent(cookie.split('=')[1] || '')
}

function formatDateForInput(dateValue) {
  if (!dateValue) {
    return ''
  }

  return String(dateValue).slice(0, 10)
}

async function parseResponse(response) {
  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.error || 'Request failed')
  }

  return payload
}

export default function AdminPage() {
  const router = useRouter()
  const [booting, setBooting] = useState(true)
  const [busy, setBusy] = useState(false)
  const [activeTab, setActiveTab] = useState('news')
  const [username, setUsername] = useState('admin')
  const [statusMessage, setStatusMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [newsItems, setNewsItems] = useState([])
  const [galleryItems, setGalleryItems] = useState([])

  const [newsForm, setNewsForm] = useState(emptyNewsForm)
  const [galleryForm, setGalleryForm] = useState(emptyGalleryForm)

  const [editingNewsId, setEditingNewsId] = useState('')
  const [editingGalleryId, setEditingGalleryId] = useState('')

  const [newsFile, setNewsFile] = useState(null)
  const [galleryFile, setGalleryFile] = useState(null)

  const apiRequest = async (url, options = {}) => {
    const method = options.method || 'GET'
    const headers = new Headers(options.headers || {})
    const isFormData = options.body instanceof FormData

    if (method !== 'GET' && method !== 'HEAD') {
      const csrfToken = readCookie(CSRF_COOKIE_NAME)
      if (csrfToken) {
        headers.set('x-csrf-token', csrfToken)
        console.log('[API] CSRF token sent:', csrfToken.substring(0, 10) + '...')
      } else {
        console.warn('[API] No CSRF token found in cookies')
      }
    }

    if (!isFormData && options.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    const response = await fetch(url, {
      ...options,
      method,
      headers,
      credentials: 'include',
      cache: 'no-store',
    })

    return parseResponse(response)
  }

  const loadData = async () => {
    try {
      const [newsResponse, galleryResponse] = await Promise.all([
        apiRequest('/api/admin/news'),
        apiRequest('/api/admin/gallery'),
      ])

      setNewsItems(newsResponse.news || [])
      setGalleryItems(galleryResponse.gallery || [])
    } catch (error) {
      console.error('Failed to load CMS data:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load content from the server.')
    }
  }

  useEffect(() => {
    let active = true

    async function bootstrap() {
      try {
        const response = await fetch('/api/admin/session', {
          credentials: 'include',
          cache: 'no-store',
        })

        const payload = await response.json().catch(() => ({}))

        console.log('[Bootstrap] Available cookies:', document.cookie)
        console.log('[Bootstrap] Session response:', payload)

        if (!response.ok || !payload.authenticated) {
          router.replace('/admin/login')
          return
        }

        if (!active) {
          return
        }

        setUsername(payload.username || 'admin')
        await loadData()
      } catch {
        if (active) {
          setErrorMessage('Failed to load admin data. Please refresh.')
        }
      } finally {
        if (active) {
          setBooting(false)
        }
      }
    }

    bootstrap()

    return () => {
      active = false
    }
  }, [router])

  const clearAlerts = () => {
    setStatusMessage('')
    setErrorMessage('')
  }

  const uploadFile = async (file, folder) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    console.log('[Upload] Uploading file:', file.name, 'to folder:', folder)
    
    try {
      const data = await apiRequest('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      console.log('[Upload] Success:', data.url)
      return data.url
    } catch (err) {
      console.error('[Upload] Failed:', err)
      throw err
    }
  }

  const handleNewsSubmit = async (event) => {
    event.preventDefault()
    console.log('[NewsSubmit] Form submitted')
    console.log('[NewsSubmit] newsFile:', newsFile)
    console.log('[NewsSubmit] newsForm:', newsForm)
    
    clearAlerts()
    setBusy(true)

    try {
      let imageUrl = newsForm.imageUrl.trim()
      console.log('[NewsSubmit] Initial imageUrl:', imageUrl)

      if (newsFile) {
        console.log('[NewsSubmit] Uploading file...')
        imageUrl = await uploadFile(newsFile, 'news')
        console.log('[NewsSubmit] After upload, imageUrl:', imageUrl)
      }

      const payload = {
        ...newsForm,
        imageUrl,
      }
      
      console.log('[NewsSubmit] Final payload imageUrl:', payload.imageUrl)

      if (editingNewsId) {
        await apiRequest(`/api/admin/news/${editingNewsId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        })
        setStatusMessage('News item updated successfully.')
      } else {
        await apiRequest('/api/admin/news', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        setStatusMessage('News item created successfully.')
      }

      setNewsForm(emptyNewsForm)
      setEditingNewsId('')
      setNewsFile(null)
      await loadData()
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to save news item'
      console.error('[NewsSubmit] Error:', errorMsg, error)
      setErrorMessage(errorMsg)
    } finally {
      setBusy(false)
    }
  }

  const handleGallerySubmit = async (event) => {
    event.preventDefault()
    clearAlerts()
    setBusy(true)

    try {
      let imageUrl = galleryForm.imageUrl.trim()

      if (galleryFile) {
        imageUrl = await uploadFile(galleryFile, 'gallery')
      }

      const payload = {
        ...galleryForm,
        imageUrl,
      }

      if (editingGalleryId) {
        await apiRequest(`/api/admin/gallery/${editingGalleryId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        })
        setStatusMessage('Gallery item updated successfully.')
      } else {
        await apiRequest('/api/admin/gallery', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        setStatusMessage('Gallery item created successfully.')
      }

      setGalleryForm(emptyGalleryForm)
      setEditingGalleryId('')
      setGalleryFile(null)
      await loadData()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save gallery item')
    } finally {
      setBusy(false)
    }
  }

  const editNewsItem = (item) => {
    clearAlerts()
    setActiveTab('news')
    setEditingNewsId(item.id)
    setNewsFile(null)
    setNewsForm({
      title: item.title || '',
      date: formatDateForInput(item.date),
      excerpt: item.excerpt || '',
      content: item.content || '',
      imageUrl: item.imageUrls?.[0] || item.imageUrl || '',
      published: Boolean(item.published),
    })
  }

  const editGalleryItem = (item) => {
    clearAlerts()
    setActiveTab('gallery')
    setEditingGalleryId(item.id)
    setGalleryFile(null)
    setGalleryForm({
      title: item.title || '',
      alt: item.alt || '',
      category: item.category || 'General',
      caption: item.caption || '',
      imageUrl: item.imageUrl || '',
      layout: item.layout || 'normal',
      visible: item.visible !== false,
      featured: Boolean(item.featured),
    })
  }

  const deleteNewsItem = async (id) => {
    clearAlerts()
    const confirmed = window.confirm('Delete this news item permanently?')
    if (!confirmed) {
      return
    }

    setBusy(true)
    try {
      await apiRequest(`/api/admin/news/${id}`, { method: 'DELETE' })
      setStatusMessage('News item removed.')
      await loadData()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to delete news item')
    } finally {
      setBusy(false)
    }
  }

  const deleteGalleryItemById = async (id) => {
    clearAlerts()
    const confirmed = window.confirm('Delete this gallery image permanently?')
    if (!confirmed) {
      return
    }

    setBusy(true)
    try {
      await apiRequest(`/api/admin/gallery/${id}`, { method: 'DELETE' })
      setStatusMessage('Gallery item removed.')
      await loadData()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to delete gallery item')
    } finally {
      setBusy(false)
    }
  }

  const resetNewsForm = () => {
    setEditingNewsId('')
    setNewsFile(null)
    setNewsForm(emptyNewsForm)
  }

  const resetGalleryForm = () => {
    setEditingGalleryId('')
    setGalleryFile(null)
    setGalleryForm(emptyGalleryForm)
  }

  const handleLogout = async () => {
    try {
      await apiRequest('/api/admin/logout', { method: 'POST' })
    } finally {
      router.replace('/admin/login')
    }
  }

  if (booting) {
    return (
      <main className={styles.page}>
        <div className={styles.loader}>Loading CMS...</div>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.topbar}>
          <div>
            <p className={styles.eyebrow}>Admin CMS</p>
            <h1 className={styles.title}>Content Management</h1>
            <p className={styles.subtitle}>Signed in as {username}</p>
          </div>
          <button type="button" className={styles.logoutButton} onClick={handleLogout}>
            Sign Out
          </button>
        </header>

        {statusMessage && <p className={styles.success}>{statusMessage}</p>}
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === 'news' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('news')}
          >
            News
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === 'gallery' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            Gallery
          </button>
        </div>

        {activeTab === 'news' && (
          <section className={styles.panelGrid}>
            <article className={styles.formCard}>
              <h2>{editingNewsId ? 'Edit News Item' : 'Create News Item'}</h2>
              <form onSubmit={handleNewsSubmit} className={styles.form}>
                <label className={styles.field}>
                  <span>Title</span>
                  <input
                    type="text"
                    id="newsTitle"
                    name="newsTitle"
                    value={newsForm.title}
                    onChange={(event) => setNewsForm((prev) => ({ ...prev, title: event.target.value }))}
                    required
                  />
                </label>

                <label className={styles.field}>
                  <span>Date</span>
                  <input
                    type="date"
                    id="newsDate"
                    name="newsDate"
                    value={newsForm.date}
                    onChange={(event) => setNewsForm((prev) => ({ ...prev, date: event.target.value }))}
                    required
                  />
                </label>

                <label className={styles.field}>
                  <span>Excerpt</span>
                  <textarea
                    id="newsExcerpt"
                    name="newsExcerpt"
                    rows={3}
                    value={newsForm.excerpt}
                    onChange={(event) =>
                      setNewsForm((prev) => ({ ...prev, excerpt: event.target.value }))
                    }
                    required
                  />
                </label>

                <label className={styles.field}>
                  <span>Content</span>
                  <textarea
                    id="newsContent"
                    name="newsContent"
                    rows={5}
                    value={newsForm.content}
                    onChange={(event) =>
                      setNewsForm((prev) => ({ ...prev, content: event.target.value }))
                    }
                    required
                  />
                </label>

                <label className={styles.field}>
                  <span>Image URL (optional if uploading)</span>
                  <input
                    type="text"
                    id="newsImageUrl"
                    name="newsImageUrl"
                    value={newsForm.imageUrl}
                    onChange={(event) =>
                      setNewsForm((prev) => ({ ...prev, imageUrl: event.target.value }))
                    }
                    placeholder="https://... or /uploads/..."
                  />
                </label>

                <label className={styles.field}>
                  <span>Upload image</span>
                  <input
                    type="file"
                    id="newsFile"
                    name="newsFile"
                    accept="image/*"
                    onChange={(event) => setNewsFile(event.target.files?.[0] || null)}
                  />
                </label>

                <label className={styles.checkboxField}>
                  <input
                    type="checkbox"
                    id="newsPublished"
                    name="newsPublished"
                    checked={newsForm.published}
                    onChange={(event) =>
                      setNewsForm((prev) => ({ ...prev, published: event.target.checked }))
                    }
                  />
                  <span>Published</span>
                </label>

                <div className={styles.actions}>
                  <button type="submit" className={styles.primaryButton} disabled={busy}>
                    {busy ? 'Saving...' : editingNewsId ? 'Update News' : 'Create News'}
                  </button>
                  {editingNewsId && (
                    <button type="button" className={styles.secondaryButton} onClick={resetNewsForm}>
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </article>

            <article className={styles.listCard}>
              <h2>Existing News</h2>
              <div className={styles.itemList}>
                {newsItems.map((item) => (
                  <div key={item.id} className={styles.itemCard}>
                    <img 
                      src={item.imageUrls?.[0] || item.imageUrl || '/images/logo.png'} 
                      alt={item.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className={styles.itemBody}>
                      <h3>{item.title}</h3>
                      <p>{item.excerpt}</p>
                      <div className={styles.metaRow}>
                        <span>{formatDateForInput(item.date)}</span>
                        <span>{item.published ? 'Published' : 'Draft'}</span>
                      </div>
                      <div className={styles.itemActions}>
                        <button type="button" className={styles.secondaryButton} onClick={() => editNewsItem(item)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className={styles.dangerButton}
                          onClick={() => deleteNewsItem(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {newsItems.length === 0 && <p className={styles.emptyText}>No news items available.</p>}
              </div>
            </article>
          </section>
        )}

        {activeTab === 'gallery' && (
          <section className={styles.panelGrid}>
            <article className={styles.formCard}>
              <h2>{editingGalleryId ? 'Edit Gallery Item' : 'Create Gallery Item'}</h2>
              <form onSubmit={handleGallerySubmit} className={styles.form}>
                <label className={styles.field}>
                  <span>Title</span>
                  <input
                    type="text"
                    id="galleryTitle"
                    name="galleryTitle"
                    value={galleryForm.title}
                    onChange={(event) =>
                      setGalleryForm((prev) => ({ ...prev, title: event.target.value }))
                    }
                    required
                  />
                </label>

                <label className={styles.field}>
                  <span>Alt Text</span>
                  <input
                    type="text"
                    id="galleryAlt"
                    name="galleryAlt"
                    value={galleryForm.alt}
                    onChange={(event) => setGalleryForm((prev) => ({ ...prev, alt: event.target.value }))}
                    required
                  />
                </label>

                <label className={styles.field}>
                  <span>Category</span>
                  <input
                    type="text"
                    id="galleryCategory"
                    name="galleryCategory"
                    value={galleryForm.category}
                    onChange={(event) =>
                      setGalleryForm((prev) => ({ ...prev, category: event.target.value }))
                    }
                    required
                  />
                </label>

                <label className={styles.field}>
                  <span>Caption</span>
                  <textarea
                    id="galleryCaption"
                    name="galleryCaption"
                    rows={3}
                    value={galleryForm.caption}
                    onChange={(event) =>
                      setGalleryForm((prev) => ({ ...prev, caption: event.target.value }))
                    }
                  />
                </label>

                <label className={styles.field}>
                  <span>Layout</span>
                  <select
                    id="galleryLayout"
                    name="galleryLayout"
                    value={galleryForm.layout}
                    onChange={(event) =>
                      setGalleryForm((prev) => ({ ...prev, layout: event.target.value }))
                    }
                  >
                    <option value="normal">Normal</option>
                    <option value="large">Large</option>
                    <option value="tall">Tall</option>
                  </select>
                </label>

                <label className={styles.field}>
                  <span>Image URL (optional if uploading)</span>
                  <input
                    type="text"
                    id="galleryImageUrl"
                    name="galleryImageUrl"
                    value={galleryForm.imageUrl}
                    onChange={(event) =>
                      setGalleryForm((prev) => ({ ...prev, imageUrl: event.target.value }))
                    }
                    placeholder="https://... or /uploads/..."
                  />
                </label>

                <label className={styles.field}>
                  <span>Upload image</span>
                  <input
                    type="file"
                    id="galleryFile"
                    name="galleryFile"
                    accept="image/*"
                    onChange={(event) => setGalleryFile(event.target.files?.[0] || null)}
                  />
                </label>

                <label className={styles.checkboxField}>
                  <input
                    type="checkbox"
                    id="galleryVisible"
                    name="galleryVisible"
                    checked={galleryForm.visible}
                    onChange={(event) =>
                      setGalleryForm((prev) => ({ ...prev, visible: event.target.checked }))
                    }
                  />
                  <span>Visible on public site</span>
                </label>

                <label className={styles.checkboxField}>
                  <input
                    type="checkbox"
                    id="galleryFeatured"
                    name="galleryFeatured"
                    checked={galleryForm.featured}
                    onChange={(event) =>
                      setGalleryForm((prev) => ({ ...prev, featured: event.target.checked }))
                    }
                  />
                  <span>Feature this image</span>
                </label>

                <div className={styles.actions}>
                  <button type="submit" className={styles.primaryButton} disabled={busy}>
                    {busy ? 'Saving...' : editingGalleryId ? 'Update Image' : 'Add Image'}
                  </button>
                  {editingGalleryId && (
                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={resetGalleryForm}
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </article>

            <article className={styles.listCard}>
              <h2>Existing Gallery Items</h2>
              <div className={styles.itemList}>
                {galleryItems.map((item) => (
                  <div key={item.id} className={styles.itemCard}>
                    <img 
                      src={item.imageUrl || '/images/logo.png'} 
                      alt={item.alt}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className={styles.itemBody}>
                      <h3>{item.title}</h3>
                      <p>{item.caption || 'No caption provided.'}</p>
                      <div className={styles.metaRow}>
                        <span>{item.category}</span>
                        <span>{item.layout}</span>
                        <span>{item.visible ? 'Visible' : 'Hidden'}</span>
                      </div>
                      <div className={styles.itemActions}>
                        <button
                          type="button"
                          className={styles.secondaryButton}
                          onClick={() => editGalleryItem(item)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className={styles.dangerButton}
                          onClick={() => deleteGalleryItemById(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {galleryItems.length === 0 && (
                  <p className={styles.emptyText}>No gallery items available.</p>
                )}
              </div>
            </article>
          </section>
        )}
      </div>
    </main>
  )
}
