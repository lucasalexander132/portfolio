'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'

export type CursorVariant = 'default' | 'link' | 'text'
export type ArrowDirection = 'diagonal' | 'up' | 'down' | 'left' | 'right'

// Neo-brutal color palette for random cursor backgrounds
const NEO_BRUTAL_COLORS = [
  'oklch(0.85 0.18 85)',   // yellow
  'oklch(0.75 0.18 145)',  // green
  'oklch(0.70 0.20 250)',  // blue
  'oklch(0.75 0.20 320)',  // pink/magenta
  'oklch(0.80 0.18 30)',   // orange
  'oklch(0.70 0.22 280)',  // purple
  'oklch(0.80 0.15 175)',  // teal
  'oklch(0.85 0.20 55)',   // peach/coral
]

function getRandomNeoBrutalColor(): string {
  return NEO_BRUTAL_COLORS[Math.floor(Math.random() * NEO_BRUTAL_COLORS.length)]
}

interface CursorState {
  variant: CursorVariant
  text?: string
  isHovering: boolean
  tiltDirection: 1 | -1
  withArrow?: boolean
  arrowDirection?: ArrowDirection
  bgColor?: string
}

interface CursorContextValue {
  cursorState: CursorState
  setCursorVariant: (variant: CursorVariant, text?: string, withArrow?: boolean, arrowDirection?: ArrowDirection, bgColor?: string) => void
  resetCursor: () => void
}

const CursorContext = createContext<CursorContextValue | null>(null)

const defaultState: CursorState = {
  variant: 'default',
  text: undefined,
  isHovering: false,
  tiltDirection: 1,
}

export function CursorProvider({ children }: { children: ReactNode }) {
  const [cursorState, setCursorState] = useState<CursorState>(defaultState)

  const setCursorVariant = useCallback(
    (variant: CursorVariant, text?: string, withArrow?: boolean, arrowDirection?: ArrowDirection, bgColor?: string) => {
      setCursorState((prev) => ({
        variant,
        text,
        isHovering: true,
        tiltDirection: prev.tiltDirection === 1 ? -1 : 1,
        withArrow,
        arrowDirection: arrowDirection ?? 'diagonal',
        // Use provided bgColor, or pick a random neo-brutal color
        bgColor: bgColor ?? getRandomNeoBrutalColor(),
      }))
    },
    []
  )

  const resetCursor = useCallback(() => {
    setCursorState((prev) => ({
      ...defaultState,
      tiltDirection: prev.tiltDirection,
    }))
  }, [])

  return (
    <CursorContext.Provider
      value={{ cursorState, setCursorVariant, resetCursor }}
    >
      {children}
    </CursorContext.Provider>
  )
}

export function useCursor() {
  const context = useContext(CursorContext)
  if (!context) {
    throw new Error('useCursor must be used within a CursorProvider')
  }
  return context
}

// Hook for easily adding cursor hover effects to elements
export function useCursorHover(variant: CursorVariant, text?: string) {
  const { setCursorVariant, resetCursor } = useCursor()

  return {
    onMouseEnter: () => setCursorVariant(variant, text),
    onMouseLeave: resetCursor,
  }
}
