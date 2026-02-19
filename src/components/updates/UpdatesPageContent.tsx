'use client'

import { useTranslations } from '@/lib/i18n'
import type { NowEntry } from '@/lib/now'
import type { UpdateEntry } from '@/lib/updates'
import NowSection from '@/components/updates/NowSection'
import EntryStreamContainer from '@/components/updates/EntryStreamContainer'

interface UpdatesPageContentProps {
  now: NowEntry
  entries: UpdateEntry[]
}

export default function UpdatesPageContent({
  now,
  entries,
}: UpdatesPageContentProps) {
  const t = useTranslations()

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-serif text-h1 text-text-primary mb-8">
        {t('updates.pageTitle')}
      </h1>
      <NowSection now={now} />
      <EntryStreamContainer entries={entries} />
    </main>
  )
}
