'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, Check, Loader2, Eye, EyeOff, ChevronUp, ChevronDown, ListOrdered, Palette } from 'lucide-react'

type Tab = 'links' | 'style'

const DEFAULT_IDS = ['services', 'about', 'process', 'testimonials', 'faq']

const DEFAULT_LABELS: Record<string, { fr: string; en: string }> = {
  services:     { fr: 'Services',    en: 'Services' },
  about:        { fr: 'À propos',    en: 'About' },
  process:      { fr: 'Processus',   en: 'Process' },
  testimonials: { fr: 'Témoignages', en: 'Testimonials' },
  faq:          { fr: 'FAQ',         en: 'FAQ' },
}

interface NavItem {
  id: string
  labelFr: string
  labelEn: string
  visible: boolean
}

interface StyleSettings {
  nav_link_color: string
  nav_link_hover_color: string
  nav_font_size: string
  nav_font_weight: string
  nav_letter_spacing: string
  nav_cta_bg: string
  nav_cta_text_color: string
  nav_header_bg: string
}

const DEFAULT_STYLE: StyleSettings = {
  nav_link_color: '',
  nav_link_hover_color: '',
  nav_font_size: '',
  nav_font_weight: '',
  nav_letter_spacing: '',
  nav_cta_bg: '',
  nav_cta_text_color: '',
  nav_header_bg: '',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ColorField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500 dark:text-obsidian-400 mb-1.5">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || '#000000'}
          onChange={e => onChange(e.target.value)}
          className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer p-0.5 bg-white dark:bg-obsidian-950 flex-shrink-0"
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder || '#000000'}
          className="flex-1 min-w-0 bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gold-400 font-mono transition-colors"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            title="Réinitialiser"
            className="flex-shrink-0 text-gray-400 hover:text-red-500 text-base px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-obsidian-800 transition-colors"
          >
            ↺
          </button>
        )}
      </div>
    </div>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500 dark:text-obsidian-400 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gold-400 transition-colors"
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminNavPage() {
  const [tab, setTab] = useState<Tab>('links')
  const [items, setItems] = useState<NavItem[]>(
    DEFAULT_IDS.map(id => ({ id, labelFr: '', labelEn: '', visible: true }))
  )
  const [style, setStyle] = useState<StyleSettings>(DEFAULT_STYLE)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [toastError, setToastError] = useState('')
  // Track which style keys were explicitly changed by the user
  const changedStyleKeys = useRef<Set<string>>(new Set())

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }
  const showError = (msg: string) => {
    setToastError(msg)
    setTimeout(() => setToastError(''), 4000)
  }

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/settings?category=nav')
        if (!res.ok) return
        const data: Array<{ key: string; value: string }> = await res.json()
        if (!Array.isArray(data)) return

        const map: Record<string, string> = {}
        data.forEach(s => { map[s.key] = s.value })

        // Reconstruct order & visibility
        let order: string[] = DEFAULT_IDS
        try { if (map.nav_order) order = JSON.parse(map.nav_order) } catch {}
        let hidden: string[] = []
        try { if (map.nav_hidden) hidden = JSON.parse(map.nav_hidden) } catch {}

        const reconstructed: NavItem[] = order.map(id => ({
          id,
          labelFr: map[`nav_label_${id}_fr`] || '',
          labelEn: map[`nav_label_${id}_en`] || '',
          visible: !hidden.includes(id),
        }))
        // Add any DEFAULT_IDS not yet in the list
        DEFAULT_IDS.forEach(id => {
          if (!reconstructed.find(i => i.id === id)) {
            reconstructed.push({ id, labelFr: '', labelEn: '', visible: true })
          }
        })
        setItems(reconstructed)

        // Load style settings
        setStyle({
          nav_link_color:       map.nav_link_color       || '',
          nav_link_hover_color: map.nav_link_hover_color || '',
          nav_font_size:        map.nav_font_size        || '',
          nav_font_weight:      map.nav_font_weight      || '',
          nav_letter_spacing:   map.nav_letter_spacing   || '',
          nav_cta_bg:           map.nav_cta_bg           || '',
          nav_cta_text_color:   map.nav_cta_text_color   || '',
          nav_header_bg:        map.nav_header_bg        || '',
        })
        changedStyleKeys.current = new Set() // reset on load
      } catch {
        // keep defaults
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  // Helper to update a style field and mark it as changed
  const updateStyle = (key: keyof StyleSettings, value: string) => {
    setStyle(s => ({ ...s, [key]: value }))
    changedStyleKeys.current.add(key)
  }

  // ── Reorder helpers ────────────────────────────────────────────────────────

  const moveUp = (i: number) => {
    if (i === 0) return
    setItems(prev => {
      const arr = [...prev]
      ;[arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]
      return arr
    })
  }

  const moveDown = (i: number) => {
    setItems(prev => {
      if (i === prev.length - 1) return prev
      const arr = [...prev]
      ;[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]
      return arr
    })
  }

  const toggleVisible = (i: number) => {
    setItems(prev =>
      prev.map((item, idx) =>
        idx === i ? { ...item, visible: !item.visible } : item
      )
    )
  }

  const updateLabel = (i: number, lang: 'fr' | 'en', value: string) => {
    setItems(prev =>
      prev.map((item, idx) =>
        idx === i
          ? { ...item, [lang === 'fr' ? 'labelFr' : 'labelEn']: value }
          : item
      )
    )
  }

  // ── Save ───────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const updates: Array<{ key: string; value: string; category: string }> = [
        { key: 'nav_order',  value: JSON.stringify(items.map(i => i.id)),                        category: 'nav' },
        { key: 'nav_hidden', value: JSON.stringify(items.filter(i => !i.visible).map(i => i.id)), category: 'nav' },
        ...items.flatMap(item => [
          { key: `nav_label_${item.id}_fr`, value: item.labelFr, category: 'nav' },
          { key: `nav_label_${item.id}_en`, value: item.labelEn, category: 'nav' },
        ]),
        // Only send style keys that the user explicitly changed
        ...Object.entries(style)
          .filter(([key]) => changedStyleKeys.current.has(key))
          .map(([key, value]) => ({ key, value, category: 'nav' })),
      ]

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (res.ok) {
        changedStyleKeys.current = new Set() // reset after successful save
        showToast('Navigation sauvegardée ✓')
      } else {
        const data = await res.json().catch(() => ({}))
        showError(data.error || 'Erreur lors de la sauvegarde')
      }
    } catch {
      showError('Erreur réseau — impossible de sauvegarder')
    } finally {
      setIsSaving(false)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-gold-500" size={28} />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-light text-obsidian-950 dark:text-white">
            Menu &amp; Navigation
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Ordre, visibilité, étiquettes et style du menu header
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2.5 bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors"
        >
          {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {isSaving ? 'Enregistrement...' : 'Sauvegarder'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-obsidian-900 p-1 rounded-xl w-fit">
        {([
          { id: 'links', label: 'Liens',  Icon: ListOrdered },
          { id: 'style', label: 'Style',  Icon: Palette },
        ] as const).map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === id
                ? 'bg-white dark:bg-obsidian-800 text-obsidian-950 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-obsidian-700 dark:hover:text-white'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab: Liens ─────────────────────────────────────────────────────── */}
      {tab === 'links' && (
        <div className="space-y-3">
          <p className="text-xs text-gray-400 mb-2">
            Utilisez les flèches pour changer l&apos;ordre. Laissez l&apos;étiquette vide pour garder le texte par défaut.
          </p>
          {items.map((item, i) => (
            <div
              key={item.id}
              className={`bg-white dark:bg-obsidian-900 rounded-2xl border transition-all p-4 ${
                item.visible
                  ? 'border-gray-100 dark:border-gray-800'
                  : 'border-dashed border-gray-200 dark:border-gray-700 opacity-55'
              }`}
            >
              {/* Top row */}
              <div className="flex items-center gap-3 mb-3">
                {/* Up / Down arrows */}
                <div className="flex flex-col gap-0.5 flex-shrink-0">
                  <button
                    onClick={() => moveUp(i)}
                    disabled={i === 0}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-obsidian-800 disabled:opacity-25 transition-colors"
                    title="Monter"
                  >
                    <ChevronUp size={13} />
                  </button>
                  <button
                    onClick={() => moveDown(i)}
                    disabled={i === items.length - 1}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-obsidian-800 disabled:opacity-25 transition-colors"
                    title="Descendre"
                  >
                    <ChevronDown size={13} />
                  </button>
                </div>

                {/* Position badge + name */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-gray-400 bg-gray-100 dark:bg-obsidian-800 px-1.5 py-0.5 rounded">
                      #{i + 1}
                    </span>
                    <span className="text-sm font-semibold text-obsidian-950 dark:text-white">
                      {DEFAULT_LABELS[item.id]?.fr ?? item.id}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">→ #{item.id}</span>
                  </div>
                </div>

                {/* Visibility toggle */}
                <button
                  onClick={() => toggleVisible(i)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    item.visible
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                      : 'bg-gray-100 dark:bg-obsidian-800 text-gray-400 hover:bg-gray-200 dark:hover:bg-obsidian-700'
                  }`}
                >
                  {item.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                  {item.visible ? 'Visible' : 'Masqué'}
                </button>
              </div>

              {/* Label overrides */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">🇫🇷 Étiquette FR</label>
                  <input
                    type="text"
                    value={item.labelFr}
                    onChange={e => updateLabel(i, 'fr', e.target.value)}
                    placeholder={DEFAULT_LABELS[item.id]?.fr ?? item.id}
                    className="w-full bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">🇬🇧 Label EN</label>
                  <input
                    type="text"
                    value={item.labelEn}
                    onChange={e => updateLabel(i, 'en', e.target.value)}
                    placeholder={DEFAULT_LABELS[item.id]?.en ?? item.id}
                    className="w-full bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Tab: Style ─────────────────────────────────────────────────────── */}
      {tab === 'style' && (
        <div className="space-y-4">
          {/* Nav links */}
          <div className="bg-white dark:bg-obsidian-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <h2 className="text-sm font-semibold text-obsidian-950 dark:text-white mb-1">
              Liens de navigation
            </h2>
            <p className="text-xs text-gray-400 mb-4">Style des éléments du menu horizontal</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <ColorField
                label="Couleur des liens"
                value={style.nav_link_color}
                onChange={v => updateStyle('nav_link_color', v)}
                placeholder="#4a4a4a"
              />
              <ColorField
                label="Couleur au survol (hover)"
                value={style.nav_link_hover_color}
                onChange={v => updateStyle('nav_link_hover_color', v)}
                placeholder="#000000"
              />
              <SelectField
                label="Taille de police"
                value={style.nav_font_size}
                onChange={v => updateStyle('nav_font_size', v)}
                options={[
                  { value: '',     label: 'Défaut (14px)' },
                  { value: '11px', label: '11px' },
                  { value: '12px', label: '12px' },
                  { value: '13px', label: '13px' },
                  { value: '14px', label: '14px (défaut)' },
                  { value: '15px', label: '15px' },
                  { value: '16px', label: '16px' },
                  { value: '18px', label: '18px' },
                ]}
              />
              <SelectField
                label="Graisse (font-weight)"
                value={style.nav_font_weight}
                onChange={v => updateStyle('nav_font_weight', v)}
                options={[
                  { value: '',    label: 'Défaut' },
                  { value: '300', label: 'Light (300)' },
                  { value: '400', label: 'Normal (400)' },
                  { value: '500', label: 'Medium (500)' },
                  { value: '600', label: 'Semi-bold (600)' },
                  { value: '700', label: 'Bold (700)' },
                ]}
              />
              <SelectField
                label="Espacement des lettres"
                value={style.nav_letter_spacing}
                onChange={v => updateStyle('nav_letter_spacing', v)}
                options={[
                  { value: '',       label: 'Défaut' },
                  { value: '-0.02em', label: 'Serré (−0.02em)' },
                  { value: 'normal', label: 'Normal' },
                  { value: '0.05em', label: 'Léger (0.05em)' },
                  { value: '0.1em',  label: 'Large (0.1em)' },
                  { value: '0.15em', label: 'Très large (0.15em)' },
                ]}
              />
            </div>
          </div>

          {/* CTA button */}
          <div className="bg-white dark:bg-obsidian-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <h2 className="text-sm font-semibold text-obsidian-950 dark:text-white mb-1">
              Bouton CTA (header)
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Bouton d&apos;action en haut à droite du header. Le texte se configure dans Paramètres &gt; Boutons.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <ColorField
                label="Couleur de fond"
                value={style.nav_cta_bg}
                onChange={v => updateStyle('nav_cta_bg', v)}
                placeholder="#0a0a0a"
              />
              <ColorField
                label="Couleur du texte"
                value={style.nav_cta_text_color}
                onChange={v => updateStyle('nav_cta_text_color', v)}
                placeholder="#ffffff"
              />
            </div>
          </div>

          {/* Header background */}
          <div className="bg-white dark:bg-obsidian-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <h2 className="text-sm font-semibold text-obsidian-950 dark:text-white mb-1">
              Fond du header
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Couleur de fond du header après que l&apos;utilisateur commence à défiler (mode clair). Au départ, le header est transparent.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <ColorField
                label="Fond après scroll (mode clair)"
                value={style.nav_header_bg}
                onChange={v => updateStyle('nav_header_bg', v)}
                placeholder="#ffffff"
              />
            </div>
          </div>

          {/* Live preview hint */}
          <div className="flex items-start gap-3 px-4 py-3.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/40 rounded-xl text-sm text-blue-700 dark:text-blue-300">
            <span className="flex-shrink-0 mt-0.5">💡</span>
            <p>
              Laissez un champ vide pour conserver le style par défaut du thème. Les changements s&apos;appliquent immédiatement après sauvegarde.
            </p>
          </div>
        </div>
      )}

      {/* Toasts */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-obsidian-950 text-white px-4 py-3 rounded-xl text-sm shadow-xl z-50 flex items-center gap-2 border border-white/10">
          <Check size={14} className="text-gold-400" /> {toast}
        </div>
      )}
      {toastError && (
        <div className="fixed bottom-6 right-6 bg-red-600 text-white px-4 py-3 rounded-xl text-sm shadow-xl z-50 flex items-center gap-2">
          ⚠ {toastError}
        </div>
      )}
    </div>
  )
}
