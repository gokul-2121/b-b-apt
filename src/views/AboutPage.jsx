'use client'

import About from '../components/About'

export default function AboutPage() {
  return (
    <main className="page-content">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">About Us</h1>
          <p className="page-subtitle">Learn more about B&B Apartments Konni</p>
        </div>
      </div>
      <About />
    </main>
  )
}
