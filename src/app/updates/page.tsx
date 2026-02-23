import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getNow } from '@/lib/now'
import { getUpdates } from '@/lib/updates'
import UpdatesPageContent from '@/components/updates/UpdatesPageContent'
import ProfileCard from '@/components/updates/ProfileCard'
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
    <div className="lg:flex lg:gap-16 max-w-[1200px] mx-auto px-6 pt-[60px] pb-[80px]">
      {/* Left: sticky sidebar (desktop only) */}
      <aside className="hidden lg:block lg:w-[320px] shrink-0">
        <div className="sticky top-[60px]">
          <ProfileCard now={now} />
        </div>
      </aside>

      {/* Right: main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile-only ProfileCard */}
        <div className="lg:hidden mb-12">
          <ProfileCard now={now} />
        </div>

        <Suspense>
          <UpdatesPageContent entries={entries} />
        </Suspense>
        <ContactCTA />
      </div>
    </div>
  )
}
