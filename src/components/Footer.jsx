'use client'

import Link from 'next/link'
import { MapPin, Phone, Mail } from 'lucide-react'
import './Footer.css'

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/rooms', label: 'Rooms' },
  { to: '/facilities', label: 'Facilities' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-top-accent"></div>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              <img 
                src="/images/logo.png" 
                alt="B&B Apartments" 
                className="footer-logo-img"
              />
              <div className="footer-logo-text">
                <span className="footer-logo-main">B&B</span>
                <span className="footer-logo-sub">APARTMENTS</span>
              </div>
            </Link>
            <p>
              Experience the best of Kerala hospitality at B&B Apartments. 
              Your home away from home in the heart of Konni.
            </p>
            <div className="footer-social">
              <a href="https://www.facebook.com/bandbkonni" target="_blank" rel="noopener noreferrer">
                <img src="https://www.bandbkonni.com/images/fb-lgo.jpg" alt="Facebook" />
              </a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link href={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-links">
            <h4>Our Services</h4>
            <ul>
              <li><Link href="/rooms">Studio Rooms</Link></li>
              <li><Link href="/rooms">1 BHK Apartments</Link></li>
              <li><Link href="/rooms">2 BHK Apartments</Link></li>
              <li><Link href="/rooms">Conference Hall</Link></li>
              <li><Link href="/rooms">Group Bookings</Link></li>
              <li><Link href="/attractions">Tour Assistance</Link></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contact Info</h4>
            <ul>
              <li>
                <MapPin size={18} />
                <span>B&B Apartments, Konni P.O,<br/>Pathanamthitta, Kerala - 689691</span>
              </li>
              <li>
                <Phone size={18} />
                <div>
                  <a href="tel:+918078898000">+91 8078898000</a><br/>
                  <a href="tel:+919747712370">+91 97477 12370</a>
                </div>
              </li>
              <li>
                <Mail size={18} />
                <div>
                  <a href="mailto:bandbkonni@gmail.com">bandbkonni@gmail.com</a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} B&B Apartments Konni. All rights reserved.</p>
          <div className="footer-badges">
            <span>Part of</span>
            <Link href="/">B&B Group</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
