'use client'

import { Crosshair, BookOpen } from 'lucide-react'
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
      className="bg-[#1E2230] border border-[#2D3140] rounded-2xl p-8 mb-12 flex flex-col gap-6"
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center h-7 px-3.5 rounded-full bg-amber-500 text-[#161921] text-xs font-bold uppercase tracking-wider">
          NOW
        </span>
        <span className="text-sm text-text-muted italic">
          {t('updates.now.lastUpdated')} {formattedDate}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#161921] rounded-xl p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Crosshair className="w-3.5 h-3.5 text-amber-500" />
            <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-500">
              {t('updates.now.focus')}
            </p>
          </div>
          <p className="text-text-primary text-sm leading-relaxed">{focus}</p>
        </div>
        <div className="bg-[#161921] rounded-xl p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
            <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-500">
              {t('updates.now.learning')}
            </p>
          </div>
          <p className="text-text-primary text-sm leading-relaxed">{learning}</p>
        </div>
      </div>
    </section>
  )
}
