'use client'

import Gallery from '../components/Gallery'

export default function GalleryPage({ galleryItems = [] }) {
  return (
    <main className="page-content">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Gallery</h1>
          <p className="page-subtitle">A glimpse of our beautiful property</p>
        </div>
      </div>
      <Gallery images={galleryItems} />
      <div className="container" style={{ textAlign: 'center', paddingBottom: '4rem' }}>
        <a 
          href="https://drive.google.com/drive/folders/1wB1oPEEt30vM22qnWcD2SdrCrVmhOYk1" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          View More Images on Google Drive
        </a>
      </div>
    </main>
  )
}
