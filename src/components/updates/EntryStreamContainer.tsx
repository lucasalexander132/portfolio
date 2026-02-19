'use client'

import { m } from 'motion/react'
import { staggerContainerVariants, fadeUpVariants } from '@/lib/motion'
import type { UpdateEntry } from '@/lib/updates'
import EntryListItem from './EntryListItem'

interface EntryStreamContainerProps {
  entries: UpdateEntry[]
}

export default function EntryStreamContainer({
  entries,
}: EntryStreamContainerProps) {
  return (
    <m.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      aria-label="Updates stream"
    >
      {entries.map((entry) => (
        <m.div key={entry.slug} variants={fadeUpVariants}>
          <EntryListItem entry={entry} />
        </m.div>
      ))}
    </m.div>
  )
}
