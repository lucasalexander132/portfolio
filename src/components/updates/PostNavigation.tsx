'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PostNavigationProps {
  prev: { slug: string; title: string } | null
  next: { slug: string; title: string } | null
}

export default function PostNavigation({ prev, next }: PostNavigationProps) {
  if (!prev && !next) return null

  return (
    <nav className="flex justify-between items-start gap-4">
      {prev ? (
        <Link
          href={`/updates/${prev.slug}`}
          className="group flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4 text-text-muted group-hover:text-amber-500 transition-colors" />
          <div>
            <span className="block text-xs text-text-muted uppercase tracking-wide">
              Newer
            </span>
            <span className="block text-sm text-text-primary group-hover:text-amber-500 transition-colors">
              {prev.title}
            </span>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/updates/${next.slug}`}
          className={`group flex items-center gap-2 text-right ${!prev ? 'ml-auto' : ''}`}
        >
          <div>
            <span className="block text-xs text-text-muted uppercase tracking-wide text-right">
              Older
            </span>
            <span className="block text-sm text-text-primary group-hover:text-amber-500 transition-colors text-right">
              {next.title}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-amber-500 transition-colors" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  )
}
