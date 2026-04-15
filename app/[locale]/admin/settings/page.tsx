'use client'

import React, { useState, useEffect } from 'react'
import { Save, Instagram, Facebook, Linkedin, Youtube, Twitter, ExternalLink } from 'lucide-react'

interface SettingItem {
  key: string
  value: string
}

function TikTokIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.13a8.22 8.22 0 0 0 4.79 1.52V7.2a4.85 4.85 0 0 1-1.02-.51Z"/>
    </svg>
  )
}

const SOCIAL_META: Record<string, { label: string; icon: React.ReactNode; placeholder: string; color: string }> = {
  social_instagram: {
    label: 'Instagram',
    icon: <Instagram size={14} />,
    placeholder: 'https://instagram.com/votre-compte',
    color: '#E1306C',
  },
  social_facebook: {
    label: 'Facebook',
    icon: <Facebook size={14} />,
    placeholder: 'https://facebook.com/votre-page',
    color: '#1877F2',
  },
  social_tiktok: {
    label: 'TikTok',
    icon: <TikTokIcon size={14} />,
    placeholder: 'https://tiktok.com/@votre-compte',
    color: '#010101',
  },
  social_linkedin: {
    label: 'LinkedIn',
    icon: <Linkedin size={14} />,
    placeholder: 'https://linkedin.com/company/votre-page',
    color: '#0A66C2',
  },
  social_youtube: {
    label: 'YouTube',
    icon: <Youtube size={14} />,
    placeholder: 'https://youtube.com/@votre-chaine',
    color: '#FF0000',
  },
  social_twitter: {
    label: 'X / Twitter',
    icon: <Twitter size={14} />,
    placeholder: 'https://twitter.com/votre-compte',
    color: '#000000',
  },
}

const CATEGORIES = [
  { key: 'general', label: 'Général', icon: '⚙️' },
  { key: 'contact', label: 'Contact', icon: '📞' },
  { key: 'social', label: 'Réseaux sociaux', icon: '🌐' },
  { key: 'stats', label: 'Statistiques', icon: '📊' },
  { key: 'notifications', label: 'Notifications / SMTP', icon: '🔔' },
  { key: 'whatsapp', label: 'WhatsApp', icon: '💬' },
  { key: 'form', label: 'Formulaire', icon: '📝' },
]

