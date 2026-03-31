'use client'

import { useState, useEffect } from 'react'
import { Save, RefreshCw, Palette, Type, X, ChevronDown, Bold, Italic, Eye } from 'lucide-react'

const SECTIONS = ['hero', 'about', 'services', 'whyus', 'process', 'stats', 'testimonials', 'faq', 'contact', 'footer']

const SECTION_LABELS: Record<string, string> = {
  hero: '🎯 Hero', about: '👤 À propos', services: '⚡ Services', whyus: '🏆 Pourquoi nous',
  process: '🔄 Processus', stats: '📊 Statistiques', testimonials: '💬 Témoignages',
  faq: '❓ FAQ', contact: '📩 Contact', footer: '🔻 Footer',
}

// Default seed content for sections that have no DB entries yet
const SECTION_SEEDS: Record<string, Array<{ key: string; valueFr: string; valueEn: string; type?: string }>> = {
  footer: [
    { key: 'footer_description', valueFr: 'La conciergerie de luxe qui transforme votre bien en actif rentable à Marrakech.', valueEn: 'The luxury concierge that transforms your property into a profitable asset in Marrakech.' },
    { key: 'footer_tagline',     valueFr: 'Fait avec excellence à Marrakech', valueEn: 'Made with excellence in Marrakech' },
    { key: 'footer_rights',      valueFr: 'Tous droits réservés.', valueEn: 'All rights reserved.' },
    { key: 'footer_service_1',   valueFr: 'Gestion Locative',       valueEn: 'Property Management' },
    { key: 'footer_service_2',   valueFr: 'Conciergerie 24/7',      valueEn: 'Concierge 24/7' },
    { key: 'footer_service_3',   valueFr: 'Optimisation Revenus',   valueEn: 'Revenue Optimization' },
    { key: 'footer_service_4',   valueFr: 'Maintenance',            valueEn: 'Maintenance' },
    { key: 'footer_service_5',   valueFr: 'Photographie',           valueEn: 'Photography' },
    { key: 'footer_services_label', valueFr: 'Services',            valueEn: 'Services' },
  ],
}

const ALL_FONTS = [
  { value: '', label: 'Par défaut' },
  // Serif / Display
  { value: 'Cormorant Garamond', label: 'Cormorant Garamond', category: 'Serif' },
  { value: 'Playfair Display',   label: 'Playfair Display',   category: 'Serif' },
  { value: 'EB Garamond',        label: 'EB Garamond',        category: 'Serif' },
  { value: 'Lora',               label: 'Lora',               category: 'Serif' },
  { value: 'Merriweather',       label: 'Merriweather',       category: 'Serif' },
  { value: 'Libre Baskerville',  label: 'Libre Baskerville',  category: 'Serif' },
  { value: 'Cinzel',             label: 'Cinzel',             category: 'Serif' },
  { value: 'Josefin Slab',       label: 'Josefin Slab',       category: 'Serif' },
  // Sans-serif
  { value: 'Inter',              label: 'Inter',              category: 'Sans' },
  { value: 'Poppins',            label: 'Poppins',            category: 'Sans' },
  { value: 'Montserrat',         label: 'Montserrat',         category: 'Sans' },
  { value: 'Outfit',             label: 'Outfit',             category: 'Sans' },
  { value: 'DM Sans',            label: 'DM Sans',            category: 'Sans' },
  { value: 'Raleway',            label: 'Raleway',            category: 'Sans' },
  { value: 'Plus Jakarta Sans',  label: 'Plus Jakarta Sans',  category: 'Sans' },
  { value: 'Nunito',             label: 'Nunito',             category: 'Sans' },
]

const FONT_SIZES = ['12px','13px','14px','15px','16px','18px','20px','24px','28px','32px','36px','42px','48px','56px','64px','72px']

type ContentChange = {
  valueFr: string
  valueEn: string
  color?: string
  font?: string
  fontSize?: string
  fontWeight?: string
}

