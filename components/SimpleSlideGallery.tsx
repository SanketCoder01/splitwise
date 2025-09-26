'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface SlideItem {
  image: string
  text: string
}

interface SimpleSlideGalleryProps {
  items: SlideItem[]
  autoSlide?: boolean
  slideInterval?: number
  showText?: boolean
  textColor?: string
}

export default function SimpleSlideGallery({
  items,
  autoSlide = true,
  slideInterval = 3000,
  showText = true,
  textColor = '#000000'
}: SimpleSlideGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!autoSlide || items.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length)
    }, slideInterval)

    return () => clearInterval(interval)
  }, [autoSlide, slideInterval, items.length])

  if (!items || items.length === 0) return null

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg bg-gray-100">
      {/* Sliding Container */}
      <div 
        className="flex transition-transform duration-1000 ease-in-out h-full"
        style={{ 
          transform: `translateX(-${currentIndex * 100}%)`,
          width: `${items.length * 100}%`
        }}
      >
        {items.map((item, index) => (
          <div 
            key={index}
            className="relative flex-shrink-0 w-full h-full"
            style={{ width: `${100 / items.length}%` }}
          >
            <Image
              src={item.image}
              alt={item.text}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {showText && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h3 
                  className="text-xl font-bold"
                  style={{ color: textColor === '#000000' ? '#ffffff' : textColor }}
                >
                  {item.text}
                </h3>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white shadow-lg' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all duration-300"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % items.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all duration-300"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
