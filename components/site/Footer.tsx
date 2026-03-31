'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin, Youtube, Twitter } from 'lucide-react'
import { localePath } from '@/lib/utils'

function TikTokIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.13a8.22 8.22 0 0 0 4.79 1.52V7.2a4.85 4.85 0 0 1-1.02-.51Z"/>
    </svg>
  )
}

interface FooterProps {
  locale: string
  settings: Record<string, string>
  content?: Record<string, string>
}

export default function Footer({ locale, settings, content: initialContent = {} }: FooterProps) {
  const t = useTranslations('footer')
  const pathname = usePathname()

  // Fetch footer content from DB (editable via Admin > Contenu > Footer)
  // initialContent is pre-fetched SSR; client-side fetch refreshes it
  const [dbContent, setDbContent] = useState<Record<string, string>>(initialContent)

  useEffect(() => {
    fetch('/api/content?section=footer')
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data)) return
        const map: Record<string, string> = {}
        data.forEach((item: { key: string; valueFr?: string; valueEn?: string }) => {
          map[`${item.key}_fr`] = item.valueFr || ''
          map[`${item.key}_en`] = item.valueEn || ''
        })
        setDbContent(map)
      })
      .catch(() => {})
  }, [])

  // Get text from DB if available, otherwise fall back to i18n translation
  const fc = (dbKey: string, fallback: string): string => {
    const val = dbContent[`${dbKey}_${locale}`] || dbContent[`${dbKey}_fr`]
    return val || fallback
  }

  const currentYear = new Date().getFullYear()

  const homePathname = locale === 'en' ? '/en' : '/'
  const isHome = pathname === homePathname || pathname === '/en' || pathname === '/'
  const home = locale === 'en' ? '/en' : ''
  const a = (id: string) => isHome ? `#${id}` : `${home}/#${id}`

  // Smooth scroll handler for section links when already on home page
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (isHome) {
      e.preventDefault()
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const services = [
    fc('footer_service_1', locale === 'fr' ? 'Gestion Locative'     : 'Property Management'),
    fc('footer_service_2', locale === 'fr' ? 'Conciergerie 24/7'    : 'Concierge 24/7'),
    fc('footer_service_3', locale === 'fr' ? 'Optimisation Revenus' : 'Revenue Optimization'),
    fc('footer_service_4', locale === 'fr' ? 'Maintenance'          : 'Maintenance'),
    fc('footer_service_5', locale === 'fr' ? 'Photographie'         : 'Photography'),
  ]

  return (
    <footer className="bg-obsidian-950 text-white pt-16 pb-8"
      style={settings.section_footer_bg ? { backgroundColor: settings.section_footer_bg } : {}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className={`lg:col-span-2 ${settings.appearance_logo_footer_align === 'center' ? 'text-center' : ''}`}>
            <div className="mb-4">
              {(settings.appearance_logo_footer || settings.appearance_logo_header) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={settings.appearance_logo_footer || settings.appearance_logo_header}
                  alt="Logo"
                  style={{ height: `${parseInt(settings.appearance_logo_height || '40', 10)}px`, width: 'auto' }}
                  className="object-contain"
                />
              ) : (
                <>
                  <div className="font-display text-2xl font-light tracking-[0.15em] uppercase">Guard</div>
                  <div className="text-[9px] tracking-[0.35em] uppercase text-gold-500 font-medium mt-0.5">
                    Conciergerie Luxury Care
                  </div>
                </>
              )}
            </div>
            <p className="text-sm text-obsidian-400 leading-relaxed max-w-xs mb-6">
              {fc('footer_description', t('description'))}
            </p>
            <div className="flex flex-wrap gap-2">
              {settings.social_instagram && settings.social_instagram !== '#' && (
                <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-gold-500 hover:text-gold-500 transition-all" title="Instagram">
                  <Instagram size={15} />
                </a>
              )}
              {settings.social_facebook && settings.social_facebook !== '#' && (
                <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-gold-500 hover:text-gold-500 transition-all" title="Facebook">
                  <Facebook size={15} />
                </a>
              )}
              {settings.social_tiktok && settings.social_tiktok !== '#' && (
                <a href={settings.social_tiktok} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-gold-500 hover:text-gold-500 transition-all" title="TikTok">
                  <TikTokIcon size={15} />
                </a>
              )}
              {settings.social_linkedin && settings.social_linkedin !== '#' && (
                <a href={settings.social_linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-gold-500 hover:text-gold-500 transition-all" title="LinkedIn">
                  <Linkedin size={15} />
                </a>
              )}
              {settings.social_youtube && settings.social_youtube !== '#' && (
                <a href={settings.social_youtube} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-gold-500 hover:text-gold-500 transition-all" title="YouTube">
                  <Youtube size={15} />
                </a>
              )}
              {settings.social_twitter && settings.social_twitter !== '#' && (
                <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-gold-500 hover:text-gold-500 transition-all" title="X / Twitter">
                  <Twitter size={15} />
                </a>
              )}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-gold-500 font-medium mb-4">
              {fc('footer_services_label', t('services'))}
            </h4>
            <ul className="space-y-2">
              {services.map(s => (
                <li key={s}>
                  <a href={a('services')} onClick={e => handleAnchorClick(e, 'services')} className="text-sm text-obsidian-400 hover:text-white transition-colors">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-gold-500 font-medium mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              {settings.contact_phone && (
                <li className="flex items-start gap-2.5">
                  <Phone size={14} className="text-gold-500 mt-0.5 flex-shrink-0" />
                  <a href={`tel:${settings.contact_phone}`} className="text-sm text-obsidian-400 hover:text-white transition-colors">
                    {settings.contact_phone}
                  </a>
                </li>
              )}
              {settings.contact_email && (
                <li className="flex items-start gap-2.5">
                  <Mail size={14} className="text-gold-500 mt-0.5 flex-shrink-0" />
                  <a href={`mailto:${settings.contact_email}`} className="text-sm text-obsidian-400 hover:text-white transition-colors break-all">
                    {settings.contact_email}
                  </a>
                </li>
              )}
              {(locale === 'fr' ? settings.contact_address_fr : settings.contact_address_en) && (
                <li className="flex items-start gap-2.5">
                  <MapPin size={14} className="text-gold-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-obsidian-400">
                    {locale === 'fr' ? settings.contact_address_fr : settings.contact_address_en}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-obsidian-500">
            © {currentYear} Guard Conciergerie Luxury Care. {fc('footer_rights', t('rights'))}
          </p>
          <div className="flex gap-4 text-xs text-obsidian-500">
            <a href={localePath(locale, '/legal')} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t('legal')}</a>
            <a href={localePath(locale, '/privacy')} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t('privacy')}</a>
          </div>
        </div>

        {/* Bottom tagline */}
        <p className="text-center text-xs text-obsidian-600 mt-6 tracking-widest uppercase">
          {fc('footer_tagline', t('made_in'))}
        </p>

        {/* Agency credit */}
        <a
          href="https://la360.ma/"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-[10px] text-obsidian-600 hover:text-gold-500 transition-colors duration-200 mt-3"
        >
          {locale === 'fr'
            ? 'Site conçu et développé par LA360 — Agence de communication à Marrakech'
            : 'Website designed & developed by LA360 — Communication agency in Marrakech'}
        </a>
      </div>
    </footer>
  )
}
