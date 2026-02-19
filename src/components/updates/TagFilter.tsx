'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { UPDATE_TAGS, type UpdateTag } from '@/lib/tags'
import { useTranslations } from '@/lib/i18n'

function formatLabel(tag: UpdateTag): string {
  const raw = tag.replace(/-/g, ' ')
  return raw.charAt(0).toUpperCase() + raw.slice(1)
}

export default function TagFilter() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations()

  const activeTag = searchParams.get('tag')

  function handleTagClick(tag: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (tag === null || tag === activeTag) {
      params.delete('tag')
    } else {
      params.set('tag', tag)
    }
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  return (
    <div
      role="group"
      aria-label={t('updates.filter.label')}
      className="flex flex-wrap gap-2 mb-6"
    >
      <button
        type="button"
        onClick={() => handleTagClick(null)}
        aria-pressed={!activeTag}
        className={`inline-flex items-center h-8 px-4 rounded-full text-sm font-medium border hover:opacity-80 transition-opacity ${
          !activeTag
            ? 'bg-[#D4A843] text-[#161921] border-transparent'
            : 'bg-transparent text-text-muted border-[#3D424D]'
        }`}
      >
        {t('updates.filter.all')}
      </button>
      {UPDATE_TAGS.map((tag) => {
        const isActive = activeTag === tag

        return (
          <button
            key={tag}
            type="button"
            onClick={() => handleTagClick(tag)}
            aria-pressed={isActive}
            className={`inline-flex items-center h-8 px-4 rounded-full text-sm font-medium border hover:opacity-80 transition-opacity ${
              isActive
                ? 'bg-[#D4A843] text-[#161921] border-transparent'
                : 'bg-transparent text-text-muted border-[#3D424D]'
            }`}
          >
            {formatLabel(tag)}
          </button>
        )
      })}
    </div>
  )
}
