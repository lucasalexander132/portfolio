'use client'

import { useState } from 'react'
import { m, AnimatePresence, useAnimationControls } from 'motion/react'
import { X } from 'lucide-react'
import { useCursor } from '@/components/cursor'
import { useTranslations } from '@/lib/i18n'

// Snappy spring for neo-brutal - quick and decisive
const springBrutal = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 30,
}

interface ContactFormProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactForm({ isOpen, onClose }: ContactFormProps) {
  const t = useTranslations()
  const { setCursorVariant, resetCursor } = useCursor()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [shakenFields, setShakenFields] = useState<Set<string>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // Animation controls for each field
  const nameControls = useAnimationControls()
  const emailControls = useAnimationControls()
  const messageControls = useAnimationControls()

  const shakeField = async (controls: ReturnType<typeof useAnimationControls>) => {
    await controls.start({
      x: [0, -10, 10, -8, 8, -5, 5, -2, 2, 0],
      transition: { duration: 0.4, ease: 'easeOut' },
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check which fields are empty
    const emptyFields: string[] = []
    if (!formData.name.trim()) emptyFields.push('name')
    if (!formData.email.trim()) emptyFields.push('email')
    if (!formData.message.trim()) emptyFields.push('message')

    if (emptyFields.length > 0) {
      // Trigger shake on empty fields
      setShakenFields(new Set(emptyFields))

      // Shake animations
      const shakePromises: Promise<void>[] = []
      if (emptyFields.includes('name')) shakePromises.push(shakeField(nameControls))
      if (emptyFields.includes('email')) shakePromises.push(shakeField(emailControls))
      if (emptyFields.includes('message')) shakePromises.push(shakeField(messageControls))

      await Promise.all(shakePromises)
      setShakenFields(new Set())
      return
    }

    // Submit to API
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setSubmitStatus('error')
        setErrorMessage(data.error || 'Something went wrong')
        return
      }

      setSubmitStatus('success')
      setFormData({ name: '', email: '', message: '' })

      // Close modal after showing success
      setTimeout(() => {
        onClose()
        // Reset status after close animation
        setTimeout(() => setSubmitStatus('idle'), 300)
      }, 1500)
    } catch {
      setSubmitStatus('error')
      setErrorMessage('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
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
          {/* Backdrop - solid black, no blur */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-base-950/90"
            onClick={onClose}
          />

          {/* Modal Card - Neo Brutal */}
          <m.div
            initial={{ y: 40, opacity: 0, rotate: -1 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 40, opacity: 0, rotate: 1 }}
            transition={springBrutal}
            style={{ willChange: 'transform, opacity' }}
            className="fixed z-40 inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[min(36vw,460px)] sm:min-w-[380px] bg-amber-400 border-4 border-base-950 shadow-[8px_8px_0px_0px_#0a0a0a]"
          >

            <div className="p-6 sm:p-8">
              {/* Close button - offset position */}
              <m.button
                type="button"
                onClick={onClose}
                className="absolute -top-3 -right-3 w-10 h-10 bg-text-primary border-3 border-base-950 shadow-[3px_3px_0px_0px_#0a0a0a] flex items-center justify-center hover:bg-red-400 hover:shadow-[1px_1px_0px_0px_#0a0a0a] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                whileTap={{ scale: 0.95 }}
                transition={springBrutal}
                onMouseEnter={() => setCursorVariant('text', t('contact.cursor.close'), false, undefined, '#ef4444')}
                onMouseLeave={resetCursor}
                aria-label="Close contact form"
              >
                <X className="w-5 h-5 text-base-950" strokeWidth={3} />
              </m.button>

              {/* Header */}
              <div className="mb-8">
                <h2 className="font-mono text-3xl sm:text-4xl font-black text-base-950 uppercase tracking-tight leading-none">
                  {t('contact.title')}
                </h2>
                <div className="mt-2 h-1 w-16 bg-base-950" />
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Name field */}
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block font-mono text-xs font-bold text-base-950 uppercase tracking-widest"
                  >
                    {t('contact.name_label')}
                  </label>
                  <m.div animate={nameControls}>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`w-full h-12 px-4 border-3 shadow-[4px_4px_0px_0px_#0a0a0a] font-mono text-base-950 placeholder:text-base-500 focus:shadow-[2px_2px_0px_0px_#0a0a0a] focus:outline-none transition-all ${shakenFields.has('name') ? 'border-red-600 bg-red-200' : 'bg-text-primary border-base-950'}`}
                      placeholder={t('contact.name_placeholder')}
                    />
                  </m.div>
                </div>

                {/* Email field */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block font-mono text-xs font-bold text-base-950 uppercase tracking-widest"
                  >
                    {t('contact.email_label')}
                  </label>
                  <m.div animate={emailControls}>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full h-12 px-4 border-3 shadow-[4px_4px_0px_0px_#0a0a0a] font-mono text-base-950 placeholder:text-base-500 focus:shadow-[2px_2px_0px_0px_#0a0a0a] focus:outline-none transition-all ${shakenFields.has('email') ? 'border-red-600 bg-red-200' : 'bg-text-primary border-base-950'}`}
                      placeholder={t('contact.email_placeholder')}
                    />
                  </m.div>
                </div>

                {/* Message field */}
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="block font-mono text-xs font-bold text-base-950 uppercase tracking-widest"
                  >
                    {t('contact.message_label')}
                  </label>
                  <m.div animate={messageControls}>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className={`w-full px-4 py-3 border-3 shadow-[4px_4px_0px_0px_#0a0a0a] font-mono text-base-950 placeholder:text-base-500 focus:shadow-[2px_2px_0px_0px_#0a0a0a] focus:outline-none transition-all resize-none ${shakenFields.has('message') ? 'border-red-600 bg-red-200' : 'bg-text-primary border-base-950'}`}
                      placeholder={t('contact.message_placeholder')}
                    />
                  </m.div>
                </div>

                {/* Submit button */}
                <m.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 mt-2 bg-base-950 border-3 border-base-950 text-text-primary font-mono font-bold text-lg uppercase tracking-wider shadow-[4px_4px_0px_0px_#78350f] hover:shadow-[2px_2px_0px_0px_#78350f] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_#78350f]"
                  whileTap={isSubmitting ? {} : { scale: 0.98 }}
                  transition={springBrutal}
                  onMouseEnter={() => !isSubmitting && setCursorVariant('text', t('contact.cursor.submit'), true, 'diagonal')}
                  onMouseLeave={resetCursor}
                >
                  {isSubmitting ? t('contact.sending') : `${t('contact.submit')} →`}
                </m.button>

                {/* Status feedback */}
                <AnimatePresence mode="wait">
                  {submitStatus === 'success' && (
                    <m.p
                      key="success"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="font-mono text-sm font-bold text-green-800 text-center mt-3"
                    >
                      {t('contact.success')}
                    </m.p>
                  )}
                  {submitStatus === 'error' && (
                    <m.p
                      key="error"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="font-mono text-sm font-bold text-red-700 text-center mt-3"
                    >
                      {errorMessage || t('contact.error')}
                    </m.p>
                  )}
                </AnimatePresence>
              </form>

              {/* Corner decorations */}
              <div className="absolute bottom-4 left-4 w-4 h-4 border-l-3 border-b-3 border-base-950" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-r-3 border-b-3 border-base-950" />
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  )
}
