import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Users, Home, Star, TrendingUp, ArrowRight, Clock } from 'lucide-react'

export default async function DashboardPage({ params: { locale } }: { params: { locale: string } }) {
  const prefix = locale === 'en' ? '/en/admin' : '/admin'

  const [totalLeads, newLeads, recentLeads, services, testimonials] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: 'new' } }),
    prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.service.count({ where: { active: true } }),
    prisma.testimonial.count({ where: { active: true } }),
  ])

  const stats = [
    { label: 'Total Leads', value: totalLeads, icon: Users, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600', href: `${prefix}/leads` },
    { label: 'Nouveaux leads', value: newLeads, icon: TrendingUp, color: 'bg-gold-50 dark:bg-gold-900/20 text-gold-600', href: `${prefix}/leads?status=new` },
    { label: 'Services actifs', value: services, icon: Home, color: 'bg-green-50 dark:bg-green-900/20 text-green-600', href: `${prefix}/services` },
    { label: 'Témoignages', value: testimonials, icon: Star, color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600', href: `${prefix}/testimonials` },
  ]

  const statusLabels: Record<string, { label: string; class: string }> = {
    new: { label: 'Nouveau', class: 'bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400' },
    contacted: { label: 'Contacté', class: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
    closed: { label: 'Fermé', class: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-obsidian-950 dark:text-white">Tableau de bord</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Vue d'ensemble de Guard Conciergerie</p>
      </div>

      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white dark:bg-obsidian-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg ${stat.color} bg-opacity-50 flex items-center justify-center`}>
                <stat.icon size={16} />
              </div>
              <ArrowRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
            <div className="text-2xl font-semibold text-obsidian-950 dark:text-white">{stat.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent leads */}
      <div className="bg-white dark:bg-obsidian-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h2 className="font-medium text-obsidian-950 dark:text-white flex items-center gap-2">
            <Clock size={16} className="text-gold-500" />
            Leads récents
          </h2>
          <Link href={`${prefix}/leads`} className="text-xs text-gold-600 dark:text-gold-400 hover:underline">
            Voir tous →
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">Aucun lead pour le moment</div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {recentLeads.map(lead => (
              <Link
                key={lead.id}
                href={`${prefix}/leads/${lead.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-obsidian-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-obsidian-100 dark:bg-obsidian-700 flex items-center justify-center text-xs font-medium text-obsidian-600 dark:text-obsidian-300">
                    {(lead.name || '?').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-obsidian-900 dark:text-white">{lead.name || '—'}</div>
                    <div className="text-xs text-gray-400">{lead.city || '—'} · {lead.propertyType || '—'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusLabels[lead.status]?.class}`}>
                    {statusLabels[lead.status]?.label || lead.status}
                  </span>
                  <span className="text-xs text-gray-400 hidden sm:inline">
                    {formatDate(lead.createdAt, 'fr')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
