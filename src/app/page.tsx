import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { Services } from '@/components/sections/Services'
import { Projects } from '@/components/sections/Projects'

export default function Home() {
  return (
    <div className="fixed inset-0 p-3 sm:p-4 md:p-6 bg-text-primary">
      <div className="h-full rounded-[28px] overflow-y-auto overflow-x-hidden scrollbar-hide bg-text-primary">
        {/* Main content card */}
        <div className="bg-base-900 rounded-[28px]">
          <Navigation />
          <main>
            <Hero />
            <Services />
            <Projects />
          </main>
        </div>

        {/* Footer area - same cream color as frame */}
        <Footer />
      </div>
    </div>
  )
}
