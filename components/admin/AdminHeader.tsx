'use client'

import { signOut } from 'next-auth/react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LogOut, Bell } from 'lucide-react'
import { Session } from 'next-auth'

interface AdminHeaderProps {
  locale: string
  session: Session
}

export default function AdminHeader({ locale, session }: AdminHeaderProps) {
  return (
    <header className="h-14 bg-white dark:bg-obsidian-900 border-b border-gray-100 dark:border-gray-800 px-6 flex items-center justify-between flex-shrink-0">
      <div className="text-sm text-gray-500 dark:text-gray-400 lg:pl-0 pl-10">
        Bonjour, <span className="font-medium text-obsidian-900 dark:text-white">{session.user?.name}</span>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button
          onClick={() => signOut({ callbackUrl: locale === 'en' ? '/en/admin/login' : '/admin/login' })}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Déconnexion</span>
        </button>
      </div>
    </header>
  )
}
