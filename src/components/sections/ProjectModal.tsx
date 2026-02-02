'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import type { Project } from '@/types/project'
import { isLiveProject } from '@/types/project'

interface ProjectModalProps {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProjectModal({ project, open, onOpenChange }: ProjectModalProps) {
  const [activeImage, setActiveImage] = useState(0)

  // Reset active image when project changes
  useEffect(() => {
    if (project) {
      setActiveImage(0)
    }
  }, [project?.id])

  const navigateGallery = useCallback(
    (direction: 'prev' | 'next') => {
      if (!project) return
      const imageCount = project.images.length
      if (imageCount <= 1) return

      setActiveImage((current) => {
        if (direction === 'prev') {
          return current === 0 ? imageCount - 1 : current - 1
        }
        return current === imageCount - 1 ? 0 : current + 1
      })
    },
    [project]
  )

  // Keyboard navigation for gallery
  useEffect(() => {
    if (!open || !project || project.images.length <= 1) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        navigateGallery('prev')
      } else if (e.key === 'ArrowRight') {
        navigateGallery('next')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, project, navigateGallery])

  if (!project) return null

  const hasMultipleImages = project.images.length > 1

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-6xl max-h-[85vh] overflow-y-auto border-base-700 bg-base-900 p-0 [&>button]:text-text-primary [&>button]:ring-amber-400 [&>button]:ring-offset-base-900"
      >
        {/* Image gallery */}
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-t-lg bg-base-800">
          <Image
            src={project.images[activeImage]}
            alt={`${project.title} screenshot ${activeImage + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 1152px) 100vw, 1152px"
            priority
          />

          {/* Gallery navigation */}
          {hasMultipleImages && (
            <>
              <button
                type="button"
                onClick={() => navigateGallery('prev')}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-base-900/80 p-2 text-text-primary transition-colors hover:bg-base-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={() => navigateGallery('next')}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-base-900/80 p-2 text-text-primary transition-colors hover:bg-base-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Dot indicators */}
          {hasMultipleImages && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {project.images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === activeImage
                      ? 'bg-amber-400'
                      : 'bg-base-600 hover:bg-base-500'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                  aria-current={index === activeImage ? 'true' : undefined}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 pt-4">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-h2 font-serif text-text-primary">
              {project.title}
            </DialogTitle>
            <DialogDescription className="text-body text-text-secondary">
              {project.tagline}
            </DialogDescription>
          </DialogHeader>

          {/* Case study narrative */}
          <div className="space-y-6">
            <section>
              <h3 className="font-serif text-lg text-amber-400 mb-2">
                Challenge
              </h3>
              <p className="text-body text-text-secondary leading-relaxed">
                {project.challenge}
              </p>
            </section>

            <section>
              <h3 className="font-serif text-lg text-amber-400 mb-2">
                Approach
              </h3>
              <p className="text-body text-text-secondary leading-relaxed">
                {project.approach}
              </p>
            </section>

            <section>
              <h3 className="font-serif text-lg text-amber-400 mb-2">
                Result
              </h3>
              <p className="text-body text-text-secondary leading-relaxed">
                {project.result}
              </p>
            </section>
          </div>

          {/* Technologies */}
          <div className="mt-6 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-base-800 px-3 py-1 text-sm text-text-secondary"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            {isLiveProject(project) && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-6 py-2.5 font-medium text-base-950 transition-colors hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-base-900"
              >
                Visit Project
                <ExternalLink size={18} />
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-base-700 px-6 py-2.5 font-medium text-text-primary transition-colors hover:bg-base-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-base-900"
              >
                View on GitHub
                <Github size={18} />
              </a>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
