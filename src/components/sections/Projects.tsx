'use client'

import { useRef, useState, useEffect } from 'react'
import { m, useInView, AnimatePresence } from 'motion/react'
import { projects } from '@/data/projects'
import type { Project } from '@/types/project'
import { fadeUpVariants, staggerContainerVariants } from '@/lib/motion'
import { ProjectCard } from './ProjectCard'
import { ProjectDetail } from './ProjectDetail'

// Sort projects: live first, then coming-soon
const sortedProjects = [...projects].sort((a, b) => {
  if (a.status === 'live' && b.status === 'coming-soon') return -1
  if (a.status === 'coming-soon' && b.status === 'live') return 1
  return 0
})

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const sectionRef = useRef(null)
  const detailRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.25 })

  // Scroll to detail section when project is selected
  useEffect(() => {
    if (selectedProject && detailRef.current) {
      // Small delay to let animation start
      const timeout = setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
      return () => clearTimeout(timeout)
    }
  }, [selectedProject?.id])

  return (
    <>
      {/* Main projects section with animated border-radius */}
      <m.section
        ref={sectionRef}
        id="projects"
        className="py-[var(--spacing-section)]"
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={staggerContainerVariants}
        style={{
          borderBottomLeftRadius: selectedProject ? '1.5rem' : 0,
          borderBottomRightRadius: selectedProject ? '1.5rem' : 0,
        }}
      >
        <div className="mx-auto max-w-6xl px-[var(--container-padding)]">
          {/* Section header */}
          <m.div variants={fadeUpVariants}>
            <h2 className="text-h1 font-serif text-text-primary mb-4">
              Recent Work
            </h2>
            <p className="text-body text-text-secondary max-w-2xl mb-12">
              Real projects, real results. Click any project to see the full story.
            </p>
          </m.div>

          {/* Project grid */}
          <m.div
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainerVariants}
          >
            {sortedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelectedProject(
                  selectedProject?.id === project.id ? null : project
                )}
                isSelected={selectedProject?.id === project.id}
              />
            ))}
          </m.div>
        </div>
      </m.section>

      {/* Inline detail section - appears below cards */}
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
              onClose={() => setSelectedProject(null)}
            />
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}
