'use client'

import { Crosshair, Headphones } from 'lucide-react'
import { useLocale, useTranslations } from '@/lib/i18n'
import type { NowEntry } from '@/lib/now'

interface ProfileCardProps {
  now: NowEntry
}

export default function ProfileCard({ now }: ProfileCardProps) {
  const { locale } = useLocale()
  const t = useTranslations()
  const focus = locale === 'fr' ? now.focus_fr : now.focus_en

  return (
    <div className="rounded-[20px] bg-[#e9e0d0] p-1.5">
      <div className="relative rounded-[14px] bg-[#1E2230] overflow-hidden">
        {/* Photo area */}
        <div className="h-[200px] w-full overflow-hidden">
          <img
            src="/images/me7.png"
            alt="Lucas Alexander"
            className="w-full h-full object-cover object-[center_30%]"
          />
        </div>

        {/* Content area - overlaps photo slightly */}
        <div className="relative -mt-6 rounded-t-[18px] bg-[#1e2230] px-6 pt-6 pb-5 flex flex-col gap-4">
          {/* Name & title */}
          <div className="flex flex-col gap-1">
            <h2 className="font-serif text-[24px] text-[#F5F0E8] tracking-[1px]">
              Lucas Alexander
            </h2>
            <p className="font-sans text-xs font-medium text-[#D4A843] uppercase tracking-[2px]">
              Full Stack Developer
            </p>
          </div>

          {/* Bio */}
          <p className="text-xs font-normal text-[#7A8194] leading-[1.6]">
            Building thoughtful digital experiences with modern web technologies.
            Focused on craft, performance, and the details that make interfaces feel alive.
          </p>

          {/* Current focus & listening sections */}
          <div className="flex flex-col gap-2.5">
            <div className="bg-[#161921] rounded-lg px-4 py-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-[#D4A843]" />
                <span className="font-mono text-[11px] font-semibold text-[#D4A843] uppercase tracking-[1.5px]">
                  {t('updates.now.focus')}
                </span>
              </div>
              <p className="text-xs font-normal text-[#F5F0E8] leading-[1.5]">
                {focus}
              </p>
            </div>

            <a
              href="https://www.youtube.com/watch?v=CkM6LhCgw1Q"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#161921] rounded-lg px-4 py-3 flex flex-col gap-2 transition-colors hover:bg-[#1a1e2a]"
            >
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-[#D4A843]" />
                <span className="font-mono text-[11px] font-semibold text-[#D4A843] uppercase tracking-[1.5px]">
                  Listening To
                </span>
              </div>
              <p className="text-xs font-normal text-[#F5F0E8] leading-[1.5]">
                CHAMELEONS — The South Hill Experiment
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
