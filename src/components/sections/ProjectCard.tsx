'use client'

import Image from 'next/image'
import { m } from 'motion/react'
import type { Project } from '@/types/project'
import { springSubtle, fadeUpVariants } from '@/lib/motion'

interface ProjectCardProps {
  project: Project
  onClick: () => void
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <m.article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      variants={fadeUpVariants}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={springSubtle}
      className="card-grain group relative cursor-pointer overflow-hidden rounded-xl bg-base-800 shadow-elevation-sm transition-shadow duration-300 hover:shadow-elevation-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-base-950"
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
          {project.tagline}
        </p>
      </div>
    </m.article>
  )
}
