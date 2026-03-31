'use client'

import { useState, useEffect } from 'react'
import { Check, Loader2, RefreshCw, X, Phone } from 'lucide-react'

// ── WhatsApp SVG ─────────────────────────────────────────────────────────────
function WaIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill={color} width={size} height={size}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

// ── Live Preview ──────────────────────────────────────────────────────────────
function ButtonPreview({ s }: { s: Record<string, string> }) {
  const bgColor   = s.whatsapp_button_color      || '#25D366'
  const iconColor = s.whatsapp_button_text_color || '#FFFFFF'
  const shape     = s.whatsapp_button_shape || 'circle'
  const size      = s.whatsapp_button_size  || 'md'
  const animation = s.whatsapp_button_animation || 'none'
  const showLabel = s.whatsapp_button_label === 'true'
  const labelText = s.whatsapp_button_label_text || 'Contactez-nous'
  const position  = s.whatsapp_button_position || 'bottom-right'

  const borderRadius = { circle: '9999px', rounded: '18px', square: '8px' }[shape] || '9999px'
  const { btnSize, iconSize } = (
    size === 'sm' ? { btnSize: 44, iconSize: 20 } :
    size === 'lg' ? { btnSize: 64, iconSize: 34 } :
                   { btnSize: 56, iconSize: 28 }
  )
  const animClass = animation === 'pulse' ? 'animate-pulse' : animation === 'bounce' ? 'animate-bounce' : ''
  const isLeft = position === 'bottom-left'
  const posLabel = { 'bottom-right': 'Bas droite', 'bottom-left': 'Bas gauche', 'bottom-center': 'Bas centre' }[position] || ''

  return (
    <div className="bg-obsidian-950/5 dark:bg-obsidian-950/40 rounded-2xl border border-obsidian-100 dark:border-white/5 overflow-hidden">
      {/* Mock browser chrome */}
      <div className="bg-obsidian-100 dark:bg-obsidian-800 px-4 py-2.5 flex items-center gap-2 border-b border-obsidian-200 dark:border-white/10">
        <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-400"/><div className="w-2.5 h-2.5 rounded-full bg-yellow-400"/><div className="w-2.5 h-2.5 rounded-full bg-green-400"/></div>
        <div className="flex-1 bg-white dark:bg-obsidian-900 rounded-md text-[10px] text-obsidian-400 px-2 py-0.5 mx-2">guardconciergerie.com</div>
      </div>
      {/* Preview area */}
      <div className="relative h-52 bg-gradient-to-br from-obsidian-900 via-obsidian-800 to-obsidian-950 flex items-center justify-center overflow-hidden">
        <p className="text-obsidian-600 text-xs tracking-widest uppercase">Aperçu du bouton</p>
        {/* Simulated position */}
        <div
          className="absolute flex items-center gap-2"
          style={{
            bottom: 12,
            ...(position === 'bottom-right'  ? { right: 12 } : {}),
            ...(position === 'bottom-left'   ? { left: 12 } : {}),
            ...(position === 'bottom-center' ? { left: '50%', transform: 'translateX(-50%)' } : {}),
            flexDirection: isLeft ? 'row-reverse' : 'row',
          }}
        >
          <div
            className={`flex items-center justify-center shadow-lg ${animClass}`}
            style={{ backgroundColor: bgColor, borderRadius, width: btnSize * 0.75, height: btnSize * 0.75, flexShrink: 0 }}
          >
            <WaIcon size={iconSize * 0.75} color={iconColor} />
          </div>
          {showLabel && (
            <span className="px-2.5 py-1 text-[10px] font-medium shadow whitespace-nowrap"
              style={{ backgroundColor: bgColor, color: iconColor, borderRadius }}>
              {labelText}
            </span>
          )}
        </div>
      </div>
      <div className="px-4 py-2 text-[10px] text-obsidian-400 flex justify-between">
        <span>Position : <strong>{posLabel}</strong></span>
        <span>Taille : <strong>{{ sm: 'Petit', md: 'Moyen', lg: 'Grand' }[size]}</strong></span>
      </div>
    </div>
  )
}

