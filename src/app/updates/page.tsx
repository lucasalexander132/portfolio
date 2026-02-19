import type { Metadata } from 'next'
import { getNow } from '@/lib/now'
import { getUpdates } from '@/lib/updates'
import UpdatesPageContent from '@/components/updates/UpdatesPageContent'

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

  return <UpdatesPageContent now={now} entries={entries} />
}
