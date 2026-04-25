'use client'

import Facilities from '../components/Facilities'

export default function FacilitiesPage() {
  return (
    <main className="page-content">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Our Facilities</h1>
          <p className="page-subtitle">Modern amenities for your comfort</p>
        </div>
      </div>
      <Facilities />
    </main>
  )
}
