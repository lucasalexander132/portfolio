import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'

export default function UpdatesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-base-900">
      <Navigation />
      <div className="pt-16 pb-32">
        {children}
      </div>
      <Footer />
    </div>
  )
}
