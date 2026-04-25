'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone, Mail } from 'lucide-react'
import './Header.css'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/rooms', label: 'Rooms' },
  { to: '/facilities', label: 'Facilities' },
  { to: '/news', label: 'News & Events' },
  { to: '/attractions', label: 'Nearby' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => setMenuOpen(!menuOpen)
  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      {/* Top Contact Bar */}
      <div className={`top-bar ${scrolled || !isHomePage ? 'hidden' : ''}`}>
        <div className="container top-bar-content">
          <a href="tel:+918078898000" className="top-bar-item">
            <Phone size={14} />
            <span>+91 8078898000</span>
          </a>
          <a href="tel:+919747712370" className="top-bar-item">
            <Phone size={14} />
            <span>+91 97477 12370</span>
          </a>
          <a href="mailto:bandbkonni@gmail.com" className="top-bar-item">
            <Mail size={14} />
            <span>bandbkonni@gmail.com</span>
          </a>
        </div>
      </div>

      <header className={`header ${scrolled || !isHomePage ? 'scrolled' : ''}`}>
        <nav className="nav container">
          <Link href="/" className="nav-logo">
            <img src="/images/logo.png" alt="B&B" className="logo-image" />
            <div className="logo-text">
              <span className="logo-main">B&B</span>
              <span className="logo-sub">APARTMENTS</span>
            </div>
          </Link>

          <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
            {navLinks.map((link) => (
              <li key={link.to} className="nav-item">
                <Link 
                  href={link.to} 
                  className={`nav-link ${pathname === link.to ? 'active' : ''}`} 
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="nav-item nav-mobile-cta">
              <Link href="/contact" className="btn btn-accent" onClick={closeMenu}>
                Book Now
              </Link>
            </li>
          </ul>

          <Link href="/contact" className="nav-cta">Book Now</Link>

          <button className="nav-toggle" onClick={toggleMenu} aria-label="Toggle menu">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>
    </>
  )
}
