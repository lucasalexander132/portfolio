import { Navigation } from '@/components/layout/Navigation'
import { Hero } from '@/components/sections/Hero'
import { Services } from '@/components/sections/Services'

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Services />
      </main>
    </>
  )
}
