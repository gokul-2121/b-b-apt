'use client'

import Rooms from '../components/Rooms'

export default function RoomsPage() {
  return (
    <main className="page-content">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Our Rooms</h1>
          <p className="page-subtitle">Explore our fully furnished apartments</p>
        </div>
      </div>
      <Rooms />
    </main>
  )
}
