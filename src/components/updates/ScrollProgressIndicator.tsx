'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

interface HeadingInfo {
  id: string
  text: string
  level: number
  element: HTMLElement
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

interface ScrollProgressIndicatorProps {
  body: string
}

export default function ScrollProgressIndicator({ body }: ScrollProgressIndicatorProps) {
  const [headings, setHeadings] = useState<HeadingInfo[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLElement | null>(null)

  // Phase 1: Assign IDs to headings in the prose container
  useEffect(() => {
    const proseContainer = document.querySelector('.prose-updates')
    if (!proseContainer) return

    const els = proseContainer.querySelectorAll('h2, h3')
    els.forEach((el) => {
      if (!el.id) {
        el.id = slugify(el.textContent || '')
      }
    })
  }, [body])

  // Phase 2: Extract heading info after IDs are assigned
  useEffect(() => {
    // Small delay to ensure IDs are set from the previous effect
    const timer = setTimeout(() => {
      const proseContainer = document.querySelector('.prose-updates')
      if (!proseContainer) {
        setHeadings([])
        return
      }

      const els = proseContainer.querySelectorAll<HTMLElement>('h2, h3')
      const extracted: HeadingInfo[] = Array.from(els).map((el) => ({
        id: el.id,
        text: el.textContent || '',
        level: el.tagName === 'H2' ? 2 : 3,
        element: el,
      }))

      setHeadings(extracted)
    }, 50)

    return () => clearTimeout(timer)
  }, [body])

  // Find scroll container
  useEffect(() => {
    const container = document.querySelector<HTMLElement>(
      '.updates-root > .overflow-y-auto'
    )
    scrollContainerRef.current = container
  }, [])

  // Scroll tracking
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container || headings.length === 0) return

    const scrollTop = container.scrollTop
    const offset = 120

    let currentIndex = 0
    for (let i = headings.length - 1; i >= 0; i--) {
      const el = headings[i].element
      const elTop = el.offsetTop - container.offsetTop
      if (scrollTop + offset >= elTop) {
        currentIndex = i
        break
      }
    }

    setActiveIndex(currentIndex)
  }, [headings])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || headings.length === 0) return

    container.addEventListener('scroll', handleScroll, { passive: true })
    // Initial check
    handleScroll()

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [headings, handleScroll])

  const handleClick = (heading: HeadingInfo) => {
    const container = scrollContainerRef.current
    if (!container) return

    const elTop = heading.element.offsetTop - container.offsetTop
    container.scrollTo({ top: elTop - 80, behavior: 'smooth' })
  }

  if (headings.length === 0) return null

  return (
    <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-2">
      {headings.map((heading, i) => (
        <button
          key={heading.id || i}
          onClick={() => handleClick(heading)}
          aria-label={`Scroll to: ${heading.text}`}
          className={`rounded-full transition-all duration-300 ${
            heading.level === 2 ? 'w-6' : 'w-3'
          } h-[3px] ${
            i === activeIndex
              ? 'bg-amber-500 opacity-100'
              : 'bg-base-700 opacity-40'
          }`}
        />
      ))}
    </div>
  )
}
