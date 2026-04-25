'use client'

import { 
  Car, Wifi, Shield, Sun, Droplets, Wind, Utensils, Tv,
  Coffee, Shirt, TreePine, Dumbbell, Users, Flame, Zap,
  ArrowUpFromLine, Battery, CircleDot
} from 'lucide-react'
import { useScrollReveal } from '../hooks/useAnimations'
import './Facilities.css'

const facilities = [
  { icon: Car, name: 'Basement Parking', desc: 'Secure parking' },
  { icon: Wifi, name: 'Free WiFi', desc: 'High-speed internet' },
  { icon: Shield, name: '24/7 Security', desc: 'CCTV surveillance' },
  { icon: Battery, name: '24 Hrs Power Backup', desc: 'Uninterrupted supply' },
  { icon: Sun, name: 'Solar Energy', desc: 'Eco-friendly power' },
  { icon: Droplets, name: 'Rainwater Harvest', desc: 'Water conservation' },
  { icon: Wind, name: 'Air Conditioning', desc: 'Climate control' },
  { icon: Utensils, name: 'Kitchen Facility', desc: 'Fully equipped' },
  { icon: Tv, name: 'Smart TV', desc: 'Entertainment' },
  { icon: Coffee, name: 'Reception', desc: '24/7 assistance' },
  { icon: Shirt, name: 'Laundry', desc: 'Washing machine' },
  { icon: TreePine, name: 'Roof Garden', desc: 'Relaxation space' },
  { icon: ArrowUpFromLine, name: 'Lift', desc: 'Easy access' },
  { icon: Dumbbell, name: 'Badminton Court', desc: 'Recreation' },
  { icon: CircleDot, name: 'Football/Cricket Turf', desc: 'Recreation' },
  { icon: Users, name: 'Conference Hall', desc: 'Meeting space' },
  { icon: Flame, name: 'Fire Safety', desc: 'Full protection' },
  { icon: Zap, name: 'Power Backup', desc: 'Generator backup' },
]

export default function Facilities() {
  const [sectionRef, isVisible] = useScrollReveal(0.1)

  return (
    <section className="facilities section" id="facilities" ref={sectionRef}>
      <div className="container">
        <div className={`section-header ${isVisible ? 'visible' : ''}`}>
          <span className="section-tag reveal">Amenities</span>
          <h2 className="section-title reveal">Premium <span className="text-gradient">Facilities</span></h2>
          <p className="section-subtitle reveal">
            Everything you need for a comfortable and memorable stay
          </p>
        </div>

        <div className={`facilities-grid ${isVisible ? 'visible' : ''}`}>
          {facilities.map((facility, index) => (
            <div 
              className="facility-card" 
              key={index}
              style={{ transitionDelay: `${index * 0.05}s` }}
            >
              <div className="facility-icon">
                <facility.icon size={28} />
              </div>
              <h3>{facility.name}</h3>
              <p>{facility.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