// ── Option Button ─────────────────────────────────────────────────────────────
function OptBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all border-2 ${
        active
          ? 'border-gold-500 bg-gold-500/10 text-gold-600 dark:text-gold-400'
          : 'border-obsidian-100 dark:border-white/10 text-obsidian-500 hover:border-obsidian-300 dark:hover:border-white/20'
      }`}
    >
      {children}
    </button>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function WhatsAppAdminPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/settings?category=whatsapp').then(r => r.json()),
      fetch('/api/settings?category=contact').then(r => r.json()),
    ]).then(([wa, ct]) => {
      const map: Record<string, string> = {}
      if (Array.isArray(wa)) wa.forEach((s: any) => { map[s.key] = s.value })
      if (Array.isArray(ct)) ct.forEach((s: any) => { map[s.key] = s.value })
      setSettings(map)
    }).finally(() => setLoading(false))
  }, [])

  const set = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const save = async () => {
    setSaving(true)
    setSaveError('')
    try {
      const waKeys = ['whatsapp_button_enabled','whatsapp_button_message','whatsapp_button_color',
        'whatsapp_button_text_color','whatsapp_button_position','whatsapp_button_shape',
        'whatsapp_button_size','whatsapp_button_animation','whatsapp_button_label','whatsapp_button_label_text']
      const entries = waKeys.map(key => ({ key, value: settings[key] || '', category: 'whatsapp' }))
      // also save contact_whatsapp
      if (settings.contact_whatsapp !== undefined) {
        entries.push({ key: 'contact_whatsapp', value: settings.contact_whatsapp, category: 'contact' })
      }
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entries),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        const data = await res.json().catch(() => ({}))
        setSaveError(data.error || 'Erreur lors de la sauvegarde')
        setTimeout(() => setSaveError(''), 4000)
      }
    } catch {
      setSaveError('Erreur réseau — impossible de sauvegarder')
      setTimeout(() => setSaveError(''), 4000)
    } finally {
      setSaving(false)
    }
  }

  const enabled = settings.whatsapp_button_enabled === 'true'
  const phoneDigits = (settings.contact_whatsapp || '').replace(/[^0-9]/g, '')
  const phoneInvalid = enabled && phoneDigits.length < 7

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-gold-500" size={32} />
    </div>
  )

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#25D366' }}>
            <WaIcon size={22} color="#fff" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-obsidian-950 dark:text-white">Bouton WhatsApp</h1>
            <p className="text-sm text-gray-500 mt-0.5">Flottant sur le site — visible par les visiteurs</p>
          </div>
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors">
          {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <Check size={15} /> : null}
          {saved ? 'Sauvegardé !' : saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>

      {/* Phone number warning */}
      {phoneInvalid && (
        <div className="mb-6 flex items-start gap-3 bg-amber-50 dark:bg-amber-900/15 border border-amber-300 dark:border-amber-700/40 rounded-xl px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
          <X size={16} className="mt-0.5 flex-shrink-0 text-amber-500" />
          <div>
            <p className="font-semibold">Le bouton est activé mais ne s&apos;affichera pas !</p>
            <p className="mt-0.5 text-xs">Le numéro WhatsApp est vide ou invalide. Entrez un vrai numéro ci-dessous (ex : +212612345678) puis sauvegardez.</p>
          </div>
        </div>
      )}
      {saveError && (
        <div className="mb-6 flex items-center gap-2 bg-red-50 dark:bg-red-900/15 border border-red-300 dark:border-red-700/40 rounded-xl px-4 py-3 text-sm text-red-700 dark:text-red-400">
          <X size={15} className="flex-shrink-0" />
          {saveError}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left column — controls */}
        <div className="space-y-5">

          {/* Enable toggle */}
          <div className="bg-white dark:bg-obsidian-900 border border-obsidian-100 dark:border-white/5 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-obsidian-950 dark:text-white">Activer le bouton</p>
                <p className="text-xs text-obsidian-400 mt-0.5">Affiche le bouton flottant sur toutes les pages</p>
              </div>
              <button
                onClick={() => set('whatsapp_button_enabled', enabled ? 'false' : 'true')}
                className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-green-500' : 'bg-obsidian-200 dark:bg-obsidian-700'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>

          {/* Phone number */}
          <div className="bg-white dark:bg-obsidian-900 border border-obsidian-100 dark:border-white/5 rounded-2xl p-5">
            <label className="text-xs font-medium text-obsidian-600 dark:text-obsidian-300 flex items-center gap-1.5 mb-2">
              <Phone size={12} />
              Numéro WhatsApp
            </label>
            <input
              type="text"
              value={settings.contact_whatsapp || ''}
              onChange={e => set('contact_whatsapp', e.target.value)}
              placeholder="+212 6XX XXX XXX"
              className="w-full px-3 py-2 bg-obsidian-50 dark:bg-obsidian-950 border border-obsidian-100 dark:border-white/10 rounded-xl text-sm text-obsidian-800 dark:text-white focus:outline-none focus:border-gold-500 placeholder:text-obsidian-300"
            />
            <p className="text-[10px] text-obsidian-400 mt-1.5">Format international avec indicatif pays (ex: +212612345678)</p>
          </div>

          {/* Pre-filled message */}
          <div className="bg-white dark:bg-obsidian-900 border border-obsidian-100 dark:border-white/5 rounded-2xl p-5">
            <label className="text-xs font-medium text-obsidian-600 dark:text-obsidian-300 block mb-2">Message pré-rempli</label>
            <textarea
              value={settings.whatsapp_button_message || ''}
              onChange={e => set('whatsapp_button_message', e.target.value)}
              rows={3}
              placeholder="Bonjour, je souhaite en savoir plus sur vos services..."
              className="w-full px-3 py-2 bg-obsidian-50 dark:bg-obsidian-950 border border-obsidian-100 dark:border-white/10 rounded-xl text-sm text-obsidian-800 dark:text-white focus:outline-none focus:border-gold-500 placeholder:text-obsidian-300 resize-none"
            />
            <p className="text-[10px] text-obsidian-400 mt-1.5">Ce message apparaît automatiquement dans la zone de saisie WhatsApp du client.</p>
          </div>

          {/* Colors */}
          <div className="bg-white dark:bg-obsidian-900 border border-obsidian-100 dark:border-white/5 rounded-2xl p-5">
            <p className="text-sm font-medium text-obsidian-950 dark:text-white mb-4">Couleurs</p>
            <div className="space-y-4">
              {[
                { key: 'whatsapp_button_color',      label: 'Fond du bouton',  default: '#25D366' },
                { key: 'whatsapp_button_text_color', label: "Couleur de l'icône", default: '#FFFFFF' },
              ].map(({ key, label, default: def }) => (
                <div key={key} className="flex items-center gap-4">
                  <input
                    type="color"
                    value={settings[key] || def}
                    onChange={e => set(key, e.target.value)}
                    className="w-12 h-12 rounded-xl border-0 cursor-pointer bg-transparent p-0.5"
                  />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-obsidian-700 dark:text-obsidian-300">{label}</p>
                    <p className="text-[10px] text-obsidian-400 font-mono">{settings[key] || def}</p>
                  </div>
                  <button onClick={() => set(key, def)} title="Réinitialiser"
                    className="text-obsidian-300 hover:text-gold-500 transition-colors">
                    <RefreshCw size={13} />
                  </button>
                </div>
              ))}
            </div>
            {/* Quick presets */}
            <div className="mt-4 pt-4 border-t border-obsidian-100 dark:border-white/5">
              <p className="text-[10px] text-obsidian-400 mb-2 uppercase tracking-wide">Presets</p>
              <div className="flex gap-2 flex-wrap">
                {[
                  { bg: '#25D366', icon: '#FFFFFF', name: 'WhatsApp' },
                  { bg: '#000000', icon: '#FFFFFF', name: 'Noir' },
                  { bg: '#d4922b', icon: '#FFFFFF', name: 'Or' },
                  { bg: '#1b3a5c', icon: '#FFFFFF', name: 'Marine' },
                  { bg: '#FFFFFF', icon: '#25D366', name: 'Blanc' },
                ].map(p => (
                  <button key={p.name} onClick={() => { set('whatsapp_button_color', p.bg); set('whatsapp_button_text_color', p.icon) }}
                    title={p.name}
                    className="w-7 h-7 rounded-full border-2 border-white dark:border-obsidian-700 shadow transition-transform hover:scale-110"
                    style={{ backgroundColor: p.bg }} />
                ))}
              </div>
            </div>
          </div>

          {/* Position */}
          <div className="bg-white dark:bg-obsidian-900 border border-obsidian-100 dark:border-white/5 rounded-2xl p-5">
            <p className="text-sm font-medium text-obsidian-950 dark:text-white mb-3">Position</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'bottom-left',   icon: '↙', label: 'Bas gauche' },
                { value: 'bottom-center', icon: '↓',  label: 'Bas centre' },
                { value: 'bottom-right',  icon: '↘', label: 'Bas droite' },
              ].map(opt => (
                <button key={opt.value}
                  onClick={() => set('whatsapp_button_position', opt.value)}
                  className={`py-3 rounded-xl border-2 text-center transition-all ${
                    (settings.whatsapp_button_position || 'bottom-right') === opt.value
                      ? 'border-gold-500 bg-gold-500/10'
                      : 'border-obsidian-100 dark:border-white/10 hover:border-obsidian-200'
                  }`}
                >
                  <p className="text-xl mb-0.5">{opt.icon}</p>
                  <p className="text-[10px] text-obsidian-500 dark:text-obsidian-400">{opt.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Shape */}
          <div className="bg-white dark:bg-obsidian-900 border border-obsidian-100 dark:border-white/5 rounded-2xl p-5">
            <p className="text-sm font-medium text-obsidian-950 dark:text-white mb-3">Forme</p>
            <div className="flex gap-2">
              {[
                { value: 'circle',  label: 'Rond',        radius: '9999px' },
                { value: 'rounded', label: 'Arrondi',     radius: '14px' },
                { value: 'square',  label: 'Carré',       radius: '6px' },
              ].map(opt => {
                const active = (settings.whatsapp_button_shape || 'circle') === opt.value
                return (
                  <button key={opt.value} onClick={() => set('whatsapp_button_shape', opt.value)}
                    className={`flex-1 py-3 flex flex-col items-center gap-2 rounded-xl border-2 transition-all ${
                      active ? 'border-gold-500 bg-gold-500/10' : 'border-obsidian-100 dark:border-white/10 hover:border-obsidian-200'
                    }`}
                  >
                    <div className="w-8 h-8 bg-obsidian-200 dark:bg-obsidian-700"
                      style={{ borderRadius: opt.radius }} />
                    <p className="text-[10px] text-obsidian-500 dark:text-obsidian-400">{opt.label}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Size */}
          <div className="bg-white dark:bg-obsidian-900 border border-obsidian-100 dark:border-white/5 rounded-2xl p-5">
            <p className="text-sm font-medium text-obsidian-950 dark:text-white mb-3">Taille</p>
            <div className="flex gap-2">
              <OptBtn active={(settings.whatsapp_button_size || 'md') === 'sm'} onClick={() => set('whatsapp_button_size', 'sm')}>Petit (44px)</OptBtn>
              <OptBtn active={(settings.whatsapp_button_size || 'md') === 'md'} onClick={() => set('whatsapp_button_size', 'md')}>Moyen (56px)</OptBtn>
              <OptBtn active={(settings.whatsapp_button_size || 'md') === 'lg'} onClick={() => set('whatsapp_button_size', 'lg')}>Grand (64px)</OptBtn>
            </div>
          </div>

          {/* Animation */}
          <div className="bg-white dark:bg-obsidian-900 border border-obsidian-100 dark:border-white/5 rounded-2xl p-5">
            <p className="text-sm font-medium text-obsidian-950 dark:text-white mb-3">Animation</p>
            <div className="flex gap-2">
              <OptBtn active={(settings.whatsapp_button_animation || 'none') === 'none'}   onClick={() => set('whatsapp_button_animation', 'none')}>Aucune</OptBtn>
              <OptBtn active={(settings.whatsapp_button_animation || 'none') === 'pulse'}  onClick={() => set('whatsapp_button_animation', 'pulse')}>Pulsation</OptBtn>
              <OptBtn active={(settings.whatsapp_button_animation || 'none') === 'bounce'} onClick={() => set('whatsapp_button_animation', 'bounce')}>Rebond</OptBtn>
            </div>
          </div>

          {/* Label */}
          <div className="bg-white dark:bg-obsidian-900 border border-obsidian-100 dark:border-white/5 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-obsidian-950 dark:text-white">Étiquette texte</p>
                <p className="text-xs text-obsidian-400 mt-0.5">Bulle de texte affichée à côté du bouton</p>
              </div>
              <button
                onClick={() => set('whatsapp_button_label', settings.whatsapp_button_label === 'true' ? 'false' : 'true')}
                className={`relative w-12 h-6 rounded-full transition-colors ${settings.whatsapp_button_label === 'true' ? 'bg-green-500' : 'bg-obsidian-200 dark:bg-obsidian-700'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.whatsapp_button_label === 'true' ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            {settings.whatsapp_button_label === 'true' && (
              <input
                type="text"
                value={settings.whatsapp_button_label_text || ''}
                onChange={e => set('whatsapp_button_label_text', e.target.value)}
                placeholder="Contactez-nous"
                className="w-full px-3 py-2 bg-obsidian-50 dark:bg-obsidian-950 border border-obsidian-100 dark:border-white/10 rounded-xl text-sm text-obsidian-800 dark:text-white focus:outline-none focus:border-gold-500 placeholder:text-obsidian-300"
              />
            )}
          </div>
        </div>

        {/* Right column — live preview (sticky) */}
        <div className="lg:sticky lg:top-6 h-fit space-y-4">
          <div className="bg-white dark:bg-obsidian-900 border border-obsidian-100 dark:border-white/5 rounded-2xl p-5">
            <p className="text-xs font-medium text-obsidian-500 dark:text-obsidian-400 uppercase tracking-wide mb-3">Aperçu en direct</p>
            <ButtonPreview s={settings} />
          </div>

          {/* Quick info */}
          <div className="bg-white dark:bg-obsidian-900 border border-obsidian-100 dark:border-white/5 rounded-2xl p-5 space-y-3">
            <p className="text-xs font-medium text-obsidian-500 dark:text-obsidian-400 uppercase tracking-wide">Récapitulatif</p>
            {[
              { label: 'Statut',   value: enabled ? '✅ Actif' : '⛔ Désactivé' },
              { label: 'Numéro',   value: settings.contact_whatsapp || '—' },
              { label: 'Position', value: { 'bottom-right': 'Bas droite', 'bottom-left': 'Bas gauche', 'bottom-center': 'Bas centre' }[settings.whatsapp_button_position || 'bottom-right'] || '—' },
              { label: 'Forme',    value: { circle: 'Rond', rounded: 'Arrondi', square: 'Carré' }[settings.whatsapp_button_shape || 'circle'] || '—' },
              { label: 'Taille',   value: { sm: 'Petit', md: 'Moyen', lg: 'Grand' }[settings.whatsapp_button_size || 'md'] || '—' },
              { label: 'Animation',value: { none: 'Aucune', pulse: 'Pulsation', bounce: 'Rebond' }[settings.whatsapp_button_animation || 'none'] || '—' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center text-xs">
                <span className="text-obsidian-400">{label}</span>
                <span className="font-medium text-obsidian-700 dark:text-obsidian-300">{value}</span>
              </div>
            ))}
          </div>

          {/* Info box */}
          <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 rounded-xl p-4 text-xs text-green-700 dark:text-green-400">
            <p className="font-semibold mb-1">💡 Comment ça marche ?</p>
            <p>Le bouton s'affiche en bas de toutes les pages du site. En cliquant dessus, le visiteur est redirigé vers WhatsApp avec votre numéro et le message pré-rempli.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
