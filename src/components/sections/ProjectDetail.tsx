'use client'

import { useState } from 'react'
import { m, AnimatePresence } from 'motion/react'
import { X, Github, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import type { Project } from '@/types/project'
import { isLiveProject } from '@/types/project'
import { useLocale, useTranslations } from '@/lib/i18n'

// Hover bubbles config per project - positioned to overlay the image corners
// Text is locale-keyed for i18n support
const projectBubbles: Record<string, { text: { en: string; fr: string }; position: string; rotate: string; bg: string }[]> = {
  'codex-grove': [
    { text: { en: '220K+ lines of TypeScript', fr: '220K+ lignes de TypeScript' }, position: '-top-3 left-4', rotate: '-5deg', bg: 'bg-amber-300' },
    { text: { en: 'AI that actually gets it', fr: 'Une IA qui comprend vraiment' }, position: 'top-1/4 -right-2', rotate: '4deg', bg: 'bg-lime-300' },
    { text: { en: 'Kanban meets knowledge', fr: 'Kanban rencontre la connaissance' }, position: 'bottom-8 left-4', rotate: '-3deg', bg: 'bg-cyan-300' },
  ],
  'distill': [
    { text: { en: 'Word -> Card in 30 sec', fr: 'Mot -> Carte en 30 sec' }, position: '-top-3 left-4', rotate: '-4deg', bg: 'bg-violet-300' },
    { text: { en: 'Cross-platform sync', fr: 'Synchronisation multiplateforme' }, position: 'top-1/3 -right-2', rotate: '5deg', bg: 'bg-amber-300' },
    { text: { en: 'OCR text capture magic', fr: 'Magie de capture OCR' }, position: 'bottom-8 left-4', rotate: '-6deg', bg: 'bg-rose-300' },
  ],
  'rippl': [
    { text: { en: 'Trauma-informed design', fr: 'Conception informee par le trauma' }, position: '-top-3 left-4', rotate: '-3deg', bg: 'bg-sky-300' },
    { text: { en: 'Based on clinical research', fr: 'Base sur la recherche clinique' }, position: 'top-1/3 -right-2', rotate: '4deg', bg: 'bg-emerald-300' },
    { text: { en: 'Your safe space', fr: 'Votre espace sur' }, position: 'bottom-8 left-4', rotate: '-5deg', bg: 'bg-amber-300' },
  ],
  'civix-solutions': [
    { text: { en: 'Schema-first extraction', fr: 'Extraction axee sur les schemas' }, position: '-top-3 left-4', rotate: '-4deg', bg: 'bg-orange-300' },
    { text: { en: 'Bilingual from day one', fr: 'Bilingue des le premier jour' }, position: 'top-1/4 -right-2', rotate: '5deg', bg: 'bg-cyan-300' },
    { text: { en: 'Confidence-scored results', fr: 'Resultats avec scores de confiance' }, position: 'bottom-8 left-4', rotate: '-3deg', bg: 'bg-lime-300' },
  ],
}

interface ProjectDetailProps {
  project: Project
  onClose: () => void
}

export function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const { locale } = useLocale()
  const t = useTranslations()
  const content = project.content[locale]
  const [isImageHovered, setIsImageHovered] = useState(false)
  const bubbles = projectBubbles[project.id] || []

  return (
    <div key={project.id} className="bg-text-primary">
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
            {content.tagline}
          </m.p>

          {/* Challenge */}
          <m.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mb-16"
          >
            <span className="text-xs uppercase tracking-[0.2em] text-amber-700 font-medium">
              {t('projects.labels.challenge')}
            </span>
            <p className="mt-4 text-body text-base-700 leading-[1.8]">
              {content.challenge}
            </p>
          </m.section>
        </div>

        {/* Image interruption */}
        {project.images[0] && (
          <m.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="max-w-5xl mx-auto px-6 my-8 flex justify-center"
            >
              <div
                className="relative cursor-pointer"
                onMouseEnter={() => setIsImageHovered(true)}
                onMouseLeave={() => setIsImageHovered(false)}
              >
              <m.div
                className="relative overflow-hidden max-h-[70vh]"
                animate={{
                  borderRadius: isImageHovered ? 0 : 12,
                  boxShadow: isImageHovered
                    ? '12px 12px 0px 0px #f59e0b'
                    : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  border: isImageHovered ? '4px solid #0a0a0a' : '4px solid transparent',
                }}
              >
                <Image
                  src={project.images[0]}
                  alt={`${project.title} screenshot`}
                  width={1200}
                  height={800}
                  className="object-contain max-h-[70vh] w-auto h-auto"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
              </m.div>

              {/* Hover bubbles */}
              <AnimatePresence>
                {isImageHovered &&
                  bubbles.map((bubble, index) => (
                    <m.div
                      key={bubble.text[locale]}
                      className={`absolute ${bubble.position} z-20 pointer-events-none`}
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        transition: {
                          duration: 0.3,
                          delay: index * 0.12,
                          ease: [0.0, 0.0, 0.2, 1],
                        },
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.8,
                        y: 10,
                        transition: {
                          duration: 0.2,
                          delay: (bubbles.length - 1 - index) * 0.06,
                          ease: [0.4, 0.0, 1, 1],
                        },
                      }}
                    >
                      <span
                        className={`inline-block px-4 py-2 text-sm whitespace-nowrap ${bubble.bg} text-base-900 border-[3px] border-base-900 font-bold`}
                        style={{
                          fontFamily: 'var(--font-sketch)',
                          boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.9)',
                          transform: `rotate(${bubble.rotate})`,
                        }}
                      >
                        {bubble.text[locale]}
                      </span>
                    </m.div>
                  ))}
              </AnimatePresence>
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
              {t('projects.labels.approach')}
            </span>
            <p className="mt-4 text-body text-base-700 leading-[1.8]">
              {content.approach}
            </p>
          </m.section>
        </div>

        {/* Second image interruption */}
        {project.images[1] && (
          <m.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="max-w-5xl mx-auto px-6 my-8 flex justify-center"
          >
            <div className="relative rounded-xl overflow-hidden max-h-[70vh]">
              <Image
                src={project.images[1]}
                alt={`${project.title} detail`}
                width={1200}
                height={800}
                className="object-contain max-h-[70vh] w-auto h-auto"
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
              {t('projects.labels.result')}
            </span>
            <p className="mt-4 text-body text-base-700 leading-[1.8]">
              {content.result}
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
              {t('projects.labels.built_with')}
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
                <span>{t('projects.labels.visit_project')}</span>
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
                <span>{t('projects.labels.view_source')}</span>
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
            className="max-w-5xl mx-auto px-6 mb-8 flex justify-center"
          >
            <div className="relative rounded-xl overflow-hidden max-h-[70vh]">
              <Image
                src={project.images[2]}
                alt={`${project.title} overview`}
                width={1200}
                height={800}
                className="object-contain max-h-[70vh] w-auto h-auto"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </m.div>
        )}
      </m.div>
    </div>
  )
}
