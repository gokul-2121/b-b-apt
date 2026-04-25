'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
import { useScrollReveal } from '../hooks/useAnimations'
import './Contact.css'

export default function Contact() {
  const [sectionRef, isVisible] = useScrollReveal(0.1)
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', guests: '', checkIn: '', checkOut: '', message: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const text = `Hello, I would like to make a booking enquiry.%0A%0AName: ${formData.name}%0AEmail: ${formData.email}%0APhone: ${formData.phone}%0AGuests: ${formData.guests}%0ACheck-in: ${formData.checkIn}%0ACheck-out: ${formData.checkOut}%0AMessage: ${formData.message}`
    window.open(`https://wa.me/918078898000?text=${text}`, '_blank')
  }

  return (
    <section className="contact section" id="contact" ref={sectionRef}>
      <div className="container">
        <div className={`contact-grid ${isVisible ? 'visible' : ''}`}>
          <div className="contact-info reveal-left">
            <span className="section-tag">Get in Touch</span>
            <h2 className="section-title">Book Your <span className="text-gradient">Stay Today</span></h2>
            <p className="contact-desc">
              Ready to experience Kerala's finest hospitality? Contact us to check availability 
              and make your reservation.
            </p>

            <div className="info-cards">
              <div className="info-card">
                <div className="info-icon"><MapPin size={24} /></div>
                <div className="info-content">
                  <h4>Address</h4>
                  <p>B&B Apartments, Konni P.O,<br/>Pathanamthitta, Kerala - 689691</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon"><Phone size={24} /></div>
                <div className="info-content">
                  <h4>Phone</h4>
                  <p>
                    <a href="tel:+918078898000">+91 8078898000</a><br/>
                    <a href="tel:+919747712370">+91 97477 12370</a>
                  </p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon"><Mail size={24} /></div>
                <div className="info-content">
                  <h4>Email</h4>
                  <p>
                    <a href="mailto:bandbkonni@gmail.com">bandbkonni@gmail.com</a>
                  </p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon"><Clock size={24} /></div>
                <div className="info-content">
                  <h4>Check-in / Check-out</h4>
                  <p>Check-in: 12:00 PM<br/>Check-out: 11:00 AM</p>
                </div>
              </div>
            </div>

            <div className="social-booking">
              <a href="https://www.facebook.com/bandbkonni" target="_blank" rel="noopener noreferrer" className="social-btn facebook" style={{ background: '#1877F2', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                <span>Facebook</span>
              </a>
              <a href="https://www.booking.com/searchresults.html?ss=B%26B+Apartments+Konni" target="_blank" rel="noopener noreferrer" className="social-btn booking" style={{ background: '#003580', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
                <span style={{ fontSize: '1.2rem', fontFamily: 'Arial, sans-serif' }}>B.</span>
                <span>Booking.com</span>
              </a>
              <a href="https://www.goibibo.com/hotels/" target="_blank" rel="noopener noreferrer" className="social-btn goibibo" style={{ background: '#FF5A00', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
                <span style={{ fontSize: '1.2rem', fontFamily: 'Arial, sans-serif' }}>gi</span>
                <span>Goibibo</span>
              </a>
            </div>
          </div>

          <div className="contact-form-wrapper reveal-right">
            <h3>Send an Enquiry</h3>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input 
                    type="text" id="name" name="name" 
                    placeholder="Your name" required
                    value={formData.name} onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" id="email" name="email" 
                    placeholder="your@email.com" required
                    value={formData.email} onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input 
                    type="tel" id="phone" name="phone" 
                    placeholder="+91 XXXXX XXXXX" required
                    value={formData.phone} onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="guests">Number of Guests</label>
                  <select id="guests" name="guests" value={formData.guests} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="1-2">1-2 Guests</option>
                    <option value="3-5">3-5 Guests</option>
                    <option value="6-10">6-10 Guests</option>
                    <option value="10+">10+ Guests</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="checkIn">Check-in Date</label>
                  <input 
                    type="date" id="checkIn" name="checkIn"
                    value={formData.checkIn} onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="checkOut">Check-out Date</label>
                  <input 
                    type="date" id="checkOut" name="checkOut"
                    value={formData.checkOut} onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea 
                  id="message" name="message" rows="4"
                  placeholder="Any special requests or questions?"
                  value={formData.message} onChange={handleChange}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-full">
                <Send size={18} />
                <span>Send via WhatsApp</span>
              </button>
            </form>
          </div>
        </div>

        <div className="map-wrapper">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3936.5!2d76.8477!3d9.2344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMTQnMDQuMCJOIDc2wrA1MCc1MS4xIkU!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
            width="100%" 
            height="400" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy"
            title="B&B Apartments Location"
          ></iframe>
        </div>
      </div>
    </section>
  )
}
