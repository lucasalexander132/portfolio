'use client'

import { useLocale, useTranslations } from '@/lib/i18n'
import type { NowEntry } from '@/lib/now'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const MONTHS_FR = [
  'janvier', 'f\u00e9vrier', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'ao\u00fbt', 'septembre', 'octobre', 'novembre', 'd\u00e9cembre',
]

interface NowSectionProps {
  now: NowEntry
}

export default function NowSection({ now }: NowSectionProps) {
  const { locale } = useLocale()
  const t = useTranslations()

  const focus = locale === 'fr' ? now.focus_fr : now.focus_en
  const learning = locale === 'fr' ? now.learning_fr : now.learning_en

  const months = locale === 'fr' ? MONTHS_FR : MONTHS
  const [year, month] = now.updated.split('-')
  const formattedDate = `${months[parseInt(month, 10) - 1]} ${year}`

  return (
    <section
      aria-label="Now"
      className="bg-[#1E2230] border border-[#2D3140] rounded-2xl p-8 mb-12"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center h-7 px-3.5 rounded-[14px] bg-amber-500 text-[#161921] text-xs font-bold uppercase tracking-wider">
          NOW
        </span>
        <span className="text-sm text-text-muted">
          {t('updates.now.lastUpdated')} {formattedDate}
        </span>
      </div>
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
    </section>
  )
}
