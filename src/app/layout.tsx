import type { Metadata } from 'next'
import { Fraunces, Open_Sans } from 'next/font/google'
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
      className={`${fraunces.variable} ${openSans.variable}`}
    >
      <body className="grain-overlay bg-base-950 text-text-primary">
        {children}
      </body>
    </html>
  )
}