const COLOR_KEYS = ['appearance_primary_color']

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingItem[]>([])
  const [activeCategory, setActiveCategory] = useState('general')
  const [changes, setChanges] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [toastError, setToastError] = useState('')

  const fetchData = async () => {
    const res = await fetch('/api/settings')
    setSettings(await res.json())
    setChanges({})
  }

  useEffect(() => { fetchData() }, [])

  const filtered = settings.filter(s => s.category === activeCategory)
  const primaryColorSetting = settings.find(s => s.key === 'appearance_primary_color')
  const primaryColorValue = changes['appearance_primary_color'] ?? primaryColorSetting?.value ?? '#ffaa00'

  const getValue = (setting: SettingItem) => changes[setting.key] ?? setting.value ?? ''

  const handleChange = (key: string, value: string) => {
    setChanges(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    if (Object.keys(changes).length === 0) return
    setIsSaving(true)
    try {
      const updates = Object.entries(changes).map(([key, value]) => {
        const setting = settings.find(s => s.key === key)
        return { key, value, category: setting?.category || 'general' }
      })
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (res.ok) {
        setToast('Paramètres sauvegardés ✓')
        setTimeout(() => setToast(''), 3000)
        fetchData()
      } else {
        const data = await res.json().catch(() => ({}))
        setToastError(data.error || 'Erreur lors de la sauvegarde')
        setTimeout(() => setToastError(''), 4000)
      }
    } catch {
      setToastError('Erreur réseau — impossible de sauvegarder')
      setTimeout(() => setToastError(''), 4000)
    } finally {
      setIsSaving(false)
    }
  }

  const labelMap: Record<string, string> = {
    site_name: 'Nom du site',
    site_tagline_fr: 'Slogan (FR)',
    site_tagline_en: 'Slogan (EN)',
    contact_email: 'Email de contact',
    contact_phone: 'Téléphone',
    contact_whatsapp: 'WhatsApp',
    contact_address_fr: 'Adresse (FR)',
    contact_address_en: 'Adresse (EN)',
    stat_properties: 'Nombre de biens',
    stat_clients: 'Taux satisfaction',
    stat_years: "Années d'expertise",
    stat_revenue: 'Revenus en plus',
    stat_properties_label_fr: 'Label biens (FR)',
    stat_properties_label_en: 'Label biens (EN)',
    stat_clients_label_fr: 'Label clients (FR)',
    stat_clients_label_en: 'Label clients (EN)',
    stat_years_label_fr: 'Label années (FR)',
    stat_years_label_en: 'Label années (EN)',
    stat_revenue_label_fr: 'Label revenus (FR)',
    stat_revenue_label_en: 'Label revenus (EN)',
    notification_email: 'Email de notification (destinataire)',
    smtp_host: 'Serveur SMTP (ex: smtp.gmail.com)',
    smtp_port: 'Port SMTP (587 ou 465)',
    smtp_user: 'Utilisateur SMTP (votre email)',
    smtp_pass: 'Mot de passe SMTP',
    smtp_from: 'Expéditeur (ex: Guard <noreply@...>)',
    whatsapp_button_enabled: 'Activer le bouton WhatsApp (true / false)',
    whatsapp_button_message: 'Message pré-rempli WhatsApp',
    form_confirmation_fr: 'Message de confirmation (FR)',
    form_confirmation_en: 'Message de confirmation (EN)',
    form_button_fr: 'Texte bouton (FR)',
    form_button_en: 'Texte bouton (EN)',
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-obsidian-950 dark:text-white">Paramètres</h1>
          <p className="text-sm text-gray-500 mt-1">Configuration générale du site</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || Object.keys(changes).length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white rounded-lg text-sm"
        >
          <Save size={14} />
          {isSaving ? 'Sauvegarde...' : `Sauvegarder${Object.keys(changes).length > 0 ? ` (${Object.keys(changes).length})` : ''}`}
        </button>
      </div>

      {/* ── Quick Access: Primary Color ── */}
      <div className="mb-6 bg-white dark:bg-obsidian-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm font-semibold text-obsidian-950 dark:text-white mb-0.5">🎨 Couleur principale du site</p>
            <p className="text-xs text-gray-400">Couleur or/accent appliquée sur tout le site (boutons, titres, icônes…)</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="color"
                value={primaryColorValue}
                onChange={e => handleChange('appearance_primary_color', e.target.value)}
                className="w-10 h-10 rounded-lg border-2 border-gray-200 dark:border-gray-700 cursor-pointer p-0.5 bg-transparent"
                style={{ accentColor: primaryColorValue }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <input
                type="text"
                value={primaryColorValue}
                onChange={e => handleChange('appearance_primary_color', e.target.value)}
                className="w-28 bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none focus:border-gold-400"
              />
              <div className="flex gap-1.5">
                {['#ffaa00','#c9880f','#b5750d','#e8a53c','#f0c060'].map(c => (
                  <button
                    key={c}
                    onClick={() => handleChange('appearance_primary_color', c)}
                    title={c}
                    className="w-5 h-5 rounded-full border-2 transition-all"
                    style={{ backgroundColor: c, borderColor: primaryColorValue === c ? '#000' : 'transparent' }}
                  />
                ))}
              </div>
            </div>
            <div className="w-14 h-10 rounded-lg shadow-sm border border-gray-200 dark:border-white/10 flex items-center justify-center" style={{ backgroundColor: primaryColorValue }}>
              <span className="text-[10px] text-white font-bold drop-shadow">Aa</span>
            </div>
          </div>
        </div>
        {'appearance_primary_color' in changes && (
          <p className="mt-2 text-xs text-orange-500">● Modifié — n&apos;oubliez pas de sauvegarder</p>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeCategory === cat.key
                ? 'bg-obsidian-950 dark:bg-white text-white dark:text-obsidian-950'
                : 'bg-white dark:bg-obsidian-900 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-obsidian-800'
            }`}
          >
            <span>{cat.icon}</span> {cat.label}
          </button>
        ))}
      </div>

      {/* Settings fields */}
      <div className="bg-white dark:bg-obsidian-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">

        {/* ── Social Networks: special card layout ── */}
        {activeCategory === 'social' ? (
          <div className="space-y-3">
            <p className="text-xs text-gray-400 mb-4">
              Renseignez les URL complètes de vos profils. Les icônes apparaîtront automatiquement dans le footer du site.
            </p>
            {Object.entries(SOCIAL_META).map(([key, meta]) => {
              const setting = settings.find(s => s.key === key)
              const value = changes[key] ?? setting?.value ?? ''
              const isChanged = key in changes
              const hasValue = value && value !== '#'
              return (
                <div key={key} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-obsidian-950/50">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                    style={{ backgroundColor: meta.color }}
                  >
                    {meta.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="flex items-center gap-1.5 text-xs font-medium text-obsidian-700 dark:text-obsidian-300 mb-1">
                      {meta.label}
                      {isChanged && <span className="text-orange-500">● Modifié</span>}
                    </label>
                    <input
                      type="url"
                      value={value}
                      onChange={e => handleChange(key, e.target.value)}
                      placeholder={meta.placeholder}
                      className="w-full bg-white dark:bg-obsidian-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-gold-400"
                    />
                  </div>
                  {hasValue && (
                    <a
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 p-2 rounded-lg bg-white dark:bg-obsidian-800 border border-gray-200 dark:border-white/10 text-gray-400 hover:text-gold-500 transition-colors"
                      title="Ouvrir le lien"
                    >
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Aucun paramètre dans cette catégorie</p>
            ) : (
              filtered.map(setting => {
                const isTextarea = (setting.value?.length > 80) || setting.key.includes('confirmation')
                const isColorKey = COLOR_KEYS.includes(setting.key)
                const isChanged = setting.key in changes
                const currentVal = getValue(setting)
                return (
                  <div key={setting.key}>
                    <label className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
                      {labelMap[setting.key] || setting.key}
                      {isChanged && <span className="text-orange-500">● Modifié</span>}
                    </label>
                    {isColorKey ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={currentVal || '#000000'}
                          onChange={e => handleChange(setting.key, e.target.value)}
                          className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer p-0.5 bg-transparent"
                        />
                        <input
                          type="text"
                          value={currentVal}
                          onChange={e => handleChange(setting.key, e.target.value)}
                          className="flex-1 bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-gold-400"
                        />
                      </div>
                    ) : isTextarea ? (
                      <textarea
                        value={currentVal}
                        onChange={e => handleChange(setting.key, e.target.value)}
                        rows={2}
                        className="w-full bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-gold-400"
                      />
                    ) : (
                      <input
                        type="text"
                        value={currentVal}
                        onChange={e => handleChange(setting.key, e.target.value)}
                        className="w-full bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold-400"
                      />
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>

      {toast && <div className="fixed bottom-6 right-6 bg-obsidian-900 text-white px-4 py-2.5 rounded-lg text-sm shadow-xl z-50">{toast}</div>}
      {toastError && <div className="fixed bottom-6 right-6 bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm shadow-xl z-50">⚠ {toastError}</div>}
    </div>
  )
}
