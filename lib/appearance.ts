// Default gold palette (hex #d4922b)
export const DEFAULT_PRIMARY = '#d4922b'

// ── Section system ────────────────────────────────────────────────────────────
export const SECTION_NAMES = ['hero','about','services','whyus','process','stats','testimonials','faq','contact','footer'] as const
export type SectionName = typeof SECTION_NAMES[number]

export const SECTION_LABELS: Record<SectionName, string> = {
  hero: '🎯 Hero', about: '👤 À propos', services: '⚡ Services',
  whyus: '🏆 Pourquoi nous', process: '🔄 Processus', stats: '📊 Statistiques',
  testimonials: '💬 Témoignages', faq: '❓ FAQ', contact: '📩 Contact', footer: '🔻 Footer',
}

export const SECTION_SELECTORS: Record<SectionName, string> = {
  hero: '#top', about: '#about', services: '#services', whyus: '#whyus',
  process: '#process', stats: '#stats', testimonials: '#testimonials',
  faq: '#faq', contact: '#contact', footer: 'footer',
}

export const DISPLAY_FONTS = [
  { value: '', label: 'Cormorant Garamond (défaut)' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'EB Garamond', label: 'EB Garamond' },
  { value: 'Lora', label: 'Lora' },
  { value: 'Merriweather', label: 'Merriweather' },
  { value: 'Libre Baskerville', label: 'Libre Baskerville' },
  { value: 'Cinzel', label: 'Cinzel' },
  { value: 'Josefin Slab', label: 'Josefin Slab' },
]

export const BODY_FONTS = [
  { value: '', label: 'Inter (défaut)' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Outfit', label: 'Outfit' },
  { value: 'DM Sans', label: 'DM Sans' },
  { value: 'Raleway', label: 'Raleway' },
  { value: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans' },
  { value: 'Nunito', label: 'Nunito' },
]

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return null
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  }
}

function blend(c: number, amount: number, toward: number): number {
  return Math.round(Math.min(255, Math.max(0, c + (toward - c) * amount)))
}

function toVar(r: number, g: number, b: number): string {
  return `${r}, ${g}, ${b}`
}

export function generateGoldPalette(primaryHex: string): Record<string, string> {
  const p = hexToRgb(primaryHex) ?? hexToRgb(DEFAULT_PRIMARY)!
  const W = 255

  return {
    '50':  toVar(blend(p.r, 0.95, W), blend(p.g, 0.95, W), blend(p.b, 0.95, W)),
    '100': toVar(blend(p.r, 0.85, W), blend(p.g, 0.85, W), blend(p.b, 0.85, W)),
    '200': toVar(blend(p.r, 0.70, W), blend(p.g, 0.70, W), blend(p.b, 0.70, W)),
    '300': toVar(blend(p.r, 0.50, W), blend(p.g, 0.50, W), blend(p.b, 0.50, W)),
    '400': toVar(blend(p.r, 0.25, W), blend(p.g, 0.25, W), blend(p.b, 0.25, W)),
    '500': toVar(p.r, p.g, p.b),
    '600': toVar(blend(p.r, 0.15, 0), blend(p.g, 0.15, 0), blend(p.b, 0.15, 0)),
    '700': toVar(blend(p.r, 0.35, 0), blend(p.g, 0.35, 0), blend(p.b, 0.35, 0)),
    '800': toVar(blend(p.r, 0.52, 0), blend(p.g, 0.52, 0), blend(p.b, 0.52, 0)),
    '900': toVar(blend(p.r, 0.67, 0), blend(p.g, 0.67, 0), blend(p.b, 0.67, 0)),
  }
}

