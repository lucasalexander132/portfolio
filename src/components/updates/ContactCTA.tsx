'use client'

import { Send } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

export function ContactCTA() {
  const t = useTranslations()

  const handleClick = () => {
    window.dispatchEvent(new Event('openContactForm'))
  }

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <div className="border border-[#2D3140] rounded-xl p-12 bg-[#1E2230] flex flex-col items-center text-center gap-5">
        <h2 className="font-serif text-3xl font-semibold text-text-primary">
          {t('updates.cta.title')}
        </h2>
        <p className="text-text-muted text-base">
          {t('updates.cta.description')}
        </p>
        <button
          onClick={handleClick}
          className="inline-flex items-center gap-2 bg-amber-500 text-[#161921] px-8 py-3 rounded-full font-medium hover:bg-amber-400 transition-colors"
        >
          <Send className="w-4.5 h-4.5" />
          {t('updates.cta.button')}
        </button>
      </div>
    </section>
  )
}
