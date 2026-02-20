import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'

export default function UpdatesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="updates-root fixed inset-0 p-3 sm:p-4 md:p-6 bg-text-primary">
      {/* Top brand mark - centered in frame */}
      <div className="absolute top-0 left-0 right-0 h-3 sm:h-4 md:h-6 flex items-center justify-center z-50">
        <span className="text-[8px] tracking-[0.1em] text-base-900 font-sans font-semibold">
          C I V I X &nbsp; S O L U T I O N S
        </span>
      </div>

      <div className="h-full rounded-[28px] overflow-y-auto overflow-x-hidden scrollbar-hide bg-text-primary overscroll-none">
        <div className="bg-base-900 rounded-[28px]">
          <Navigation />
          {children}
        </div>
        <Footer />
      </div>
    </div>
  )
}
