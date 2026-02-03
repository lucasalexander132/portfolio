'use client'

import { useState } from 'react'
import { m, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'
import { springSnappy } from '@/lib/motion'
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
        <m.div
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={springSnappy}
          className="fixed top-[60px] left-0 right-0 z-40 bg-base-900/95 backdrop-blur-md border-b border-base-700/30"
        >
          <div className="max-w-md mx-auto py-8 px-6">
            {/* Close button */}
            <m.button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg text-base-400 hover:text-text-primary hover:bg-base-800 transition-colors"
              whileTap={{ scale: 0.95 }}
              transition={springSnappy}
              onMouseEnter={() => setCursorVariant('link', undefined, true)}
              onMouseLeave={resetCursor}
              aria-label="Close contact form"
            >
              <X className="w-5 h-5" />
            </m.button>

            <h2 className="font-serif text-2xl text-text-primary mb-6">
              Get in Touch
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-text-secondary">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-base-800/50 border-base-700/50 text-text-primary placeholder:text-base-500 focus-visible:border-amber-500 focus-visible:ring-amber-500/20"
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-text-secondary">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-base-800/50 border-base-700/50 text-text-primary placeholder:text-base-500 focus-visible:border-amber-500 focus-visible:ring-amber-500/20"
                  placeholder="your@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-text-secondary">
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="bg-base-800/50 border-base-700/50 text-text-primary placeholder:text-base-500 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <m.div whileTap={{ scale: 0.98 }} transition={springSnappy}>
                <Button
                  type="submit"
                  className="w-full bg-amber-500 text-base-950 hover:bg-amber-400 font-medium"
                  onMouseEnter={() => setCursorVariant('text', 'Send', true)}
                  onMouseLeave={resetCursor}
                >
                  Send Message
                </Button>
              </m.div>
            </form>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
