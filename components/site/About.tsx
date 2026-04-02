'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { CheckCircle, Award, Users, TrendingUp } from 'lucide-react'

interface AboutProps {
  locale: string
  settings: Record<string, string>
  content?: Record<string, string>
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function About({ locale, settings, content = {} }: AboutProps) {
  const t = useTranslations('about')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const sectionName = 'about'

  const ct = (key: string, fallback: string): string => {
    const val = content[`${sectionName}_${key}_${locale}`] || content[`${sectionName}_${key}_fr`]
    return val || fallback
  }

  const cs = (key: string): React.CSSProperties => ({
    ...(content[`${sectionName}_${key}_color`]      && { color: content[`${sectionName}_${key}_color`] }),
    ...(content[`${sectionName}_${key}_font`]       && { fontFamily: `"${content[`${sectionName}_${key}_font`]}", sans-serif` }),
    ...(content[`${sectionName}_${key}_fontSize`]   && { fontSize: content[`${sectionName}_${key}_fontSize`] }),
    ...(content[`${sectionName}_${key}_fontWeight`] && { fontWeight: content[`${sectionName}_${key}_fontWeight`] as any }),
  })

  const pillars = [
    { icon: Award, textFr: "5 ans d'expertise à Marrakech", textEn: "5 years expertise in Marrakech" },
    { icon: Users, textFr: "Équipe dédiée 24/7", textEn: "Dedicated team 24/7" },
    { icon: TrendingUp, textFr: "+40% de revenus en moyenne", textEn: "+40% average revenue increase" },
  ]

  const aboutBg = settings.appearance_about_image || ''
  const aboutPhoto = settings.appearance_about_photo || ''
  const aboutBgPos = settings.appearance_about_image_pos || 'center'
  const aboutBgOverlay = parseInt(settings.appearance_about_image_overlay || '0', 10)
  const aboutBgDark = settings.appearance_about_image_overlay_dark !== 'false'
  const aboutPhotoPos = settings.appearance_about_photo_pos || 'center'
  const aboutPhotoFit = (settings.appearance_about_photo_fit || 'cover') as 'cover' | 'contain'

  const sectionBgColor = settings.section_about_bg || ''

  return (
    <section
      id="about"
      className="section-padding relative overflow-hidden"
      style={aboutBg
        ? { backgroundImage: `url(${aboutBg})`, backgroundSize: 'cover', backgroundPosition: aboutBgPos, ...(sectionBgColor ? { backgroundColor: sectionBgColor } : {}) }
        : (sectionBgColor ? { backgroundColor: sectionBgColor } : {})}
    >
      {!aboutBg && !sectionBgColor && <div className="absolute inset-0 bg-obsidian-50 dark:bg-obsidian-900/50" />}
      {!aboutBg && sectionBgColor && <div className="absolute inset-0" style={{ backgroundColor: sectionBgColor }} />}
      {aboutBg && aboutBgOverlay > 0 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: aboutBgDark ? `rgba(0,0,0,${aboutBgOverlay / 100})` : `rgba(255,255,255,${aboutBgOverlay / 100})` }}
        />
      )}
      {/* Decorative */}
      <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-white dark:from-obsidian-950 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Visual side */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="relative"
          >
            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-gradient-to-br from-obsidian-900 to-obsidian-700">
              {aboutPhoto ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={aboutPhoto}
                    alt="À propos Guard Conciergerie"
                    className="absolute inset-0 w-full h-full"
                    style={{ objectFit: aboutPhotoFit, objectPosition: aboutPhotoPos }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/60 to-transparent" />
                </>
              ) : (
                <>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white p-8">
                      <div className="font-display text-7xl font-light text-gold-400 mb-4">G</div>
                      <div className="text-sm tracking-[0.3em] uppercase opacity-60">Guard Conciergerie</div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/60 to-transparent" />
                </>
              )}
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-white dark:bg-obsidian-900 rounded-2xl p-5 shadow-luxury dark:shadow-luxury-dark border border-gray-100 dark:border-gray-800">
              <div className="text-center">
                <div className="font-display text-3xl font-medium text-gold-gradient">
                  {settings.stat_properties || '120+'}
                </div>
                <div className="text-xs text-obsidian-500 dark:text-obsidian-400 mt-1 tracking-wide">
                  {locale === 'fr'
                    ? settings.stat_properties_label_fr || 'Biens gérés'
                    : settings.stat_properties_label_en || 'Properties'}
                </div>
              </div>
            </div>

            {/* Second floating card */}
            <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 bg-gold-500 rounded-2xl p-4 shadow-gold-glow">
              <div className="text-white text-center">
                <div className="font-display text-2xl font-medium">
                  {settings.stat_years || '5+'}
                </div>
                <div className="text-xs opacity-80 mt-0.5">
                  {locale === 'fr' ? 'Années' : 'Years'}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content side */}
          <div>
            <motion.div
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="luxury-badge mb-6"
              style={cs('badge')}
            >
              {ct('badge', t('badge'))}
            </motion.div>

            <motion.h2
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="font-display text-4xl lg:text-5xl font-light leading-[1.1] mb-6 text-obsidian-950 dark:text-white"
              style={cs('title')}
            >
              {ct('title', t('title'))}
              <br />
              <em className="text-gold-gradient not-italic" style={cs('title_highlight')}>{ct('title_highlight', t('title_highlight'))}</em>
            </motion.h2>

            <motion.p
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="text-obsidian-500 dark:text-obsidian-300 leading-relaxed mb-4"
              style={cs('text')}
            >
              {ct('text', t('text'))}
            </motion.p>

            <motion.p
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="text-obsidian-500 dark:text-obsidian-300 leading-relaxed mb-8"
              style={cs('text2')}
            >
              {ct('text2', t('text2'))}
            </motion.p>

            {/* Pillars */}
            <div className="space-y-3 mb-8">
              {pillars.map((pillar, i) => (
                <motion.div
                  key={i}
                  custom={5 + i}
                  variants={fadeUp}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gold-50 dark:bg-gold-900/20 flex items-center justify-center flex-shrink-0">
                    <pillar.icon size={14} className="text-gold-600 dark:text-gold-400" />
                  </div>
                  <span className="text-sm text-obsidian-600 dark:text-obsidian-300">
                    {locale === 'fr' ? pillar.textFr : pillar.textEn}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.a
              custom={8}
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              href="#contact"
              className="inline-flex items-center gap-2 text-sm font-medium text-gold-600 dark:text-gold-400 hover:gap-3 transition-all"
            >
              {locale === 'fr' ? 'Parler à notre équipe' : 'Talk to our team'}
              <span>→</span>
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  )
}
