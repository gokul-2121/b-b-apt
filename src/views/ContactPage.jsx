'use client'

import Contact from '../components/Contact'

export default function ContactPage() {
  return (
    <main className="page-content">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Contact Us</h1>
          <p className="page-subtitle">Get in touch for bookings and inquiries</p>
        </div>
      </div>
      <Contact />
    </main>
  )
}
