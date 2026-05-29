'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  { src: '/masjid/masjid-1.jpg', caption: 'Sabdi Badher Par Jame Masjid' },
  { src: '/masjid/masjid-2.jpg', caption: 'Our Masjid — Serving the Community' },
  { src: '/masjid/masjid-3.jpg', caption: 'Jumu\'ah Prayer — Community Gathering' },
  { src: '/masjid/masjid-4.jpg', caption: 'Surrounded by Nature\'s Blessings' },
]

export default function MasjidSlider() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  const goTo = useCallback((index: number) => {
    if (animating) return
    setAnimating(true)
    setCurrent(index)
    setTimeout(() => setAnimating(false), 600)
  }, [animating])

  const prev = () => goTo((current - 1 + slides.length) % slides.length)
  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo])

  useEffect(() => {
    const timer = setInterval(next, 4500)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section className="relative w-full overflow-hidden bg-black" style={{ height: '420px' }}>
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <Image
            src={slide.src}
            alt={slide.caption}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/35" />
          {/* Caption */}
          <div className="absolute bottom-0 left-0 right-0 px-6 py-5 bg-gradient-to-t from-black/70 to-transparent">
            <p className="text-white text-center font-semibold text-lg drop-shadow">{slide.caption}</p>
          </div>
        </div>
      ))}

      {/* Prev button */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Next button */}
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all ${i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/80'}`}
          />
        ))}
      </div>
    </section>
  )
}
