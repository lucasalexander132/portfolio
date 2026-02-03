import type { Metadata } from 'next'
import { Fraunces, Open_Sans, Architects_Daughter } from 'next/font/google'
import { MotionProvider } from '@/components/motion/MotionProvider'
import { CursorProvider, CustomCursor } from '@/components/cursor'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz'],
})

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
})

const architectsDaughter = Architects_Daughter({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-sketch',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Civix Solutions | Frontend Development for Small Business',
  description: 'Boutique frontend consultancy building solutions for small businesses.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${openSans.variable} ${architectsDaughter.variable}`}
    >
      <body className="bg-base-950 text-text-primary">
        <MotionProvider>
          <CursorProvider>
            <CustomCursor />
            {children}
          </CursorProvider>
        </MotionProvider>
      </body>
    </html>
  )
}
