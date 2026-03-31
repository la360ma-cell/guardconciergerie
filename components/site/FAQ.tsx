'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FAQProps {
  locale: string
  faqs: any[]
  settings: Record<string, string>
  content?: Record<string, string>
}

export default function FAQ({ locale, faqs, settings, content = {} }: FAQProps) {
  const t = useTranslations('faq')
  const sn = 'faq'
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
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  if (!faqs.length) return null

  return (
    <section id="faq" className="section-padding bg-obsidian-50 dark:bg-obsidian-900/50" ref={ref}
      style={settings.section_faq_bg ? { backgroundColor: settings.section_faq_bg } : {}}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
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

        {/* FAQ items */}
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const question = locale === 'fr' ? faq.questionFr : faq.questionEn
            const answer = locale === 'fr' ? faq.answerFr : faq.answerEn
            const isOpen = openIndex === i

            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.05 * i }}
                className={cn(
                  'rounded-xl border transition-all duration-200',
                  isOpen
                    ? 'border-gold-200 dark:border-gold-800 bg-white dark:bg-obsidian-900'
                    : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-obsidian-900 hover:border-gray-300 dark:hover:border-gray-700'
                )}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-medium text-obsidian-900 dark:text-white pr-4">{question}</span>
                  <div className={cn(
                    'w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 transition-all',
                    isOpen
                      ? 'border-gold-500 bg-gold-500 text-white'
                      : 'border-gray-200 dark:border-gray-700 text-obsidian-500'
                  )}>
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </div>
                </button>

                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm text-obsidian-500 dark:text-obsidian-400 leading-relaxed">
                    {answer}
                  </p>
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-10"
        >
          <p className="text-sm text-obsidian-500 dark:text-obsidian-400 mb-3">
            {t('still_questions')}
          </p>
          <a
            href="#contact"
            className="text-sm font-medium text-gold-600 dark:text-gold-400 hover:underline"
          >
            {t('contact_us')} →
          </a>
        </motion.div>
      </div>
    </section>
  )
}
