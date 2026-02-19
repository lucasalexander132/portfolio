import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getUpdateBySlug, getAdjacentEntries, getUpdates } from '@/lib/updates'
import EntryArticle from '@/components/updates/EntryArticle'

export async function generateStaticParams() {
  const entries = await getUpdates()
  return entries.map((entry) => ({ slug: entry.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const entry = await getUpdateBySlug(slug)
  if (!entry) return { title: 'Not Found' }
  return {
    title: `${entry.title} | Civix Solutions`,
    description: entry.summary,
  }
}

export default async function UpdateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const entry = await getUpdateBySlug(slug)
  if (!entry) notFound()
  const adjacent = await getAdjacentEntries(slug)
  return <EntryArticle entry={entry} adjacent={adjacent} />
}
