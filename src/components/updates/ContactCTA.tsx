'use client'

import Link from 'next/link'
import { useTranslations } from '@/lib/i18n'

export function ContactCTA() {
  const t = useTranslations()

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <div className="border border-base-700/30 rounded-2xl p-8 bg-base-800/30">
        <h2 className="font-serif text-h3 text-text-primary">
          {t('updates.cta.title')}
        </h2>
        <p className="text-text-muted mt-2">
          {t('updates.cta.description')}
        </p>
        <Link
          href="/"
          className="mt-6 inline-block bg-amber-500 text-base-950 px-6 py-3 rounded-lg font-medium hover:bg-amber-400 transition-colors"
        >
          {t('updates.cta.button')}
        </Link>
      </div>
    </section>
  )
}
