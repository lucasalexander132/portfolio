'use client'

import { useState, useRef, useEffect } from 'react'
import { m, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import { Typewriter } from '@/components/motion/Typewriter'
import { fadeUpVariants } from '@/lib/motion'
import { useCursorHover } from '@/components/cursor'
import { useTranslations, useLocale } from '@/lib/i18n'

export function Hero() {
  const t = useTranslations()
  const { locale } = useLocale()
  const [headlineComplete, setHeadlineComplete] = useState(false)
  const [subtitleComplete, setSubtitleComplete] = useState(false)

  // Reset animation states when locale changes
  useEffect(() => {
    setHeadlineComplete(false)
    setSubtitleComplete(false)
  }, [locale])
  const [isImageHovered, setIsImageHovered] = useState(false)
  const imageCursorProps = useCursorHover('text', t('hero.cursor.photo'))
  const helpLinkCursorProps = useCursorHover('text', t('hero.cursor.help_link'))

  // Hover bubbles - defined inside component to access translations
  const hoverBubbles = [
    { text: t('hero.bubbles.experience'), position: 'top-4 -left-4 lg:-left-24', rotate: '-6deg', bg: 'bg-amber-300' },
    { text: t('hero.bubbles.personality'), position: 'top-1/3 right-0 sm:-right-4 lg:-right-8', rotate: '5deg', bg: 'bg-lime-300' },
    { text: t('hero.bubbles.hungry'), position: 'bottom-20 -left-4 lg:-left-20', rotate: '-4deg', bg: 'bg-cyan-300' },
  ]

  // 3D tilt effect - track mouse position relative to image
  const imageRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  // Smooth spring physics for premium feel
  const springConfig = { stiffness: 150, damping: 20 }
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [8, -8]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), springConfig)

  // Subtle lighting shift based on tilt
  const gradientX = useTransform(mouseX, [0, 1], ['30%', '70%'])
  const gradientY = useTransform(mouseY, [0, 1], ['30%', '70%'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return
    const rect = imageRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if we're actually leaving the container, not just moving to a child
    const relatedTarget = e.relatedTarget
    if (relatedTarget instanceof Element && imageRef.current?.contains(relatedTarget)) return

    mouseX.set(0.5)
    mouseY.set(0.5)
    setIsImageHovered(false)
    imageCursorProps.onMouseLeave()
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if we're entering from outside, not from a child
    const relatedTarget = e.relatedTarget
    if (relatedTarget instanceof Element && imageRef.current?.contains(relatedTarget)) return

    setIsImageHovered(true)
    imageCursorProps.onMouseEnter()
  }

  return (
    <section
      id="hero"
      className="relative min-h-[85vh] flex items-center pt-20 bg-base-900"
    >
      {/* Atmospheric background layers */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-base-900 via-base-950 to-base-950"
        aria-hidden="true"
      />

      {/* Golden hour warm glow */}
      <div
        className="absolute top-1/4 -left-1/4 w-3/4 h-1/2 rounded-full blur-[120px] opacity-30"
        style={{
          background: 'radial-gradient(circle, oklch(0.75 0.12 72 / 0.4) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-[var(--container-padding)] w-full">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
          {/* Text content */}
          <div className="max-w-3xl lg:max-w-xl xl:max-w-2xl">
            {/* Empathy-first headline with typewriter */}
            <h1 className="text-display font-serif text-text-primary mb-6">
              <Typewriter
                text={t('hero.title')}
                speed={70}
                onComplete={() => setHeadlineComplete(true)}
              />
            </h1>

            {/* Value proposition with typewriter */}
            {headlineComplete && (
              <p className="text-xs uppercase tracking-[0.2em] font-sans text-text-secondary max-w-md leading-relaxed mb-12">
                <Typewriter
                  text={t('hero.subtitle')}
                  speed={12}
                  onComplete={() => setSubtitleComplete(true)}
                />
              </p>
            )}

            {/* Scroll hint - animates after subtitle */}
            <m.div
              className="mb-8 lg:mb-0"
              variants={fadeUpVariants}
              initial="hidden"
              animate={subtitleComplete ? 'visible' : 'hidden'}
            >
              <a
                href="#services"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('services')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className="group inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
                {...helpLinkCursorProps}
              >
                <span>{t('hero.cta')}</span>
                <span
                  className="group-hover:translate-y-0.5 transition-transform"
                  aria-hidden="true"
                >
                  ↓
                </span>
              </a>
            </m.div>
          </div>

          {/* Hero photo - fades in with subtitle */}
          <m.div
            ref={imageRef}
            className="relative order-first lg:order-last w-full lg:w-auto flex justify-center lg:justify-end lg:-translate-y-8 cursor-pointer"
            style={{ perspective: 1000 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            initial="hidden"
            animate={headlineComplete ? 'idle' : 'hidden'}
            variants={{
              hidden: { opacity: 0, y: 60, scale: 0.9 },
              idle: { opacity: 1, y: 0, scale: 1 },
            }}
            transition={{
              duration: 0.8,
              ease: [0.0, 0.0, 0.2, 1],
              scale: { type: 'spring', stiffness: 200, damping: 20 },
            }}
          >
            {/* 3D tilting image container */}
            <m.div
              className="relative w-72 h-[22rem] lg:w-80 lg:h-[26rem] xl:w-96 xl:h-[30rem] overflow-hidden"
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }}
              initial={false}
              animate={{
                borderRadius: isImageHovered ? 0 : 8,
                outline: isImageHovered ? '6px solid oklch(0.85 0.18 85)' : 'none',
                outlineOffset: isImageHovered ? 0 : 0,
                boxShadow: isImageHovered
                  ? '20px 12px 0px 0px oklch(0.85 0.18 85)'
                  : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                rotate: isImageHovered ? -2 : 0,
              }}
              transition={{
                duration: 0.25,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <Image
                src="/images/me.png"
                alt="Lucas Alexander"
                fill
                className="object-cover"
                priority
              />

              {/* Dynamic lighting overlay - fades out on hover for flat neo-brutal look */}
              <m.div
                className="absolute inset-0 pointer-events-none mix-blend-soft-light"
                style={{
                  background: `radial-gradient(circle at ${gradientX} ${gradientY}, rgba(251, 191, 36, 0.3) 0%, transparent 60%)`,
                }}
                animate={{ opacity: isImageHovered ? 0 : 1 }}
                transition={{ duration: 0.25 }}
                aria-hidden="true"
              />

              {/* Edge highlight - fades out on hover */}
              <m.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: 'inset 0 0 60px rgba(0, 0, 0, 0.3)',
                }}
                animate={{ opacity: isImageHovered ? 0 : 1 }}
                transition={{ duration: 0.25 }}
                aria-hidden="true"
              />

            </m.div>

            {/* Reflection/glow beneath image - fades out for neo-brutal */}
            <m.div
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 rounded-full blur-2xl"
              style={{
                background: 'radial-gradient(ellipse, oklch(0.75 0.12 72 / 0.5) 0%, transparent 70%)',
                rotateX,
                rotateY,
              }}
              animate={{ opacity: isImageHovered ? 0 : 0.4 }}
              transition={{ duration: 0.25 }}
              aria-hidden="true"
            />

            {/* Hover bubbles */}
            <AnimatePresence>
              {isImageHovered &&
                hoverBubbles.map((bubble, index) => (
                  <m.div
                    key={bubble.text}
                    className={`absolute ${bubble.position} z-20 pointer-events-none`}
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      transition: {
                        duration: 0.3,
                        delay: index * 0.15,
                        ease: [0.0, 0.0, 0.2, 1],
                      }
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.8,
                      y: 10,
                      transition: {
                        duration: 0.25,
                        delay: (hoverBubbles.length - 1 - index) * 0.08,
                        ease: [0.4, 0.0, 1, 1],
                      }
                    }}
                    style={{
                      rotateX,
                      rotateY,
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <span
                      className={`inline-block px-4 py-2 text-sm whitespace-nowrap ${bubble.bg} text-base-900 border-[3px] border-base-900 font-bold`}
                      style={{
                        fontFamily: 'var(--font-sketch)',
                        boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.9)',
                        transform: `rotate(${bubble.rotate})`,
                        WebkitTextStroke: '0.3px currentColor',
                      }}
                    >
                      {bubble.text}
                    </span>
                  </m.div>
                ))}
            </AnimatePresence>
          </m.div>
        </div>
      </div>
    </section>
  )
}
