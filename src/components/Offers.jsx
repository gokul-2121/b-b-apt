'use client'

import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'
import { useScrollReveal } from '../hooks/useAnimations'
import './Offers.css'

const offers = [
  'Special rates for group bookings of 3+ days',
  'Complimentary airport/railway pickup for stays of 5+ days',
  'Early check-in and late check-out based on availability',
  '10% discount for NRI guests on extended stays',
  'Special Sabarimala season packages available',
]

export default function Offers() {
  const [sectionRef, sectionVisible] = useScrollReveal()

  return (
    <section className="offers section" ref={sectionRef}>
      <div className="container">
        <div className={`offers-card ${sectionVisible ? 'reveal visible' : 'reveal'}`}>
          <div className="offers-content">
            <span className="section-tag">Special Offers</span>
            <h2 className="section-title">Exclusive Deals <span className="text-gradient">Await You</span></h2>
            <p className="offers-intro">
              Make the most of your stay with our special packages and seasonal offers.
            </p>
            
            <ul className="offers-list">
              {offers.map((offer, index) => (
                <li key={index}>
                  <div className="offer-check">
                    <Check size={16} />
                  </div>
                  <span>{offer}</span>
                </li>
              ))}
            </ul>

            <p className="offers-note">
              * Terms and conditions apply. Contact us for more details on current offers.
            </p>

            <Link href="/contact" className="btn btn-primary">
              <span>Get Best Rates</span>
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="offers-image">
            <img src="https://www.bandbkonni.com/images/unit-2.jpg" alt="B&B Apartments" />
            <div className="offers-image-overlay"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
