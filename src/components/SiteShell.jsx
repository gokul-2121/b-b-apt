'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import WhatsAppButton from './WhatsAppButton'
import BackToTop from './BackToTop'
import Preloader from './Preloader'

export default function SiteShell({ children }) {
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith('/admin')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  if (isAdminRoute) {
    return <>{children}</>
  }

  return (
    <>
      {loading && <Preloader />}
      <Header />
      {children}
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </>
  )
}
