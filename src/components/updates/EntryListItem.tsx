'use client'

import Link from 'next/link'
import { m } from 'motion/react'
import type { UpdateEntry } from '@/lib/updates'
import { useLocale } from '@/lib/i18n'
import TagChip from './TagChip'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const MONTHS_FR = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
]

function formatDate(date: string, locale: string): string {
  const [year, month] = date.split('-')
  const months = locale === 'fr' ? MONTHS_FR : MONTHS
  return `${months[parseInt(month, 10) - 1]} ${year}`
}

interface EntryListItemProps {
  entry: UpdateEntry
}

export default function EntryListItem({ entry }: EntryListItemProps) {
  const { locale } = useLocale()
  const title = locale === 'fr' && entry.title_fr ? entry.title_fr : entry.title
  const summary = locale === 'fr' && entry.summary_fr ? entry.summary_fr : entry.summary

  return (
    <Link
      href={`/updates/${entry.slug}`}
      className="group block cursor-pointer"
    >
      <m.article
        className="py-7 border-b border-[#2D3140] px-4 -mx-4 rounded-lg group-hover:bg-[#EDE5D4] transition-colors duration-150"
        whileHover={{
          y: -2,
          boxShadow: '0 8px 24px oklch(0.08 0.015 250 / 0.15)',
          transition: { duration: 0.15 },
        }}
      >
        {/* Meta row: date + dot + tag */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-text-muted group-hover:text-[#555] transition-colors duration-150">
            {formatDate(entry.date, locale)}
          </span>
          <span className="text-text-muted group-hover:text-[#555] transition-colors duration-150">
            &middot;
          </span>
          <TagChip tag={entry.tag} />
        </div>

        {/* Title */}
        <h3 className="font-serif text-[20px] text-text-primary group-hover:text-[#161921] transition-colors duration-150 mb-1">
          {title}
        </h3>

        {/* Excerpt from summary field */}
        <p className="text-[15px] text-text-muted group-hover:text-[#444] transition-colors duration-150 line-clamp-2">
          {summary}
        </p>
      </m.article>
    </Link>
  )
}
