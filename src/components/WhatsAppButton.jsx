'use client'

import { MessageCircle } from 'lucide-react'
import './WhatsAppButton.css'

export default function WhatsAppButton() {
  const phoneNumber = '918078898000'
  const message = 'Hello, I would like to enquire about B&B Apartments Konni'
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <a 
      href={whatsappUrl}
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={24} />
      <span>Chat with us</span>
    </a>
  )
}
