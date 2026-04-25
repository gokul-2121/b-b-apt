'use client'

import Attractions from '../components/Attractions'

export default function AttractionsPage() {
  return (
    <main className="page-content">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Nearby Attractions</h1>
          <p className="page-subtitle">Discover the beauty around Konni</p>
        </div>
      </div>
      <Attractions />
    </main>
  )
}
