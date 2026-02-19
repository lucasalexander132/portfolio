'use client'

import type { UpdateTag } from '@/lib/tags'

function formatLabel(tag: UpdateTag): string {
  const raw = tag.replace(/-/g, ' ')
  return raw.charAt(0).toUpperCase() + raw.slice(1)
}

interface TagChipProps {
  tag: UpdateTag
  className?: string
}

export default function TagChip({ tag, className }: TagChipProps) {
  return (
    <span
      className={`inline-flex items-center h-6 px-2.5 rounded-[12px] text-xs font-medium bg-[#D4A843] text-[#161921] border-transparent ${className ?? ''}`}
    >
      {formatLabel(tag)}
    </span>
  )
}
