'use client'

import { useState, useEffect } from 'react'
import { Save, Check, Loader2, ExternalLink } from 'lucide-react'

const DEFAULTS: Record<string, string> = {
  legal_last_updated_fr: 'mars 2025',
  legal_last_updated_en: 'March 2025',
  legal_s2_fr: 'Ce site est hébergé par :\n\nVercel Inc.\n340 Pine Street, Suite 700, San Francisco, CA 94104, USA\nhttps://vercel.com',
  legal_s2_en: 'This website is hosted by:\n\nVercel Inc.\n340 Pine Street, Suite 700, San Francisco, CA 94104, USA\nhttps://vercel.com',
  legal_s3_fr: "L'ensemble des contenus présents sur ce site (textes, images, vidéos, logos, icônes) sont la propriété exclusive de Guard Conciergerie Luxury Care ou de ses partenaires. Toute reproduction, distribution, modification ou utilisation de ces contenus sans autorisation écrite préalable est strictement interdite.",
  legal_s3_en: 'All content on this website (text, images, videos, logos, icons) is the exclusive property of Guard Conciergerie Luxury Care or its partners. Any reproduction, distribution, modification or use of this content without prior written authorization is strictly prohibited.',
  legal_s4_fr: "Guard Conciergerie Luxury Care s'efforce de fournir des informations exactes et à jour sur ce site. Cependant, nous ne saurions garantir l'exactitude, l'exhaustivité ou l'actualité des informations diffusées. L'utilisateur reconnaît utiliser ces informations sous sa propre responsabilité.",
  legal_s4_en: 'Guard Conciergerie Luxury Care strives to provide accurate and up-to-date information on this website. However, we cannot guarantee the accuracy, completeness or timeliness of the information provided. The user acknowledges using this information under their own responsibility.',
  legal_s5_fr: "Ce site utilise des cookies techniques nécessaires à son bon fonctionnement. Ces cookies ne collectent pas de données personnelles à des fins de traçage. En naviguant sur ce site, vous acceptez l'utilisation de ces cookies.",
  legal_s5_en: 'This website uses technical cookies necessary for its proper functioning. These cookies do not collect personal data for tracking purposes. By browsing this website, you accept the use of these cookies.',
  legal_s6_fr: 'Les présentes mentions légales sont régies par le droit marocain. En cas de litige, et à défaut de résolution amiable, les tribunaux compétents du ressort de Marrakech seront seuls compétents.',
  legal_s6_en: 'These legal notices are governed by Moroccan law. In case of dispute, and in the absence of an amicable resolution, the competent courts of the Marrakech jurisdiction shall have exclusive jurisdiction.',
}

const SECTIONS = [
  {
    key: 'last_updated',
    titleFr: 'Date de mise à jour',
    frKey: 'legal_last_updated_fr',
    enKey: 'legal_last_updated_en',
    rows: 1,
  },
  {
    key: 's2',
    titleFr: '2. Hébergement',
    frKey: 'legal_s2_fr',
    enKey: 'legal_s2_en',
    rows: 6,
  },
  {
    key: 's3',
    titleFr: '3. Propriété intellectuelle',
    frKey: 'legal_s3_fr',
    enKey: 'legal_s3_en',
    rows: 5,
  },
  {
    key: 's4',
    titleFr: '4. Limitation de responsabilité',
    frKey: 'legal_s4_fr',
    enKey: 'legal_s4_en',
    rows: 5,
  },
  {
    key: 's5',
    titleFr: '5. Cookies',
    frKey: 'legal_s5_fr',
    enKey: 'legal_s5_en',
    rows: 5,
  },
  {
    key: 's6',
    titleFr: '6. Droit applicable',
    frKey: 'legal_s6_fr',
    enKey: 'legal_s6_en',
    rows: 5,
  },
]

export default function AdminLegalPage() {
  const [values, setValues] = useState<Record<string, string>>(DEFAULTS)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [toastError, setToastError] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }
  const showError = (msg: string) => { setToastError(msg); setTimeout(() => setToastError(''), 4000) }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/settings?category=legal')
        if (res.ok) {
          const data: Array<{ key: string; value: string }> = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            const merged: Record<string, string> = { ...DEFAULTS }
            data.forEach(item => { merged[item.key] = item.value })
            setValues(merged)
          }
        }
      } catch {
        // keep defaults
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleChange = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const updates = Object.entries(values).map(([key, value]) => ({
        key,
        value,
        category: 'legal',
      }))
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (res.ok) {
        showToast('Mentions légales sauvegardées')
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
          <h1 className="text-2xl font-display font-light text-obsidian-950 dark:text-white">Mentions légales</h1>
          <p className="text-sm text-gray-500 mt-1">Contenu de la page mentions légales</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/legal"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-gold-500 hover:text-gold-600 transition-colors"
          >
            Voir la page <ExternalLink size={13} />
          </a>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2.5 bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {isSaving ? 'Enregistrement...' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div className="mb-6 flex items-start gap-3 px-4 py-3.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-xl text-sm text-amber-800 dark:text-amber-300">
        <span className="flex-shrink-0 mt-0.5">⚠</span>
        <p>
          Section 1 (Éditeur) et Section 7 (Contact) utilisent automatiquement les infos de contact depuis Paramètres.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-5">
        {SECTIONS.map(section => (
          <div
            key={section.key}
            className="bg-white dark:bg-obsidian-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5"
          >
            <h2 className="text-sm font-semibold text-obsidian-950 dark:text-white mb-4">
              {section.titleFr}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  🇫🇷 Français
                </label>
                <textarea
                  value={values[section.frKey] ?? ''}
                  onChange={e => handleChange(section.frKey, e.target.value)}
                  rows={section.rows}
                  className="w-full bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gold-400 resize-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  🇬🇧 English
                </label>
                <textarea
                  value={values[section.enKey] ?? ''}
                  onChange={e => handleChange(section.enKey, e.target.value)}
                  rows={section.rows}
                  className="w-full bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gold-400 resize-none transition-colors"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

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
