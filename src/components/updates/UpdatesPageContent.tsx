'use client'

import { useSearchParams } from 'next/navigation'
import { m } from 'motion/react'
import { useTranslations } from '@/lib/i18n'
import { UPDATE_TAGS, type UpdateTag } from '@/lib/tags'
import type { NowEntry } from '@/lib/now'
import type { UpdateEntry } from '@/lib/updates'
import NowSection from '@/components/updates/NowSection'
import EntryStreamContainer from '@/components/updates/EntryStreamContainer'
import TagFilter from '@/components/updates/TagFilter'
import { staggerContainerVariants, fadeUpVariants } from '@/lib/motion'

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
    <m.main
      className="max-w-[720px] mx-auto px-6 pt-[60px] pb-[80px]"
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
    >
      <m.div variants={fadeUpVariants}>
        <h1 className="font-serif text-[48px] font-bold text-text-primary mb-8">
          {t('updates.pageTitle')}
        </h1>
      </m.div>
      <m.div variants={fadeUpVariants}>
        <NowSection now={now} />
      </m.div>
      <m.div variants={fadeUpVariants} className="flex items-baseline justify-between mb-4">
        <h2 className="font-serif text-[24px] text-text-primary">
          {t('updates.stream.title')}
        </h2>
        <span className="text-sm text-text-muted">
          {filteredEntries.length} {t('updates.stream.entries')}
        </span>
      </m.div>
      <m.div variants={fadeUpVariants}>
        <TagFilter />
      </m.div>
      <m.div variants={fadeUpVariants}>
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
      </m.div>
    </m.main>
  )
}
