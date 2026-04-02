'use client'

import { useState, useEffect, useRef } from 'react'
import { Palette, Type, Image as ImageIcon, Upload, Check, Loader2, RefreshCw, X, Sun, Moon, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { DISPLAY_FONTS, BODY_FONTS } from '@/lib/appearance'

type Tab = 'images' | 'colors' | 'fonts' | 'texts'

interface SectionDef {
  key: string
  label: string
  description: string
  type: 'bg' | 'photo'
}

const SECTIONS: SectionDef[] = [
  { key: 'appearance_hero_image',    label: 'Hero — Bannière principale',    description: 'Image de fond plein-écran du hero',                         type: 'bg' },
  { key: 'appearance_about_photo',   label: 'À propos — Photo portrait',     description: 'Photo affichée dans le cadre gauche (section À propos)',     type: 'photo' },
  { key: 'appearance_about_image',   label: 'À propos — Fond de section',    description: 'Image de fond derrière toute la section À propos',           type: 'bg' },
  { key: 'appearance_contact_image', label: 'Contact — Fond de section',     description: 'Image de fond de la section Contact',                        type: 'bg' },
  { key: 'appearance_stats_image',   label: 'Statistiques — Fond de section','description': 'Image de fond de la section Statistiques',               type: 'bg' },
]

const POSITIONS = [
  { value: 'top left',     label: '↖' },
  { value: 'top center',   label: '↑' },
  { value: 'top right',    label: '↗' },
  { value: 'center left',  label: '←' },
  { value: 'center',       label: '·' },
  { value: 'center right', label: '→' },
  { value: 'bottom left',  label: '↙' },
  { value: 'bottom center',label: '↓' },
  { value: 'bottom right', label: '↘' },
]

function posKey(sectionKey: string, type: 'bg' | 'photo') {
  return type === 'photo' ? `${sectionKey}_pos` : `${sectionKey}_pos`
}

export default function AppearancePage({ params: { locale } }: { params: { locale: string } }) {
  const [tab, setTab] = useState<Tab>('images')
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  // Track which keys the user actually changed so we never overwrite untouched settings
  const changedKeys = useRef<Set<string>>(new Set())

  useEffect(() => {
    fetch('/api/settings?category=appearance')
      .then(r => r.json())
      .then(data => {
        const map: Record<string, string> = {}
        if (Array.isArray(data)) data.forEach((s: any) => { map[s.key] = s.value })
        setSettings(map)
        changedKeys.current = new Set() // reset on load
      })
      .finally(() => setLoading(false))
  }, [])

  const update = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    changedKeys.current.add(key) // mark as changed
    setSaved(false)
  }

  const save = async () => {
    setSaving(true)
    try {
      // Only send keys that were explicitly changed by the user
      const entries = [...changedKeys.current]
        .map(key => ({ key, value: settings[key] ?? '', category: 'appearance' }))
      if (entries.length === 0) { setSaved(true); setTimeout(() => setSaved(false), 3000); return }
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entries),
      })
      changedKeys.current = new Set() // reset after successful save
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const uploadImage = async (sectionKey: string, file: File) => {
    setUploading(sectionKey)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) update(sectionKey, data.url)
    } finally {
      setUploading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-gold-500" size={32} />
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-light text-obsidian-950 dark:text-white">Apparence</h1>
          <p className="text-sm text-obsidian-500 mt-1">Personnalisez les images, couleurs et polices du site</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <Check size={15} /> : null}
          {saved ? 'Sauvegardé !' : saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-obsidian-100 dark:bg-obsidian-900 rounded-xl mb-8 w-fit">
        {([
          { id: 'images', label: 'Images', icon: ImageIcon },
          { id: 'colors', label: 'Couleurs', icon: Palette },
          { id: 'fonts',  label: 'Polices',  icon: Type },
          { id: 'texts',  label: 'Textes',   icon: AlignLeft },
        ] as const).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === id
                ? 'bg-white dark:bg-obsidian-800 text-obsidian-950 dark:text-white shadow-sm'
                : 'text-obsidian-500 hover:text-obsidian-800 dark:hover:text-white'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* âÂÂâÂÂ IMAGES TAB âÂÂâÂÂ */}
      {tab === 'images' && (
        <div className="space-y-6">
          {/* âÂÂâÂÂ Logo section âÂÂâÂÂ */}
          <div className="bg-white dark:bg-obsidian-900 border border-obsidian-100 dark:border-white/5 rounded-2xl p-6">
            <h3 className="font-medium text-obsidian-950 dark:text-white mb-1">Logo</h3>
            <p className="text-xs text-obsidian-400 mb-5">
              <strong>Logo Header (scrollé)</strong> — affiché quand le menu a un fond blanc (après scroll).<br />
              <strong>Logo Header (transparent)</strong> — affiché quand le menu est transparent (haut de page, sur l'image hero).<br />
              <strong>Logo Footer</strong> — affiché dans le pied de page. Si non défini, utilise le Logo Header scrollé.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mb-5">
              {(['appearance_logo_header', 'appearance_logo_header_transparent', 'appearance_logo_footer'] as const).map(logoKey => {
                const logoLabel = logoKey === 'appearance_logo_header'
                  ? 'Logo Header (scrollé)'
                  : logoKey === 'appearance_logo_header_transparent'
                  ? 'Logo Header (transparent)'
                  : 'Logo Footer'
                const logoUrl = settings[logoKey] || ''
                const isUploadingLogo = uploading === logoKey
                return (
                  <div key={logoKey}>
                    <p className="text-xs font-medium text-obsidian-600 dark:text-obsidian-300 mb-2">{logoLabel}</p>
                    {logoUrl ? (
                      <div className="relative rounded-xl overflow-hidden h-24 bg-obsidian-100 dark:bg-obsidian-800 mb-2 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={logoUrl} alt={logoLabel} className="max-h-full max-w-full object-contain p-3" />
                        <button
                          onClick={() => update(logoKey, '')}
                          className="absolute top-2 right-2 text-white bg-black/40 rounded-full p-1 hover:bg-red-500/80 transition-colors"
                        >
                          <X size={12} />
                        </button>
                        <button
                          onClick={() => fileInputRefs.current[logoKey]?.click()}
                          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity text-white text-xs font-medium gap-1"
                        >
                          <RefreshCw size={14} /> Changer
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => fileInputRefs.current[logoKey]?.click()}
                        disabled={isUploadingLogo}
                        className="w-full h-24 border-2 border-dashed border-obsidian-200 dark:border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 text-obsidian-400 hover:text-gold-500 hover:border-gold-500 transition-colors mb-2"
                      >
                        {isUploadingLogo ? <Loader2 size={20} className="animate-spin" /> : (
                          <>
                            <Upload size={20} />
                            <span className="text-xs">Uploader le logo</span>
                          </>
                        )}
                      </button>
                    )}
                    <input
                      type="text"
                      value={logoUrl}
                      onChange={e => update(logoKey, e.target.value)}
                      placeholder="Ou collez une URL..."
                      className="w-full text-xs px-3 py-2 bg-obsidian-50 dark:bg-obsidian-950 border border-obsidian-100 dark:border-white/10 rounded-lg text-obsidian-600 dark:text-obsidian-400 focus:outline-none focus:border-gold-500 placeholder:text-obsidian-300 dark:placeholder:text-obsidian-600"
                    />
                    <input
                      ref={el => { fileInputRefs.current[logoKey] = el }}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/svg+xml"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0]
                        if (file) uploadImage(logoKey, file)
                        e.target.value = ''
                      }}
                    />
                  </div>
                )
              })}
            </div>

            <div>
              <p className="text-xs font-medium text-obsidian-600 dark:text-obsidian-300 mb-2">
                Hauteur du logo : {settings.appearance_logo_height || '40'}px
              </p>
              <input
                type="range"
                min={20}
                max={120}
                step={4}
                value={parseInt(settings.appearance_logo_height || '40', 10)}
                onChange={e => update('appearance_logo_height', e.target.value)}
                className="w-full accent-gold-500"
              />
              <div className="flex justify-between text-[10px] text-obsidian-400 mt-1">
                <span>20px</span>
                <span>120px</span>
              </div>
            </div>
          </div>

          {SECTIONS.map(section => {
            const imgUrl = settings[section.key] || ''
            const posKey = `${section.key}_pos`
            const overlayKey = `${section.key}_overlay`
            const overlayDarkKey = `${section.key}_overlay_dark`
            const fitKey = `${section.key}_fit`

            const pos = settings[posKey] || 'center'
            const overlay = parseInt(settings[overlayKey] || '0', 10)
            const isDark = settings[overlayDarkKey] !== 'false'
            const fit = settings[fitKey] || 'cover'
            const isUploading = uploading === section.key

            return (
              <div key={section.key} className="bg-white dark:bg-obsidian-900 border border-obsidian-100 dark:border-white/5 rounded-2xl p-6">
                {/* Section header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-obsidian-950 dark:text-white">{section.label}</h3>
                    <p className="text-xs text-obsidian-400 mt-0.5">{section.description}</p>
                  </div>
                  {imgUrl && (
                    <button onClick={() => update(section.key, '')} className="text-obsidian-400 hover:text-red-500 transition-colors">
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Image preview / upload */}
                {imgUrl ? (
                  <div className="relative rounded-xl overflow-hidden h-44 bg-obsidian-100 dark:bg-obsidian-800 mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgUrl}
                      alt={section.label}
                      className="w-full h-full"
                      style={{ objectFit: fit as any, objectPosition: pos }}
                    />
                    {overlay > 0 && (
                      <div
                        className="absolute inset-0"
                        style={{ backgroundColor: isDark ? `rgba(0,0,0,${overlay / 100})` : `rgba(255,255,255,${overlay / 100})` }}
                      />
                    )}
                    <button
                      onClick={() => fileInputRefs.current[section.key]?.click()}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity text-white text-sm font-medium gap-2"
                    >
                      <RefreshCw size={16} /> Changer
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRefs.current[section.key]?.click()}
                    disabled={isUploading}
                    className="w-full h-44 border-2 border-dashed border-obsidian-200 dark:border-white/10 rounded-xl flex flex-col items-center justify-center gap-3 text-obsidian-400 hover:text-gold-500 hover:border-gold-500 transition-colors mb-4"
                  >
                    {isUploading ? <Loader2 size={24} className="animate-spin" /> : (
                      <>
                        <Upload size={24} />
                        <span className="text-sm">Cliquez pour uploader</span>
                        <span className="text-xs">JPG, PNG, WebP • max 10 MB</span>
                      </>
                    )}
                  </button>
                )}

                {/* URL input */}
                <input
                  type="text"
                  value={imgUrl}
                  onChange={e => update(section.key, e.target.value)}
                  placeholder="Ou collez une URL..."
                  className="w-full text-xs px-3 py-2 bg-obsidian-50 dark:bg-obsidian-950 border border-obsidian-100 dark:border-white/10 rounded-lg text-obsidian-600 dark:text-obsidian-400 focus:outline-none focus:border-gold-500 placeholder:text-obsidian-300 dark:placeholder:text-obsidian-600 mb-4"
                />

                {/* Controls (visible only when image is set) */}
                {imgUrl && (
                  <div className="space-y-4 pt-4 border-t border-obsidian-100 dark:border-white/5">
                    {/* Position grid */}
                    <div>
                      <p className="text-xs font-medium text-obsidian-600 dark:text-obsidian-300 mb-2">Position</p>
                      <div className="grid grid-cols-3 gap-1 w-28">
                        {POSITIONS.map(p => (
                          <button
                            key={p.value}
                            onClick={() => update(posKey, p.value)}
                            title={p.value}
                            className={`h-8 w-8 rounded text-sm flex items-center justify-center transition-all ${
                              pos === p.value
                                ? 'bg-gold-500 text-white'
                                : 'bg-obsidian-100 dark:bg-obsidian-800 text-obsidian-500 hover:bg-obsidian-200 dark:hover:bg-obsidian-700'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Object fit (portrait photo only) */}
                    {section.type === 'photo' && (
                      <div>
                        <p className="text-xs font-medium text-obsidian-600 dark:text-obsidian-300 mb-2">Ajustement</p>
                        <div className="flex gap-2">
                          {(['cover', 'contain'] as const).map(f => (
                            <button
                              key={f}
                              onClick={() => update(fitKey, f)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                fit === f
                                  ? 'bg-gold-500 text-white'
                                  : 'bg-obsidian-100 dark:bg-obsidian-800 text-obsidian-500 hover:bg-obsidian-200'
                              }`}
                            >
                              {f === 'cover' ? 'Remplir (Cover)' : 'Ajuster (Contain)'}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Overlay (BG images only) */}
                    {section.type === 'bg' && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-medium text-obsidian-600 dark:text-obsidian-300">
                            Superposition : {overlay}%
                          </p>
                          <div className="flex gap-1">
                            <button
                              onClick={() => update(overlayDarkKey, 'true')}
                              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all ${
                                isDark
                                  ? 'bg-obsidian-950 text-white'
                                  : 'bg-obsidian-100 dark:bg-obsidian-800 text-obsidian-500'
                              }`}
                            >
                              <Moon size={11} /> Sombre
                            </button>
                            <button
                              onClick={() => update(overlayDarkKey, 'false')}
                              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all ${
                                !isDark
                                  ? 'bg-white border border-obsidian-200 text-obsidian-900'
                                  : 'bg-obsidian-100 dark:bg-obsidian-800 text-obsidian-500'
                              }`}
                            >
                              <Sun size={11} /> Clair
                            </button>
                          </div>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={90}
                          step={5}
                          value={overlay}
                          onChange={e => update(overlayKey, e.target.value)}
                          className="w-full accent-gold-500"
                        />
                        <div className="flex justify-between text-[10px] text-obsidian-400 mt-1">
                          <span>Transparent</span>
                          <span>90%</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <input
                  ref={el => { fileInputRefs.current[section.key] = el }}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) uploadImage(section.key, file)
                    e.target.value = ''
                  }}
                />
              </div>
            )
          })}
        </div>
      )}

      {/* âÂÂâÂÂ COLORS TAB âÂÂâÂÂ */}
      {tab === 'colors' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-obsidian-900 border border-obsidian-100 dark:border-white/5 rounded-2xl p-6">
            <h3 className="font-medium text-obsidian-950 dark:text-white mb-4">Couleur de marque (principale)</h3>
            <div className="flex items-center gap-4 mb-6">
              <input
                type="color"
                value={settings.appearance_primary_color || '#d4922b'}
                onChange={e => update('appearance_primary_color', e.target.value)}
                className="w-16 h-16 rounded-xl border-0 cursor-pointer bg-transparent"
                style={{ padding: 2 }}
              />
              <div>
                <p className="text-sm font-medium text-obsidian-800 dark:text-obsidian-200">
                  {settings.appearance_primary_color || '#d4922b'}
                </p>
                <p className="text-xs text-obsidian-400 mt-1">Cliquez pour choisir une couleur</p>
              </div>
              <button
                onClick={() => update('appearance_primary_color', '#d4922b')}
                className="ml-auto text-xs text-obsidian-400 hover:text-gold-500 transition-colors flex items-center gap-1"
              >
                <RefreshCw size={12} /> Réinitialiser
              </button>
            </div>
            <div>
              <p className="text-xs text-obsidian-400 mb-2">Aperçu de la palette générée</p>
              <div className="flex rounded-xl overflow-hidden h-10">
                {['50','100','200','300','400','500','600','700','800','900'].map(shade => (
                  <div
                    key={shade}
                    className="flex-1 relative group"
                    style={{ backgroundColor: `rgb(var(--gold-${shade}))` }}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: parseInt(shade) < 400 ? '#333' : '#fff' }}>
                      {shade}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-obsidian-400 mt-2">
                âÂÂ¡ Rechargez la page du site après sauvegarde pour voir les changements.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-obsidian-900 border border-obsidian-100 dark:border-white/5 rounded-2xl p-6">
            <h3 className="font-medium text-obsidian-950 dark:text-white mb-4">Palettes prédéfinies</h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {[
                { label: 'Or (défaut)', color: '#d4922b' },
                { label: 'Cuivre',      color: '#b87333' },
                { label: 'Bronze',      color: '#cd7f32' },
                { label: 'Champagne',   color: '#c9a96e' },
                { label: 'Bordeaux',    color: '#722f37' },
                { label: 'Marine',      color: '#1b3a5c' },
                { label: 'Émeraude',    color: '#046b3b' },
                { label: 'Améthyste',   color: '#6b3fa0' },
                { label: 'Ardoise',     color: '#4a5568' },
                { label: 'Anthracite',  color: '#374151' },
                { label: 'Rose gold',   color: '#b76e79' },
                { label: 'Platine',     color: '#8d9099' },
              ].map(preset => (
                <button
                  key={preset.color}
                  onClick={() => update('appearance_primary_color', preset.color)}
                  title={preset.label}
                  className={`group flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${
                    settings.appearance_primary_color === preset.color
                      ? 'border-obsidian-950 dark:border-white scale-105'
                      : 'border-transparent hover:border-obsidian-200 dark:hover:border-white/20'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg shadow-sm" style={{ backgroundColor: preset.color }} />
                  <span className="text-[10px] text-obsidian-500 dark:text-obsidian-400 text-center leading-tight">{preset.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* âÂÂâÂÂ FONTS TAB âÂÂâÂÂ */}
      {tab === 'fonts' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-obsidian-900 border border-obsidian-100 dark:border-white/5 rounded-2xl p-6">
            <h3 className="font-medium text-obsidian-950 dark:text-white mb-1">Police de titres</h3>
            <p className="text-xs text-obsidian-400 mb-4">Utilisée pour les titres, logos et éléments d'affichage</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DISPLAY_FONTS.map(font => (
                <button
                  key={font.value}
                  onClick={() => update('appearance_font_display', font.value)}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
                    (settings.appearance_font_display || '') === font.value
                      ? 'border-gold-500 bg-gold-500/5'
                      : 'border-obsidian-100 dark:border-white/10 hover:border-obsidian-200 dark:hover:border-white/20'
                  }`}
                >
                  <div>
                    <p className="text-xl text-obsidian-950 dark:text-white" style={{ fontFamily: font.value || 'var(--font-cormorant)' }}>
                      Aa — Guard
                    </p>
                    <p className="text-xs text-obsidian-400 mt-1">{font.label}</p>
                  </div>
                  {(settings.appearance_font_display || '') === font.value && <Check size={16} className="text-gold-500 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-obsidian-900 border border-obsidian-100 dark:border-white/5 rounded-2xl p-6">
            <h3 className="font-medium text-obsidian-950 dark:text-white mb-1">Police de corps</h3>
            <p className="text-xs text-obsidian-400 mb-4">Utilisée pour les paragraphes, labels et texte courant</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BODY_FONTS.map(font => (
                <button
                  key={font.value}
                  onClick={() => update('appearance_font_body', font.value)}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
                    (settings.appearance_font_body || '') === font.value
                      ? 'border-gold-500 bg-gold-500/5'
                      : 'border-obsidian-100 dark:border-white/10 hover:border-obsidian-200 dark:hover:border-white/20'
                  }`}
                >
                  <div>
                    <p className="text-base text-obsidian-950 dark:text-white" style={{ fontFamily: font.value || 'var(--font-inter)' }}>
                      La conciergerie de luxe ÃÂ  Marrakech
                    </p>
                    <p className="text-xs text-obsidian-400 mt-1">{font.label}</p>
                  </div>
                  {(settings.appearance_font_body || '') === font.value && <Check size={16} className="text-gold-500 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gold-500/10 border border-gold-500/20 rounded-xl p-4 text-sm text-obsidian-700 dark:text-obsidian-300">
            Ã°ÂÂÂ¡ Les polices Google Fonts sont chargées automatiquement. Rechargez la page après sauvegarde.
          </div>
        </div>
      )}

      {/* âÂÂâÂÂ TEXTS TAB âÂÂâÂÂ */}
      {tab === 'texts' && (
        <div className="space-y-6">

          {/* All text colors */}
          <div className="bg-white dark:bg-obsidian-900 border border-obsidian-100 dark:border-white/5 rounded-2xl p-6">
            <h3 className="font-medium text-obsidian-950 dark:text-white mb-1">Couleurs des textes</h3>
            <p className="text-xs text-obsidian-400 mb-5">Laissez vide pour utiliser la couleur par défaut du thème.</p>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
              {([
                { key: 'appearance_heading_color',    label: 'Titres (H1–H5)',         hint: 'Tous les titres du site', preview: (c: string) => <p className="text-2xl font-light" style={{ color: c, fontFamily: 'var(--font-cormorant, serif)' }}>Titre exemple</p> },
                { key: 'appearance_body_color',        label: 'Corps de texte (paragraphes)', hint: 'Descriptions, paragraphes', preview: (c: string) => <p className="text-sm" style={{ color: c }}>Exemple de texte de corps.</p> },
                { key: 'appearance_nav_text_color',    label: 'Menu de navigation',     hint: 'Liens du menu header', preview: (c: string) => <p className="text-sm font-medium tracking-wide" style={{ color: c }}>Services · À propos · Contact</p> },
                { key: 'appearance_nav_bg_color',      label: 'Fond du menu (défilé)',  hint: 'Couleur de fond du header après scroll', preview: (c: string) => <div className="h-8 rounded-lg" style={{ backgroundColor: c }} /> },
                { key: 'appearance_footer_text_color', label: 'Textes du footer',       hint: 'Tous les textes du pied de page', preview: (c: string) => <p className="text-sm" style={{ color: c }}>Footer — Adresse, liens, copyright</p> },
                { key: 'appearance_badge_color',       label: 'Badges / étiquettes',    hint: 'Labels de section (ex: "Nos Services")', preview: (c: string) => <span className="text-xs tracking-[0.2em] uppercase font-medium" style={{ color: c }}>— NOS SERVICES —</span> },
              ] as const).map(({ key, label, hint, preview }) => {
                const val = settings[key] || ''
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-xs font-medium text-obsidian-600 dark:text-obsidian-300">{label}</p>
                        <p className="text-[10px] text-obsidian-400">{hint}</p>
                      </div>
                      {val && (
                        <button onClick={() => update(key, '')} className="text-[10px] text-obsidian-400 hover:text-red-500 flex items-center gap-0.5">
                          <X size={10} /> Reset
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={val || '#000000'}
                        onChange={e => update(key, e.target.value)}
                        className="w-10 h-10 rounded-lg border-0 cursor-pointer bg-transparent flex-shrink-0"
                        style={{ padding: 2 }}
                      />
                      {val ? (
                        <div className="flex-1 rounded-lg p-2 bg-obsidian-50 dark:bg-obsidian-800 overflow-hidden">
                          {preview(val)}
                        </div>
                      ) : (
                        <span className="text-xs text-obsidian-300">Par défaut</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Hero height + alignment */}
          <div className="bg-white dark:bg-obsidian-900 border border-obsidian-100 dark:border-white/5 rounded-2xl p-6">
            <h3 className="font-medium text-obsidian-950 dark:text-white mb-4">Section Hero</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <div className="mb-3"><p className="text-xs font-medium text-obsidian-600 dark:text-obsidian-300">Hauteur de la section Hero</p><p className="text-[10px] text-obsidian-400">Contrôle la hauteur de toute la section : titre, textes ET formulaire</p></div>
                <div>
                  {/* Slider de hauteur hero */}
                  {(() => {
                    const rawVal = settings.appearance_hero_height || 'screen';
                    const vhValue = rawVal === 'screen' ? 100 : parseInt(rawVal) || 100;
                    const displayLabel = vhValue >= 200 ? `Très grand (${vhValue}vh)` : vhValue === 100 ? 'Plein écran (100vh)' : vhValue >= 85 ? `Grand (${vhValue}vh)` : vhValue >= 70 ? `Moyen (${vhValue}vh)` : vhValue >= 55 ? `Compact (${vhValue}vh)` : `Minimal (${vhValue}vh)`;
                    return (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gold-600 dark:text-gold-400">{displayLabel}</span>
                          <span className="text-xs text-obsidian-400">{vhValue}vh</span>
                        </div>
                        <input
                          type="range"
                          min={30}
                          max={300}
                          step={5}
                          value={vhValue}
                          onChange={e => {
                            const v = parseInt(e.target.value);
                            update('appearance_hero_height', v === 100 ? 'screen' : `${v}vh`);
                          }}
                          className="w-full accent-gold-500 cursor-pointer"
                          style={{ height: '6px' }}
                        />
                        <div className="flex justify-between text-[10px] text-obsidian-400">
                          <span>30vh<br/>Min.</span>
                          <span>70vh<br/>Moyen</span>
                          <span>100vh<br/>Plein</span>
                          <span>150vh<br/>XL</span>
                          <span>200vh<br/>XXL</span>
                          <span>300vh<br/>Max</span>
                        </div>
                        {/* Aperçu visuel */}
                        <div className="relative mt-3 rounded-xl overflow-hidden bg-obsidian-100 dark:bg-obsidian-800 border border-obsidian-200 dark:border-white/10" style={{ height: '80px' }}>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full bg-gold-500/20 transition-all duration-300 flex items-center justify-center rounded" style={{ height: `${vhValue}%`, minHeight: '12px' }}>
                              <span className="text-[10px] font-medium text-gold-600 dark:text-gold-400">{vhValue}vh</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-obsidian-600 dark:text-obsidian-300 mb-3">Alignement du texte Hero</p>
                <div className="flex gap-2">
                  {([
                    { value: 'left',   label: 'Gauche',  icon: AlignLeft },
                    { value: 'center', label: 'Centre',  icon: AlignCenter },
                  ] as const).map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => update('appearance_hero_text_align', value)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                        (settings.appearance_hero_text_align || 'left') === value
                          ? 'border-gold-500 bg-gold-500/10 text-gold-600 dark:text-gold-400'
                          : 'border-obsidian-100 dark:border-white/10 text-obsidian-500 hover:border-obsidian-300 dark:hover:border-white/20'
                      }`}
                    >
                      <Icon size={16} />
                      {label}
                    </button>
                  ))}
                </div>
                <div className="mt-4">
                  <p className="text-xs font-medium text-obsidian-600 dark:text-obsidian-300 mb-3">Position logo footer</p>
                  <div className="flex gap-2">
                    {([
                      { value: 'left',   label: 'Gauche',  icon: AlignLeft },
                      { value: 'center', label: 'Centre',  icon: AlignCenter },
                    ] as const).map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => update('appearance_logo_footer_align', value)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                          (settings.appearance_logo_footer_align || 'left') === value
                            ? 'border-gold-500 bg-gold-500/10 text-gold-600 dark:text-gold-400'
                            : 'border-obsidian-100 dark:border-white/10 text-obsidian-500 hover:border-obsidian-300 dark:hover:border-white/20'
                        }`}
                      >
                        <Icon size={16} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gold-500/10 border border-gold-500/20 rounded-xl p-4 text-sm text-obsidian-700 dark:text-obsidian-300">
            Ã°ÂÂÂ¡ Rechargez la page du site après sauvegarde pour voir les changements de couleur.
          </div>
        </div>
      )}
    </div>
  )
}
