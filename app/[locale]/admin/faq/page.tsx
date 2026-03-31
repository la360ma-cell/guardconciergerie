'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, GripVertical, X, Save, Check, ChevronDown, Loader2, HelpCircle } from 'lucide-react'

const emptyFaq = { questionFr: '', questionEn: '', answerFr: '', answerEn: '', category: 'general', order: 0, active: true }

const CATEGORIES: Record<string, { label: string; color: string }> = {
  general:  { label: 'Général',   color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  pricing:  { label: 'Tarifs',    color: 'bg-gold-100 text-gold-700 dark:bg-gold-900/30 dark:text-gold-400' },
  process:  { label: 'Processus', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  services: { label: 'Services',  color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
}

export default function FAQPage() {
  const [items, setItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editModal, setEditModal] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [openId, setOpenId] = useState<number | null>(null)
  const [filterCat, setFilterCat] = useState('all')
  const [draggedId, setDraggedId] = useState<number | null>(null)
  const [dragOverId, setDragOverId] = useState<number | null>(null)

  const fetchData = async () => { try { const res = await fetch('/api/faq'); setItems(await res.json()) } catch { setItems([]) } finally { setIsLoading(false) } }
  useEffect(() => { fetchData() }, [])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleReorder = async (fromId: number, toId: number) => {
    if (fromId === toId) return
    const fromIdx = items.findIndex(x => x.id === fromId)
    const toIdx = items.findIndex(x => x.id === toId)
    const next = [...items]; const [removed] = next.splice(fromIdx, 1); next.splice(toIdx, 0, removed)
    setItems(next)
    await fetch('/api/faq/reorder', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(next.map((x, i) => ({ id: x.id, order: i + 1 }))) })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = editModal.id
        ? await fetch('/api/faq', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editModal) })
        : await fetch('/api/faq', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...editModal, order: items.length + 1 }) })
      if (!res.ok) { showToast('Erreur lors de la sauvegarde'); return }
      setEditModal(null); fetchData(); showToast('FAQ sauvegardé')
    } catch { showToast('Erreur réseau') } finally { setIsSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette question ?')) return
    try {
      const res = await fetch(`/api/faq/${id}`, { method: 'DELETE' })
      if (!res.ok) { showToast('Erreur lors de la suppression'); return }
      fetchData(); showToast('Supprimé')
    } catch { showToast('Erreur réseau') }
  }

  const filtered = filterCat === 'all' ? items : items.filter(x => x.category === filterCat)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-light text-obsidian-950 dark:text-white">FAQ</h1>
          <p className="text-sm text-gray-500 mt-1">{items.length} question(s) · Glisser-déposer pour réorganiser</p>
        </div>
        <button onClick={() => setEditModal({ ...emptyFaq })} className="flex items-center gap-2 px-4 py-2.5 bg-gold-500 hover:bg-gold-600 text-white rounded-xl text-sm font-medium transition-colors">
          <Plus size={14} /> Nouvelle question
        </button>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[{ key: 'all', label: 'Toutes' }, ...Object.entries(CATEGORIES).map(([k, v]) => ({ key: k, label: v.label }))].map(c => (
          <button key={c.key} onClick={() => setFilterCat(c.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filterCat === c.key ? 'bg-obsidian-950 dark:bg-white text-white dark:text-obsidian-950' :
              'bg-white dark:bg-obsidian-900 border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300'
            }`}>
            {c.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-gold-500" size={28} /></div>
      ) : (
        <div className="space-y-2">
          {filtered.length === 0 && (
            <div className="bg-white dark:bg-obsidian-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-12 text-center">
              <HelpCircle size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400">Aucune question dans cette catégorie</p>
            </div>
          )}
          {filtered.map(item => {
            const cat = CATEGORIES[item.category] || CATEGORIES.general
            const isDragging = draggedId === item.id
            const isOver = dragOverId === item.id && draggedId !== item.id
            const isOpen = openId === item.id
            return (
              <div key={item.id} draggable
                onDragStart={() => setDraggedId(item.id)}
                onDragOver={e => { e.preventDefault(); setDragOverId(item.id) }}
                onDrop={e => { e.preventDefault(); if (draggedId) handleReorder(draggedId, item.id); setDraggedId(null); setDragOverId(null) }}
                onDragEnd={() => { setDraggedId(null); setDragOverId(null) }}
                className={`bg-white dark:bg-obsidian-900 rounded-xl border-2 overflow-hidden transition-all duration-150 ${
                  isDragging ? 'opacity-40 scale-[.98] border-gold-300' :
                  isOver ? 'border-gold-500 shadow-lg' :
                  'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <div className="cursor-grab text-gray-300 hover:text-gray-500 flex-shrink-0"><GripVertical size={16} /></div>
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setOpenId(isOpen ? null : item.id)}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm text-obsidian-900 dark:text-white">{item.questionFr}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${cat.color}`}>{cat.label}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{item.questionEn}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => setEditModal({ ...item })} className="p-2 hover:bg-gray-100 dark:hover:bg-obsidian-700 rounded-lg text-gray-400 hover:text-gold-500 transition-colors"><Pencil size={13} /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                    <button onClick={() => setOpenId(isOpen ? null : item.id)} className="p-2 text-gray-400">
                      <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
                {isOpen && (
                  <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-4 grid sm:grid-cols-2 gap-4 bg-gray-50/50 dark:bg-obsidian-950/30">
                    <div><p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">🇫🇷 Réponse</p><p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item.answerFr}</p></div>
                    <div><p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">🇬🇧 Answer</p><p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item.answerEn}</p></div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {editModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setEditModal(null) }}>
          <div className="bg-white dark:bg-obsidian-900 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-obsidian-950 dark:text-white">{editModal.id ? 'Modifier' : 'Nouvelle'} question</h2>
              <button onClick={() => setEditModal(null)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-obsidian-700"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Catégorie</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(CATEGORIES).map(([k, v]) => (
                    <button key={k} onClick={() => setEditModal({ ...editModal, category: k })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${editModal.category === k ? v.color + ' ring-2 ring-offset-1 ring-gold-400' : 'bg-gray-100 dark:bg-obsidian-800 text-gray-500 hover:bg-gray-200'}`}>
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">🇫🇷 Question</label>
                  <input value={editModal.questionFr} onChange={e => setEditModal({ ...editModal, questionFr: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gold-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">🇬🇧 Question</label>
                  <input value={editModal.questionEn} onChange={e => setEditModal({ ...editModal, questionEn: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gold-400" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">🇫🇷 Réponse</label>
                  <textarea value={editModal.answerFr} onChange={e => setEditModal({ ...editModal, answerFr: e.target.value })} rows={5}
                    className="w-full bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gold-400 resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">🇬🇧 Answer</label>
                  <textarea value={editModal.answerEn} onChange={e => setEditModal({ ...editModal, answerEn: e.target.value })} rows={5}
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
