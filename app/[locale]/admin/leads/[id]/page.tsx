'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import type { Lead } from '@/types'
import { ArrowLeft, Phone, MapPin, Home, MessageSquare, Camera, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const locale = params.locale as string
  const id = params.id as string
  const prefix = locale === 'en' ? '/en/admin' : '/admin'

  const [lead, setLead] = useState<Lead | null>(null)
  const [status, setStatus] = useState('')
  const [notes, setNotes] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/leads/${id}`)
      .then(r => r.json())
      .then(data => {
        // Parse photos from JSON string to array
        if (typeof data.photos === 'string') {
          try { data.photos = JSON.parse(data.photos) } catch { data.photos = [] }
        }
        setLead(data)
        setStatus(data.status || 'new')
        setNotes(data.notes || '')
      })
  }, [id])

  const handleSave = async () => {
    setIsSaving(true)
    await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    })
    setIsSaving(false)
  }

  const handleDelete = async () => {
    if (!confirm('Supprimer ce lead définitivement ?')) return
    await fetch(`/api/leads/${id}`, { method: 'DELETE' })
    router.push(`${prefix}/leads`)
  }

  if (!lead) return (
    <div className="flex items-center justify-center h-48">
      <div className="animate-spin w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full" />
    </div>
  )

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href={`${prefix}/leads`} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-obsidian-800 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-obsidian-950 dark:text-white">{lead.name}</h1>
          <p className="text-xs text-gray-400 mt-0.5">Lead #{lead.id} · {formatDate(lead.createdAt, 'fr')}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Contact info card */}
          <div className="bg-white dark:bg-obsidian-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
            <h2 className="font-medium text-sm text-gray-400 uppercase tracking-wider mb-4">Informations de contact</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <InfoRow icon={Phone} label="Téléphone" value={lead.phone} href={`tel:${lead.phone}`} />
              <InfoRow icon={MapPin} label="Ville" value={lead.city} />
              <InfoRow icon={Home} label="Type de bien" value={lead.propertyType} />
              <InfoRow icon={MessageSquare} label="Message" value={lead.message || '—'} />
            </div>
          </div>

          {/* Photos */}
          {lead.photos?.length > 0 && (
            <div className="bg-white dark:bg-obsidian-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
              <h2 className="font-medium text-sm text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Camera size={14} />
                Photos ({lead.photos.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {lead.photos.map((photo: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPhoto(photo)}
                    className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-obsidian-800 hover:opacity-90 transition-opacity"
                  >
                    <img src={photo} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: status & notes */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-obsidian-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
            <h2 className="font-medium text-sm text-gray-400 uppercase tracking-wider mb-4">Gestion</h2>

            <div className="mb-4">
              <label className="block text-xs text-gray-500 mb-1.5">Statut</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold-400"
              >
                <option value="new">Nouveau</option>
                <option value="contacted">Contacté</option>
                <option value="closed">Fermé</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-xs text-gray-500 mb-1.5">Notes internes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={4}
                className="w-full bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold-400 resize-none"
                placeholder="Notes privées..."
              />
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-2.5 bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Save size={14} />
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>

          <button
            onClick={handleDelete}
            className="w-full py-2.5 bg-white dark:bg-obsidian-900 border border-red-200 dark:border-red-900 text-red-500 rounded-lg text-sm font-medium transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center gap-2"
          >
            <Trash2 size={14} />
            Supprimer ce lead
          </button>
        </div>
      </div>

      {/* Photo lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            src={selectedPhoto}
            alt="Photo"
            className="max-w-full max-h-full rounded-lg"
            onClick={e => e.stopPropagation()}
          />
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            ✕
          </button>
          <a
            href={selectedPhoto}
            download
            className="absolute bottom-4 right-4 px-4 py-2 bg-white text-black rounded-lg text-sm"
            onClick={e => e.stopPropagation()}
          >
            Télécharger
          </a>
        </div>
      )}
    </div>
  )
}

function InfoRow({ icon: Icon, label, value, href }: { icon: React.ElementType; label: string; value: string; href?: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
        <Icon size={12} />
        {label}
      </div>
      {href ? (
        <a href={href} className="text-sm font-medium text-gold-600 hover:underline">{value}</a>
      ) : (
        <p className="text-sm text-obsidian-900 dark:text-white">{value}</p>
      )}
    </div>
  )
}
