'use client'

import type { UpdateEntry } from '@/lib/updates'

interface EntryStreamContainerProps {
  entries: UpdateEntry[]
}

export default function EntryStreamContainer({
  entries,
}: EntryStreamContainerProps) {
  return (
    <section aria-label="Updates stream">
      {entries.map((entry) => (
        <div key={entry.slug} className="py-4 border-b border-base-800">
          <p className="text-sm text-text-muted">{entry.title}</p>
        </div>
      ))}
    </section>
  )
}
