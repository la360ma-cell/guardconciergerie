'use client'

import { useState, useEffect } from 'react'
import { Save, Check, Loader2, ExternalLink } from 'lucide-react'

const DEFAULTS: Record<string, string> = {
  privacy_last_updated_fr: 'mars 2025',
  privacy_last_updated_en: 'March 2025',
  privacy_s1_fr: "Guard Conciergerie Luxury Care (« nous ») s'engage à protéger la vie privée des utilisateurs de son site web. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations personnelles conformément au Règlement Général sur la Protection des Données (RGPD) et à la législation marocaine en vigueur.",
  privacy_s1_en: 'Guard Conciergerie Luxury Care ("we") is committed to protecting the privacy of users of its website. This privacy policy explains how we collect, use and protect your personal information in accordance with the General Data Protection Regulation (GDPR) and applicable Moroccan legislation.',
  privacy_s2_fr: "Nous collectons uniquement les données nécessaires à la fourniture de nos services :\n• Nom et prénom\n• Adresse email\n• Numéro de téléphone\n• Type et localisation du bien immobilier\n• Message et informations complémentaires\n• Données de navigation (cookies techniques)",
  privacy_s2_en: "We only collect data necessary for the provision of our services:\n• First and last name\n• Email address\n• Phone number\n• Property type and location\n• Message and additional information\n• Browsing data (technical cookies)",
  privacy_s3_fr: "Vos données sont utilisées pour :\n• Répondre à vos demandes de contact et d'évaluation\n• Vous proposer nos services de conciergerie et de gestion locative\n• Améliorer notre site web et nos services\n• Respecter nos obligations légales et réglementaires",
  privacy_s3_en: "Your data is used for:\n• Responding to your contact and evaluation requests\n• Offering our concierge and rental management services\n• Improving our website and services\n• Complying with our legal and regulatory obligations",
  privacy_s4_fr: "Le traitement de vos données repose sur votre consentement explicite lors de la soumission du formulaire de contact, et sur notre intérêt légitime à répondre à vos demandes et à améliorer nos services.",
  privacy_s4_en: 'The processing of your data is based on your explicit consent when submitting the contact form, and on our legitimate interest in responding to your requests and improving our services.',
  privacy_s5_fr: "Vos données personnelles sont conservées pendant une durée maximale de 3 ans à compter du dernier contact. Au-delà de cette période, elles sont supprimées ou anonymisées, sauf obligation légale contraire.",
  privacy_s5_en: 'Your personal data is retained for a maximum period of 3 years from the last contact. Beyond this period, it is deleted or anonymized, unless there is a contrary legal obligation.',
  privacy_s6_fr: "Nous ne vendons, ne louons et ne partageons pas vos données personnelles avec des tiers à des fins commerciales. Vos données peuvent uniquement être transmises à des prestataires techniques (hébergeur, service d'emailing) dans le strict cadre de la fourniture de nos services.",
  privacy_s6_en: 'We do not sell, rent or share your personal data with third parties for commercial purposes. Your data may only be passed on to technical service providers (hosting, email service) strictly within the framework of providing our services.',
  privacy_s7_fr: "Conformément au RGPD, vous disposez des droits suivants :\n• Droit d'accès — obtenir une copie de vos données\n• Droit de rectification — corriger des données inexactes\n• Droit à l'effacement — demander la suppression de vos données\n• Droit à la portabilité — recevoir vos données dans un format structuré\n• Droit d'opposition — vous opposer au traitement\n• Droit à la limitation — limiter le traitement dans certains cas",
  privacy_s7_en: "In accordance with the GDPR, you have the following rights:\n• Right of access — obtain a copy of your data\n• Right of rectification — correct inaccurate data\n• Right to erasure — request deletion of your data\n• Right to portability — receive your data in a structured format\n• Right to object — object to the processing\n• Right to restriction — restrict processing in certain cases",
  privacy_s8_fr: "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, toute divulgation, altération ou destruction. Notre site utilise le protocole HTTPS pour sécuriser les échanges de données.",
  privacy_s8_en: 'We implement appropriate technical and organizational measures to protect your data against unauthorized access, disclosure, alteration or destruction. Our website uses the HTTPS protocol to secure data exchanges.',
  privacy_s9_fr: "Notre site utilise uniquement des cookies techniques essentiels au bon fonctionnement du site (gestion des sessions, préférences de langue, thème). Ces cookies ne sont pas utilisés à des fins publicitaires ou de traçage comportemental.",
  privacy_s9_en: 'Our website uses only technical cookies essential to the proper functioning of the site (session management, language preferences, theme). These cookies are not used for advertising or behavioral tracking purposes.',
  privacy_s10_fr: "Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les modifications seront publiées sur cette page avec une date de mise à jour. Nous vous encourageons à consulter régulièrement cette page.",
  privacy_s10_en: 'We reserve the right to modify this privacy policy at any time. Changes will be posted on this page with an updated date. We encourage you to regularly review this page.',
}

const SECTIONS = [
  {
    key: 'last_updated',
    titleFr: 'Date de mise à jour',
    frKey: 'privacy_last_updated_fr',
    enKey: 'privacy_last_updated_en',
    rows: 1,
  },
  {
    key: 's1',
    titleFr: '1. Introduction',
    frKey: 'privacy_s1_fr',
    enKey: 'privacy_s1_en',
    rows: 5,
  },
  {
    key: 's2',
    titleFr: '2. Données collectées',
    frKey: 'privacy_s2_fr',
    enKey: 'privacy_s2_en',
    rows: 6,
  },
  {
    key: 's3',
    titleFr: '3. Finalités du traitement',
    frKey: 'privacy_s3_fr',
    enKey: 'privacy_s3_en',
    rows: 6,
  },
  {
    key: 's4',
    titleFr: '4. Base légale du traitement',
    frKey: 'privacy_s4_fr',
    enKey: 'privacy_s4_en',
    rows: 5,
  },
  {
    key: 's5',
    titleFr: '5. Conservation des données',
    frKey: 'privacy_s5_fr',
    enKey: 'privacy_s5_en',
    rows: 5,
  },
  {
    key: 's6',
    titleFr: '6. Partage des données',
    frKey: 'privacy_s6_fr',
    enKey: 'privacy_s6_en',
    rows: 5,
  },
  {
    key: 's7',
    titleFr: '7. Vos droits',
    frKey: 'privacy_s7_fr',
    enKey: 'privacy_s7_en',
    rows: 6,
  },
  {
    key: 's8',
    titleFr: '8. Sécurité',
    frKey: 'privacy_s8_fr',
    enKey: 'privacy_s8_en',
    rows: 5,
  },
  {
    key: 's9',
    titleFr: '9. Cookies',
    frKey: 'privacy_s9_fr',
    enKey: 'privacy_s9_en',
    rows: 5,
  },
  {
    key: 's10',
    titleFr: '10. Modifications',
    frKey: 'privacy_s10_fr',
    enKey: 'privacy_s10_en',
    rows: 5,
  },
]

export default function AdminPrivacyPage() {
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
        const res = await fetch('/api/settings?category=privacy')
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
        category: 'privacy',
      }))
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (res.ok) {
        showToast('Politique de confidentialité sauvegardée')
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
          <h1 className="text-2xl font-display font-light text-obsidian-950 dark:text-white">Politique de confidentialité</h1>
          <p className="text-sm text-gray-500 mt-1">Contenu de la page politique de confidentialité</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/privacy"
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
          Section 7 (Vos droits) et Section 11 (Contact DPO) affichent automatiquement l&apos;email de contact depuis Paramètres.
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
