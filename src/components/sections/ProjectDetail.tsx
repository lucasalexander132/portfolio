'use client'

import { m } from 'motion/react'
import { X, ExternalLink, Github } from 'lucide-react'
import { DraggableGallery } from './DraggableGallery'
import type { Project } from '@/types/project'
import { isLiveProject } from '@/types/project'

interface ProjectDetailProps {
  project: Project
  onClose: () => void
}

export function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  return (
    <div className="bg-text-primary rounded-b-[28px]">
      {/* Close button */}
      <div className="relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-base-900/80 p-2 text-text-primary transition-colors hover:bg-base-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
          aria-label="Close project details"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content wipes in from right after height animation */}
      <m.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.3, ease: 'easeOut' }}
      >
        {/* Gallery - full bleed */}
        <div className="pt-6">
          <DraggableGallery images={project.images} projectTitle={project.title} />
        </div>

        {/* Content container */}
        <div className="mx-auto max-w-6xl px-[var(--container-padding)] py-12">
          {/* Two-column layout on desktop */}
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left column: Title, tagline, technologies */}
            <div>
              <h2 className="text-h1 font-serif text-base-900 mb-3">
                {project.title}
              </h2>
              <p className="text-body-lg text-base-700 mb-8">
                {project.tagline}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-base-200 px-3 py-1 text-sm text-base-700"
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
                    className="inline-flex items-center gap-2 rounded-md bg-amber-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 focus:ring-offset-text-primary"
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
                    className="inline-flex items-center gap-2 rounded-md bg-base-800 px-6 py-2.5 font-medium text-text-primary transition-colors hover:bg-base-700 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 focus:ring-offset-text-primary"
                  >
                    View on GitHub
                    <Github size={18} />
                  </a>
                )}
              </div>
            </div>

            {/* Right column: Case study narrative */}
            <div className="space-y-8">
              <section>
                <h3 className="font-serif text-lg text-amber-700 mb-3">
                  Challenge
                </h3>
                <p className="text-body text-base-700 leading-relaxed">
                  {project.challenge}
                </p>
              </section>

              <section>
                <h3 className="font-serif text-lg text-amber-700 mb-3">
                  Approach
                </h3>
                <p className="text-body text-base-700 leading-relaxed">
                  {project.approach}
                </p>
              </section>

              <section>
                <h3 className="font-serif text-lg text-amber-700 mb-3">
                  Result
                </h3>
                <p className="text-body text-base-700 leading-relaxed">
                  {project.result}
                </p>
              </section>
            </div>
          </div>
        </div>
      </m.div>
    </div>
  )
}