// ── Google Fonts dynamic loader ───────────────────────────────────────────────
const loadedFonts = new Set<string>()
function loadFont(font: string) {
  if (!font || loadedFonts.has(font)) return
  loadedFonts.add(font)
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@300;400;500;600;700&display=swap`
  document.head.appendChild(link)
}

// ── Style Panel ───────────────────────────────────────────────────────────────
function StylePanel({
  contentKey, data, onChange,
}: {
  contentKey: string
  data: Partial<ContentChange>
  onChange: (key: string, field: keyof ContentChange, val: string) => void
}) {
  const color      = data.color      || ''
  const font       = data.font       || ''
  const fontSize   = data.fontSize   || ''
  const fontWeight = data.fontWeight || ''
  const isBold     = fontWeight === 'bold'
  const previewText = data.valueFr || 'Aperçu du texte'

  // Load font when selected
  if (font) loadFont(font)

  const previewStyle: React.CSSProperties = {
    color:      color      || undefined,
    fontFamily: font       ? `"${font}", sans-serif` : undefined,
    fontSize:   fontSize   || undefined,
    fontWeight: (fontWeight as any) || undefined,
  }

  return (
    <div className="mt-3 pt-3 border-t border-obsidian-100 dark:border-white/5 space-y-4">
      {/* Live preview */}
      <div className="bg-obsidian-50 dark:bg-obsidian-950 rounded-xl px-4 py-3 flex items-center gap-2">
        <Eye size={12} className="text-obsidian-400 flex-shrink-0" />
        <p className="text-sm leading-relaxed line-clamp-2" style={previewStyle}>
          {previewText}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Color */}
        <div>
          <label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-obsidian-400 mb-2">
            <Palette size={10} /> Couleur
          </label>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="color"
                value={color || '#000000'}
                onChange={e => onChange(contentKey, 'color', e.target.value)}
                className="w-9 h-9 rounded-lg border border-obsidian-200 dark:border-white/10 cursor-pointer bg-transparent p-0.5"
              />
            </div>
            <input
              type="text"
              value={color}
              onChange={e => onChange(contentKey, 'color', e.target.value)}
              placeholder="#000000"
              maxLength={9}
              className="flex-1 min-w-0 px-2 py-1.5 bg-obsidian-50 dark:bg-obsidian-950 border border-obsidian-100 dark:border-white/10 rounded-lg text-xs font-mono text-obsidian-700 dark:text-obsidian-300 focus:outline-none focus:border-gold-500 placeholder:text-obsidian-300"
            />
            {color && (
              <button onClick={() => onChange(contentKey, 'color', '')}
                className="text-obsidian-300 hover:text-red-500 transition-colors flex-shrink-0">
                <X size={12} />
              </button>
            )}
          </div>
          {/* Quick color presets */}
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {['#FFFFFF','#000000','#d4922b','#1b3a5c','#6b7280','#ef4444','#3b82f6','#10b981'].map(c => (
              <button key={c} onClick={() => onChange(contentKey, 'color', c)}
                title={c}
                className="w-5 h-5 rounded-full border-2 transition-transform hover:scale-110"
                style={{ backgroundColor: c, borderColor: color === c ? '#d4922b' : 'transparent' }} />
            ))}
          </div>
        </div>

        {/* Font family */}
        <div>
          <label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-obsidian-400 mb-2">
            <Type size={10} /> Police
          </label>
          <div className="relative">
            <select
              value={font}
              onChange={e => { onChange(contentKey, 'font', e.target.value); loadFont(e.target.value) }}
              className="w-full px-3 py-1.5 bg-obsidian-50 dark:bg-obsidian-950 border border-obsidian-100 dark:border-white/10 rounded-lg text-xs text-obsidian-700 dark:text-obsidian-300 focus:outline-none focus:border-gold-500 appearance-none pr-7"
            >
              {ALL_FONTS.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
            <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-obsidian-400 pointer-events-none" />
          </div>
          {/* Font preview */}
          {font && (
            <p className="mt-1.5 text-xs text-obsidian-500 truncate" style={{ fontFamily: `"${font}", sans-serif` }}>
              Aa — {font}
            </p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Font size */}
        <div>
          <label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-obsidian-400 mb-2">
            Taille
          </label>
          <div className="flex gap-1.5 items-center">
            <div className="relative flex-1">
              <select
                value={fontSize}
                onChange={e => onChange(contentKey, 'fontSize', e.target.value)}
                className="w-full px-3 py-1.5 bg-obsidian-50 dark:bg-obsidian-950 border border-obsidian-100 dark:border-white/10 rounded-lg text-xs text-obsidian-700 dark:text-obsidian-300 focus:outline-none focus:border-gold-500 appearance-none pr-7"
              >
                <option value="">Par défaut</option>
                {FONT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-obsidian-400 pointer-events-none" />
            </div>
            <input
              type="text"
              value={fontSize}
              onChange={e => onChange(contentKey, 'fontSize', e.target.value)}
              placeholder="libre"
              className="w-20 px-2 py-1.5 bg-obsidian-50 dark:bg-obsidian-950 border border-obsidian-100 dark:border-white/10 rounded-lg text-xs font-mono text-obsidian-700 dark:text-obsidian-300 focus:outline-none focus:border-gold-500 placeholder:text-obsidian-300"
            />
          </div>
        </div>

        {/* Font weight */}
        <div>
          <label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-obsidian-400 mb-2">
            Style
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onChange(contentKey, 'fontWeight', isBold ? '' : 'bold')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border-2 transition-all font-bold ${
                isBold
                  ? 'border-gold-500 bg-gold-500/10 text-gold-600 dark:text-gold-400'
                  : 'border-obsidian-100 dark:border-white/10 text-obsidian-500 hover:border-obsidian-300'
              }`}
            >
              <Bold size={12} /> Gras
            </button>
            {(color || font || fontSize || fontWeight) && (
              <button
                onClick={() => {
                  onChange(contentKey, 'color', '')
                  onChange(contentKey, 'font', '')
                  onChange(contentKey, 'fontSize', '')
                  onChange(contentKey, 'fontWeight', '')
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-dashed border-obsidian-200 dark:border-white/10 text-obsidian-400 hover:text-red-500 hover:border-red-300 transition-all"
              >
                <RefreshCw size={11} /> Réinitialiser
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Content Card ──────────────────────────────────────────────────────────────
function ContentCard({
  content, changes, onTextChange, onStyleChange,
}: {
  content: any
  changes: Record<string, ContentChange>
  onTextChange: (key: string, field: 'valueFr' | 'valueEn', val: string) => void
  onStyleChange: (key: string, field: keyof ContentChange, val: string) => void
}) {
  const [styleOpen, setStyleOpen] = useState(false)
  const key = content.key
  const ch = changes[key]
  const isChanged = !!ch

  const hasStyle = !!(content.color || content.font || content.fontSize || content.fontWeight)
  const hasPendingStyle = !!(ch?.color !== undefined || ch?.font !== undefined || ch?.fontSize !== undefined || ch?.fontWeight !== undefined)

  const getCurrentStyle = () => ({
    color:      ch?.color      ?? content.color      ?? '',
    font:       ch?.font       ?? content.font       ?? '',
    fontSize:   ch?.fontSize   ?? content.fontSize   ?? '',
    fontWeight: ch?.fontWeight ?? content.fontWeight ?? '',
    valueFr:    ch?.valueFr    ?? content.valueFr    ?? '',
    valueEn:    ch?.valueEn    ?? content.valueEn    ?? '',
  })

  const getVal = (field: 'valueFr' | 'valueEn') => ch?.[field] ?? content[field] ?? ''
  const isLong = (content.valueFr?.length > 100 || content.valueEn?.length > 100)

  return (
    <div className={`bg-white dark:bg-obsidian-900 rounded-2xl border-2 transition-all ${
      isChanged ? 'border-gold-200 dark:border-gold-900/40' : 'border-gray-100 dark:border-gray-800'
    } overflow-hidden`}>
      {/* Card header */}
      <div className="flex items-center gap-2 px-5 pt-4 pb-2">
        <code className="text-xs text-gold-600 dark:text-gold-400 bg-gold-50 dark:bg-gold-900/20 px-2 py-0.5 rounded-md font-mono">
          {key}
        </code>
        {isChanged && <span className="text-[10px] text-orange-500 font-medium">● Modifié</span>}
        {(hasStyle || hasPendingStyle) && (
          <span className="text-[10px] text-purple-500 font-medium flex items-center gap-0.5">
            <Palette size={9} /> Stylé
          </span>
        )}
        <div className="ml-auto flex items-center gap-1">
          {/* Style toggle */}
          <button
            onClick={() => setStyleOpen(!styleOpen)}
            className={`flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-lg border transition-all ${
              styleOpen
                ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/40 text-purple-600 dark:text-purple-400'
                : 'border-obsidian-100 dark:border-white/10 text-obsidian-400 hover:text-purple-500 hover:border-purple-200'
            }`}
          >
            <Palette size={10} />
            Style
            <ChevronDown size={9} className={`transition-transform ${styleOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      <div className="px-5 pb-5">
        {/* Text fields */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">🇫🇷 Français</label>
            {isLong ? (
              <textarea
                value={getVal('valueFr')}
                onChange={e => onTextChange(key, 'valueFr', e.target.value)}
                rows={3}
                className="w-full bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-gold-400 transition-colors"
              />
            ) : (
              <input
                type="text"
                value={getVal('valueFr')}
                onChange={e => onTextChange(key, 'valueFr', e.target.value)}
                className="w-full bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gold-400 transition-colors"
              />
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">🇬🇧 English</label>
            {isLong ? (
              <textarea
                value={getVal('valueEn')}
                onChange={e => onTextChange(key, 'valueEn', e.target.value)}
                rows={3}
                className="w-full bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-gold-400 transition-colors"
              />
            ) : (
              <input
                type="text"
                value={getVal('valueEn')}
                onChange={e => onTextChange(key, 'valueEn', e.target.value)}
                className="w-full bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gold-400 transition-colors"
              />
            )}
          </div>
        </div>

        {/* Style panel (collapsible) */}
        {styleOpen && (
          <StylePanel
            contentKey={key}
            data={getCurrentStyle()}
            onChange={onStyleChange}
          />
        )}
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ContentPage() {
  const [contents, setContents] = useState<any[]>([])
  const [activeSection, setActiveSection] = useState('hero')
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [changes, setChanges] = useState<Record<string, ContentChange>>({})
  const [loading, setLoading] = useState(false)

  const fetchData = async (section?: string) => {
    const sec = section ?? activeSection
    setLoading(true)
    try {
      const res = await fetch(`/api/content?section=${sec}`)
      const data = await res.json()
      setContents(Array.isArray(data) ? data : [])
      setChanges({})
    } catch {
      setContents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData(activeSection) }, [activeSection])

  const handleTextChange = (key: string, field: 'valueFr' | 'valueEn', value: string) => {
    setChanges(prev => {
      const existing = prev[key] || {
        valueFr: contents.find(c => c.key === key)?.valueFr || '',
        valueEn: contents.find(c => c.key === key)?.valueEn || '',
      }
      return { ...prev, [key]: { ...existing, [field]: value } }
    })
  }

  const handleStyleChange = (key: string, field: keyof ContentChange, value: string) => {
    setChanges(prev => {
      const existing = prev[key] || {
        valueFr: contents.find(c => c.key === key)?.valueFr || '',
        valueEn: contents.find(c => c.key === key)?.valueEn || '',
      }
      return { ...prev, [key]: { ...existing, [field]: value } }
    })
  }

  const handleSave = async () => {
    if (Object.keys(changes).length === 0) return
    setIsSaving(true)
    try {
      const updates = Object.entries(changes).map(([key, vals]) => {
        const original = contents.find((c: any) => c.key === key) || {}
        return {
          key,
          section:    (original as any).section || activeSection,
          valueFr:    vals.valueFr    ?? (original as any).valueFr    ?? '',
          valueEn:    vals.valueEn    ?? (original as any).valueEn    ?? '',
          color:      vals.color      !== undefined ? vals.color      : ((original as any).color      ?? ''),
          font:       vals.font       !== undefined ? vals.font       : ((original as any).font       ?? ''),
          fontSize:   vals.fontSize   !== undefined ? vals.fontSize   : ((original as any).fontSize   ?? ''),
          fontWeight: vals.fontWeight !== undefined ? vals.fontWeight : ((original as any).fontWeight ?? ''),
        }
      })
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      })
      if (res.ok) {
        setToast('Contenu sauvegardé ✓')
        setTimeout(() => setToast(''), 3000)
        await fetchData(activeSection)
      } else {
        setToast('⚠ Erreur lors de la sauvegarde')
        setTimeout(() => setToast(''), 4000)
      }
    } catch {
      setToast('⚠ Erreur réseau')
      setTimeout(() => setToast(''), 4000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSeed = async () => {
    const seeds = SECTION_SEEDS[activeSection]
    if (!seeds) return
    try {
      setLoading(true)
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updates: seeds.map(s => ({
            key:     s.key,
            valueFr: s.valueFr,
            valueEn: s.valueEn,
            section: activeSection,
            type:    s.type || 'text',
          })),
        }),
      })
      if (!res.ok) throw new Error('Seed failed')
      await fetchData(activeSection)
    } catch {
      setLoading(false)
    }
  }

  const changeCount = Object.keys(changes).length

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-obsidian-950 dark:text-white">Contenu du site</h1>
          <p className="text-sm text-gray-500 mt-1">Textes, couleurs et polices par section</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || changeCount === 0}
          className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors"
        >
          <Save size={14} />
          {isSaving ? 'Sauvegarde...' : changeCount > 0 ? `Sauvegarder (${changeCount})` : 'Sauvegarder'}
        </button>
      </div>

      {/* Section tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {SECTIONS.map(section => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
              activeSection === section
                ? 'bg-obsidian-950 dark:bg-white text-white dark:text-obsidian-950'
                : 'bg-white dark:bg-obsidian-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-obsidian-800'
            }`}
          >
            {SECTION_LABELS[section]}
          </button>
        ))}
      </div>

      {/* Hint */}
      <div className="flex items-center gap-2 mb-4 px-4 py-2.5 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/20 rounded-xl text-xs text-purple-600 dark:text-purple-400">
        <Palette size={13} />
        Cliquez sur <strong className="mx-1">Style</strong> à droite de chaque texte pour modifier sa couleur, police, taille et graisse.
      </div>

      {/* Content items */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : contents.length === 0 ? (
          <div className="p-10 text-center bg-white dark:bg-obsidian-900 rounded-2xl border border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-400 mb-4">Aucun contenu pour cette section.</p>
            {SECTION_SEEDS[activeSection] ? (
              <div className="flex flex-col items-center gap-3">
                <p className="text-xs text-gray-400 max-w-xs">
                  Cliquez ci-dessous pour créer le contenu par défaut de cette section. Vous pourrez ensuite le modifier.
                </p>
                <button
                  onClick={handleSeed}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 hover:bg-gold-600 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  ✦ Créer le contenu par défaut
                </button>
              </div>
            ) : (
              <button onClick={() => fetchData(activeSection)} className="mt-2 text-gold-500 hover:underline flex items-center gap-1 mx-auto text-sm">
                <RefreshCw size={12} /> Actualiser
              </button>
            )}
          </div>
        ) : (
          contents.map(content => (
            <ContentCard
              key={content.id}
              content={content}
              changes={changes}
              onTextChange={handleTextChange}
              onStyleChange={handleStyleChange}
            />
          ))
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-obsidian-900 text-white px-5 py-3 rounded-xl text-sm shadow-2xl z-50 flex items-center gap-2">
          <span className="text-green-400">✓</span> {toast}
        </div>
      )}
    </div>
  )
}
