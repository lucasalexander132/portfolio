'use client'

import { useLocale } from '@/lib/i18n'
import { m } from 'motion/react'
import { springSnappy } from '@/lib/motion'
import { useCursor } from '@/components/cursor'

type Locale = 'en' | 'fr'

const languages: { code: Locale; label: string; cursorText: string }[] = [
  { code: 'fr', label: 'FR', cursorText: 'Français' },
  { code: 'en', label: 'EN', cursorText: 'English' },
]

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale()
  const { setCursorVariant, resetCursor } = useCursor()

  return (
    <div
      className="flex flex-col gap-0.5"
      role="group"
      aria-label="Language selection"
    >
      {languages.map(({ code, label, cursorText }) => {
        const isActive = locale === code
        return (
          <m.button
            key={code}
            type="button"
            lang={code}
            aria-pressed={isActive}
            onClick={() => setLocale(code)}
            className={`
              px-2 py-1 text-xs font-medium rounded transition-colors
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500
              ${
                isActive
                  ? 'bg-amber-500 text-base-950 cursor-default'
                  : 'text-text-secondary hover:text-amber-500 cursor-pointer'
              }
            `}
            whileTap={isActive ? {} : { scale: 0.95 }}
            transition={springSnappy}
            onMouseEnter={() => !isActive && setCursorVariant('text', cursorText)}
            onMouseLeave={resetCursor}
          >
            {label}
          </m.button>
        )
      })}
    </div>
  )
}
