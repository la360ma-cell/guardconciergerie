'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TestimonialsProps {
  locale: string
  testimonials: any[]
  settings?: Record<string, string>
  content?: Record<string, string>
}

export default function Testimonials({ locale, testimonials, settings = {}, content = {} }: TestimonialsProps) {
  const t = useTranslations('testimonials')
  const sn = 'testimonials'
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
  const [active, setActive] = useState(0)

  if (!testimonials.length) return null

  const prev = () => setActive(i => (i - 1 + testimonials.length) % testimonials.length)
  const next = () => setActive(i => (i + 1) % testimonials.length)

  return (
    <section id="testimonials" className="section-padding bg-white dark:bg-obsidian-950" ref={ref}
      style={settings.section_testimonials_bg ? { backgroundColor: settings.section_testimonials_bg } : {}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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

        {/* Main testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative bg-obsidian-50 dark:bg-obsidian-900 rounded-3xl p-8 lg:p-12 border border-gray-100 dark:border-gray-800">
            {/* Quote icon */}
            <Quote
              size={48}
              className="absolute top-6 right-8 text-gold-200 dark:text-gold-900/50 fill-current"
            />

            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {Array.from({ length: testimonials[active].rating }).map((_, i) => (
                <Star key={i} size={16} className="text-gold-500 fill-gold-500" />
              ))}
            </div>

            {/* Text */}
            <motion.p
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="font-display text-xl lg:text-2xl font-light leading-relaxed text-obsidian-800 dark:text-obsidian-100 mb-8 italic"
            >
              &ldquo;{locale === 'fr' ? testimonials[active].textFr : testimonials[active].textEn}&rdquo;
            </motion.p>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gold-100 dark:bg-gold-900/20 border border-gold-200 dark:border-gold-800 flex items-center justify-center flex-shrink-0">
                <span className="font-display text-lg font-medium text-gold-600 dark:text-gold-400">
                  {testimonials[active].name.charAt(0)}
                </span>
              </div>
              <div>
                <div className="font-medium text-obsidian-900 dark:text-white">
                  {testimonials[active].name}
                </div>
                <div className="text-sm text-obsidian-400 dark:text-obsidian-500">
                  {testimonials[active].location}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:border-gold-500 hover:text-gold-500 transition-all"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300',
                    i === active ? 'w-8 bg-gold-500' : 'w-1.5 bg-gray-300 dark:bg-gray-700'
                  )}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:border-gold-500 hover:text-gold-500 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>

        {/* All testimonials preview (desktop) */}
        {testimonials.length > 1 && (
          <div className="hidden lg:grid grid-cols-3 gap-4 mt-12">
            {testimonials.map((item, i) => (
              <button
                key={item.id}
                onClick={() => setActive(i)}
                className={cn(
                  'p-4 rounded-xl text-left transition-all duration-200 border',
                  i === active
                    ? 'border-gold-300 dark:border-gold-700 bg-gold-50 dark:bg-gold-900/10'
                    : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                )}
              >
                <div className="font-medium text-sm text-obsidian-900 dark:text-white mb-1">{item.name}</div>
                <div className="text-xs text-obsidian-400 dark:text-obsidian-500">{item.location}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
