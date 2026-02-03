'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { m, useInView, AnimatePresence } from 'motion/react'
import { projects } from '@/data/projects'
import type { Project } from '@/types/project'
import { fadeUpVariants, staggerContainerVariants } from '@/lib/motion'
import { ProjectDetail } from './ProjectDetail'
import { useCursorHover } from '@/components/cursor'
import { useLocale, useTranslations } from '@/lib/i18n'

// Hover bubbles config per project - positioned OUTSIDE the card
// Text is locale-keyed for i18n support
const projectBubbles: Record<string, { text: { en: string; fr: string }; position: string; rotate: string; bg: string }[]> = {
  'codex-grove': [
    { text: { en: 'Simple Scheduling', fr: 'Planification simple' }, position: 'top-2 -left-4 lg:-left-16', rotate: '-5deg', bg: 'bg-amber-300' },
    { text: { en: 'Chat with your docs', fr: 'Discutez avec vos docs' }, position: 'top-1/4 -right-4 lg:-right-8', rotate: '4deg', bg: 'bg-lime-300' },
    { text: { en: 'Employee task management', fr: 'Gestion des taches employes' }, position: 'bottom-24 -left-4 lg:-left-12', rotate: '-3deg', bg: 'bg-cyan-300' },
  ],
  'distill': [
    { text: { en: 'Word -> Card in 30 sec', fr: 'Mot -> Carte en 30 sec' }, position: 'top-2 -left-4 lg:-left-12', rotate: '-4deg', bg: 'bg-violet-300' },
    { text: { en: 'Cross-platform sync', fr: 'Synchronisation multiplateforme' }, position: 'top-1/4 -right-4 lg:-right-6', rotate: '5deg', bg: 'bg-amber-300' },
    { text: { en: 'OCR text capture magic', fr: 'Magie de capture OCR' }, position: 'bottom-24 -left-4 lg:-left-10', rotate: '-6deg', bg: 'bg-rose-300' },
  ],
  'rippl': [
    { text: { en: 'Trauma-informed design', fr: 'Conception informee par le trauma' }, position: 'top-2 -left-4 lg:-left-12', rotate: '-3deg', bg: 'bg-sky-300' },
    { text: { en: 'Based on clinical research', fr: 'Base sur la recherche clinique' }, position: 'top-1/4 -right-4 lg:-right-6', rotate: '4deg', bg: 'bg-emerald-300' },
    { text: { en: 'Know thyself', fr: 'Connais-toi toi-meme' }, position: 'bottom-24 -left-4 lg:-left-10', rotate: '-5deg', bg: 'bg-amber-300' },
  ],
  'civix-solutions': [
    { text: { en: 'Minimal, yet powerful', fr: 'Minimal, mais puissant' }, position: 'top-2 -left-4 lg:-left-12', rotate: '-4deg', bg: 'bg-orange-300' },
    { text: { en: 'Bilingual from day one', fr: 'Bilingue des le premier jour' }, position: 'top-1/4 -right-4 lg:-right-6', rotate: '5deg', bg: 'bg-cyan-300' },
    { text: { en: 'PDF to Excel', fr: 'PDF vers Excel' }, position: 'bottom-24 -left-4 lg:-left-10', rotate: '-3deg', bg: 'bg-lime-300' },
  ],
}

// Use projects in their defined order (Codex Grove first)
const sortedProjects = projects

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
  locale: 'en' | 'fr'
  comingSoonLabel: string
}

