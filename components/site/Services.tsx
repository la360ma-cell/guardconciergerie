'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Home, Clock, TrendingUp, Wrench, Camera, BarChart3, Star, Shield, Key, HeartHandshake } from 'lucide-react'

const iconMap: Record<string, any> = {
  Home, Clock, TrendingUp, Wrench, Camera, BarChart3, Star, Shield, Key, HeartHandshake
}

interface ServicesProps {
  locale: string
  services: any[]
  settings?: Record<string, string>
  content?: Record<string, string>
}

export default function Services({ locale, services, settings = {}, content = {} }: ServicesProps) {
  const t = useTranslations('services')
  const sn = 'services'
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

  return (
    <section id="services" className="section-padding bg-white dark:bg-obsidian-950" ref={ref}
      style={settings.section_services_bg ? { backgroundColor: settings.section_services_bg } : {}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="luxury-badge justify-center mb-4"
            style={cs('badge')}
          >
            {ct('badge', t('badge'))}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl lg:text-5xl font-light text-obsidian-950 dark:text-white"
            style={cs('title')}
          >
            {ct('title', t('title'))}{' '}
            <em className="text-gold-gradient not-italic" style={cs('title_highlight')}>{ct('title_highlight', t('title_highlight'))}</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-obsidian-500 dark:text-obsidian-300 max-w-2xl mx-auto"
            style={cs('subtitle')}
          >
            {ct('subtitle', t('subtitle'))}
          </motion.p>
        </div>

        {/* Services grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] || Star
            const title = locale === 'fr' ? service.titleFr : service.titleEn
            const desc = locale === 'fr' ? service.descFr : service.descEn

            return (
              <motion.div
                key={service.id}
                id={`service-card-${i}`}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="group relative p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-gold-200 dark:hover:border-gold-800 bg-white dark:bg-obsidian-900 hover:shadow-luxury dark:hover:shadow-luxury-dark transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-obsidian-50 dark:bg-obsidian-800 group-hover:bg-gold-50 dark:group-hover:bg-gold-900/20 flex items-center justify-center mb-4 transition-colors duration-300">
                  <Icon size={22} className="text-obsidian-600 dark:text-obsidian-300 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors duration-300" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-medium text-obsidian-950 dark:text-white mb-2 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors duration-300">
                  {title}
                </h3>
                <p className="text-sm text-obsidian-500 dark:text-obsidian-400 leading-relaxed">
                  {desc}
                </p>

                {/* Hover indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl" />
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center mt-12"
        >
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); document.getElementById('hero-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }}
            className="btn-secondary inline-flex items-center gap-2 px-8 py-3.5 border border-obsidian-200 dark:border-obsidian-700 rounded-full text-sm font-medium hover:bg-obsidian-950 hover:text-white dark:hover:bg-white dark:hover:text-obsidian-950 transition-all duration-200"
          >
            {locale === 'fr'
              ? settings.btn_text_services_fr || 'Demander un devis gratuit'
              : settings.btn_text_services_en || 'Request a free quote'}
            <span>→</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
