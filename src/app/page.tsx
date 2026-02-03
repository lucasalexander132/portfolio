'use client'

import { useState } from 'react'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { Services } from '@/components/sections/Services'
import { Projects } from '@/components/sections/Projects'
import type { Project } from '@/types/project'

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <div className="fixed inset-0 p-3 sm:p-4 md:p-6 bg-text-primary">
      <div className="h-full rounded-[28px] overflow-y-auto overflow-x-hidden scrollbar-hide bg-text-primary overscroll-none">
        {/* Main content card */}
        <div className="bg-base-900 rounded-[28px]">
          <Navigation />
          <main
            className="transition-colors duration-300"
            style={{ backgroundColor: selectedProject ? 'var(--color-text-primary)' : 'transparent' }}
          >
            <Hero />
            <Services hasProjectOpen={!!selectedProject} />
            <Projects
              selectedProject={selectedProject}
              onSelectProject={setSelectedProject}
            />
          </main>
        </div>

        {/* Footer area - same cream color as frame */}
        <Footer />
      </div>
    </div>
  )
}
