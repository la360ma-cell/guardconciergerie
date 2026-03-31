'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, GripVertical, X, Save, Star, Check, Loader2, Quote } from 'lucide-react'

const emptyItem = { name: '', location: '', textFr: '', textEn: '', rating: 5, order: 0, active: true }

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button" onClick={() => onChange(n)} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} className="transition-transform hover:scale-110">
          <Star size={22} className={`transition-colors ${n <= (hover || value) ? 'fill-gold-500 text-gold-500' : 'text-gray-300'}`} />
        </button>
      ))}
    </div>
  )
}

export default function TestimonialsPage() {
  const [items, setItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editModal, setEditModal] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [draggedId, setDraggedId] = useState<number | null>(null)
  const [dragOverId, setDragOverId] = useState<number | null>(null)

  const fetchData = async () => { try { const res = await fetch('/api/testimonials'); setItems(await res.json()) } catch { setItems([]) } finally { setIsLoading(false) } }
  useEffect(() => { fetchData() }, [])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleReorder = async (fromId: number, toId: number) => {
    if (fromId === toId) return
    const fromIdx = items.findIndex(x => x.id === fromId)
    const toIdx = items.findIndex(x => x.id === toId)
    const next = [...items]; const [removed] = next.splice(fromIdx, 1); next.splice(toIdx, 0, removed)
    setItems(next)
    await fetch('/api/testimonials/reorder', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(next.map((x, i) => ({ id: x.id, order: i + 1 }))) })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = editModal.id
        ? await fetch('/api/testimonials', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editModal) })
        : await fetch('/api/testimonials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...editModal, order: items.length + 1 }) })
      if (!res.ok) { showToast('Erreur lors de la sauvegarde'); return }
      setEditModal(null); fetchData(); showToast('Témoignage sauvegardé')
    } catch { showToast('Erreur réseau') } finally { setIsSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce témoignage ?')) return
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' })
      if (!res.ok) { showToast('Erreur lors de la suppression'); return }
      fetchData(); showToast('Supprimé')
    } catch { showToast('Erreur réseau') }
  }

  const toggleActive = async (item: any) => {
    try {
      const res = await fetch(`/api/testimonials/${item.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !item.active }) })
      if (!res.ok) { showToast('Erreur lors de la mise à jour'); return }
      setItems(prev => prev.map(x => x.id === item.id ? { ...x, active: !x.active } : x))
    } catch { showToast('Erreur réseau') }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-light text-obsidian-950 dark:text-white">Témoignages</h1>
          <p className="text-sm text-gray-500 mt-1">{items.length} témoignage(s) · Glisser-déposer pour réorganiser</p>
        </div>
        <button onClick={() => setEditModal({ ...emptyItem })} className="flex items-center gap-2 px-4 py-2.5 bg-gold-500 hover:bg-gold-600 text-white rounded-xl text-sm font-medium transition-colors">
          <Plus size={14} /> Nouveau
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-gold-500" size={28} /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map(item => {
            const isDragging = draggedId === item.id
            const isOver = dragOverId === item.id && draggedId !== item.id
            return (
              <div key={item.id} draggable
                onDragStart={() => setDraggedId(item.id)}
                onDragOver={e => { e.preventDefault(); setDragOverId(item.id) }}
                onDrop={e => { e.preventDefault(); if (draggedId) handleReorder(draggedId, item.id); setDraggedId(null); setDragOverId(null) }}
                onDragEnd={() => { setDraggedId(null); setDragOverId(null) }}
                className={`bg-white dark:bg-obsidian-900 rounded-xl border-2 p-5 flex flex-col transition-all duration-150 ${
                  isDragging ? 'opacity-40 scale-95 border-gold-300' :
                  isOver ? 'border-gold-500 shadow-lg -translate-y-0.5' :
                  'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="cursor-grab text-gray-300 hover:text-gray-400 mt-0.5"><GripVertical size={16} /></div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-obsidian-900 dark:text-white">{item.name}</div>
                      <div className="text-xs text-gray-400">{item.location}</div>
                    </div>
                  </div>
                  <button onClick={() => toggleActive(item)}
                    className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${item.active ? 'bg-gold-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${item.active ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className={i < item.rating ? 'fill-gold-500 text-gold-500' : 'text-gray-200 dark:text-gray-700'} />
                  ))}
                </div>
                <div className="relative flex-1 mb-4">
                  <Quote size={14} className="absolute -top-1 -left-1 text-gold-200 dark:text-gold-900/50" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 pl-4 italic">{item.textFr}</p>
                </div>
                <div className="flex justify-end gap-1 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <button onClick={() => setEditModal({ ...item })} className="p-2 hover:bg-gray-100 dark:hover:bg-obsidian-700 rounded-lg text-gray-400 hover:text-gold-500 transition-colors"><Pencil size={13} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                </div>
              </div>
            )
          })}
          <button onClick={() => setEditModal({ ...emptyItem })}
            className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-5 flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-gold-400 hover:text-gold-500 transition-all min-h-[180px]">
            <Plus size={24} /><span className="text-sm">Ajouter</span>
          </button>
        </div>
      )}

      {editModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setEditModal(null) }}>
          <div className="bg-white dark:bg-obsidian-900 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-obsidian-950 dark:text-white">{editModal.id ? 'Modifier' : 'Nouveau'} témoignage</h2>
              <button onClick={() => setEditModal(null)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-obsidian-700 transition-colors"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Nom complet</label>
                  <input value={editModal.name} onChange={e => setEditModal({ ...editModal, name: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gold-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Localisation</label>
                  <input value={editModal.location} onChange={e => setEditModal({ ...editModal, location: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gold-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Note</label>
                <StarRating value={editModal.rating} onChange={v => setEditModal({ ...editModal, rating: v })} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">🇫🇷 Texte</label>
                  <textarea value={editModal.textFr} onChange={e => setEditModal({ ...editModal, textFr: e.target.value })} rows={5}
                    className="w-full bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gold-400 resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">🇬🇧 Text</label>
                  <textarea value={editModal.textEn} onChange={e => setEditModal({ ...editModal, textEn: e.target.value })} rows={5}
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
