'use client'

import React, { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { motion, useInView } from 'framer-motion'
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'
import DynamicForm from './DynamicForm'

interface ContactSectionProps {
  locale: string
  settings: Record<string, string>
  formFields: any[]
  content?: Record<string, string>
}

export default function ContactSection({ locale, settings, formFields, content = {} }: ContactSectionProps) {
  const t = useTranslations('contact')
  const sn = 'contact'
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

  const whatsappPhone = (settings.contact_whatsapp || '').replace(/[^0-9]/g, '')

  const contactItems = [
    settings.contact_phone ? {
      icon: Phone,
      label: t('phone'),
      value: settings.contact_phone,
      href: `tel:${settings.contact_phone}`,
    } : null,
    settings.contact_email ? {
      icon: Mail,
      label: t('email'),
      value: settings.contact_email,
      href: `mailto:${settings.contact_email}`,
    } : null,
    (settings.contact_address_fr || settings.contact_address_en) ? {
      icon: MapPin,
      label: t('address'),
      value: locale === 'fr' ? settings.contact_address_fr || '' : settings.contact_address_en || '',
      href: null,
    } : null,
    whatsappPhone.length >= 7 ? {
      icon: MessageCircle,
      label: t('whatsapp'),
      value: settings.contact_whatsapp || '',
      href: `https://wa.me/${whatsappPhone}`,
    } : null,
  ].filter(Boolean) as { icon: React.ComponentType<any>; label: string; value: string; href: string | null }[]

  const contactBg = settings.appearance_contact_image || ''
  const contactBgPos = settings.appearance_contact_image_pos || 'center'
  const contactBgOverlay = parseInt(settings.appearance_contact_image_overlay || '0', 10)
  const contactBgDark = settings.appearance_contact_image_overlay_dark !== 'false'

  const sectionBgColor = settings.section_contact_bg || ''

  return (
    <section
      id="contact"
      className="section-padding relative"
      ref={ref}
      style={contactBg
        ? { backgroundImage: `url(${contactBg})`, backgroundSize: 'cover', backgroundPosition: contactBgPos, ...(sectionBgColor ? { backgroundColor: sectionBgColor } : {}) }
        : (sectionBgColor ? { backgroundColor: sectionBgColor } : {})}
    >
      {!contactBg && !sectionBgColor && <div className="absolute inset-0 bg-white dark:bg-obsidian-950" />}
      {!contactBg && sectionBgColor && <div className="absolute inset-0" style={{ backgroundColor: sectionBgColor }} />}
      {contactBg && contactBgOverlay > 0 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: contactBgDark ? `rgba(0,0,0,${contactBgOverlay / 100})` : `rgba(255,255,255,${contactBgOverlay / 100})` }}
        />
      )}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="mt-4 text-obsidian-500 dark:text-obsidian-300 max-w-lg mx-auto"
            style={cs('subtitle')}
          >
            {ct('subtitle', t('subtitle'))}
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-display text-2xl font-medium text-obsidian-950 dark:text-white mb-3">
              {t('info_title')}
            </h3>
            <p className="text-obsidian-500 dark:text-obsidian-300 leading-relaxed mb-8">
              {t('info_text')}
            </p>

            {/* Contact info */}
            <div className="space-y-4">
              {contactItems.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-obsidian-50 dark:bg-obsidian-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center flex-shrink-0">
                    <item.icon size={16} className="text-gold-500" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-xs text-obsidian-400 dark:text-obsidian-500 tracking-wide uppercase mb-0.5">
                      {item.label}
                    </div>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-sm font-medium text-obsidian-900 dark:text-white hover:text-gold-600 dark:hover:text-gold-400 transition-colors"
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-sm font-medium text-obsidian-900 dark:text-white">
                        {item.value}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            {[
              { key: 'social_instagram', label: 'Instagram' },
              { key: 'social_facebook', label: 'Facebook' },
              { key: 'social_tiktok', label: 'TikTok' },
              { key: 'social_linkedin', label: 'LinkedIn' },
              { key: 'social_youtube', label: 'YouTube' },
              { key: 'social_twitter', label: 'X / Twitter' },
            ].filter(({ key }) => {
              const val = settings[key]
              return val && val !== '#' && val.startsWith('http')
            }).length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {[
                  { key: 'social_instagram', label: 'Instagram' },
                  { key: 'social_facebook', label: 'Facebook' },
                  { key: 'social_tiktok', label: 'TikTok' },
                  { key: 'social_linkedin', label: 'LinkedIn' },
                  { key: 'social_youtube', label: 'YouTube' },
                  { key: 'social_twitter', label: 'X / Twitter' },
                ].filter(({ key }) => {
                  const val = settings[key]
                  return val && val !== '#' && val.startsWith('http')
                }).map(({ key, label }) => (
                  <a
                    key={key}
                    href={settings[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-full hover:border-gold-400 hover:text-gold-600 dark:hover:text-gold-400 transition-all"
                  >
                    {label}
                  </a>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-obsidian-900 p-6 lg:p-8 shadow-luxury dark:shadow-luxury-dark"
          >
            <DynamicForm
              locale={locale}
              formFields={formFields}
              settings={settings}
              variant="section"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
