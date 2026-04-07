'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Save, GripVertical, Eye, EyeOff } from 'lucide-react'

interface FormFieldItem {
  id: number
  name: string
  label: string
  type: string
  required: boolean
  options: string | null
  order: number
  active: boolean
}

const fieldTypes = ['text', 'tel', 'email', 'select', 'textarea', 'file', 'number']

const emptyField = {
  name: '', labelFr: '', labelEn: '', type: 'text', required: false,
  options: null, order: 0, active: true,
  placeholder_fr: '', placeholder_en: '',
  conditionalOn: '', conditionalValue: ''
}

export default function FormBuilderPage() {
  const [fields, setFields] = useState<FormFieldItem[]>([])
  const [editModal, setEditModal] = useState<FormFieldItem | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [optionInput, setOptionInput] = useState({ fr: '', en: '' })

  const fetchData = async () => {
    const res = await fetch('/api/form-config')
    setFields(await res.json())
  }
  useEffect(() => { fetchData() }, [])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleSave = async () => {
    if (!editModal.name || !editModal.labelFr) {
      showToast('Nom et label FR obligatoires')
      return
    }
    setIsSaving(true)
    const data = {
      ...editModal,
      options: editModal.type === 'select' && editModal.options ? editModal.options : null
    }
    if (editModal.id) {
      await fetch('/api/form-config', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    } else {
      await fetch('/api/form-config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, order: fields.length + 1 }) })
    }
    setEditModal(null)
    fetchData()
    showToast('Champ sauvegardé')
    setIsSaving(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce champ ?')) return
    await fetch(`/api/form-config/${id}`, { method: 'DELETE' })
    fetchData()
    showToast('Champ supprimé')
  }

  const toggleActive = async (field: FormFieldItem) => {
    await fetch(`/api/form-config/${field.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !field.active }),
    })
    fetchData()
  }

  const addOption = () => {
    if (!optionInput.fr) return
    const existing = editModal.options ? JSON.parse(editModal.options) : []
    const updated = [...existing, { valueFr: optionInput.fr, valueEn: optionInput.en || optionInput.fr }]
    setEditModal({ ...editModal, options: JSON.stringify(updated) })
    setOptionInput({ fr: '', en: '' })
  }

  const removeOption = (index: number) => {
    const existing = JSON.parse(editModal.options || '[]')
    existing.splice(index, 1)
    setEditModal({ ...editModal, options: JSON.stringify(existing) })
  }

  const getOptions = () => {
    try { return JSON.parse(editModal?.options || '[]') } catch { return [] }
  }

  const typeLabels: Record<string, string> = {
    text: 'Texte', tel: 'Téléphone', email: 'Email', select: 'Liste déroulante',
    textarea: 'Zone de texte', file: 'Fichier / Photos', number: 'Nombre'
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-obsidian-950 dark:text-white">Formulaire dynamique</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez les champs du formulaire de contact</p>
        </div>
        <button onClick={() => setEditModal({ ...emptyField })} className="flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg text-sm">
          <Plus size={14} /> Nouveau champ
        </button>
      </div>

      <div className="bg-white dark:bg-obsidian-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="divide-y divide-gray-50 dark:divide-gray-800">
          {fields.map(field => (
            <div key={field.id} className="flex items-center gap-3 px-5 py-3.5">
              <GripVertical size={14} className="text-gray-300 cursor-grab flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-obsidian-900 dark:text-white">{field.labelFr}</span>
                  {field.required && <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 px-1.5 py-0.5 rounded">Requis</span>}
                  {field.conditionalOn && <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-1.5 py-0.5 rounded">Conditionnel</span>}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {typeLabels[field.type] || field.type} · <code className="text-xs">{field.name}</code>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => toggleActive(field)} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-obsidian-700 text-gray-400">
                  {field.active ? <Eye size={13} className="text-green-500" /> : <EyeOff size={13} />}
                </button>
                <button onClick={() => setEditModal({ ...field })} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-obsidian-700 text-gray-400 hover:text-gold-500">
                  <Pencil size={13} />
                </button>
                <button onClick={() => handleDelete(field.id)} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-obsidian-700 text-gray-400 hover:text-red-500">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview note */}
      <div className="mt-4 p-4 bg-gold-50 dark:bg-gold-900/10 rounded-xl text-sm text-gold-700 dark:text-gold-400 border border-gold-200 dark:border-gold-800">
        💡 Les modifications du formulaire sont appliquées en temps réel sur le site.
      </div>

      {/* Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-obsidian-900 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
              <h2 className="font-semibold">{editModal.id ? 'Modifier' : 'Nouveau'} champ</h2>
              <button onClick={() => setEditModal(null)}><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Nom technique *</label>
                  <input value={editModal.name} onChange={e => setEditModal({...editModal, name: e.target.value.toLowerCase().replace(/\s/g, '_')})}
                    className="w-full bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-mono"
                    placeholder="mon_champ" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Type</label>
                  <select value={editModal.type} onChange={e => setEditModal({...editModal, type: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm">
                    {fieldTypes.map(t => <option key={t} value={t}>{typeLabels[t] || t}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Label FR *</label>
                  <input value={editModal.labelFr} onChange={e => setEditModal({...editModal, labelFr: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Label EN</label>
                  <input value={editModal.labelEn} onChange={e => setEditModal({...editModal, labelEn: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Placeholder FR</label>
                  <input value={editModal.placeholder_fr || ''} onChange={e => setEditModal({...editModal, placeholder_fr: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Placeholder EN</label>
                  <input value={editModal.placeholder_en || ''} onChange={e => setEditModal({...editModal, placeholder_en: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="required" checked={editModal.required} onChange={e => setEditModal({...editModal, required: e.target.checked})} className="w-4 h-4 accent-gold-500" />
                <label htmlFor="required" className="text-sm text-gray-700 dark:text-gray-300">Champ obligatoire</label>
              </div>

              {/* Conditional */}
              <div className="grid sm:grid-cols-2 gap-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Affiché si (champ)</label>
                  <input value={editModal.conditionalOn || ''} onChange={e => setEditModal({...editModal, conditionalOn: e.target.value})}
                    className="w-full bg-white dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-mono"
                    placeholder="city" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Égal à (valeur)</label>
                  <input value={editModal.conditionalValue || ''} onChange={e => setEditModal({...editModal, conditionalValue: e.target.value})}
                    className="w-full bg-white dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm"
                    placeholder="Autre ville" />
                </div>
              </div>

              {/* Options for select */}
              {editModal.type === 'select' && (
                <div>
                  <label className="block text-xs text-gray-500 mb-2">Options</label>
                  <div className="space-y-1.5 mb-3">
                    {getOptions().map((opt: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className="flex-1 px-2 py-1 bg-gray-50 dark:bg-obsidian-950 rounded text-gray-700 dark:text-gray-300">{opt.valueFr} / {opt.valueEn}</span>
                        <button onClick={() => removeOption(i)} className="text-red-400 hover:text-red-600"><X size={12} /></button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input placeholder="Option FR" value={optionInput.fr} onChange={e => setOptionInput({...optionInput, fr: e.target.value})}
                      className="flex-1 bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm" />
                    <input placeholder="Option EN" value={optionInput.en} onChange={e => setOptionInput({...optionInput, en: e.target.value})}
                      className="flex-1 bg-gray-50 dark:bg-obsidian-950 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm" />
                    <button onClick={addOption} className="px-3 py-1.5 bg-gold-500 text-white rounded-lg text-sm"><Plus size={14} /></button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-gray-100 dark:border-gray-800">
              <button onClick={() => setEditModal(null)} className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg">Annuler</button>
              <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 text-sm bg-gold-500 text-white rounded-lg flex items-center gap-2">
                <Save size={14} />{isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-6 right-6 bg-obsidian-900 text-white px-4 py-2.5 rounded-lg text-sm shadow-xl z-50">✓ {toast}</div>}
    </div>
  )
}
