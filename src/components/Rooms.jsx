'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Users, ArrowRight, Bed, Bath, UtensilsCrossed, Wifi, Sofa, Star } from 'lucide-react'
import { useScrollReveal } from '../hooks/useAnimations'
import './Rooms.css'

const rooms = [
  {
    id: 1,
    type: 'Studio',
    name: 'Studio Rooms',
    description: 'Perfect for couples or solo travellers. Fully furnished with modern amenities.',
    image: 'https://i.ibb.co/zW3vnNkm/200-BR.jpg',
    price: '1,500',
    amenities: ['Bedroom', 'Bathroom', 'WiFi', 'AC'],
  },
  {
    id: 2,
    type: 'Apartment',
    name: '1 BHK Apartment',
    description: 'Perfect for couples or solo travellers. Fully furnished with modern amenities.',
    image: 'https://i.ibb.co/XxmWKP6M/1-BHK-202.jpg',
    price: '2,500',
    amenities: ['1 Bedroom', '1 Bathroom', 'Kitchen', 'Balcony', 'WiFi'],
  },
  {
    id: 3,
    type: 'Apartment',
    name: '2 BHK Apartment',
    description: 'Spacious apartments ideal for families or small groups.',
    image: 'https://i.ibb.co/jk9wkKH0/103-BR.jpg',
    price: '3,500',
    amenities: ['2 Bedrooms', '2 Bathrooms', 'Kitchen', 'Living Room', 'Balcony'],
    featured: true,
  },
  {
    id: 4,
    type: 'Dormitory',
    name: 'Dormitory',
    description: 'Dormitory facilities available for Group of Travellers/Pilgrims/Wedding Parties etc.',
    image: 'https://i.ibb.co/PGv5rCxH/Dormitory-4.jpg',
    price: '800',
    amenities: ['Shared Room', 'Bathroom', 'WiFi', 'AC'],
    perPerson: true,
  },
  {
    id: 5,
    type: 'Conference',
    name: 'Conference Hall',
    description: 'Mini conference hall perfect for meetings and small events.',
    image: 'https://i.ibb.co/zHFgsbSB/IMG-20240323-094431-1.jpg',
    price: '5,000',
    amenities: ['60 Capacity', 'Projector', 'AC', 'Audio System'],
  },
]

export default function Rooms() {
  const [sectionRef, isVisible] = useScrollReveal(0.1)

  return (
    <section className="rooms section" id="rooms" ref={sectionRef}>
      <div className="rooms-bg"></div>
      <div className="container">
        <div className={`section-header ${isVisible ? 'visible' : ''}`}>
          <span className="section-tag reveal">Our Accommodations</span>
          <h2 className="section-title reveal">Comfort Meets <span className="text-gradient">Elegance</span></h2>
          <p className="section-subtitle reveal">
            Choose from our range of fully furnished apartments designed for your comfort
          </p>
        </div>

        <div className={`rooms-grid ${isVisible ? 'visible' : ''}`}>
          {rooms.map((room, index) => (
            <div 
              className={`room-card ${room.featured ? 'featured' : ''}`} 
              key={room.id}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="room-image">
                <Image 
                  src={encodeURI(room.image)} 
                  alt={room.name} 
                  fill 
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {room.featured && <span className="room-badge">Most Popular</span>}
              </div>
              <div className="room-content">
                <span className="room-type">{room.type}</span>
                <h3 className="room-title">{room.name}</h3>
                <p className="room-description">{room.description}</p>
                <ul className="room-amenities">
                  {room.amenities.map((amenity, i) => (
                    <li key={i}>{amenity}</li>
                  ))}
                </ul>
                <div className="room-footer">
                  <div className="room-price">
                    <span className="price-symbol">₹</span>
                    <span className="price">{room.price}</span>
                    <span className="per">/{room.perPerson ? 'person' : 'night'}</span>
                  </div>
                  <Link href="/contact" className="btn btn-primary room-btn">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`group-booking ${isVisible ? 'visible' : ''}`}>
          <div className="group-content">
            <div className="group-icon">
              <Users size={32} />
            </div>
            <div className="group-text">
              <h3>Planning a Group Trip?</h3>
              <p>Book all apartments together and enjoy special group rates.</p>
            </div>
            <div className="group-price">
              <span className="from">Special rates for</span>
              <span className="amount">Groups</span>
              <span className="per">of 25-40 persons</span>
              <span className="group-note">Contact for pricing</span>
            </div>
            <Link href="/contact" className="btn btn-accent">
              <span>Enquire Now</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
