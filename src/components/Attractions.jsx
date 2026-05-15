'use client'

import { useState } from 'react'
import { MapPin, Church } from 'lucide-react'
import { useScrollReveal } from '../hooks/useAnimations'
import './Attractions.css'

const touristSpots = [
  { name: 'Konni Elephant Training Centre', distance: '2 km', image: '/images/attractions/konni_elephant.png' },
  { name: 'Adavi Eco Tourism', distance: '10 km', image: '/images/attractions/adavi_eco.png' },
  { name: 'Gavi Forest', distance: '55 km', image: '/images/attractions/gavi_forest.png' },
  { name: 'Perunthenaruvi Waterfall', distance: '25 km', image: '/images/attractions/waterfall.png' },
]

const pilgrimSpots = [
  { name: 'Sabarimala Temple', distance: '65 km', image: '/images/attractions/sabarimala.png' },
  { name: 'Mannadi Temple', distance: '5 km', image: '/images/attractions/mannadi.png' },
  { name: 'Aranmula Parthasarathy', distance: '15 km', image: '/images/attractions/aranmula.png' },
  { name: 'Pandalam Palace', distance: '12 km', image: '/images/attractions/pandalam.png' },
  { name: 'Kalleli Oorali Appoppankavu', distance: '8 km', image: '/images/attractions/kalleli.png' },
]

export default function Attractions() {
  const [activeTab, setActiveTab] = useState('tourist')
  const [sectionRef, isVisible] = useScrollReveal(0.1)

  const spots = activeTab === 'tourist' ? touristSpots : pilgrimSpots

  return (
    <section className="attractions section" id="attractions" ref={sectionRef}>
      <div className="container">
        <div className={`section-header ${isVisible ? 'visible' : ''}`}>
          <span className="section-tag reveal">Explore</span>
          <h2 className="section-title reveal">Nearby <span className="text-gradient">Attractions</span></h2>
          <p className="section-subtitle reveal">
            Discover the beauty and spirituality of central Travancore
          </p>
        </div>

        <div className="attractions-tabs">
          <button 
            className={`tab-btn ${activeTab === 'tourist' ? 'active' : ''}`}
            onClick={() => setActiveTab('tourist')}
          >
            <MapPin size={20} />
            <span>Tourist Spots</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'pilgrim' ? 'active' : ''}`}
            onClick={() => setActiveTab('pilgrim')}
          >
            <Church size={20} />
            <span>Pilgrim Centers</span>
          </button>
        </div>

        <div className="attractions-grid">
          {spots.map((spot, index) => (
            <div className="attraction-card" key={`${activeTab}-${index}`}>
              <div className="attraction-image" style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden' }}>
                <img 
                  src={spot.image} 
                  alt={spot.name} 
                  style={{ objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
                  loading="lazy"
                  width="400"
                  height="300"
                />
                <div className="attraction-distance">
                  <MapPin size={12} />
                  <span>{spot.distance}</span>
                </div>
              </div>
              <div className="attraction-content">
                <h3>{spot.name}</h3>
                <p><MapPin size={14} /> {spot.distance} away</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
