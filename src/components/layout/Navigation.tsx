'use client'

import Link from 'next/link'
import { m } from 'motion/react'
import { springSnappy } from '@/lib/motion'

const navLinks = [
  { href: '#services', label: 'Services', primary: false },
  { href: '#projects', label: 'Projects', primary: false },
  { href: '#contact', label: 'Contact', primary: true },
]

export function Navigation() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace('#', '')
    const target = document.getElementById(targetId)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 bg-base-900/90 backdrop-blur-md rounded-lg px-2 py-2 shadow-lg border border-base-700/30">
        {/* Logo */}
        <m.div whileTap={{ scale: 0.95 }} transition={springSnappy}>
          <Link
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-text-primary text-base-950 font-serif text-lg font-medium hover:bg-amber-400 transition-colors"
          >
            C.
          </Link>
        </m.div>

        {/* Nav Links */}
        <ul className="flex items-center gap-1 pl-1">
          {navLinks.map(({ href, label, primary }) => (
            <li key={href}>
              {primary ? (
                <m.a
                  href={href}
                  onClick={(e) => handleClick(e, href)}
                  whileTap={{ scale: 0.97 }}
                  transition={springSnappy}
                  className="block px-4 py-2 text-sm rounded-lg bg-amber-500 text-base-950 font-medium hover:bg-amber-400 transition-colors"
                >
                  {label}
                </m.a>
              ) : (
                <m.a
                  href={href}
                  onClick={(e) => handleClick(e, href)}
                  className="relative block px-4 py-2 text-sm rounded-lg text-amber-500 border border-amber-500/50 hover:bg-amber-500/10 hover:border-amber-400 transition-colors"
                  initial="rest"
                  whileHover="hover"
                >
                  <span className="relative z-10">{label}</span>
                  <m.span
                    className="absolute bottom-2 left-4 right-4 h-0.5 bg-amber-500 origin-left"
                    variants={{
                      rest: { scaleX: 0 },
                      hover: { scaleX: 1 },
                    }}
                    transition={springSnappy}
                  />
                </m.a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
