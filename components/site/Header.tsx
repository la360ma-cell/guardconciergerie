'use client'

import { LangToggle } from '@/components/ui/LangToggle'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Phone, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface HeaderProps {
  locale: string
  settings: Record<string, string>
}

const DEFAULT_IDS = ['services', 'about', 'process', 'testimonials', 'faq']

export default function Header({ locale, settings }: HeaderProps) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Base path for the home page (respects as-needed locale prefix)
  const home = locale === 'en' ? '/en' : ''
  const homePathname = locale === 'en' ? '/en' : '/'

  const isHome = pathname === homePathname || pathname === '/en' || pathname === '/'

  const a = (id: string) => isHome ? `#${id}` : `${home}/#${id}`

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (isHome) {
      e.preventDefault()
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setMenuOpen(false)
    }
  }

  // ── Parse nav settings ────────────────────────────────────────────────────

  // Ordered list of IDs
  let orderedIds: string[] = DEFAULT_IDS
  try { if (settings.nav_order) orderedIds = JSON.parse(settings.nav_order) } catch {}

  // Hidden IDs
  let hiddenIds: string[] = []
  try { if (settings.nav_hidden) hiddenIds = JSON.parse(settings.nav_hidden) } catch {}

  // Default labels from i18n
  const defaultLabels: Record<string, string> = {
    services:     t('services'),
    about:        t('about'),
    process:      t('process'),
    testimonials: t('testimonials'),
    faq:          t('faq'),
  }

  // Full item map (all possible items)
  const allItems = DEFAULT_IDS.map(id => ({
    id,
    href: a(id),
    label: settings[`nav_label_${id}_${locale}`] || defaultLabels[id] || id,
  }))

  // Final filtered + ordered nav links
  const navLinks = orderedIds
    .filter(id => !hiddenIds.includes(id))
    .map(id => allItems.find(item => item.id === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))

  // ── Style settings ────────────────────────────────────────────────────────

  const navLinkStyle: React.CSSProperties = {
    ...(settings.nav_link_color      && { color: settings.nav_link_color }),
    ...(settings.nav_font_size       && { fontSize: settings.nav_font_size }),
    ...(settings.nav_font_weight     && { fontWeight: settings.nav_font_weight }),
    ...(settings.nav_letter_spacing  && { letterSpacing: settings.nav_letter_spacing }),
  }

  const ctaStyle: React.CSSProperties = {
    ...(settings.nav_cta_bg         && { backgroundColor: settings.nav_cta_bg }),
    ...(settings.nav_cta_text_color && { color: settings.nav_cta_text_color }),
  }

  const headerScrolledStyle: React.CSSProperties =
    scrolled && settings.nav_header_bg
      ? { backgroundColor: settings.nav_header_bg }
      : {}

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full">
      {/* Inject hover color override via a style tag if set */}
      {settings.nav_link_hover_color && /^#[0-9a-fA-F]{3,8}$|^rgb/.test(settings.nav_link_hover_color) && (
        <style dangerouslySetInnerHTML={{
          __html: `.guard-nav-link:hover { color: ${settings.nav_link_hover_color} !important; }`
        }} />
      )}

      <header
        className={cn(
          'w-full transition-all duration-300',
          scrolled
            ? 'bg-white/95 dark:bg-obsidian-950/95 backdrop-blur-md shadow-luxury dark:shadow-luxury-dark py-3'
            : 'bg-transparent py-5'
        )}
        style={headerScrolledStyle}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo — transparent version when at top, scrolled version when scrolled */}
            <a href={`${home}/`} className="flex items-center leading-none group">
              {(() => {
                const logoHeight = `${parseInt(settings.appearance_logo_height || '40', 10)}px`
                // Logo transparent = logo shown when header is not scrolled
                const logoTransparent = settings.appearance_logo_header_transparent
                // Logo scrolled = logo shown when header has scrolled background (light mode)
                const logoScrolled = settings.appearance_logo_header
                // Logo dark = logo shown in dark mode when header is visible (dark background)
                const logoDark = settings.appearance_logo_header_dark
                // Pick the right logo: dark mode + scrolled → dark logo, else normal logic
                const isDark = resolvedTheme === 'dark'
                const activeLogo = scrolled
                  ? (isDark && logoDark ? logoDark : logoScrolled || logoTransparent)
                  : (logoTransparent || logoScrolled)

                if (activeLogo) return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={activeLogo}
                    alt="Logo"
                    style={{ height: logoHeight, width: 'auto' }}
                    className="object-contain transition-opacity duration-300"
                  />
                )

                return (
                  <span className="flex flex-col leading-none">
                    <span className={cn(
                      'font-display text-xl font-light tracking-[0.15em] uppercase transition-colors',
                      scrolled ? 'text-obsidian-950 dark:text-white' : 'text-white dark:text-white'
                    )}>
                      Guard
                    </span>
                    <span className="text-[9px] tracking-[0.35em] uppercase text-gold-400 font-medium mt-0.5">
                      Conciergerie Luxury Care
                    </span>
                  </span>
                )
              })()}
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={e => handleAnchorClick(e, link.id)}
                  className="guard-nav-link text-sm text-obsidian-600 dark:text-obsidian-300 hover:text-obsidian-950 dark:hover:text-white transition-colors duration-200 tracking-wide"
                  style={navLinkStyle}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right controls */}
            <div className="hidden lg:flex items-center gap-3">
              <LangToggle locale={locale} />
              <ThemeToggle />
              <a
                href={a('contact')}
                onClick={e => handleAnchorClick(e, 'contact')}
                className="btn-primary ml-2 px-5 py-2.5 bg-obsidian-950 dark:bg-white text-white dark:text-obsidian-950 text-sm font-medium tracking-wide rounded-full hover:bg-gold-600 dark:hover:bg-gold-400 transition-colors duration-200"
                style={ctaStyle}
              >
                {locale === 'fr'
                  ? settings.btn_text_header_fr || t('cta')
                  : settings.btn_text_header_en || t('cta')}
              </a>
            </div>

            {/* Mobile controls */}
            <div className="flex lg:hidden items-center gap-2">
              <LangToggle locale={locale} />
              <ThemeToggle />
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-9 h-9 flex items-center justify-center"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-full z-50 bg-white dark:bg-obsidian-950 border-b border-gray-100 dark:border-gray-800 shadow-luxury lg:hidden overflow-y-auto max-h-[calc(100vh-4rem)]"
          >
            <nav className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map(link => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={e => { handleAnchorClick(e, link.id); setMenuOpen(false) }}
                  className="guard-nav-link text-base text-obsidian-700 dark:text-obsidian-200 hover:text-gold-600 dark:hover:text-gold-400 py-2 border-b border-gray-100 dark:border-gray-800 transition-colors"
                  style={navLinkStyle}
                >
                  {link.label}
                </a>
              ))}
              <a
                href={`tel:${settings.contact_phone}`}
                className="flex items-center gap-2 text-sm text-gold-600 dark:text-gold-400 py-2"
              >
                <Phone size={14} />
                {settings.contact_phone}
              </a>
              <a
                href={a('contact')}
                onClick={e => { handleAnchorClick(e, 'contact'); setMenuOpen(false) }}
                className="btn-primary mt-2 w-full py-3 bg-obsidian-950 dark:bg-white text-white dark:text-obsidian-950 text-sm font-medium text-center rounded-full"
                style={ctaStyle}
              >
                {locale === 'fr'
                  ? settings.btn_text_header_fr || t('cta')
                  : settings.btn_text_header_en || t('cta')}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
