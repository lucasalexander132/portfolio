'use client'

import Image from 'next/image'
import { m } from 'motion/react'
import type { Project } from '@/types/project'
import { fadeUpVariants } from '@/lib/motion'
import { useCursorHover } from '@/components/cursor'

interface ProjectCardProps {
  project: Project
  onClick: () => void
  isSelected?: boolean
}

/**
 * @deprecated This component is no longer used.
 * BentoCard in Projects.tsx replaced it. Consider deleting in polish phase.
 */
export function ProjectCard({ project, onClick, isSelected }: ProjectCardProps) {
  // Use English content as default for deprecated component
  const content = project.content.en
  const cursorProps = useCursorHover('text', content.cursorText)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <m.article
      {...(content.cursorText ? cursorProps : {})}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      variants={fadeUpVariants}
      whileHover={{
        y: -6,
        x: -3,
        boxShadow: '6px 6px 0px 0px #f59e0b',
      }}
      whileTap={{ scale: 0.98, boxShadow: '2px 2px 0px 0px #f59e0b' }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`card-grain group relative cursor-pointer overflow-hidden rounded-lg bg-base-800 border-2 border-transparent hover:border-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-base-950 ${isSelected ? 'ring-2 ring-amber-400' : ''}`}
    >
      {/* Thumbnail container */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={project.thumbnail}
          alt={`${project.title} preview`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Coming Soon badge */}
        {project.status === 'coming-soon' && (
          <span className="absolute right-3 top-3 rounded-full bg-base-900/90 px-3 py-1 text-xs font-medium text-amber-400">
            Coming Soon
          </span>
        )}
      </div>

      {/* Card content */}
      <div className="p-6">
        <h3 className="text-h3 font-serif text-text-primary mb-2">
          {project.title}
        </h3>
        <p className="text-body text-text-secondary line-clamp-2">
          {content.tagline}
        </p>
      </div>
    </m.article>
  )
}
