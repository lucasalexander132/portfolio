'use client'

import { useLocale, useTranslations } from '@/lib/i18n'
import type { NowEntry } from '@/lib/now'

interface NowSectionProps {
  now: NowEntry
}

export default function NowSection({ now }: NowSectionProps) {
  const { locale } = useLocale()
  const t = useTranslations()

  const focus = locale === 'fr' ? now.focus_fr : now.focus_en
  const learning = locale === 'fr' ? now.learning_fr : now.learning_en

  const formattedDate = new Date(now.updated).toLocaleDateString(
    locale === 'fr' ? 'fr-CA' : 'en-CA',
    { year: 'numeric', month: 'long' },
  )

  return (
    <section
      aria-label="Now"
      className="mb-12 p-6 rounded-lg bg-base-900 border border-base-800"
    >
      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-1">
            {t('updates.now.focus')}
          </p>
          <p className="text-text-primary">{focus}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-1">
            {t('updates.now.learning')}
          </p>
          <p className="text-text-primary">{learning}</p>
        </div>
      </div>
      <p className="text-xs text-text-muted mt-4">
        {t('updates.now.lastUpdated')} {formattedDate}
      </p>
    </section>
  )
}
