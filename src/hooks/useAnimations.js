import { useEffect, useRef, useState } from 'react'

export function useScrollReveal(threshold = 0.1) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(element)
        }
      },
      { threshold, rootMargin: '50px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, isVisible]
}

export function useLazyImage(src) {
  const [loaded, setLoaded] = useState(false)
  const [imageSrc, setImageSrc] = useState('')

  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      setImageSrc(src)
      setLoaded(true)
    }
  }, [src])

  return [imageSrc, loaded]
}