function BentoCard({ project, index, size, onClick, isSelected, locale, comingSoonLabel }: BentoCardProps) {
  const content = project.content[locale]
  const cursorProps = useCursorHover('text', content.cursorText || 'View project')
  const config = bentoConfig[size]
  const [isHovered, setIsHovered] = useState(false)
  const bubbles = projectBubbles[project.id] || []

  return (
    <m.article
      {...(content.cursorText ? cursorProps : {})}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variants={fadeUpVariants}
      whileHover={{
        y: -6,
        x: -3,
        rotate: -2,
        borderRadius: 0,
        boxShadow: '6px 6px 0px 0px #f59e0b',
      }}
      whileTap={{ scale: 0.98, boxShadow: '2px 2px 0px 0px #f59e0b' }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`card-grain group relative cursor-pointer overflow-visible rounded-sm bg-base-800 border-2 border-transparent hover:border-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-base-950 ${config.colSpan} ${config.rowSpan} ${isSelected ? 'ring-2 ring-amber-400' : ''} ${isHovered ? 'z-50' : 'z-0'}`}
    >
      {/* Image container */}
      <div className={`relative w-full h-full overflow-hidden ${config.aspect}`}>
        <Image
          src={project.thumbnail}
          alt={`${project.title} preview`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={size === 'hero' || size === 'wide' ? '(max-width: 640px) 100vw, 66vw' : '(max-width: 640px) 100vw, 33vw'}
        />

        {/* Number badge - top left */}
        <span className="absolute left-4 top-4 font-mono text-xs text-white/50 tracking-wider drop-shadow-md">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Coming Soon badge */}
        {project.status === 'coming-soon' && (
          <span className="absolute right-4 top-4 rounded-full bg-base-900/80 backdrop-blur-sm px-3 py-1 text-xs font-medium text-amber-400">
            {comingSoonLabel}
          </span>
        )}

        {/* Floating content card */}
        <div className="absolute bottom-2 left-2 right-2 sm:bottom-2.5 sm:left-2.5 sm:right-2.5">
          <div className="rounded-lg group-hover:rounded-none bg-base-900/85 group-hover:bg-base-950 backdrop-blur-md p-4 sm:p-5 border border-white/5 group-hover:border-2 group-hover:border-amber-500 transition-all duration-200 group-hover:shadow-[3px_3px_0px_0px_#f59e0b]">
            <h3 className={`font-serif text-text-primary mb-1 ${size === 'hero' ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'}`}>
              {project.title}
            </h3>
            <p className={`text-text-secondary/80 line-clamp-2 ${size === 'hero' ? 'text-sm sm:text-base max-w-md' : 'text-sm'}`}>
              {content.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Hover bubbles */}
      <AnimatePresence>
        {isHovered &&
          bubbles.map((bubble, idx) => (
            <m.div
              key={bubble.text[locale]}
              className={`absolute ${bubble.position} z-[100] pointer-events-none`}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: {
                  duration: 0.25,
                  delay: idx * 0.1,
                  ease: [0.0, 0.0, 0.2, 1],
                },
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
                y: 10,
                transition: {
                  duration: 0.15,
                  delay: (bubbles.length - 1 - idx) * 0.05,
                  ease: [0.4, 0.0, 1, 1],
                },
              }}
            >
              <span
                className={`inline-block px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap ${bubble.bg} text-base-900 border-[3px] border-base-900 font-bold`}
                style={{
                  fontFamily: 'var(--font-sketch)',
                  boxShadow: '3px 3px 0px 0px rgba(0,0,0,0.9)',
                  transform: `rotate(${bubble.rotate})`,
                }}
              >
                {bubble.text[locale]}
              </span>
            </m.div>
          ))}
      </AnimatePresence>
    </m.article>
  )
}

interface ProjectsProps {
  selectedProject: Project | null
  onSelectProject: (project: Project | null) => void
}

export function Projects({ selectedProject, onSelectProject }: ProjectsProps) {
  const { locale } = useLocale()
  const t = useTranslations()
  const sectionRef = useRef(null)
  const detailRef = useRef<HTMLDivElement>(null)
  const prevProjectRef = useRef<string | null>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 })

  // Scroll to detail section when project is selected or switched
  useEffect(() => {
    if (selectedProject && detailRef.current) {
      const wasSwitching = prevProjectRef.current !== null && prevProjectRef.current !== selectedProject.id

      // Update ref for next render
      prevProjectRef.current = selectedProject.id

      // When switching, scroll immediately to top of detail
      // When opening, wait for animation
      const timeout = setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, wasSwitching ? 0 : 100)
      return () => clearTimeout(timeout)
    } else {
      // Reset when closing
      prevProjectRef.current = null
    }
  }, [selectedProject?.id])

  return (
    <>
      {/* Inline detail section */}
      <AnimatePresence mode="wait">
        {selectedProject && (
          <m.div
            ref={detailRef}
            key="project-detail"
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
              {t('projects.header')}
            </p>
          </m.div>

          {/* Bento grid */}
          <m.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 auto-rows-min overflow-visible"
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
                locale={locale}
                comingSoonLabel={t('projects.coming_soon')}
              />
            ))}
          </m.div>

          {/* Section footer */}
          <m.div variants={fadeUpVariants} className="mt-12 md:mt-16">
            <p className="text-xs uppercase tracking-[0.2em] text-text-secondary max-w-md leading-relaxed">
              {t('projects.footer')}
            </p>
          </m.div>
        </div>
      </m.section>
    </>
  )
}
