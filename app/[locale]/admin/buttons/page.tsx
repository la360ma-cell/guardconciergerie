'use client'

import { useState, useEffect } from 'react'
import { Check, Loader2, RefreshCw, X } from 'lucide-react'

// ── Live Preview ──────────────────────────────────────────────────────────────
function BtnPreview({ s }: { s: Record<string, string> }) {
  const shape      = s.btn_shape       || 'pill'
  const primaryBg  = s.btn_primary_bg  || '#0f0f0f'
  const primaryTxt = s.btn_primary_text || '#ffffff'
  const primaryHov = s.btn_primary_hover_bg || '#ffaa00'
  const secBg      = s.btn_secondary_bg || 'transparent'
  const secTxt     = s.btn_secondary_text || '#0f0f0f'
  const secBdr     = s.btn_secondary_border || '#d1d5db'
  const weight     = { light:'300', normal:'400', medium:'500', semibold:'600', bold:'700' }[s.btn_font_weight||'medium'] || '500'

  const radiusMap: Record<string,string> = { pill:'9999px', rounded:'16px', semiround:'8px', square:'2px' }
  const radius = radiusMap[shape] || '9999px'

  return (
    <div className="space-y-4">
      {/* Primary preview */}
      <div>
        <p className="text-[10px] text-obsidian-400 uppercase tracking-wide mb-2">Bouton Primaire</p>
        <div className="flex flex-wrap gap-3 items-center">
          <button
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm transition-all"
            style={{ backgroundColor: primaryBg, color: primaryTxt, borderRadius: radius, fontWeight: weight, border: `2px solid ${primaryBg}` }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = primaryHov; (e.currentTarget as HTMLButtonElement).style.borderColor = primaryHov }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = primaryBg; (e.currentTarget as HTMLButtonElement).style.borderColor = primaryBg }}
          >
            {s.btn_text_hero_primary_fr || 'Demander une évaluation'}
          </button>
          <button
            className="inline-flex items-center gap-2 px-5 py-2 text-sm transition-all"
            style={{ backgroundColor: primaryBg, color: primaryTxt, borderRadius: radius, fontWeight: weight, border: `2px solid ${primaryBg}` }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = primaryHov; (e.currentTarget as HTMLButtonElement).style.borderColor = primaryHov }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = primaryBg; (e.currentTarget as HTMLButtonElement).style.borderColor = primaryBg }}
          >
            {s.btn_text_header_fr || 'Nous contacter'}
          </button>
        </div>
      </div>
      {/* Secondary preview */}
      <div>
        <p className="text-[10px] text-obsidian-400 uppercase tracking-wide mb-2">Bouton Secondaire</p>
        <div className="flex flex-wrap gap-3 items-center">
          <button
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm transition-all"
            style={{ backgroundColor: secBg, color: secTxt, borderRadius: radius, fontWeight: weight, border: `1.5px solid ${secBdr}` }}
          >
            {s.btn_text_hero_secondary_fr || 'Découvrir nos services'}
          </button>
          <button
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm transition-all"
            style={{ backgroundColor: secBg, color: secTxt, borderRadius: radius, fontWeight: weight, border: `1.5px solid ${secBdr}` }}
          >
            {s.btn_text_services_fr || 'Demander un devis gratuit'} →
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Color Row ─────────────────────────────────────────────────────────────────
function ColorRow({ label, hint, k, s, set }: {
  label: string; hint?: string; k: string
  s: Record<string,string>; set: (k:string,v:string)=>void
}) {
  const val = s[k] || ''
  return (
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={val || '#000000'}
        onChange={e => set(k, e.target.value)}
        className="w-9 h-9 rounded-lg border border-obsidian-200 dark:border-white/10 cursor-pointer bg-transparent p-0.5 flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-obsidian-700 dark:text-obsidian-300">{label}</p>
        {hint && <p className="text-[10px] text-obsidian-400">{hint}</p>}
      </div>
      <code className="text-[10px] font-mono text-obsidian-400 bg-obsidian-50 dark:bg-obsidian-950 px-1.5 py-0.5 rounded">{val || '—'}</code>
      {val && (
        <button onClick={() => set(k, '')} className="text-obsidian-300 hover:text-red-500 transition-colors flex-shrink-0">
          <X size={12} />
        </button>
      )}
    </div>
  )
}

