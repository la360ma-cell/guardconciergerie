'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'

interface ProcessProps {
  locale: string
  settings: Record<string, string>
  content?: Record<string, string>
}

export default function Process({ locale, settings, content = {} }: ProcessProps) {
  const t = useTranslations('process')
  const sn = 'process'
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

  const steps = [
    {
      num: ct('step_1_num', t('step_1_num')),
      title: ct('step_1_title', t('step_1_title')),
      text: ct('step_1_text', t('step_1_text')),
    },
    {
      num: ct('step_2_num', t('step_2_num')),
      title: ct('step_2_title', t('step_2_title')),
      text: ct('step_2_text', t('step_2_text')),
    },
    {
      num: ct('step_3_num', t('step_3_num')),
      title: ct('step_3_title', t('step_3_title')),
      text: ct('step_3_text', t('step_3_text')),
    },
  ]

  return (
    <section id="process" className="section-padding bg-white dark:bg-obsidian-950" ref={ref}
      style={settings.section_process_bg ? { backgroundColor: settings.section_process_bg } : {}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="luxury-badge justify-center mb-4"
            style={cs('badge')}
          >
            {ct('badge', t('badge'))}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl lg:text-5xl font-light text-obsidian-950 dark:text-white"
            style={cs('title')}
          >
            {ct('title', t('title'))}{' '}
            <em className="text-gold-gradient not-italic" style={cs('title_highlight')}>{ct('title_highlight', t('title_highlight'))}</em>
          </motion.h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-12 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-gold-300 dark:via-gold-700 to-transparent" />

          <div className="grid lg:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 * i }}
                className="relative text-center"
              >
                {/* Number circle */}
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="w-20 h-20 rounded-full bg-obsidian-50 dark:bg-obsidian-900 border-2 border-gold-200 dark:border-gold-800 flex items-center justify-center">
                    <span className="font-display text-2xl font-light text-gold-600 dark:text-gold-400">
                      {step.num}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <ArrowRight
                      size={20}
                      className="absolute -right-12 top-1/2 -translate-y-1/2 text-gold-300 dark:text-gold-700 hidden lg:block"
                    />
                  )}
                </div>

                <h3 className="font-display text-2xl font-medium text-obsidian-950 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-obsidian-500 dark:text-obsidian-400 leading-relaxed max-w-xs mx-auto">
                  {step.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-14"
        >
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); document.getElementById('hero-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }}
            className="btn-primary inline-flex items-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white rounded-full text-sm font-semibold tracking-wide transition-colors duration-200 shadow-gold-glow"
          >
            {locale === 'fr'
              ? settings.btn_text_process_fr || t('cta')
              : settings.btn_text_process_en || t('cta')}
            <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
