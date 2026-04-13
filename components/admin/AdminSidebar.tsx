'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
    Users, Home, Menu, X, MessageCircle,
} from 'lucide-react'
import { useState } from 'react'

const getNavItems = (locale: string) => {
    const prefix = locale === 'en' ? '/en/admin' : '/admin'
    return [
      { href: `${prefix}/leads`,    label: 'Leads',    icon: Users },
      { href: `${prefix}/whatsapp`, label: 'WhatsApp', icon: MessageCircle },
        ]
}

interface AdminSidebarProps {
    locale: string
}

export default function AdminSidebar({ locale }: AdminSidebarProps) {
    const pathname = usePathname()
    const [mobileOpen, setMobileOpen] = useState(false)
    const navItems = getNavItems(locale)

  const sidebarContent = (
        <div className="h-full flex flex-col">
          {/* Logo */}
              <div className="p-6 border-b border-white/5">
                      <div className="text-white font-display text-lg tracking-wide">GUARD</div>div>
                      <div className="text-[8px] tracking-[0.3em] uppercase text-gold-500 mt-0.5">Admin Panel</div>div>
              </div>div>
        
          {/* Nav */}
              <nav className="flex-1 p-4 overflow-y-auto">
                      <div className="space-y-1">
                        {navItems.map(item => {
                      const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                                    return (
                                                    <Link
                                                                      key={item.href}
                                                                      href={item.href}
                                                                      prefetch={false}
                                                                      onClick={() => setMobileOpen(false)}
                                                                      className={cn(
                                                                                          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
                                                                                          isActive
                                                                                            ? 'bg-gold-500 text-white'
                                                                                            : 'text-obsidian-400 hover:text-white hover:bg-white/5'
                                                                                        )}
                                                                    >
                                                                    <item.icon size={16} strokeWidth={1.5} />
                                                      {item.label}
                                                    </Link>Link>
                                                  )
        })}
                      </div>div>
              </nav>nav>
        
          {/* Footer */}
              <div className="p-4 border-t border-white/5">
                      <Link
                                  href={locale === 'en' ? '/en' : '/'}
                                  prefetch={false}
                                  className="flex items-center gap-2 text-xs text-obsidian-500 hover:text-white transition-colors"
                                >
                                <Home size={12} />
                                Voir le site
                      </Link>Link>
              </div>div>
        </div>div>
      )
    
      return (
            <>
              {/* Desktop */}
                  <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-[260px] bg-obsidian-950 border-r border-white/5 z-30">
                    {sidebarContent}
                  </aside>aside>
            
              {/* Mobile toggle */}
                  <button
                            className="lg:hidden fixed top-4 left-4 z-40 w-9 h-9 bg-obsidian-950 rounded-lg flex items-center justify-center text-white"
                            onClick={() => setMobileOpen(!mobileOpen)}
                          >
                    {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                  </button>button>
            
              {/* Mobile overlay */}
              {mobileOpen && (
                      <div
                                  className="lg:hidden fixed inset-0 z-30 bg-black/50"
                                  onClick={() => setMobileOpen(false)}
                                />
                    )}
            
              {/* Mobile sidebar */}
              {mobileOpen && (
                      <aside className="lg:hidden fixed left-0 top-0 bottom-0 w-[260px] bg-obsidian-950 border-r border-white/5 z-30">
                        {sidebarContent}
                      </aside>aside>
                  )}
            </>>
          )
}</></div>