export function buildAppearanceStyles(settings: Record<string, string>): string {
  const primaryColor = settings.appearance_primary_color || DEFAULT_PRIMARY
  const palette = generateGoldPalette(primaryColor)
  const fontDisplay = settings.appearance_font_display || ''
  const fontBody = settings.appearance_font_body || ''

  const goldVars = Object.entries(palette)
    .map(([shade, rgb]) => `  --gold-${shade}: ${rgb};`)
    .join('\n')

  const fontVars = [
    fontDisplay ? `  --font-display: "${fontDisplay}", Georgia, serif;` : '',
    fontBody ? `  --font-body: "${fontBody}", system-ui, sans-serif;` : '',
  ].filter(Boolean).join('\n')

  const headingColor   = settings.appearance_heading_color   || ''
  const bodyColor      = settings.appearance_body_color      || ''
  const navTextColor   = settings.appearance_nav_text_color  || ''
  const navBgColor     = settings.appearance_nav_bg_color    || ''
  const footerTextColor= settings.appearance_footer_text_color || ''
  const badgeColor     = settings.appearance_badge_color     || ''
  const btnTextColor   = settings.appearance_btn_text_color  || ''
  const btnBgColor     = settings.appearance_btn_bg_color    || ''

  // ── Button system ────────────────────────────────────────────────────────
  const btnShape       = settings.btn_shape          || ''
  const btnPrimaryBg   = settings.btn_primary_bg     || ''
  const btnPrimaryText = settings.btn_primary_text   || ''
  const btnPrimaryHover= settings.btn_primary_hover_bg || ''
  const btnSecondaryBg = settings.btn_secondary_bg   || ''
  const btnSecondaryTxt= settings.btn_secondary_text || ''
  const btnSecondaryBdr= settings.btn_secondary_border|| ''
  const btnSecondaryHov= settings.btn_secondary_hover_bg || ''
  const btnFontWeight  = settings.btn_font_weight    || ''

  const shapeMap: Record<string,string> = {
    pill:       '9999px',
    rounded:    '16px',
    semiround:  '8px',
    square:     '2px',
  }
  const btnRadius = shapeMap[btnShape] || ''

  const weightMap: Record<string,string> = {
    light: '300', normal: '400', medium: '500', semibold: '600', bold: '700',
  }
  const btnWeight = weightMap[btnFontWeight] || ''

  const btnRules: string[] = []
  if (btnRadius)      btnRules.push(`.btn-primary,.btn-secondary{border-radius:${btnRadius} !important;}`)
  if (btnWeight)      btnRules.push(`.btn-primary,.btn-secondary{font-weight:${btnWeight} !important;}`)
  if (btnPrimaryBg)   btnRules.push(`.btn-primary{background-color:${btnPrimaryBg} !important;border-color:${btnPrimaryBg} !important;}`)
  if (btnPrimaryText) btnRules.push(`.btn-primary{color:${btnPrimaryText} !important;}`)
  if (btnPrimaryHover)btnRules.push(`.btn-primary:hover{background-color:${btnPrimaryHover} !important;border-color:${btnPrimaryHover} !important;}`)
  if (btnSecondaryBg) btnRules.push(`.btn-secondary{background-color:${btnSecondaryBg} !important;}`)
  if (btnSecondaryTxt)btnRules.push(`.btn-secondary{color:${btnSecondaryTxt} !important;}`)
  if (btnSecondaryBdr)btnRules.push(`.btn-secondary{border-color:${btnSecondaryBdr} !important;}`)
  if (btnSecondaryHov)btnRules.push(`.btn-secondary:hover{background-color:${btnSecondaryHov} !important;}`)

  const overrideRules = [
    headingColor    ? `h1,h2,h3,h4,h5{color:${headingColor} !important;}` : '',
    bodyColor       ? `p{color:${bodyColor} !important;}` : '',
    navTextColor    ? `header nav a,header .nav-link{color:${navTextColor} !important;}` : '',
    navBgColor      ? `header.scrolled{background-color:${navBgColor} !important;}` : '',
    footerTextColor ? `footer,footer p,footer span,footer a,footer li,footer div{color:${footerTextColor} !important;}` : '',
    badgeColor      ? `.luxury-badge{color:${badgeColor} !important;}` : '',
    btnTextColor    ? `.btn-primary,header a.cta-btn{color:${btnTextColor} !important;}` : '',
    btnBgColor      ? `.btn-primary,header a.cta-btn{background-color:${btnBgColor} !important;}` : '',
    ...btnRules,
  ].filter(Boolean).join('\n')

  const allSectionRules = buildSectionOnlyCSS(settings)
  return `:root {\n${goldVars}${fontVars ? '\n' + fontVars : ''}\n}${overrideRules ? '\n' + overrideRules : ''}${allSectionRules ? '\n' + allSectionRules : ''}`
}

/**
 * Generates ONLY the section-specific CSS rules.
 * Used both server-side (in buildAppearanceStyles) and client-side (live preview in editor).
 */
