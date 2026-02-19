'use client'

import { useSearchParams } from 'next/navigation'
import { useTranslations } from '@/lib/i18n'
import { UPDATE_TAGS, type UpdateTag } from '@/lib/tags'
import type { NowEntry } from '@/lib/now'
import type { UpdateEntry } from '@/lib/updates'
import NowSection from '@/components/updates/NowSection'
import EntryStreamContainer from '@/components/updates/EntryStreamContainer'
import TagFilter from '@/components/updates/TagFilter'

interface UpdatesPageContentProps {
  now: NowEntry
  entries: UpdateEntry[]
}

export default function UpdatesPageContent({
  now,
  entries,
}: UpdatesPageContentProps) {
  const t = useTranslations()
  const searchParams = useSearchParams()

  const tagParam = searchParams.get('tag')
  const activeTag: UpdateTag | null =
    tagParam && (UPDATE_TAGS as readonly string[]).includes(tagParam)
      ? (tagParam as UpdateTag)
      : null

  const filteredEntries = activeTag
    ? entries.filter((e) => e.tag === activeTag)
    : entries

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-serif text-h1 text-text-primary mb-8">
        {t('updates.pageTitle')}
      </h1>
      <TagFilter />
      <NowSection now={now} />
      {filteredEntries.length === 0 && activeTag ? (
        <p className="text-text-muted text-center py-12">
          {t('updates.filter.noEntries')}
        </p>
      ) : (
        <EntryStreamContainer
          key={activeTag ?? 'all'}
          entries={filteredEntries}
        />
      )}
    </main>
  )
}
