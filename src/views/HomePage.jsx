'use client'

import Hero from '../components/Hero'
import About from '../components/About'
import Rooms from '../components/Rooms'
import Facilities from '../components/Facilities'
import Attractions from '../components/Attractions'
import Gallery from '../components/Gallery'
import Guests from '../components/Guests'
import Offers from '../components/Offers'
import Contact from '../components/Contact'

export default function HomePage({ galleryItems = [] }) {
  return (
    <main>
      <Hero />
      <About />
      <Rooms />
      <Facilities />
      <Guests />
      <Attractions />
      <Gallery images={galleryItems} />
      <Offers />
      <Contact />
    </main>
  )
}
