'use client'

import { useState, useRef } from 'react'
import { m, useInView, AnimatePresence } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { fadeUpVariants, staggerContainerVariants } from '@/lib/motion'
import { useCursorHover } from '@/components/cursor'
import { useLocale, useTranslations } from '@/lib/i18n'
import { services, type Locale } from '@/data/services'

function ServiceRow({
  service,
  locale,
  isExpanded,
  hasExpanded,
  onHover,
  onClick,
}: {
  service: (typeof services)[number]
  locale: Locale
  isExpanded: boolean
  hasExpanded: boolean
  onHover: (id: string | null) => void
  onClick: (id: string) => void
}) {
  const content = service.content[locale]
  const cursorProps = useCursorHover('text', content.cursorText)

  return (
    <m.article
      className="group relative border-t border-base-700/50 last:border-b"
      onMouseEnter={() => {
        onHover(service.id)
        cursorProps.onMouseEnter()
      }}
      onMouseLeave={() => {
        onHover(null)
        cursorProps.onMouseLeave()
      }}
      onClick={() => onClick(service.id)}
      initial="rest"
      animate={isExpanded ? 'expanded' : hasExpanded && !isExpanded ? 'dimmed' : 'rest'}
      variants={{
        rest: { opacity: 1 },
        expanded: { opacity: 1 },
        dimmed: { opacity: 0.4 },
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Main row - always visible */}
      <div className="relative py-6 md:py-8 flex items-center justify-between gap-4 cursor-pointer">
        {/* Number */}
        <span className="text-small font-sans text-text-muted w-12 shrink-0 ml-4">
          {service.number}
        </span>

        {/* Title */}
        <m.h3
          className="flex-1 text-h1 md:text-display font-serif text-text-primary tracking-tight"
          variants={{
            rest: { x: 0 },
            expanded: { x: 16 },
            dimmed: { x: 0 },
          }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {content.title}
        </m.h3>

        {/* Arrow indicator - using CSS transitions for color */}
        <div
          className={`shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full border flex items-center justify-center transition-colors duration-300 ${
            isExpanded
              ? 'bg-amber-500 border-amber-500'
              : 'bg-transparent border-base-600'
          }`}
        >
          <m.div
            variants={{
              rest: { rotate: 0 },
              expanded: { rotate: 45 },
              dimmed: { rotate: 0 },
            }}
            transition={{ duration: 0.3 }}
          >
            <ArrowUpRight
              size={20}
              className={`transition-colors duration-300 ${isExpanded ? 'text-base-900' : 'text-text-secondary'}`}
              strokeWidth={1.5}
            />
          </m.div>
        </div>
      </div>

      {/* Expandable description */}
      <AnimatePresence>
        {isExpanded && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="pb-8 md:pb-10 pl-16 md:pl-20">
              <p className="text-sm tracking-[0.1em] font-sans text-text-secondary max-w-sm leading-snug">
                {content.description}
              </p>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Hover highlight line */}
      <m.div
        className="absolute left-0 top-0 bottom-0 w-[3px] bg-amber-500 origin-top"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </m.article>
  )
}

function FooterText() {
  const t = useTranslations()
  const cursorProps = useCursorHover('text', t('services.footer_cursor'))

  return (
    <p
      className="text-xs uppercase tracking-[0.2em] text-text-secondary max-w-md leading-relaxed cursor-default inline-block"
      {...cursorProps}
    >
      {t('services.footer')}
    </p>
  )
}

interface ServicesProps {
  hasProjectOpen?: boolean
}

export function Services({ hasProjectOpen = false }: ServicesProps) {
  const { locale } = useLocale()
  const t = useTranslations()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [lockedId, setLockedId] = useState<string | null>(null)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.2,
  })

  // Locked takes priority over hovered
  const expandedId = lockedId ?? hoveredId

  const handleClick = (id: string) => {
    // Toggle: if already locked to this id, unlock; otherwise lock to this id
    setLockedId(lockedId === id ? null : id)
  }

  const handleHover = (id: string | null) => {
    // Only update hover if nothing is locked
    if (!lockedId) {
      setHoveredId(id)
    }
  }

  return (
    <m.section
      ref={sectionRef}
      id="services"
      className="py-[var(--spacing-section)] bg-base-900 transition-[border-radius] duration-300"
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={staggerContainerVariants}
      style={{
        borderBottomLeftRadius: hasProjectOpen ? '28px' : 0,
        borderBottomRightRadius: hasProjectOpen ? '28px' : 0,
      }}
    >
      <div className="mx-auto max-w-6xl px-[var(--container-padding)]">
        {/* Section header */}
        <m.div variants={fadeUpVariants} className="mb-12 md:mb-16 flex justify-end">
          <p className="text-xs uppercase tracking-[0.2em] text-text-secondary max-w-md leading-relaxed text-right">
            {t('services.header')}
          </p>
        </m.div>

        {/* Accordion list */}
        <m.div variants={fadeUpVariants}>
          {services.map((service) => (
            <ServiceRow
              key={service.id}
              service={service}
              locale={locale}
              isExpanded={expandedId === service.id}
              hasExpanded={expandedId !== null}
              onHover={handleHover}
              onClick={handleClick}
            />
          ))}
        </m.div>

        {/* Section footer */}
        <m.div variants={fadeUpVariants} className="mt-12 md:mt-16">
          <FooterText />
        </m.div>
      </div>
    </m.section>
  )
}
