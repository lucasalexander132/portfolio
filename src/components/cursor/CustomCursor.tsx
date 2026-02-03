'use client'

import { useEffect, useState } from 'react'
import { m, useMotionValue, useSpring, AnimatePresence } from 'motion/react'
import { useCursor } from './CursorContext'

export function CustomCursor() {
  const { cursorState } = useCursor()
  const [isVisible, setIsVisible] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  // Use motion values for smooth cursor following
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)

  // Spring for smooth following (high damping = no bounce)
  const springConfig = { damping: 50, stiffness: 500, mass: 0.5 }
  const x = useSpring(cursorX, springConfig)
  const y = useSpring(cursorY, springConfig)

  useEffect(() => {
    // Check for touch device
    const checkTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window || navigator.maxTouchPoints > 0
      )
    }
    checkTouch()

    if (isTouchDevice) return

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [cursorX, cursorY, isVisible, isTouchDevice])

  // Don't render on touch devices
  if (isTouchDevice) return null

  const isExpanded = cursorState.isHovering
  const showText = cursorState.variant === 'text' && cursorState.text
  const showArrow = cursorState.withArrow
  const arrowDirection = cursorState.arrowDirection ?? 'diagonal'

  // Arrow SVG paths for different directions
  const arrowPaths: Record<string, React.ReactNode> = {
    diagonal: (
      <>
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="7 7 17 7 17 17" />
      </>
    ),
    up: (
      <>
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
      </>
    ),
    down: (
      <>
        <line x1="12" y1="5" x2="12" y2="19" />
        <polyline points="5 12 12 19 19 12" />
      </>
    ),
    left: (
      <>
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 5 5 12 12 19" />
      </>
    ),
    right: (
      <>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </>
    ),
  }

  // Calculate width for text (approx 7px per char + padding + arrow)
  const textWidth = showText ? (cursorState.text?.length || 0) * 7 + 48 : 48

  // Neo-brutalist color scheme - darker cream base with dark text
  const colors = {
    fill: 'oklch(0.88 0.035 80)', // warm cream
    fillExpanded: 'oklch(0.88 0.035 80)', // warm cream when expanded too
    border: 'oklch(0.22 0.015 250)', // base-900 border
    shadow: '3px 3px 0px 0px oklch(0.22 0.015 250)', // base-900 shadow
    text: 'text-[oklch(0.22_0.015_250)]', // base-900 text
  }

  return (
    <>
      {/* Hide default cursor globally */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>

      {/* Custom cursor */}
      <m.div
        className="fixed top-0 left-0 pointer-events-none z-9999 flex items-center justify-center"
        style={{
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
        }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
      >
        {/* Cursor shape - Neo-brutalist style */}
        <m.div
          className="flex items-center justify-center gap-1.5 overflow-hidden border-2"
          initial={false}
          animate={{
            width: isExpanded ? textWidth : 14,
            height: isExpanded ? 28 : 14,
            borderRadius: 0,
            paddingLeft: isExpanded ? 10 : 0,
            paddingRight: isExpanded ? 10 : 0,
            rotate: isExpanded ? cursorState.tiltDirection * 2 : 0,
            backgroundColor: isExpanded ? colors.fillExpanded : colors.fill,
            borderColor: colors.border,
            boxShadow: colors.shadow,
          }}
          transition={{
            type: 'spring',
            damping: 50,
            stiffness: 500,
            mass: 0.5,
            backgroundColor: {
              type: 'tween',
              duration: 0.15,
              ease: 'easeOut',
            },
            borderColor: {
              type: 'tween',
              duration: 0.15,
              ease: 'easeOut',
            },
            boxShadow: {
              type: 'tween',
              duration: 0.15,
              ease: 'easeOut',
            },
          }}
        >
          <AnimatePresence>
            {showArrow && (
              <m.svg
                key="arrow"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="square"
                strokeLinejoin="miter"
                className={`w-3.5 h-3.5 shrink-0 ${colors.text}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.15 }}
              >
                {arrowPaths[arrowDirection]}
              </m.svg>
            )}
            {showText && (
              <m.span
                key="text"
                className={`text-xs whitespace-nowrap font-bold ${colors.text}`}
                style={{
                  fontFamily: 'var(--font-sketch)',
                  WebkitTextStroke: '0.2px currentColor',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {cursorState.text}
              </m.span>
            )}
          </AnimatePresence>
        </m.div>
      </m.div>
    </>
  )
}
