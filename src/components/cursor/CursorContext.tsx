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

interface CursorState {
  variant: CursorVariant
  text?: string
  isHovering: boolean
  tiltDirection: 1 | -1
  withArrow?: boolean
  arrowDirection?: ArrowDirection
}

interface CursorContextValue {
  cursorState: CursorState
  setCursorVariant: (variant: CursorVariant, text?: string, withArrow?: boolean, arrowDirection?: ArrowDirection) => void
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
    (variant: CursorVariant, text?: string, withArrow?: boolean, arrowDirection?: ArrowDirection) => {
      setCursorState((prev) => ({
        variant,
        text,
        isHovering: true,
        tiltDirection: prev.tiltDirection === 1 ? -1 : 1,
        withArrow,
        arrowDirection: arrowDirection ?? 'diagonal',
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
