'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { formatDate } from '@/lib/utils'
import { Search, Download, Trash2, ChevronDown, Phone, MessageCircle, Mail, MapPin, Home, FileText, Calendar, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const STATUS_OPTIONS = [
  { value: 'new',       label: 'Nouveau',  class: 'bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400' },
  { value: 'contacted', label: 'Contacté', class: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
  { value: 'closed',    label: 'Fermé',    class: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
]
const statusMap = Object.fromEntries(STATUS_OPTIONS.map(s => [s.value, s]))

function StatusDropdown({ lead, onUpdate }: { lead: any; onUpdate: (id: number, status: string) => void }) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const change = async (newStatus: string) => {
    if (newStatus === lead.status) { setOpen(false); return }
    setSaving(true)
    await fetch(`/api/leads/${lead.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) })
    onUpdate(lead.id, newStatus)
    setSaving(false)
    setOpen(false)
  }

  const cfg = statusMap[lead.status] || STATUS_OPTIONS[0]

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={cn('flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all hover:opacity-80', cfg.class)}
      >
        {saving ? <Loader2 size={10} className="animate-spin" /> : cfg.label}
        <ChevronDown size={10} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-20 bg-white dark:bg-obsidian-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden min-w-[120px]">
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => change(opt.value)}
              className={cn(
                'w-full text-left px-3 py-2 text-xs font-medium hover:bg-gray-50 dark:hover:bg-obsidian-700 transition-colors flex items-center gap-2',
                opt.value === lead.status ? opt.class : 'text-gray-600 dark:text-gray-300'
              )}
            >
              {opt.value === lead.status && <Check size={10} />}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function LeadRow({ lead, onDelete, onStatusUpdate }: { lead: any; onDelete: (id: number) => void; onStatusUpdate: (id: number, status: string) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <tr
        className="hover:bg-gray-50 dark:hover:bg-obsidian-800 transition-colors cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <ChevronDown size={13} className={`text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
            <div>
              <div className="font-medium text-sm text-obsidian-900 dark:text-white">{lead.name}</div>
              <div className="text-xs text-gray-400 sm:hidden">{lead.phone}</div>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 hidden sm:table-cell" onClick={e => e.stopPropagation()}>
          <a href={`tel:${lead.phone}`} className="text-sm text-gold-600 hover:underline" onClick={e => e.stopPropagation()}>{lead.phone}</a>
        </td>
        <td className="px-4 py-3 hidden md:table-cell text-sm text-gray-500">{lead.city}</td>
        <td className="px-4 py-3 hidden lg:table-cell text-sm text-gray-500">{lead.propertyType}</td>
        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
          <StatusDropdown lead={lead} onUpdate={onStatusUpdate} />
        </td>
        <td className="px-4 py-3 hidden xl:table-cell text-xs text-gray-400">{formatDate(lead.createdAt)}</td>
        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-end gap-1">
            {lead.phone && (
              <a href={`tel:${lead.phone}`} title="Appeler"
                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-obsidian-700 transition-colors text-gray-400 hover:text-gold-600">
                <Phone size={13} />
              </a>
            )}
            {lead.phone && (
              <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" title="WhatsApp"
                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-obsidian-700 transition-colors text-gray-400 hover:text-green-600">
                <MessageCircle size={13} />
              </a>
            )}
            {lead.email && (
              <a href={`mailto:${lead.email}`} title="Email"
                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-obsidian-700 transition-colors text-gray-400 hover:text-blue-600">
                <Mail size={13} />
              </a>
            )}
            <button onClick={() => onDelete(lead.id)}
              className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-obsidian-700 transition-colors text-gray-400 hover:text-red-500">
              <Trash2 size={13} />
            </button>
          </div>
        </td>
      </tr>
      {open && (
        <tr className="bg-gray-50/80 dark:bg-obsidian-950/40">
          <td colSpan={7} className="px-6 py-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {lead.email && (
                <div className="flex items-start gap-2">
                  <Mail size={14} className="text-gold-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Email</p>
                    <a href={`mailto:${lead.email}`} className="text-sm text-blue-600 hover:underline break-all">{lead.email}</a>
                  </div>
                </div>
              )}
              {lead.city && (
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-gold-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Ville</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{lead.city}</p>
                  </div>
                </div>
              )}
              {lead.propertyType && (
                <div className="flex items-start gap-2">
                  <Home size={14} className="text-gold-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Type de bien</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{lead.propertyType}</p>
                  </div>
                </div>
              )}
              {lead.createdAt && (
                <div className="flex items-start gap-2">
                  <Calendar size={14} className="text-gold-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Date</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{formatDate(lead.createdAt)}</p>
                  </div>
                </div>
              )}
              {lead.message && (
                <div className="flex items-start gap-2 sm:col-span-2 lg:col-span-4">
                  <FileText size={14} className="text-gold-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Message</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{lead.message}</p>
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const fetchLeads = useCallback(async () => {
    setIsLoading(true)
    try {
      const qs = new URLSearchParams({ page: String(page), search, ...(statusFilter && { status: statusFilter }) })
      const res = await fetch(`/api/leads?${qs}`)
      const data = await res.json()
      setLeads(data.leads || [])
      setTotal(data.total || 0)
    } catch (err) {
      console.error('Failed to fetch leads:', err)
      setLeads([])
      setTotal(0)
    } finally {
      setIsLoading(false)
    }
  }, [page, search, statusFilter])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce lead ?')) return
    await fetch(`/api/leads/${id}`, { method: 'DELETE' })
    fetchLeads()
  }

  const handleStatusUpdate = (id: number, status: string) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
  }

  const exportCsv = () => {
    window.open(`/api/leads?export=csv${search ? `&search=${search}` : ''}${statusFilter ? `&status=${statusFilter}` : ''}`)
  }

  const counts = STATUS_OPTIONS.map(s => ({ ...s, count: leads.filter(l => l.status === s.value).length }))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-obsidian-950 dark:text-white">Leads</h1>
          <p className="text-sm text-gray-500 mt-1">{total} demande(s) au total</p>
        </div>
        <button
          onClick={exportCsv}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-obsidian-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-obsidian-800 transition-colors"
        >
          <Download size={14} />
          Exporter CSV
        </button>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {counts.map(s => (
          <button key={s.value} onClick={() => { setStatusFilter(statusFilter === s.value ? '' : s.value); setPage(1) }}
            className={cn('bg-white dark:bg-obsidian-900 border-2 rounded-xl p-3 text-left transition-all',
              statusFilter === s.value ? 'border-gold-500' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200'
            )}>
            <p className="text-lg font-bold text-obsidian-900 dark:text-white">{s.count}</p>
            <span className={cn('text-[11px] font-medium px-2 py-0.5 rounded-full', s.class)}>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, email, ville..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-obsidian-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-gold-400"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
          className="px-3 py-2 bg-white dark:bg-obsidian-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none"
        >
          <option value="">Tous les statuts</option>
          {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-obsidian-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-gold-500" size={28} /></div>
        ) : leads.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">Aucun lead trouvé</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 text-xs text-gray-400 uppercase tracking-wider">
                  <th className="px-4 py-3 text-left font-medium">Nom</th>
                  <th className="px-4 py-3 text-left font-medium hidden sm:table-cell">Téléphone</th>
                  <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Ville</th>
                  <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">Type de bien</th>
                  <th className="px-4 py-3 text-left font-medium">Statut</th>
                  <th className="px-4 py-3 text-left font-medium hidden xl:table-cell">Date</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {leads.map(lead => (
                  <LeadRow key={lead.id} lead={lead} onDelete={handleDelete} onStatusUpdate={handleStatusUpdate} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {total > 20 && (
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <span className="text-xs text-gray-400">Page {page} · {total} résultats</span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 text-xs border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-obsidian-800 transition-colors">Précédent</button>
              <button disabled={page * 20 >= total} onClick={() => setPage(p => p + 1)} className="px-3 py-1 text-xs border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-obsidian-800 transition-colors">Suivant</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
