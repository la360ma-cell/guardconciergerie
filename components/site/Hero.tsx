'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { CheckCircle, ArrowRight, ChevronDown, MapPin } from 'lucide-react'
import DynamicForm from './DynamicForm'

interface HeroProps {
  locale: string
  settings: Record<string, string>
  formFields: any[]
  content?: Record<string, string>
}

// Moroccan zellij-inspired geometric star
function MoroccanStar({ size = 120, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      <polygon points="50,2 61.8,38.2 100,38.2 69.1,61.8 80.9,98 50,74.4 19.1,98 30.9,61.8 0,38.2 38.2,38.2"
        fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
      <polygon points="50,18 58.5,43.8 85.4,43.8 64.5,58.8 72.9,84.5 50,69.5 27.1,84.5 35.5,58.8 14.6,43.8 41.5,43.8"
        fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      <line x1="50" y1="2"  x2="50" y2="98" stroke="currentColor" strokeWidth="0.4" opacity="0.2" />
      <line x1="2"  y1="50" x2="98" y2="50" stroke="currentColor" strokeWidth="0.4" opacity="0.2" />
      <line x1="15" y1="15" x2="85" y2="85" stroke="currentColor" strokeWidth="0.4" opacity="0.2" />
      <line x1="85" y1="15" x2="15" y2="85" stroke="currentColor" strokeWidth="0.4" opacity="0.2" />
    </svg>
  )
}

