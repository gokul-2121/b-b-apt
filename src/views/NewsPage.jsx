'use client'

import { useState } from 'react'
import './News.css'

function formatDate(dateInput) {
  const date = new Date(dateInput)

  if (Number.isNaN(date.getTime())) {
    return dateInput
  }

  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

function NewsModal({ item, onClose }) {
  if (!item) return null

  return (
    <div className="news-modal-overlay" onClick={onClose}>
      <article className="news-modal" onClick={(e) => e.stopPropagation()}>
        <button className="news-modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        {item.imageUrl && (
          <div className="news-modal-image-wrap">
            <img src={item.imageUrl} alt={item.title} referrerPolicy="no-referrer" />
          </div>
        )}
        <div className="news-modal-body">
          <time className="news-modal-date">{formatDate(item.date)}</time>
          <h2 className="news-modal-title">{item.title}</h2>
          <p className="news-modal-excerpt">{item.excerpt}</p>
          <div className="news-modal-divider" />
          <div className="news-modal-content">
            {item.content.split('\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </article>
    </div>
  )
}

export default function NewsPage({ newsItems = [] }) {
  const [selectedItem, setSelectedItem] = useState(null)

  return (
    <section className="news-page" id="news-events">
      <div className="news-page-container">
        {/* Hero Banner */}
        <div className="news-hero">
          <span className="news-hero-tag">Stay Informed</span>
          <h1 className="news-hero-title">
            News & <span className="news-gradient-text">Events</span>
          </h1>
          <p className="news-hero-subtitle">
            Latest updates, announcements, and upcoming happenings at B&B Apartments Konni
          </p>
        </div>

        {/* News Grid */}
        <div className="news-items-grid">
          {newsItems.map((item, index) => (
            <article
              className={`news-item-card ${index === 0 ? 'news-item-featured' : ''}`}
              key={item.id}
              onClick={() => setSelectedItem(item)}
            >
              <div className="news-item-image-wrap">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} loading="lazy" referrerPolicy="no-referrer" />
                ) : (
                  <div className="news-item-no-image">
                    <span>📰</span>
                  </div>
                )}
                <div className="news-item-image-overlay" />
              </div>
              <div className="news-item-body">
                <time className="news-item-date">{formatDate(item.date)}</time>
                <h3 className="news-item-title">{item.title}</h3>
                <p className="news-item-excerpt">{item.excerpt}</p>
                <span className="news-read-more">
                  Read more
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </article>
          ))}

          {newsItems.length === 0 && (
            <div className="news-empty-state">
              <div className="news-empty-icon">📰</div>
              <h3>No news items published yet</h3>
              <p>New announcements and events will appear here once they are published through the admin panel.</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <NewsModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </section>
  )
}
