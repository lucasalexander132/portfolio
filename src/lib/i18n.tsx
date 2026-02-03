'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import en from '../../messages/en.json'
import fr from '../../messages/fr.json'
import type { TranslationKey } from '@/types/i18n'

type Locale = 'en' | 'fr'

const messages = { en, fr } as const

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en')

  // Detect browser language on mount
  useEffect(() => {
    const browserLang = navigator.language.split('-')[0]
    if (browserLang === 'fr') {
      setLocale('fr')
    }
  }, [])

  const t = useCallback(
    (key: TranslationKey): string => {
      const keys = key.split('.')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let value: any = messages[locale]

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k]
        } else {
          // Return key as fallback (visible bug indicator)
          return key
        }
      }

      return typeof value === 'string' ? value : key
    },
    [locale]
  )

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return { locale: context.locale, setLocale: context.setLocale }
}

export function useTranslations() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useTranslations must be used within a LocaleProvider')
  }
  return context.t
}
