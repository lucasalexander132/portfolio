'use client'

import { m } from 'motion/react'
import { X, ExternalLink, Github, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import type { Project } from '@/types/project'
import { isLiveProject } from '@/types/project'

interface ProjectDetailProps {
  project: Project
  onClose: () => void
}

export function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  return (
    <div className="bg-text-primary overflow-hidden">
      {/* Close button - fixed position within container */}
      <button
        type="button"
        onClick={onClose}
        className="sticky top-4 float-right mr-4 mt-4 z-20 rounded-full bg-base-900/80 p-2 text-text-primary transition-colors hover:bg-base-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
        aria-label="Close project details"
      >
        <X size={20} />
      </button>

      {/* Content wipes in */}
      <m.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
        className="clear-both"
      >
        {/* Massive Title Section */}
        <div className="pt-16 pb-8 px-4 overflow-hidden">
          <m.h2
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: 'easeOut' }}
            className="font-serif text-[clamp(4rem,15vw,12rem)] leading-[0.85] tracking-tight text-base-900 max-w-[90vw]"
          >
            {project.title}
          </m.h2>
        </div>

        {/* Narrow content column */}
        <div className="max-w-[45ch] mx-auto px-6 pb-12">
          {/* Tagline */}
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-body-lg text-base-600 mb-12 leading-relaxed"
          >
            {project.tagline}
          </m.p>

          {/* Challenge */}
          <m.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mb-16"
          >
            <span className="text-xs uppercase tracking-[0.2em] text-amber-700 font-medium">
              Challenge
            </span>
            <p className="mt-4 text-body text-base-700 leading-[1.8]">
              {project.challenge}
            </p>
          </m.section>
        </div>

        {/* Image interruption */}
        {project.images[0] && (
          <m.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="max-w-5xl mx-auto px-6 my-8"
          >
            <div className="aspect-[21/9] relative rounded-xl overflow-hidden">
              <Image
                src={project.images[0]}
                alt={`${project.title} screenshot`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </m.div>
        )}

        {/* Continue narrow column */}
        <div className="max-w-[45ch] mx-auto px-6 py-12">
          {/* Approach */}
          <m.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            className="mb-16"
          >
            <span className="text-xs uppercase tracking-[0.2em] text-amber-700 font-medium">
              Approach
            </span>
            <p className="mt-4 text-body text-base-700 leading-[1.8]">
              {project.approach}
            </p>
          </m.section>
        </div>

        {/* Second image interruption */}
        {project.images[1] && (
          <m.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="max-w-5xl mx-auto px-6 my-8"
          >
            <div className="aspect-[21/9] relative rounded-xl overflow-hidden">
              <Image
                src={project.images[1]}
                alt={`${project.title} detail`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </m.div>
        )}

        {/* Final section */}
        <div className="max-w-[45ch] mx-auto px-6 py-12">
          {/* Result */}
          <m.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.5 }}
            className="mb-16"
          >
            <span className="text-xs uppercase tracking-[0.2em] text-amber-700 font-medium">
              Result
            </span>
            <p className="mt-4 text-body text-base-700 leading-[1.8]">
              {project.result}
            </p>
          </m.section>

          {/* Technologies - subtle */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.9, duration: 0.5 }}
            className="mb-16 pt-8 border-t border-base-200"
          >
            <span className="text-xs uppercase tracking-[0.2em] text-base-400 font-medium">
              Built with
            </span>
            <p className="mt-3 text-sm text-base-500">
              {project.technologies.join(' · ')}
            </p>
          </m.div>

          {/* CTAs - minimal styling */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.1, duration: 0.5 }}
            className="flex flex-col gap-4 pb-8"
          >
            {isLiveProject(project) && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 text-base-900 font-medium transition-colors hover:text-amber-700"
              >
                <span>Visit Project</span>
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 text-base-600 transition-colors hover:text-base-900"
              >
                <Github size={18} />
                <span>View Source</span>
              </a>
            )}
          </m.div>
        </div>

        {/* Third image as footer if available */}
        {project.images[2] && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.3, duration: 0.6 }}
            className="max-w-5xl mx-auto px-6 mb-8"
          >
            <div className="aspect-[21/9] relative rounded-xl overflow-hidden">
              <Image
                src={project.images[2]}
                alt={`${project.title} overview`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </m.div>
        )}
      </m.div>
    </div>
  )
}
