'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

interface StatsProps {
  locale: string
  settings: Record<string, string>
  content?: Record<string, string>
}

function CountUp({ value, inView, suffix = '' }: { value: string; inView: boolean; suffix?: string }) {
  const numStr = value.replace(/[^0-9]/g, '')
  const num = parseInt(numStr, 10)
  const prefix = value.match(/^[^0-9]*/)?.[0] || ''
  const suf = value.replace(/[0-9]/g, '').replace(prefix, '') || suffix

  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView || isNaN(num)) return

    const duration = 2000
    const steps = 60
    const step = num / steps
    let current = 0

    const timer = setInterval(() => {
      current += step
      if (current >= num) {
        setCount(num)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [inView, num])

  return (
    <span>
      {prefix}{isNaN(num) ? value : count}{suf}
    </span>
  )
}

export default function Stats({ locale, settings, content = {} }: StatsProps) {
  const t = useTranslations('stats')
  const sn = 'stats'
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

  const stats = [
    {
      value: settings.stat_properties || '120+',
      labelFr: settings.stat_properties_label_fr || 'Biens gérés',
      labelEn: settings.stat_properties_label_en || 'Managed properties',
    },
    {
      value: settings.stat_clients || '95%',
      labelFr: settings.stat_clients_label_fr || 'Propriétaires satisfaits',
      labelEn: settings.stat_clients_label_en || 'Satisfied owners',
    },
    {
      value: settings.stat_years || '5+',
      labelFr: settings.stat_years_label_fr || "Années d'expertise",
      labelEn: settings.stat_years_label_en || 'Years of expertise',
    },
    {
      value: settings.stat_revenue || '+40%',
      labelFr: settings.stat_revenue_label_fr || 'Revenus en plus en moyenne',
      labelEn: settings.stat_revenue_label_en || 'Average revenue increase',
    },
  ]

  return (
    <section id="stats" className="section-padding bg-obsidian-50 dark:bg-obsidian-900/50" ref={ref}
      style={settings.section_stats_bg ? { backgroundColor: settings.section_stats_bg } : {}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="font-display text-4xl font-light text-obsidian-950 dark:text-white"
            style={cs('title')}
          >
            {ct('title', t('title'))}{' '}
            <em className="text-gold-gradient not-italic" style={cs('title_highlight')}>{ct('title_highlight', t('title_highlight'))}</em>
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="relative text-center p-6 rounded-2xl bg-white dark:bg-obsidian-900 border border-gray-100 dark:border-gray-800 group hover:border-gold-200 dark:hover:border-gold-800 transition-colors"
            >
              {/* Decorative top border */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

              <div className="font-display text-4xl lg:text-5xl font-light text-gold-gradient mb-2">
                <CountUp value={stat.value} inView={isInView} />
              </div>
              <div className="text-xs text-obsidian-500 dark:text-obsidian-400 leading-tight tracking-wide">
                {locale === 'fr' ? stat.labelFr : stat.labelEn}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
