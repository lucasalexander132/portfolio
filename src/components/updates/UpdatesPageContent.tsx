'use client'

import { useSearchParams } from 'next/navigation'
import { useTranslations } from '@/lib/i18n'
import { UPDATE_TAGS, type UpdateTag } from '@/lib/tags'
import type { UpdateEntry } from '@/lib/updates'
import EntryStreamContainer from '@/components/updates/EntryStreamContainer'
import TagFilter from '@/components/updates/TagFilter'

interface UpdatesPageContentProps {
  entries: UpdateEntry[]
}

export default function UpdatesPageContent({
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
    <main className="animate-page-fade">
      <h1 className="font-serif text-[44px] font-bold text-[#EDE5D4] tracking-[-1px] text-center mb-12">
        What I&apos;m Up To / The Whum Tooz
      </h1>
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-serif text-[24px] text-text-primary">
          {t('updates.stream.title')}
        </h2>
        <span className="text-sm text-text-muted">
          {filteredEntries.length} {t('updates.stream.entries')}
        </span>
      </div>
      <TagFilter />
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
