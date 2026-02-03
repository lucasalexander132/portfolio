'use client'

import { useState, useEffect } from 'react'
import { m } from 'motion/react'
import { Mail } from 'lucide-react'
import { springSnappy, springSubtle } from '@/lib/motion'
import { useCursor } from '@/components/cursor'
import { ContactForm } from './ContactForm'

const navLinks = [
  { href: '#services', label: 'Services', cursorText: "What I'll Do" },
  { href: '#projects', label: 'Projects', cursorText: "What I've Done" },
]

export function Navigation() {
  const { setCursorVariant, resetCursor } = useCursor()
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Close form on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFormOpen) {
        setIsFormOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isFormOpen])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace('#', '')
    const target = document.getElementById(targetId)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleContactClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsFormOpen((prev) => !prev)
  }

  return (
    <>
      <m.nav
        className="fixed left-1/2 -translate-x-1/2 z-50"
        animate={{
          bottom: isFormOpen ? 'auto' : 40,
          top: isFormOpen ? 12 : 'auto',
        }}
        transition={springSubtle}
      >
        <div className="flex items-center gap-1 bg-base-900/50 backdrop-blur-md rounded-lg px-2 py-2 shadow-lg border border-base-700/30">
          {/* Logo */}
          <m.div whileTap={{ scale: 0.95 }} transition={springSnappy}>
            <a
              href="#hero"
              onClick={(e) => handleClick(e, '#hero')}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-text-primary text-base-950 font-serif text-lg font-medium hover:bg-amber-400 transition-colors"
              onMouseEnter={() => setCursorVariant('link', undefined, true, 'up')}
              onMouseLeave={resetCursor}
            >
              C.
            </a>
          </m.div>

          {/* Nav Links */}
          <ul className="flex items-center gap-1 pl-1">
            {navLinks.map(({ href, label, cursorText }) => (
              <li key={href}>
                <m.a
                  href={href}
                  onClick={(e) => handleClick(e, href)}
                  className="block px-4 py-2 text-sm rounded-lg text-amber-500 border border-amber-500/50 bg-base-900 hover:bg-base-800 hover:border-amber-400 transition-colors"
                  onMouseEnter={() => setCursorVariant('text', cursorText, true)}
                  onMouseLeave={resetCursor}
                >
                  {label}
                </m.a>
              </li>
            ))}
          </ul>

          {/* Contact Icon */}
          <m.div whileTap={{ scale: 0.95 }} transition={springSnappy}>
            <button
              type="button"
              onClick={handleContactClick}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-500 text-base-950 hover:bg-amber-400 transition-colors"
              onMouseEnter={() => setCursorVariant('text', 'Drop a Line', true)}
              onMouseLeave={resetCursor}
              aria-label="Contact"
            >
              <Mail className="w-5 h-5" />
            </button>
          </m.div>
        </div>
      </m.nav>

      <ContactForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </>
  )
}
