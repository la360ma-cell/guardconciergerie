'use client'

import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'

const PAGES = ['home']

export default function SEOPage() {
  const [configs, setConfigs] = useState<Record<string, any>>({})
  const [activeLocale, setActiveLocale] = useState<'fr' | 'en'>('fr')
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState('')

  const fetchData = async () => {
    const res = await fetch('/api/seo')
    const data = await res.json()
    const mapped: Record<string, any> = {}
    data.forEach((item: any) => { mapped[`${item.page}_${item.locale}`] = item })
    setConfigs(mapped)
  }

  useEffect(() => { fetchData() }, [])

  const handleChange = (page: string, locale: string, field: string, value: string) => {
    const key = `${page}_${locale}`
    setConfigs(prev => ({
      ...prev,
      [key]: { ...(prev[key] || { page, locale }), [field]: value }
    }))
  }

  const getVal = (page: string, locale: string, field: string) => {
    return configs[`${page}_${locale}`]?.[field] || ''
  }

  const handleSave = async () => {
    setIsSaving(true)
    for (const config of Object.values(configs)) {
      if (config.page && config.locale) {
        await fetch('/api/seo', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config),
        })
      }
    }
    setToast('SEO sauvegardé')
    setTimeout(() => setToast(''), 3000)
    setIsSaving(false)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-obsidian-950 dark:text-white">SEO</h1>
          <p className="text-sm text-gray-500 mt-1">Métadonnées par page et par langue</p>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg text-sm disabled:opacity-50">
          <Save size={14} />{isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>

      {/* Locale toggle */}
      <div className="flex gap-2 mb-6">
        {(['fr', 'en'] as const).map(locale => (
          <button key={locale} onClick={() => setActiveLocale(locale)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeLocale === locale ? 'bg-obsidian-950 dark:bg-white text-white dark:text-obsidian-950' : 'bg-white dark:bg-obsidian-900 border border-gray-200 dark:border-gray-700'
            }`}>
            {locale === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}
          </button>
        ))}
      </div>

      {PAGES.map(page => (
        <div key={page} className="bg-white dark:bg-obsidian-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 mb-4">
          <h3 className="font-medium text-obsidian-900 dark:text-white mb-4 capitalize flex items-center gap-2">
            Page: <code className="text-gold-500 text-sm">{page}</code>
            <span className="text-xs text-gray-400">({activeLocale.toUpperCase()})</span>
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Title (balise &lt;title&gt;)</label>
              <input value={getVal(page, activeLocale, 'title')} onChange={e => handleChange(page, activeLocale, 'title', e.target.value)}
                className="w-full bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold-400"
                placeholder="Titre de la page" />
              <div className="text-right text-xs text-gray-400 mt-1">
                {getVal(page, activeLocale, 'title').length} / 60 caractères recommandés
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Meta description</label>
              <textarea value={getVal(page, activeLocale, 'description')} onChange={e => handleChange(page, activeLocale, 'description', e.target.value)}
                rows={3} className="w-full bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-gold-400"
                placeholder="Description de la page" />
              <div className="text-right text-xs text-gray-400 mt-1">
                {getVal(page, activeLocale, 'description').length} / 160 caractères recommandés
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Mots-clés</label>
              <input value={getVal(page, activeLocale, 'keywords')} onChange={e => handleChange(page, activeLocale, 'keywords', e.target.value)}
                className="w-full bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold-400"
                placeholder="mot1, mot2, mot3" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">OG Image URL</label>
              <input value={getVal(page, activeLocale, 'ogImage')} onChange={e => handleChange(page, activeLocale, 'ogImage', e.target.value)}
                className="w-full bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold-400"
                placeholder="/images/og-image.jpg" />
            </div>
          </div>
        </div>
      ))}

      {toast && <div className="fixed bottom-6 right-6 bg-obsidian-900 text-white px-4 py-2.5 rounded-lg text-sm shadow-xl z-50">✓ {toast}</div>}
    </div>
  )
}
