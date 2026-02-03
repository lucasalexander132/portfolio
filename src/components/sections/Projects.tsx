'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import { m, useInView, AnimatePresence } from 'motion/react'
import { projects } from '@/data/projects'
import type { Project } from '@/types/project'
import { fadeUpVariants, staggerContainerVariants, springSubtle } from '@/lib/motion'
import { ProjectDetail } from './ProjectDetail'
import { useCursorHover } from '@/components/cursor'

// Sort projects: live first, then coming-soon
const sortedProjects = [...projects].sort((a, b) => {
  if (a.status === 'live' && b.status === 'coming-soon') return -1
  if (a.status === 'coming-soon' && b.status === 'live') return 1
  return 0
})

// Bento grid layout configuration
// Each item specifies grid span and aspect ratio
type BentoSize = 'hero' | 'tall' | 'wide' | 'standard'

const bentoLayout: BentoSize[] = ['hero', 'tall', 'standard', 'wide']

const bentoConfig: Record<BentoSize, { colSpan: string; rowSpan: string; aspect: string }> = {
  hero: {
    colSpan: 'sm:col-span-2',
    rowSpan: 'sm:row-span-2',
    aspect: 'aspect-[4/3] sm:aspect-[16/10]',
  },
  tall: {
    colSpan: 'col-span-1',
    rowSpan: 'sm:row-span-2',
    aspect: 'aspect-[4/3] sm:aspect-[3/4]',
  },
  wide: {
    colSpan: 'sm:col-span-2',
    rowSpan: 'row-span-1',
    aspect: 'aspect-[4/3] sm:aspect-[21/9]',
  },
  standard: {
    colSpan: 'col-span-1',
    rowSpan: 'row-span-1',
    aspect: 'aspect-[4/3]',
  },
}

interface BentoCardProps {
  project: Project
  index: number
  size: BentoSize
  onClick: () => void
  isSelected: boolean
}

function BentoCard({ project, index, size, onClick, isSelected }: BentoCardProps) {
  const cursorProps = useCursorHover('text', project.cursorText || 'View project')
  const config = bentoConfig[size]

  return (
    <m.article
      {...(project.cursorText ? cursorProps : {})}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      variants={fadeUpVariants}
      whileHover={{ y: -8, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={springSubtle}
      className={`card-grain group relative cursor-pointer overflow-hidden rounded-sm bg-base-800 shadow-elevation-sm transition-shadow duration-300 hover:shadow-elevation-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-base-950 ${config.colSpan} ${config.rowSpan} ${isSelected ? 'ring-2 ring-amber-400' : ''}`}
    >
      {/* Image container */}
      <div className={`relative w-full h-full ${config.aspect}`}>
        <Image
          src={project.thumbnail}
          alt={`${project.title} preview`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={size === 'hero' || size === 'wide' ? '(max-width: 640px) 100vw, 66vw' : '(max-width: 640px) 100vw, 33vw'}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-base-900/90 via-base-900/20 to-transparent" />

        {/* Number badge - top left */}
        <span className="absolute left-4 top-4 font-mono text-xs text-white/50 tracking-wider">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Coming Soon badge */}
        {project.status === 'coming-soon' && (
          <span className="absolute right-4 top-4 rounded-full bg-base-900/80 backdrop-blur-sm px-3 py-1 text-xs font-medium text-amber-400">
            Coming Soon
          </span>
        )}

        {/* Content overlay - bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
          <h3 className={`font-serif text-text-primary mb-1 ${size === 'hero' ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'}`}>
            {project.title}
          </h3>
          <p className={`text-text-secondary/80 line-clamp-2 ${size === 'hero' ? 'text-sm sm:text-base max-w-md' : 'text-sm'}`}>
            {project.tagline}
          </p>
        </div>
      </div>
    </m.article>
  )
}

interface ProjectsProps {
  selectedProject: Project | null
  onSelectProject: (project: Project | null) => void
}

export function Projects({ selectedProject, onSelectProject }: ProjectsProps) {
  const sectionRef = useRef(null)
  const detailRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 })

  // Scroll to detail section when project is selected
  useEffect(() => {
    if (selectedProject && detailRef.current) {
      const timeout = setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
      return () => clearTimeout(timeout)
    }
  }, [selectedProject?.id])

  return (
    <>
      {/* Inline detail section */}
      <AnimatePresence mode="wait">
        {selectedProject && (
          <m.div
            ref={detailRef}
            key={selectedProject.id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <ProjectDetail
              project={selectedProject}
              onClose={() => onSelectProject(null)}
            />
          </m.div>
        )}
      </AnimatePresence>

      <m.section
        ref={sectionRef}
        id="projects"
        className="py-[var(--spacing-section)] bg-base-900 transition-[border-radius] duration-300"
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={staggerContainerVariants}
        style={{
          borderTopLeftRadius: selectedProject ? '28px' : 0,
          borderTopRightRadius: selectedProject ? '28px' : 0,
          borderBottomLeftRadius: '28px',
          borderBottomRightRadius: '28px',
        }}
      >
        <div className="mx-auto max-w-6xl px-[var(--container-padding)]">
          {/* Section header - editorial style */}
          <m.div variants={fadeUpVariants} className="mb-12 md:mb-16 flex justify-end">
            <p className="text-xs uppercase tracking-[0.2em] text-text-secondary max-w-md leading-relaxed text-right">
              Real projects, real results. Click any card to see the full story
              behind the build.
            </p>
          </m.div>

          {/* Bento grid */}
          <m.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 auto-rows-min"
            variants={staggerContainerVariants}
          >
            {sortedProjects.map((project, index) => (
              <BentoCard
                key={project.id}
                project={project}
                index={index}
                size={bentoLayout[index] || 'standard'}
                onClick={() => onSelectProject(
                  selectedProject?.id === project.id ? null : project
                )}
                isSelected={selectedProject?.id === project.id}
              />
            ))}
          </m.div>

          {/* Section footer */}
          <m.div variants={fadeUpVariants} className="mt-12 md:mt-16">
            <p className="text-xs uppercase tracking-[0.2em] text-text-secondary max-w-md leading-relaxed">
              More in the works. The best is yet to come.
            </p>
          </m.div>
        </div>
      </m.section>
    </>
  )
}
