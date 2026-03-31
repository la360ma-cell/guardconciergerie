'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, GripVertical, X, Save, Check, Home, Clock, TrendingUp, Wrench, Camera, BarChart3, Star, Shield, Key, HeartHandshake, Loader2, type LucideIcon } from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  Home, Clock, TrendingUp, Wrench, Camera, BarChart3, Star, Shield, Key, HeartHandshake,
}
const ICON_OPTIONS = Object.keys(ICON_MAP)

const emptyService = { titleFr: '', titleEn: '', descFr: '', descEn: '', icon: 'Star', order: 0, active: true }

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editModal, setEditModal] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [draggedId, setDraggedId] = useState<number | null>(null)
  const [dragOverId, setDragOverId] = useState<number | null>(null)

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services')
      setServices(await res.json())
    } catch { setServices([]) } finally { setIsLoading(false) }
  }
  useEffect(() => { fetchServices() }, [])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleReorder = async (fromId: number, toId: number) => {
    if (fromId === toId) return
    const fromIdx = services.findIndex(s => s.id === fromId)
    const toIdx = services.findIndex(s => s.id === toId)
    const next = [...services]
    const [removed] = next.splice(fromIdx, 1)
    next.splice(toIdx, 0, removed)
    setServices(next)
    await fetch('/api/services/reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next.map((s, i) => ({ id: s.id, order: i + 1 }))),
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = editModal.id
        ? await fetch('/api/services', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editModal) })
        : await fetch('/api/services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...editModal, order: services.length + 1 }) })
      if (!res.ok) { showToast('Erreur lors de la sauvegarde'); return }
      setEditModal(null); fetchServices(); showToast('Service sauvegardé')
    } catch { showToast('Erreur réseau') } finally { setIsSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce service ?')) return
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' })
      if (!res.ok) { showToast('Erreur lors de la suppression'); return }
      fetchServices(); showToast('Service supprimé')
    } catch { showToast('Erreur réseau') }
  }

  const toggleActive = async (service: any) => {
    try {
      const res = await fetch(`/api/services/${service.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !service.active }),
      })
      if (!res.ok) { showToast('Erreur lors de la mise à jour'); return }
      setServices(prev => prev.map(s => s.id === service.id ? { ...s, active: !s.active } : s))
    } catch { showToast('Erreur réseau') }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-light text-obsidian-950 dark:text-white">Services</h1>
          <p className="text-sm text-gray-500 mt-1">{services.length} service(s) · Glisser-déposer pour réorganiser</p>
        </div>
        <button onClick={() => setEditModal({ ...emptyService })}
          className="flex items-center gap-2 px-4 py-2.5 bg-gold-500 hover:bg-gold-600 text-white rounded-xl text-sm font-medium transition-colors">
          <Plus size={14} /> Nouveau service
        </button>
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-gold-500" size={28} /></div>
        ) : services.length === 0 ? (
          <div className="bg-white dark:bg-obsidian-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-12 text-center">
            <Star size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400">Aucun service — créez-en un !</p>
          </div>
        ) : services.map(service => {
          const IconComp = ICON_MAP[service.icon] || Star
          const isDragging = draggedId === service.id
          const isOver = dragOverId === service.id && draggedId !== service.id
          return (
            <div key={service.id}
              draggable
              onDragStart={() => setDraggedId(service.id)}
              onDragOver={e => { e.preventDefault(); setDragOverId(service.id) }}
              onDrop={e => { e.preventDefault(); if (draggedId) handleReorder(draggedId, service.id); setDraggedId(null); setDragOverId(null) }}
              onDragEnd={() => { setDraggedId(null); setDragOverId(null) }}
              className={`bg-white dark:bg-obsidian-900 rounded-xl border-2 transition-all duration-150 ${
                isDragging ? 'opacity-40 scale-[.98] border-gold-300' :
                isOver ? 'border-gold-500 shadow-lg -translate-y-0.5' :
                'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
              }`}
            >
              <div className="flex items-center gap-3 px-4 py-3.5">
                <div className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-colors touch-none">
                  <GripVertical size={18} />
                </div>
                <div className="w-9 h-9 rounded-xl bg-gold-50 dark:bg-gold-900/20 flex items-center justify-center flex-shrink-0">
                  <IconComp size={16} className="text-gold-600 dark:text-gold-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium text-sm text-obsidian-900 dark:text-white">{service.titleFr}</span>
                    <span className="text-[10px] text-gray-400 hidden sm:inline">/ {service.titleEn}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{service.descFr}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => toggleActive(service)} title={service.active ? 'Désactiver' : 'Activer'}
                    className={`relative w-10 h-5 rounded-full transition-colors ${service.active ? 'bg-gold-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${service.active ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                  <button onClick={() => setEditModal({ ...service })} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-obsidian-700 text-gray-400 hover:text-gold-500 transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(service.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {editModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setEditModal(null) }}>
          <div className="bg-white dark:bg-obsidian-900 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-obsidian-950 dark:text-white">{editModal.id ? 'Modifier le service' : 'Nouveau service'}</h2>
              <button onClick={() => setEditModal(null)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-obsidian-700 transition-colors"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Icône</label>
                <div className="grid grid-cols-5 gap-2">
                  {ICON_OPTIONS.map(iconName => {
                    const Icon = ICON_MAP[iconName]
                    return (
                      <button key={iconName} onClick={() => setEditModal({ ...editModal, icon: iconName })}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                          editModal.icon === iconName ? 'border-gold-500 bg-gold-50 dark:bg-gold-900/20' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200'
                        }`}>
                        <Icon size={20} className={editModal.icon === iconName ? 'text-gold-600' : 'text-gray-400'} />
                        <span className="text-[9px] text-gray-400 truncate w-full text-center">{iconName}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">🇫🇷 Titre</label>
                  <input value={editModal.titleFr} onChange={e => setEditModal({ ...editModal, titleFr: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gold-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">🇬🇧 Title</label>
                  <input value={editModal.titleEn} onChange={e => setEditModal({ ...editModal, titleEn: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gold-400" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">🇫🇷 Description</label>
                  <textarea value={editModal.descFr} onChange={e => setEditModal({ ...editModal, descFr: e.target.value })} rows={4}
                    className="w-full bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gold-400 resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">🇬🇧 Description</label>
                  <textarea value={editModal.descEn} onChange={e => setEditModal({ ...editModal, descEn: e.target.value })} rows={4}
                    className="w-full bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gold-400 resize-none" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-obsidian-950/30 rounded-b-2xl">
              <button onClick={() => setEditModal(null)} className="px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-obsidian-700 transition-colors">Annuler</button>
              <button onClick={handleSave} disabled={isSaving} className="px-5 py-2.5 text-sm bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-white rounded-xl flex items-center gap-2 transition-colors">
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-obsidian-950 text-white px-4 py-3 rounded-xl text-sm shadow-xl z-50 flex items-center gap-2 border border-white/10">
          <Check size={14} className="text-gold-400" /> {toast}
        </div>
      )}
    </div>
  )
}