// ── Text Row ──────────────────────────────────────────────────────────────────
function TextRow({ labelFr, labelEn, kFr, kEn, s, set }: {
  labelFr: string; labelEn: string; kFr: string; kEn: string
  s: Record<string,string>; set: (k:string,v:string)=>void
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <div>
        <label className="block text-[10px] font-medium text-obsidian-400 mb-1">🇫🇷 {labelFr}</label>
        <input type="text" value={s[kFr]||''} onChange={e=>set(kFr,e.target.value)}
          className="w-full px-3 py-1.5 bg-obsidian-50 dark:bg-obsidian-950 border border-obsidian-100 dark:border-white/10 rounded-lg text-sm text-obsidian-800 dark:text-white focus:outline-none focus:border-gold-500" />
      </div>
      <div>
        <label className="block text-[10px] font-medium text-obsidian-400 mb-1">🇬🇧 {labelEn}</label>
        <input type="text" value={s[kEn]||''} onChange={e=>set(kEn,e.target.value)}
          className="w-full px-3 py-1.5 bg-obsidian-50 dark:bg-obsidian-950 border border-obsidian-100 dark:border-white/10 rounded-lg text-sm text-obsidian-800 dark:text-white focus:outline-none focus:border-gold-500" />
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ButtonsAdminPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)

  useEffect(() => {
    fetch('/api/settings?category=buttons')
      .then(r => r.json())
      .then((data: any[]) => {
        const map: Record<string,string> = {}
        if (Array.isArray(data)) data.forEach(s => { map[s.key] = s.value })
        setSettings(map)
      })
      .finally(() => setLoading(false))
  }, [])

  const set = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const save = async () => {
    setSaving(true)
    const entries = Object.entries(settings).map(([key, value]) => ({ key, value, category: 'buttons' }))
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entries),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    setSaving(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-gold-500" size={32} />
    </div>
  )

  const shape = settings.btn_shape || 'pill'
  const fw    = settings.btn_font_weight || 'medium'

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-obsidian-950 dark:text-white">Boutons du site</h1>
          <p className="text-sm text-gray-500 mt-1">Forme, couleurs et textes des boutons</p>
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors">
          {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <Check size={15} /> : null}
          {saved ? 'Sauvegardé !' : saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left — controls (3/5) */}
        <div className="lg:col-span-3 space-y-5">

          {/* Shape */}
          <div className="bg-white dark:bg-obsidian-900 border border-obsidian-100 dark:border-white/5 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-obsidian-950 dark:text-white mb-4">Forme</h3>
            <div className="grid grid-cols-4 gap-3">
              {[
                { v: 'pill',      label: 'Pilule',   radius: '9999px', desc: '100% arrondi' },
                { v: 'rounded',   label: 'Arrondi',  radius: '16px',   desc: '16px' },
                { v: 'semiround', label: 'Doux',     radius: '8px',    desc: '8px' },
                { v: 'square',    label: 'Carré',    radius: '2px',    desc: '2px' },
              ].map(opt => (
                <button key={opt.v} onClick={() => set('btn_shape', opt.v)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    shape === opt.v
                      ? 'border-gold-500 bg-gold-500/10'
                      : 'border-obsidian-100 dark:border-white/10 hover:border-obsidian-200'
                  }`}
                >
                  <div className="w-16 h-8 bg-obsidian-800 dark:bg-obsidian-400" style={{ borderRadius: opt.radius }} />
                  <p className="text-[10px] font-medium text-obsidian-700 dark:text-obsidian-300">{opt.label}</p>
                  <p className="text-[9px] text-obsidian-400">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Font weight */}
          <div className="bg-white dark:bg-obsidian-900 border border-obsidian-100 dark:border-white/5 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-obsidian-950 dark:text-white mb-4">Graisse du texte</h3>
            <div className="flex gap-2 flex-wrap">
              {[
                { v:'light',    label:'Léger',    w:'300' },
                { v:'normal',   label:'Normal',   w:'400' },
                { v:'medium',   label:'Moyen',    w:'500' },
                { v:'semibold', label:'Semi-gras', w:'600' },
                { v:'bold',     label:'Gras',     w:'700' },
              ].map(opt => (
                <button key={opt.v} onClick={() => set('btn_font_weight', opt.v)}
                  className={`px-4 py-2 rounded-xl border-2 text-sm transition-all ${
                    fw === opt.v
                      ? 'border-gold-500 bg-gold-500/10 text-gold-600 dark:text-gold-400'
                      : 'border-obsidian-100 dark:border-white/10 text-obsidian-500 hover:border-obsidian-300'
                  }`}
                  style={{ fontWeight: opt.w }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Primary button colors */}
          <div className="bg-white dark:bg-obsidian-900 border border-obsidian-100 dark:border-white/5 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-obsidian-950 dark:text-white mb-1">Bouton Primaire — Couleurs</h3>
            <p className="text-xs text-obsidian-400 mb-5">Hero principal, Header, Process, Formulaire</p>
            <div className="space-y-4">
              <ColorRow label="Fond" hint="Couleur de fond par défaut" k="btn_primary_bg" s={settings} set={set} />
              <ColorRow label="Texte" hint="Couleur du texte" k="btn_primary_text" s={settings} set={set} />
              <ColorRow label="Fond au survol" hint="Couleur au hover" k="btn_primary_hover_bg" s={settings} set={set} />
            </div>
            {/* Quick presets */}
            <div className="mt-5 pt-4 border-t border-obsidian-100 dark:border-white/5">
              <p className="text-[10px] text-obsidian-400 uppercase tracking-wide mb-2">Presets rapides</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { name:'Noir',     bg:'#0f0f0f', text:'#ffffff', hover:'#ffaa00' },
                  { name:'Or',       bg:'#ffaa00', text:'#ffffff', hover:'#b87333' },
                  { name:'Blanc',    bg:'#ffffff', text:'#0f0f0f', hover:'#f5f5f5' },
                  { name:'Marine',   bg:'#1b3a5c', text:'#ffffff', hover:'#ffaa00' },
                  { name:'Émeraude', bg:'#046b3b', text:'#ffffff', hover:'#035430' },
                  { name:'Bordeaux', bg:'#722f37', text:'#ffffff', hover:'#5a2229' },
                ].map(p => (
                  <button key={p.name}
                    onClick={() => { set('btn_primary_bg',p.bg); set('btn_primary_text',p.text); set('btn_primary_hover_bg',p.hover) }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-obsidian-100 dark:border-white/10 text-xs hover:border-gold-400 transition-all"
                  >
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.bg }} />
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Secondary button colors */}
          <div className="bg-white dark:bg-obsidian-900 border border-obsidian-100 dark:border-white/5 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-obsidian-950 dark:text-white mb-1">Bouton Secondaire — Couleurs</h3>
            <p className="text-xs text-obsidian-400 mb-5">Hero secondaire, Services — bordure transparente par défaut</p>
            <div className="space-y-4">
              <ColorRow label="Fond" hint="Transparent par défaut" k="btn_secondary_bg" s={settings} set={set} />
              <ColorRow label="Texte" k="btn_secondary_text" s={settings} set={set} />
              <ColorRow label="Bordure" k="btn_secondary_border" s={settings} set={set} />
              <ColorRow label="Fond au survol" k="btn_secondary_hover_bg" s={settings} set={set} />
            </div>
          </div>

          {/* Button texts */}
          <div className="bg-white dark:bg-obsidian-900 border border-obsidian-100 dark:border-white/5 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-obsidian-950 dark:text-white mb-5">Textes des boutons</h3>
            <div className="space-y-5">
              <div>
                <p className="text-xs font-medium text-obsidian-500 dark:text-obsidian-400 mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gold-500" /> Header — CTA de navigation
                </p>
                <TextRow labelFr="FR" labelEn="EN" kFr="btn_text_header_fr" kEn="btn_text_header_en" s={settings} set={set} />
              </div>
              <div>
                <p className="text-xs font-medium text-obsidian-500 dark:text-obsidian-400 mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gold-500" /> Hero — Bouton principal
                </p>
                <TextRow labelFr="FR" labelEn="EN" kFr="btn_text_hero_primary_fr" kEn="btn_text_hero_primary_en" s={settings} set={set} />
              </div>
              <div>
                <p className="text-xs font-medium text-obsidian-500 dark:text-obsidian-400 mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-obsidian-300" /> Hero — Bouton secondaire
                </p>
                <TextRow labelFr="FR" labelEn="EN" kFr="btn_text_hero_secondary_fr" kEn="btn_text_hero_secondary_en" s={settings} set={set} />
              </div>
              <div>
                <p className="text-xs font-medium text-obsidian-500 dark:text-obsidian-400 mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-obsidian-300" /> Services — CTA bas de section
                </p>
                <TextRow labelFr="FR" labelEn="EN" kFr="btn_text_services_fr" kEn="btn_text_services_en" s={settings} set={set} />
              </div>
              <div>
                <p className="text-xs font-medium text-obsidian-500 dark:text-obsidian-400 mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gold-500" /> Processus — CTA bas de section
                </p>
                <TextRow labelFr="FR" labelEn="EN" kFr="btn_text_process_fr" kEn="btn_text_process_en" s={settings} set={set} />
              </div>
            </div>
          </div>
        </div>

        {/* Right — sticky preview (2/5) */}
        <div className="lg:col-span-2 lg:sticky lg:top-6 h-fit space-y-4">
          <div className="bg-white dark:bg-obsidian-900 border border-obsidian-100 dark:border-white/5 rounded-2xl p-5">
            <p className="text-xs font-medium text-obsidian-400 uppercase tracking-wide mb-4">Aperçu en direct</p>
            <BtnPreview s={settings} />
          </div>

          {/* Recap */}
          <div className="bg-white dark:bg-obsidian-900 border border-obsidian-100 dark:border-white/5 rounded-2xl p-5">
            <p className="text-xs font-medium text-obsidian-400 uppercase tracking-wide mb-3">Récapitulatif</p>
            {[
              { label: 'Forme',   value: { pill:'Pilule (100%)', rounded:'Arrondi (16px)', semiround:'Doux (8px)', square:'Carré (2px)' }[shape] || shape },
              { label: 'Graisse', value: { light:'Léger (300)', normal:'Normal (400)', medium:'Moyen (500)', semibold:'Semi-gras (600)', bold:'Gras (700)' }[fw] || fw },
              { label: 'Primaire bg',  value: settings.btn_primary_bg    || 'Par défaut' },
              { label: 'Primaire txt', value: settings.btn_primary_text   || 'Par défaut' },
              { label: 'Secondaire',   value: settings.btn_secondary_border || 'Par défaut' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center text-xs py-1.5 border-b border-obsidian-50 dark:border-white/5 last:border-0">
                <span className="text-obsidian-400">{label}</span>
                <span className="font-mono text-obsidian-700 dark:text-obsidian-300 max-w-[120px] truncate">{value}</span>
              </div>
            ))}
          </div>

          <div className="bg-gold-500/10 border border-gold-500/20 rounded-xl p-4 text-xs text-obsidian-700 dark:text-obsidian-300">
            <p className="font-semibold mb-1">💡 Application automatique</p>
            <p>Les styles s'appliquent sur tous les boutons CTA du site : Header, Hero, Services, Processus et Formulaire de contact.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
