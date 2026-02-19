import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getNow } from '@/lib/now'
import { getUpdates } from '@/lib/updates'
import UpdatesPageContent from '@/components/updates/UpdatesPageContent'
import { ContactCTA } from '@/components/updates/ContactCTA'

export function generateMetadata(): Metadata {
  const now = getNow()

  return {
    title: 'Updates | Civix Solutions',
    description: `Currently focused on: ${now.focus_en}`,
    openGraph: {
      title: 'Updates | Civix Solutions',
      description: `Currently focused on: ${now.focus_en}`,
    },
  }
}

export default async function UpdatesPage() {
  const now = getNow()
  const entries = await getUpdates()

  return (
    <>
      <Suspense>
        <UpdatesPageContent now={now} entries={entries} />
      </Suspense>
      <ContactCTA />
    </>
  )
}
