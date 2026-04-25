'use client'

import Image from 'next/image'
import { Users, Briefcase, Heart, Globe } from 'lucide-react'
import { useScrollReveal } from '../hooks/useAnimations'
import './Guests.css'

const guests = [
  {
    icon: Heart,
    title: 'Pilgrims',
    description: 'Gateway to Sabarimala and other sacred temples',
    image: '/Website Photos/with celebrities/IMG_20200109_105513.jpg',
  },
  {
    icon: Users,
    title: 'Families',
    description: 'Perfect for family gatherings and celebrations',
    image: '/Website Photos/with celebrities/IMG_20191010_194602.jpg',
  },
  {
    icon: Briefcase,
    title: 'Business',
    description: 'Ideal for corporate stays and meetings',
    image: '/Website Photos/with celebrities/IMG_20240612_073152.jpg',
  },
  {
    icon: Globe,
    title: 'NRIs',
    description: 'A home away from home in Kerala',
    image: '/Website Photos/with celebrities/IMG_20240525_102609.jpg',
  },
]

export default function Guests() {
  const [sectionRef, sectionVisible] = useScrollReveal()

  return (
    <section className="guests section" ref={sectionRef}>
      <div className="container">
        <div className={`section-header ${sectionVisible ? 'reveal visible' : 'reveal'}`}>
          <span className="section-tag">Who We Serve</span>
          <h2 className="section-title" style={{ color: 'white' }}>
            Perfect For <span className="text-gradient">Everyone</span>
          </h2>
        </div>

        <div className={`guests-grid ${sectionVisible ? 'stagger-children visible' : 'stagger-children'}`}>
          {guests.map((guest, index) => (
            <div className="guest-card" key={index}>
              <div className="guest-image">
                <Image 
                  src={encodeURI(guest.image)} 
                  alt={guest.title} 
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>
              <div className="guest-overlay"></div>
              <div className="guest-content">
                <div className="guest-icon">
                  <guest.icon size={24} />
                </div>
                <h3>{guest.title}</h3>
                <p>{guest.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
