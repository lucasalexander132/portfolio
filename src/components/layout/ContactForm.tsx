'use client'

import { useState } from 'react'
import { m, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'
import { springSubtle } from '@/lib/motion'
import { useCursor } from '@/components/cursor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface ContactFormProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactForm({ isOpen, onClose }: ContactFormProps) {
  const { setCursorVariant, resetCursor } = useCursor()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setFormData({ name: '', email: '', message: '' })
    onClose()
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-base-950/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Card */}
          <m.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={springSubtle}
            className="fixed z-40 inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[min(33vw,420px)] sm:min-w-[360px] bg-text-primary rounded-xl shadow-lg"
          >
            <div className="p-6 sm:p-8">
              {/* Close button */}
              <m.button
                type="button"
                onClick={onClose}
                className="absolute top-3 right-3 p-2 rounded-lg text-base-600 hover:text-base-950 hover:bg-base-950/10 transition-colors"
                whileTap={{ scale: 0.95 }}
                transition={springSubtle}
                onMouseEnter={() => setCursorVariant('link', undefined, true)}
                onMouseLeave={resetCursor}
                aria-label="Close contact form"
              >
                <X className="w-5 h-5" />
              </m.button>

              <h2 className="font-serif text-2xl text-base-950 mb-6">
                Get in Touch
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base-700">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-base-950/5 border-base-950/20 text-base-950 placeholder:text-base-600 focus-visible:border-amber-500 focus-visible:ring-amber-500/20"
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-base-950/5 border-base-950/20 text-base-950 placeholder:text-base-600 focus-visible:border-amber-500 focus-visible:ring-amber-500/20"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-base-700">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="bg-base-950/5 border-base-950/20 text-base-950 placeholder:text-base-600 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <m.div whileTap={{ scale: 0.98 }} transition={springSubtle}>
                  <Button
                    type="submit"
                    className="w-full bg-base-950 text-text-primary hover:bg-base-800 font-medium"
                    onMouseEnter={() => setCursorVariant('text', 'Send', true)}
                    onMouseLeave={resetCursor}
                  >
                    Send Message
                  </Button>
                </m.div>
              </form>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  )
}
