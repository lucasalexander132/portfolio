'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ExternalLink } from 'lucide-react'
import type { UpdateEntry } from '@/lib/updates'
import { useLocale } from '@/lib/i18n'
import TagChip from './TagChip'
import PostNavigation from './PostNavigation'
import ScrollProgressIndicator from './ScrollProgressIndicator'

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

interface EntryArticleProps {
  entry: UpdateEntry
  adjacent: {
    prev: { slug: string; title: string } | null
    next: { slug: string; title: string } | null
  }
}

export default function EntryArticle({ entry, adjacent }: EntryArticleProps) {
  const { locale } = useLocale()
  const title = locale === 'fr' && entry.title_fr ? entry.title_fr : entry.title
  const summary = locale === 'fr' && entry.summary_fr ? entry.summary_fr : entry.summary
  const body = locale === 'fr' && entry.body_fr ? entry.body_fr : entry.body

  useEffect(() => {
    const codeBlocks = document.querySelectorAll('.prose-updates pre')
    codeBlocks.forEach((pre) => {
      if (pre.querySelector('.copy-button')) return
      const button = document.createElement('button')
      button.className = 'copy-button'
      button.textContent = 'Copy'
      button.addEventListener('click', async () => {
        const code = pre.querySelector('code')
        if (code) {
          await navigator.clipboard.writeText(code.textContent || '')
          button.textContent = 'Copied!'
          setTimeout(() => {
            button.textContent = 'Copy'
          }, 2000)
        }
      })
      pre.appendChild(button)
    })
  }, [body])

  return (
    <>
    <main className="max-w-3xl mx-auto px-6 py-12">
      {/* Back row */}
      <Link
        href="/updates"
        className="flex items-center gap-1 text-text-muted hover:text-amber-500 transition-colors mb-8"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="text-sm">
          {locale === 'fr' ? 'Toutes les mises a jour' : 'All updates'}
        </span>
      </Link>

      {/* Article header */}
      <header>
        {/* Meta row */}
        <div className="flex items-center gap-2">
          <span className="text-text-muted text-sm">{formatDate(entry.date, locale)}</span>
          <span className="text-text-muted mx-2">&middot;</span>
          <TagChip tag={entry.tag} />
        </div>

        {/* Title */}
        <h1 className="font-serif text-[40px] leading-tight text-text-primary mt-3 mb-3">
          {title}
        </h1>

        {/* Subtitle / lead */}
        <p className="font-sans text-[17px] text-text-muted leading-relaxed">
          {summary}
        </p>
      </header>

      <hr className="border-[#2D3140] my-8" />

      {/* Article body -- content from trusted local markdown files via unified pipeline */}
      <div
        className="prose-updates"
        dangerouslySetInnerHTML={{ __html: body }}
      />

      {/* Link field (conditional) */}
      {entry.link && (
        <div className="flex items-center gap-2 mt-8 mb-4">
          <ExternalLink className="w-4 h-4 text-amber-500" />
          <a
            href={entry.link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-500 hover:text-amber-400 transition-colors font-sans"
          >
            {locale === 'fr' ? 'Visiter' : 'Visit'} {entry.link.label} &rarr;
          </a>
        </div>
      )}

      <hr className="border-[#2D3140] my-8" />

      {/* Post navigation */}
      <PostNavigation prev={adjacent.prev} next={adjacent.next} />
    </main>
    <ScrollProgressIndicator body={body} />
    </>
  )
}
