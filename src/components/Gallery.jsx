'use client'

import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useScrollReveal } from '../hooks/useAnimations'
import './Gallery.css'

export default function Gallery({ images = [] }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightbox, setLightbox] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [sectionRef, sectionVisible] = useScrollReveal()

  const categories = ['All', ...new Set(images.map(img => img.category))]

  const filteredImages = activeCategory === 'All' 
    ? categories.filter(c => c !== 'All').map(cat => images.find(img => img.category === cat)).filter(Boolean)
    : images.filter(img => img.category === activeCategory)

  const galleryImages = filteredImages.map((item) => ({
    src: item.imageUrl,
    alt: item.alt || item.title,
    label: item.title,
    category: item.category,
    large: item.layout === 'large',
    tall: item.layout === 'tall',
  }))

  const openLightbox = (image, index) => {
    setLightbox(image)
    setLightboxIndex(index)
  }

  const navigate = (dir) => {
    const next = (lightboxIndex + dir + galleryImages.length) % galleryImages.length
    setLightboxIndex(next)
    setLightbox(galleryImages[next])
  }

  return (
    <section className="gallery section" id="gallery" ref={sectionRef}>
      <div className="container">
        <div className={`section-header ${sectionVisible ? 'reveal visible' : 'reveal'}`}>
          <span className="section-tag">Gallery</span>
          <h2 className="section-title">Explore Our <span className="text-gradient">Spaces</span></h2>
          <p className="section-subtitle">
            Take a virtual tour through our beautifully designed apartments
          </p>
        </div>

        <div className="gallery-filters">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={`gallery-grid ${sectionVisible ? 'stagger-children visible' : 'stagger-children'}`}>
          {galleryImages.map((image, index) => (
            <div 
              className={`gallery-item ${image.large ? 'large' : ''} ${image.tall ? 'tall' : ''}`}
              key={index}
              onClick={() => openLightbox(image, index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                style={{ objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
                loading="lazy"
              />
              <div className="gallery-overlay">
                {image.category && <span className="gallery-category">{image.category}</span>}
                <span className="gallery-label">{image.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={(e) => { e.stopPropagation(); setLightbox(null); }}>
            <X size={24} />
          </button>
          <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); navigate(-1); }}>
            <ChevronLeft size={28} />
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              style={{ objectFit: 'contain', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
            />
          </div>
          <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); navigate(1); }}>
            <ChevronRight size={28} />
          </button>
          <div className="lightbox-counter" onClick={(e) => e.stopPropagation()}>
            {lightboxIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </section>
  )
}
