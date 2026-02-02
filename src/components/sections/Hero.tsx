'use client'

import { useState } from 'react'
import { m } from 'motion/react'
import Image from 'next/image'
import { Typewriter } from '@/components/motion/Typewriter'
import { fadeUpVariants } from '@/lib/motion'

export function Hero() {
  const [headlineComplete, setHeadlineComplete] = useState(false)

  return (
    <section
      id="hero"
      className="relative min-h-[85vh] flex items-center pt-20"
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

            {/* Value proposition + CTA - animate together after headline */}
            <m.div
              variants={fadeUpVariants}
              initial="hidden"
              animate={headlineComplete ? 'visible' : 'hidden'}
            >
              <p className="text-h3 font-sans text-text-secondary max-w-2xl mb-12">
                I get it. You hired someone who promised the world and disappeared.
                Let&apos;s skip the sales pitch and talk about what you actually need.
              </p>

              {/* Scroll hint */}
              <a
                href="#services"
                className="group inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
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

          {/* Hero photo - visible immediately */}
          <div className="relative order-first lg:order-last">
            <div className="relative w-64 h-80 lg:w-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl shadow-base-900/50">
              <Image
                src="/me.png"
                alt="Lucas Alexander"
                fill
                className="object-cover"
                priority
              />
              {/* Warm overlay for golden hour mood */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent mix-blend-overlay"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