export function buildSectionOnlyCSS(settings: Record<string, string>): string {
  const rules: string[] = []
  for (const name of SECTION_NAMES) {
    const sel = SECTION_SELECTORS[name]
    const g = (k: string) => settings[`section_${name}_${k}`] || ''

    // ── Background ────────────────────────────────────────────────────────────
    if (g('bg')) {
      rules.push(`${sel}{background-color:${g('bg')} !important;}`)
      // Also target absolute overlay divs used as section bg (About, Contact pattern)
      rules.push(`${sel} > div.absolute.inset-0:not([class*="pointer-events-none"]):not([class*="gradient"]):not([class*="blur"]){background-color:${g('bg')} !important;}`)
    }

    // ── Heading color ─────────────────────────────────────────────────────────
    // Covers: h1-h6, .font-display divs/spans (stat values, initials, step numbers)
    // + ALL children of these elements (em, span with text-gold-gradient, etc.)
    if (g('heading_color')) {
      const hc = g('heading_color')
      // Standard headings + .font-display elements
      rules.push(
        `${sel} h1,${sel} h2,${sel} h3,${sel} h4,${sel} h5,${sel} h6,` +
        `${sel} .font-display{` +
        `color:${hc} !important;-webkit-text-fill-color:${hc} !important;background-image:none !important;}`,
      )
      // All descendants of headings and .font-display (catches em, span.text-gold-gradient, etc.)
      rules.push(
        `${sel} h1 *,${sel} h2 *,${sel} h3 *,${sel} h4 *,${sel} h5 *,${sel} h6 *,` +
        `${sel} .font-display *{` +
        `color:${hc} !important;-webkit-text-fill-color:${hc} !important;background-image:none !important;}`,
      )
    }

    // ── Heading typography ────────────────────────────────────────────────────
    if (g('heading_size'))      rules.push(`${sel} h1,${sel} h2,${sel} h3{font-size:${g('heading_size')} !important;}`)
    if (g('heading_font'))      rules.push(`${sel} h1,${sel} h2,${sel} h3,${sel} h4,${sel} .font-display{font-family:"${g('heading_font')}",serif !important;}`)
    if (g('heading_weight'))    rules.push(`${sel} h1,${sel} h2,${sel} h3,${sel} h4,${sel} .font-display{font-weight:${g('heading_weight')} !important;}`)
    if (g('heading_align'))     rules.push(`${sel} h1,${sel} h2,${sel} h3{text-align:${g('heading_align')} !important;}`)
    if (g('heading_lh'))        rules.push(`${sel} h1,${sel} h2,${sel} h3{line-height:${g('heading_lh')} !important;}`)
    if (g('heading_ls'))        rules.push(`${sel} h1,${sel} h2{letter-spacing:${g('heading_ls')} !important;}`)
    if (g('heading_transform')) rules.push(`${sel} h1,${sel} h2,${sel} h3{text-transform:${g('heading_transform')} !important;}`)

    // ── Body color ────────────────────────────────────────────────────────────
    // Covers: p, li, inline elements (span, em, strong, small, b)
    //         + div used as text (detected by Tailwind text-size classes: text-xs, text-sm, etc.)
    //         + links (not buttons)
    if (g('body_color')) {
      const bc = g('body_color')
      // Standard text-level elements
      rules.push(
        `${sel} p,${sel} li,${sel} span,${sel} em,${sel} strong,${sel} small,${sel} b{` +
        `color:${bc} !important;-webkit-text-fill-color:${bc} !important;}`,
      )
      // Divs used as text (those with Tailwind text-size utility classes)
      rules.push(
        `${sel} div[class*="text-xs"],${sel} div[class*="text-sm"],` +
        `${sel} div[class*="text-base"],${sel} div[class*="text-lg"],` +
        `${sel} div[class*="text-xl"],${sel} div[class*="text-2xl"],` +
        `${sel} div[class*="text-3xl"],${sel} div[class*="text-4xl"],` +
        `${sel} div[class*="text-5xl"],${sel} div[class*="text-6xl"],${sel} div[class*="text-7xl"]{` +
        `color:${bc} !important;-webkit-text-fill-color:${bc} !important;}`,
      )
      // Links within section (excluding buttons/CTAs)
      rules.push(
        `${sel} a:not([class*="btn"]):not([class*="cta"]){` +
        `color:${bc} !important;-webkit-text-fill-color:${bc} !important;}`,
      )
    }

    // ── Body typography ───────────────────────────────────────────────────────
    if (g('body_size'))  rules.push(`${sel} p,${sel} li,${sel} span{font-size:${g('body_size')} !important;}`)
    if (g('body_font'))  rules.push(`${sel} p,${sel} li,${sel} span{font-family:"${g('body_font')}",sans-serif !important;}`)
    if (g('body_lh'))    rules.push(`${sel} p,${sel} li{line-height:${g('body_lh')} !important;}`)
    if (g('body_align')) rules.push(`${sel} p,${sel} li{text-align:${g('body_align')} !important;}`)

    // ── Labels / badges ───────────────────────────────────────────────────────
    if (g('label_color')) {
      const lc = g('label_color')
      rules.push(
        `${sel} .luxury-badge,${sel} [class*="badge"],${sel} [class*="label"]{` +
        `color:${lc} !important;-webkit-text-fill-color:${lc} !important;background-image:none !important;}`,
      )
    }
    if (g('label_size')) rules.push(`${sel} .luxury-badge{font-size:${g('label_size')} !important;}`)

    // ── Padding ───────────────────────────────────────────────────────────────
    if (g('py')) rules.push(`${sel}{padding-top:${g('py')} !important;padding-bottom:${g('py')} !important;}`)
  }
  return rules.join('\n')
}

export function buildGoogleFontsUrl(settings: Record<string, string>): string {
  const fontDisplay = settings.appearance_font_display || ''
  const fontBody = settings.appearance_font_body || ''

  // Collect all unique fonts: global + section-specific
  const allFonts = new Set<string>()
  if (fontDisplay) allFonts.add(fontDisplay)
  if (fontBody) allFonts.add(fontBody)

  // Section-specific fonts
  for (const name of SECTION_NAMES) {
    const hFont = settings[`section_${name}_heading_font`]
    const bFont = settings[`section_${name}_body_font`]
    if (hFont) allFonts.add(hFont)
    if (bFont) allFonts.add(bFont)
  }

  const families: string[] = []
  allFonts.forEach(font => {
    families.push(`family=${encodeURIComponent(font)}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400`)
  })

  return families.length > 0
    ? `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`
    : ''
}