export default function Hero({ locale, settings, formFields, content = {} }: HeroProps) {
  const t = useTranslations('hero')
  const sectionName = 'hero'

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

  // ── Mouse tracking ────────────────────────────────────────────────────────
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const spring  = { stiffness: 45, damping: 18 }
  const smoothX = useSpring(mouseX, spring)
  const smoothY = useSpring(mouseY, spring)

  // Background image parallax (strong — creates real depth)
  const bgX = useTransform(smoothX, [-0.5, 0.5], [-30, 30])
  const bgY = useTransform(smoothY, [-0.5, 0.5], [-18, 18])

  // Background decorative elements (slow)
  const decX = useTransform(smoothX, [-0.5, 0.5], [-14, 14])
  const decY = useTransform(smoothY, [-0.5, 0.5], [-9,   9])

  // 3D tilt on the form card
  const formRotX = useTransform(smoothY, [-0.5, 0.5], [ 4, -4])
  const formRotY = useTransform(smoothX, [-0.5, 0.5], [-6,  6])

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left)  / rect.width  - 0.5)
    mouseY.set((e.clientY - rect.top)   / rect.height - 0.5)
  }
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0) }

  // ── Settings ──────────────────────────────────────────────────────────────
  const heroBg        = settings.appearance_hero_image || ''
  const heroBgPos     = settings.appearance_hero_image_pos || 'center'
  const heroBgOverlay = parseInt(settings.appearance_hero_image_overlay || '0', 10)
  const heroBgDark    = settings.appearance_hero_image_overlay_dark !== 'false'
  const heroTextAlign = settings.appearance_hero_text_align || 'left'
  const isCenter      = heroTextAlign === 'center'
  const heroMinHeight = (settings.appearance_hero_height || 'screen') === 'screen' ? '100vh' : settings.appearance_hero_height
  const sectionBgColor = settings.section_hero_bg || ''

  return (
    <section
      id="top"
      className="relative flex items-center pt-20 bg-white dark:bg-obsidian-950"
      style={{
        height: heroMinHeight,
        minHeight: heroMinHeight,
        overflow: 'hidden',
        ...(sectionBgColor ? { backgroundColor: sectionBgColor } : {}),
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Background image layer with 3D parallax ──────────────────────── */}
      {heroBg ? (
        <motion.div
          className="absolute inset-[-6%] pointer-events-none"
          style={{
            x: bgX,
            y: bgY,
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: heroBgPos,
            scale: 1.12,
          }}
        >
          {heroBgOverlay > 0 && (
            <div
              className="absolute inset-0"
              style={{ backgroundColor: heroBgDark
                ? `rgba(0,0,0,${heroBgOverlay / 100})`
                : `rgba(255,255,255,${heroBgOverlay / 100})` }}
            />
          )}
        </motion.div>
      ) : null}

      {/* ── Decorative background (no image) ─────────────────────────────── */}
      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ x: decX, y: decY }}
      >
        {!heroBg && <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gold-50 dark:bg-gold-900/10 blur-3xl" />}
        {!heroBg && <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-gold-50 dark:bg-gold-900/5 blur-3xl" />}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        {/* Far background stars */}
        <div className="absolute -top-16 -right-16 text-gold-400 dark:text-gold-600 opacity-[0.07]">
          <MoroccanStar size={340} />
        </div>
        <div className="absolute -bottom-20 -left-20 text-gold-300 dark:text-gold-700 opacity-[0.05]">
          <MoroccanStar size={260} />
        </div>
      </motion.div>


      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-0 w-full z-10 h-full flex flex-col justify-center">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full">

          {/* Left: Text */}
          <div className={isCenter ? 'text-center' : ''}>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="luxury-badge mb-6" style={cs('badge')}
            >
              {ct('badge', t('badge'))}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-light leading-[1.1] mb-6 text-obsidian-950 dark:text-white"
              style={cs('title')}
            >
              {ct('title', t('title'))}
              <br />
              <em className="text-gold-gradient not-italic" style={cs('title_highlight')}>
                {ct('title_highlight', t('title_highlight'))}
              </em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-obsidian-500 dark:text-obsidian-300 leading-relaxed mb-8 max-w-lg"
              style={cs('subtitle')}
            >
              {ct('subtitle', t('subtitle'))}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`flex flex-wrap gap-4 mb-10${isCenter ? ' justify-center' : ''}`}
            >
              {[
                { key: 'trust_1', val: ct('trust_1', t('trust_1')) },
                { key: 'trust_2', val: ct('trust_2', t('trust_2')) },
                { key: 'trust_3', val: ct('trust_3', t('trust_3')) },
              ].map((item) => (
                <div key={item.key} className="flex items-center gap-2 text-sm text-obsidian-600 dark:text-obsidian-300">
                  <CheckCircle size={14} className="text-gold-500" />
                  <span style={cs(item.key)}>{item.val}</span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`flex flex-wrap gap-4${isCenter ? ' justify-center' : ''}`}
            >
              <a href="#contact" className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 bg-obsidian-950 dark:bg-white text-white dark:text-obsidian-950 rounded-full text-sm font-medium hover:bg-gold-600 dark:hover:bg-gold-500 dark:hover:text-white transition-all duration-200 group">
                <span style={cs('cta_primary')}>
                  {ct('cta_primary', locale === 'fr'
                    ? settings.btn_text_hero_primary_fr  || t('cta_primary')
                    : settings.btn_text_hero_primary_en  || t('cta_primary'))}
                </span>
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a href="#services" className="btn-secondary inline-flex items-center gap-2 px-7 py-3.5 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium hover:border-gold-500 hover:text-gold-600 dark:hover:text-gold-400 transition-all duration-200">
                <span style={cs('cta_secondary')}>
                  {ct('cta_secondary', locale === 'fr'
                    ? settings.btn_text_hero_secondary_fr || t('cta_secondary')
                    : settings.btn_text_hero_secondary_en || t('cta_secondary'))}
                </span>
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-3 gap-6 mt-12 pt-10 border-t border-gray-100 dark:border-gray-800"
            >
              {[
                { value: settings.stat_properties || '120+', label: locale === 'fr' ? settings.stat_properties_label_fr || 'Biens gérés'     : settings.stat_properties_label_en || 'Properties' },
                { value: settings.stat_clients    || '95%',  label: locale === 'fr' ? settings.stat_clients_label_fr    || 'Satisfaction'    : settings.stat_clients_label_en    || 'Satisfaction' },
                { value: settings.stat_revenue    || '+40%', label: locale === 'fr' ? settings.stat_revenue_label_fr    || 'Revenus en plus' : settings.stat_revenue_label_en    || 'More revenue' },
              ].map((stat) => (
                <div key={stat.value} className="text-center lg:text-left">
                  <div className="font-display text-2xl lg:text-3xl font-medium text-gold-gradient">{stat.value}</div>
                  <div className="text-xs text-obsidian-400 dark:text-obsidian-500 mt-1 leading-tight">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Form with 3D tilt + Marrakech tag */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ rotateX: formRotX, rotateY: formRotY, transformStyle: 'preserve-3d', perspective: 1200, maxHeight: 'calc(' + heroMinHeight + ' - 160px)', overflowY: 'auto', overflowX: 'hidden' }}
            className="relative will-change-transform"
          >
            {/* Marrakech tag — top right of form */}
            <div className="absolute -top-3.5 right-5 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-obsidian-950 dark:bg-gold-500 text-white text-[11px] font-semibold tracking-wide shadow-lg">
              <MapPin size={10} className="flex-shrink-0" />
              <span>Marrakech</span>
            </div>

            <DynamicForm locale={locale} formFields={formFields} settings={settings} variant="hero" />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-gold-500" />
        <ChevronDown size={16} className="text-gold-500 animate-bounce" />
      </motion.div>
    </section>
  )
}
