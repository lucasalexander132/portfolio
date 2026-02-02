'use client'

import { useRef, useState } from 'react'
import { m, useInView } from 'motion/react'
import { projects } from '@/data/projects'
import type { Project } from '@/types/project'
import { fadeUpVariants, staggerContainerVariants } from '@/lib/motion'
import { ProjectCard } from './ProjectCard'
import { ProjectModal } from './ProjectModal'

// Sort projects: live first, then coming-soon
const sortedProjects = [...projects].sort((a, b) => {
  if (a.status === 'live' && b.status === 'coming-soon') return -1
  if (a.status === 'coming-soon' && b.status === 'live') return 1
  return 0
})

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.25 })

  return (
    <m.section
      ref={sectionRef}
      id="projects"
      className="py-[var(--spacing-section)]"
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={staggerContainerVariants}
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
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </m.div>
      </div>

      {/* Project modal */}
      <ProjectModal
        project={selectedProject}
        open={selectedProject !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedProject(null)
        }}
      />
    </m.section>
  )
}
