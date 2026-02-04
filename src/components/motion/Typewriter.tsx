'use client'

import { useState, useEffect } from 'react'
import { m, AnimatePresence } from 'motion/react'

interface TypewriterProps {
  text: string
  speed?: number
  className?: string
  onComplete?: () => void
}

export function Typewriter({
  text,
  speed = 70,
  className,
  onComplete,
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [showCursor, setShowCursor] = useState(true)
  const [currentText, setCurrentText] = useState(text)

  // Reset when text prop changes
  useEffect(() => {
    if (text !== currentText) {
      setDisplayedText('')
      setIsComplete(false)
      setShowCursor(true)
      setCurrentText(text)
    }
  }, [text, currentText])

  // Typing effect
  useEffect(() => {
    if (displayedText.length < currentText.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText(currentText.slice(0, displayedText.length + 1))
      }, speed)
      return () => clearTimeout(timeoutId)
    } else if (!isComplete && displayedText.length === currentText.length && currentText.length > 0) {
      setIsComplete(true)
      onComplete?.()
    }
  }, [displayedText, currentText, speed, isComplete, onComplete])

  // Cursor fade after completion
  useEffect(() => {
    if (isComplete) {
      const timeoutId = setTimeout(() => {
        setShowCursor(false)
      }, 2000)
      return () => clearTimeout(timeoutId)
    }
  }, [isComplete])

  return (
    <span className={className}>
      {displayedText}
      <AnimatePresence>
        {showCursor && (
          <m.span
            key="cursor"
            className="inline-block w-[3px] h-[0.9em] bg-amber-400 ml-0.5 align-middle"
            initial={{ opacity: 1 }}
            animate={{
              opacity: isComplete ? [1, 0, 1, 0, 1, 0] : [1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.5,
              repeat: isComplete ? 0 : Infinity,
              repeatType: 'reverse',
            }}
          />
        )}
      </AnimatePresence>
    </span>
  )
}
