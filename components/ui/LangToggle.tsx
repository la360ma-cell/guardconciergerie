'use client'

import { useRouter, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function LangToggle({ locale, className }: { locale: string; className?: string }) {
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) return
    // Set NEXT_LOCALE cookie so next-intl middleware uses correct locale on pathless routes
    const exp = new Date(); exp.setFullYear(exp.getFullYear() + 1)
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;expires=${exp.toUTCString()};SameSite=Lax`
    // Build target path
    const current = window.location.pathname
    let newPath: string
    if (newLocale === 'fr') {
      newPath = current.replace(/^\/en(\/|$)/, '/') || '/'
    } else {
      newPath = current.startsWith('/en/') || current === '/en'
        ? current
        : '/en' + (current === '/' ? '' : current)
    }
    window.location.href = newPath
  }

  return (
    <div
      className={cn(
        'flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-full p-0.5',
        'text-xs font-medium tracking-wider',
        className
      )}
    >
      <button
        onClick={() => switchLocale('fr')}
        className={cn(
          'px-2.5 py-1 rounded-full transition-all duration-200',
          locale === 'fr'
            ? 'bg-obsidian-950 dark:bg-white text-white dark:text-obsidian-950'
            : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
        )}
      >
        FR
      </button>
      <button
        onClick={() => switchLocale('en')}
        className={cn(
          'px-2.5 py-1 rounded-full transition-all duration-200',
          locale === 'en'
            ? 'bg-obsidian-950 dark:bg-white text-white dark:text-obsidian-950'
            : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
        )}
      >
        EN
      </button>
    </div>
  )
}
