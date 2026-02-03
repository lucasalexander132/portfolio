'use client'

import { useState, useRef } from 'react'
import { m, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import { Typewriter } from '@/components/motion/Typewriter'
import { fadeUpVariants } from '@/lib/motion'
import { useCursorHover } from '@/components/cursor'

const hoverBubbles = [
  { text: '8 years in dev work', position: 'top-4 -left-4 lg:-left-24', rotate: '-6deg', bg: 'bg-amber-300' },
  { text: 'Passionate and Empathetic', position: 'top-1/3 -right-4 lg:-right-8', rotate: '5deg', bg: 'bg-lime-300' },
  { text: 'Kind of hungry', position: 'bottom-20 -left-4 lg:-left-20', rotate: '-4deg', bg: 'bg-cyan-300' },
]

export function Hero() {
  const [headlineComplete, setHeadlineComplete] = useState(false)
  const [subtitleComplete, setSubtitleComplete] = useState(false)
  const [isImageHovered, setIsImageHovered] = useState(false)
  const imageCursorProps = useCursorHover('text', "👋 That's me!")
  const helpLinkCursorProps = useCursorHover('text', 'Cause I probably can')

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
                text="Been burned by developers before?"
                speed={70}
                onComplete={() => setHeadlineComplete(true)}
              />
            </h1>

            {/* Value proposition with typewriter */}
            {headlineComplete && (
              <p className="text-xs uppercase tracking-[0.2em] font-sans text-text-secondary max-w-md leading-relaxed mb-12">
                <Typewriter
                  text="I get it. You hired someone who promised the world and disappeared. Let's skip the sales pitch and talk about what you actually need."
                  speed={12}
                  onComplete={() => setSubtitleComplete(true)}
                />
              </p>
            )}

            {/* Scroll hint - animates after subtitle */}
            <m.div
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
                <span>See how I can help</span>
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
            className="relative order-first lg:order-last lg:translate-x-16 xl:translate-x-24 lg:-translate-y-12 cursor-pointer"
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
              className="relative w-72 h-[22rem] lg:w-96 lg:h-[30rem] xl:w-[26rem] xl:h-[34rem] rounded-lg overflow-hidden shadow-2xl shadow-base-900/50"
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }}
            >
              <Image
                src="/images/me.png"
                alt="Lucas Alexander"
                fill
                className="object-cover"
                priority
              />

              {/* Dynamic lighting overlay that follows mouse */}
              <m.div
                className="absolute inset-0 rounded-lg pointer-events-none mix-blend-soft-light"
                style={{
                  background: `radial-gradient(circle at ${gradientX} ${gradientY}, rgba(251, 191, 36, 0.3) 0%, transparent 60%)`,
                }}
                aria-hidden="true"
              />

              {/* Edge highlight for depth */}
              <div
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                  boxShadow: 'inset 0 0 60px rgba(0, 0, 0, 0.3)',
                }}
                aria-hidden="true"
              />
            </m.div>

            {/* Reflection/glow beneath image */}
            <m.div
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 rounded-full blur-2xl opacity-40"
              style={{
                background: 'radial-gradient(ellipse, oklch(0.75 0.12 72 / 0.5) 0%, transparent 70%)',
                rotateX,
                rotateY,
              }}
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
