'use client'

import type { UpdateTag } from '@/lib/updates'

export const TAG_STYLES: Record<
  UpdateTag,
  { bg: string; text: string; border: string }
> = {
  'project-launch': {
    bg: 'bg-[#D4A843]',
    text: 'text-[#161921]',
    border: 'border-transparent',
  },
  'design-thinking': {
    bg: 'bg-transparent',
    text: 'text-[#8B7CC8]',
    border: 'border-[#8B7CC8]',
  },
  business: {
    bg: 'bg-transparent',
    text: 'text-[#5B8FA1]',
    border: 'border-[#5B8FA1]',
  },
  community: {
    bg: 'bg-transparent',
    text: 'text-[#6B9E78]',
    border: 'border-[#6B9E78]',
  },
  learning: {
    bg: 'bg-transparent',
    text: 'text-[#D4A843]',
    border: 'border-[#D4A843]',
  },
}

function formatLabel(tag: UpdateTag): string {
  const raw = tag.replace(/-/g, ' ')
  return raw.charAt(0).toUpperCase() + raw.slice(1)
}

interface TagChipProps {
  tag: UpdateTag
  className?: string
}

export default function TagChip({ tag, className }: TagChipProps) {
  const style = TAG_STYLES[tag]

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border} ${className ?? ''}`}
    >
      {formatLabel(tag)}
    </span>
  )
}
