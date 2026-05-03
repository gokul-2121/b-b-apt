'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, ArrowRight, Download, Building2, Users, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import './Hero.css'

const slides = [
  {
    image: 'https://i.ibb.co/v4FgF21t/Building-front-main.jpg',
    title: 'Welcome to B&B',
    subtitle: 'A Modern Haven in God\'s Own Country',
    description: 'Stay with us, feel at Home. A modern apartment complex with all modern finishes including basement parking, lift, conference hall, roof top garden & more.'
  },
  {
    image: 'https://i.ibb.co/0yhy2g0b/IMG-20190620-102550.jpg',
    title: 'Modern Living',
    subtitle: 'Premium Comfort',
    description: 'Experience modern amenities and traditional Kerala hospitality in our fully equipped apartments.'
  },
  {
    image: 'https://i.ibb.co/1YmJp8bY/new-back.jpg',
    title: 'Save The Wild Nature!',
    subtitle: 'Near By Attractions',
    description: 'Konni - an attractive tourist destination with Elephant cradle, Adavi Bowl boating & more.'
  }
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <section className="hero" id="home">
      {/* Background Slides */}
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div 
            key={index} 
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
          >
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="hero-image"
              style={{ objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
              loading="eager"
              fetchPriority="high"
            />
            <div className="hero-overlay"></div>
          </div>
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="hero-decor-left"></div>
      <div className="hero-decor-right"></div>

      {/* Slider Controls */}
      <button className="slider-btn slider-prev" onClick={prevSlide} aria-label="Previous slide">
        <ChevronLeft size={24} />
      </button>
      <button className="slider-btn slider-next" onClick={nextSlide} aria-label="Next slide">
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicators */}
      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="hero-content">
        <div className="hero-badge">
          <MapPin size={14} />
          <span>Konni, Pathanamthitta, Kerala</span>
        </div>

        <p className="hero-subtitle" key={`sub-${currentSlide}`}>
          {slides[currentSlide].subtitle}
        </p>

        <h1 className="hero-title" key={`title-${currentSlide}`}>
          {slides[currentSlide].title}
        </h1>

        <p className="hero-description" key={`desc-${currentSlide}`}>
          {slides[currentSlide].description}
        </p>

        <div className="hero-actions">
          <Link href="/rooms" className="btn btn-accent">
            <span>Explore Rooms</span>
            <ArrowRight size={16} />
          </Link>
          <a 
            href="https://www.bandbkonni.com/pdf/Brochure-B-n-B.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            <Download size={16} />
            <span>Brochure</span>
          </a>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="hero-stats-bar">
        <div className="hero-stats">
          <div className="stat">
            <Building2 className="stat-icon" />
            <div>
              <span className="stat-number">13,000</span>
              <span className="stat-label">Sq.ft Area</span>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <Users className="stat-icon" />
            <div>
              <span className="stat-number">50+</span>
              <span className="stat-label">Happy Guests</span>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <Star className="stat-icon" />
            <div>
              <span className="stat-number">7+</span>
              <span className="stat-label">Years</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
