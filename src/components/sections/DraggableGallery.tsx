'use client'

import { useRef, useState, useEffect } from 'react'
import { m } from 'motion/react'
import Image from 'next/image'

interface DraggableGalleryProps {
  images: string[]
  projectTitle: string
}

export function DraggableGallery({ images, projectTitle }: DraggableGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 })
  const [hasDragged, setHasDragged] = useState(false)

  // Calculate drag constraints based on content width
  useEffect(() => {
    const calculateConstraints = () => {
      if (containerRef.current && innerRef.current) {
        const containerWidth = containerRef.current.clientWidth
        const scrollWidth = innerRef.current.scrollWidth
        const maxDrag = scrollWidth - containerWidth
        setDragConstraints({
          left: maxDrag > 0 ? -maxDrag : 0,
          right: 0,
        })
      }
    }

    calculateConstraints()
    window.addEventListener('resize', calculateConstraints)
    return () => window.removeEventListener('resize', calculateConstraints)
  }, [images])

  return (
    <div className="relative mt-8">
      {/* Drag hint - fades after user drags */}
      {!hasDragged && images.length > 1 && (
        <m.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-4 right-4 z-10 flex items-center gap-2 rounded-full bg-base-900/80 px-3 py-1.5 text-sm text-text-secondary backdrop-blur-sm"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
          Drag to explore
        </m.div>
      )}

      {/* Gallery container with bleed effect */}
      <div
        ref={containerRef}
        className="-mx-4 sm:-mx-8 overflow-hidden"
      >
        <m.div
          ref={innerRef}
          drag="x"
          dragConstraints={dragConstraints}
          dragElastic={0.1}
          dragMomentum={true}
          dragTransition={{
            bounceStiffness: 300,
            bounceDamping: 30,
          }}
          onDragStart={() => setHasDragged(true)}
          className="flex gap-4 cursor-grab active:cursor-grabbing pl-8 sm:pl-16"
        >
          {images.map((src, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[85%] sm:w-[70%] aspect-[21/9] relative rounded-lg overflow-hidden"
            >
              <Image
                src={src}
                alt={`${projectTitle} screenshot ${i + 1}`}
                fill
                className="object-cover pointer-events-none"
                sizes="85vw"
                draggable={false}
              />
            </div>
          ))}
          {/* Padding element for last item visibility */}
          <div className="flex-shrink-0 w-4 sm:w-8" aria-hidden="true" />
        </m.div>
      </div>
    </div>
  )
}
