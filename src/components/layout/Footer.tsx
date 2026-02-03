'use client'

import { m } from 'motion/react'
import { Github, Linkedin, Twitter, Mail } from 'lucide-react'
import { useCursor } from '@/components/cursor'
import { fadeUpVariants, staggerContainerVariants } from '@/lib/motion'

const quickLinks = [
  { href: '#services', label: 'Services', cursorText: "What I'll Do" },
  { href: '#projects', label: 'Projects', cursorText: "What I've Done" },
  { href: '#contact', label: 'Contact', cursorText: 'Drop a Line' },
]

const socialLinks = [
  { href: 'https://github.com', label: 'GitHub', cursorText: 'See Code', icon: Github },
  { href: 'https://linkedin.com', label: 'LinkedIn', cursorText: 'Connect', icon: Linkedin },
  { href: 'https://twitter.com', label: 'Twitter', cursorText: 'Follow', icon: Twitter },
]

export function Footer() {
  const { setCursorVariant, resetCursor } = useCursor()

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const targetId = href.replace('#', '')
      const target = document.getElementById(targetId)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
    <footer className="pt-16 pb-32 text-base-800">
      <m.div
        className="mx-auto max-w-6xl px-6"
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand Column */}
          <m.div variants={fadeUpVariants} className="md:col-span-1">
            <p className="font-fraunces text-2xl font-medium text-text-primary">
              Civix Solutions
            </p>
            <p className="mt-3 text-base-700 text-sm font-semibold leading-relaxed max-w-xs">
              Building digital experiences that help small businesses thrive.
            </p>
            <p className="mt-6 text-sm">
              <a
                href="mailto:hello@civix.dev"
                className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors font-semibold"
                onMouseEnter={() => setCursorVariant('text', 'Say Hello', true)}
                onMouseLeave={resetCursor}
              >
                <Mail className="w-4 h-4" />
                hello@civix.dev
              </a>
            </p>
          </m.div>

          {/* Quick Links */}
          <m.div variants={fadeUpVariants} className="md:col-span-1">
            <h3 className="font-fraunces text-sm font-medium text-text-primary uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.map(({ href, label, cursorText }) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={(e) => handleNavClick(e, href)}
                    className="text-base-700 hover:text-amber-500 transition-colors text-sm font-semibold"
                    onMouseEnter={() => setCursorVariant('text', cursorText, true)}
                    onMouseLeave={resetCursor}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </m.div>

          {/* Social Links */}
          <m.div variants={fadeUpVariants} className="md:col-span-1">
            <h3 className="font-fraunces text-sm font-medium text-text-primary uppercase tracking-wider">
              Connect
            </h3>
            <ul className="mt-4 space-y-3">
              {socialLinks.map(({ href, label, cursorText, icon: Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-base-700 hover:text-amber-500 transition-colors text-sm font-semibold"
                    onMouseEnter={() => setCursorVariant('text', cursorText, true)}
                    onMouseLeave={resetCursor}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </m.div>
        </div>

        {/* Bottom Bar */}
        <m.div
          variants={fadeUpVariants}
          className="mt-16 pt-8 border-t border-base-800/50 flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <p className="text-base-600 text-xs">
            &copy; {new Date().getFullYear()} Civix Solutions. All rights reserved.
          </p>
          <p className="text-base-700 text-xs">
            Available for new projects
          </p>
        </m.div>
      </m.div>
    </footer>
  )
}
