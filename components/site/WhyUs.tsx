'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { MapPin, Eye, Star, TrendingUp, Clock, Wrench } from 'lucide-react'

const icons = [MapPin, Eye, Star, TrendingUp, Clock, Wrench]

interface WhyUsProps {
  locale: string
  settings?: Record<string, string>
  content?: Record<string, string>
}

export default function WhyUs({ locale, settings = {}, content = {} }: WhyUsProps) {
  const t = useTranslations('whyus')
  const sn = 'whyus'
  const ct = (key: string, fallback: string): string =>
    content[`${sn}_${key}_${locale}`] || content[`${sn}_${key}_fr`] || fallback
  const cs = (key: string): React.CSSProperties => ({
    ...(content[`${sn}_${key}_color`]      && { color: content[`${sn}_${key}_color`] }),
    ...(content[`${sn}_${key}_font`]       && { fontFamily: `"${content[`${sn}_${key}_font`]}", sans-serif` }),
    ...(content[`${sn}_${key}_fontSize`]   && { fontSize: content[`${sn}_${key}_fontSize`] }),
    ...(content[`${sn}_${key}_fontWeight`] && { fontWeight: content[`${sn}_${key}_fontWeight`] as any }),
  })
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const reasons = [
    { titleKey: 'reason_1_title', textKey: 'reason_1_text' },
    { titleKey: 'reason_2_title', textKey: 'reason_2_text' },
    { titleKey: 'reason_3_title', textKey: 'reason_3_text' },
    { titleKey: 'reason_4_title', textKey: 'reason_4_text' },
    { titleKey: 'reason_5_title', textKey: 'reason_5_text' },
    { titleKey: 'reason_6_title', textKey: 'reason_6_text' },
  ]

  const sectionBgColor = settings.section_whyus_bg || ''

  return (
    <section
      id="whyus"
      className="section-padding bg-obsidian-950 dark:bg-obsidian-950 relative overflow-hidden"
      style={sectionBgColor ? { backgroundColor: sectionBgColor } : {}}
      ref={ref}
    >
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-gold-500/5 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="luxury-badge justify-center mb-4 text-gold-400"
            style={{ color: '#d4922b', ...cs('badge') }}
          >
            {ct('badge', t('badge'))}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl lg:text-5xl font-light text-white"
            style={cs('title')}
          >
            {ct('title', t('title'))}{' '}
            <em className="text-gold-gradient not-italic" style={cs('title_highlight')}>{ct('title_highlight', t('title_highlight'))}</em>
          </motion.h2>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, i) => {
            const Icon = icons[i]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="group relative p-6 rounded-2xl border border-white/5 hover:border-gold-500/20 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300"
              >
                {/* Number */}
                <div className="absolute top-4 right-4 font-display text-5xl font-light text-white/5 group-hover:text-gold-500/10 transition-colors">
                  {String(i + 1).padStart(2, '0')}
                </div>

                {/* Icon */}
                <div className="w-10 h-10 rounded-lg border border-gold-500/20 flex items-center justify-center mb-4 group-hover:border-gold-500/50 transition-colors">
                  <Icon size={18} className="text-gold-500" strokeWidth={1.5} />
                </div>

                <h3 className="font-display text-lg font-medium text-white mb-2">
                  {ct(reason.titleKey, t(reason.titleKey as any))}
                </h3>
                <p className="text-sm text-obsidian-400 leading-relaxed">
                  {ct(reason.textKey, t(reason.textKey as any))}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
