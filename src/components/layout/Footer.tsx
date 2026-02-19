'use client'

import { m } from 'motion/react'
import { Github, Linkedin } from 'lucide-react'

// Bluesky icon (not available in lucide-react)
function Bluesky({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 11c-2-4-5-7-8-8-1 0-2 1-2 3 0 1 .5 5 1 6 .5 2 2.5 3 5 3-4 .5-6 2-3 6 3 4 5-1 7-5 2 4 4 9 7 5 3-4 1-5.5-3-6 2.5 0 4.5-1 5-3 .5-1 1-5 1-6 0-2-1-3-2-3-3 1-6 4-8 8Z" />
    </svg>
  )
}
import { useCursor } from '@/components/cursor'
import { useTranslations } from '@/lib/i18n'
import { fadeUpVariants, staggerContainerVariants } from '@/lib/motion'

const quickLinks = [
  { href: '#services', labelKey: 'nav.services' as const, cursorKey: 'footer.cursor.services' as const },
  { href: '#projects', labelKey: 'nav.projects' as const, cursorKey: 'footer.cursor.projects' as const },
]

const socialLinks = [
  { href: 'https://github.com/lucasalexander132', label: 'GitHub', cursorKey: 'footer.cursor.github' as const, icon: Github },
  { href: 'https://www.linkedin.com/in/lalexander132/', label: 'LinkedIn', cursorKey: 'footer.cursor.linkedin' as const, icon: Linkedin },
  { href: 'https://bsky.app/profile/eyeseesun.bsky.social', label: 'Bluesky', cursorKey: 'footer.cursor.bluesky' as const, icon: Bluesky },
]

export function Footer() {
  const t = useTranslations()
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
              {t('footer.copyright')}
            </p>
            <p className="mt-3 text-base-700 text-sm font-semibold leading-relaxed max-w-xs">
              {t('footer.brand_description')}
            </p>
          </m.div>

          {/* Quick Links */}
          <m.div variants={fadeUpVariants} className="md:col-span-1">
            <h3 className="font-fraunces text-sm font-medium text-text-primary uppercase tracking-wider">
              {t('footer.nav_title')}
            </h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.map(({ href, labelKey, cursorKey }) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={(e) => handleNavClick(e, href)}
                    className="text-base-700 hover:text-amber-500 transition-colors text-sm font-semibold"
                    onMouseEnter={() => setCursorVariant('text', t(cursorKey), true)}
                    onMouseLeave={resetCursor}
                  >
                    {t(labelKey)}
                  </a>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('openContactForm'))}
                  className="text-base-700 hover:text-amber-500 transition-colors text-sm font-semibold"
                  onMouseEnter={() => setCursorVariant('text', t('footer.cursor.contact'), true)}
                  onMouseLeave={resetCursor}
                >
                  {t('nav.contact')}
                </button>
              </li>
            </ul>
          </m.div>

          {/* Social Links */}
          <m.div variants={fadeUpVariants} className="md:col-span-1">
            <h3 className="font-fraunces text-sm font-medium text-text-primary uppercase tracking-wider">
              {t('footer.connect_title')}
            </h3>
            <ul className="mt-4 space-y-3">
              {socialLinks.map(({ href, label, cursorKey, icon: Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-base-700 hover:text-amber-500 transition-colors text-sm font-semibold"
                    onMouseEnter={() => setCursorVariant('text', t(cursorKey), true)}
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
            &copy; 2026 {t('footer.copyright')}. {t('footer.all_rights')}
          </p>
          <p className="text-base-700 text-xs">
            {t('footer.availability')}
          </p>
        </m.div>
      </m.div>
    </footer>
  )
}
