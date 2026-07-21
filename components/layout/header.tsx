import { Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import type { AppPathname } from '@/i18n/routing';
import { LocaleSwitcher } from './locale-switcher';

export function Header() {
  const t = useTranslations('header');
  const tSwitcher = useTranslations('localeSwitcher');

  const navItems: Array<{ href: AppPathname; label: string }> = [
    { href: '/acheter', label: t('buy') },
    { href: '/louer', label: t('rent') },
    { href: '/quartiers', label: t('neighbourhoods') },
    { href: '/guides', label: t('guides') },
    { href: '/contact', label: t('contact') }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-encre/10 bg-chaux/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex flex-col justify-center leading-none">
          <span className="font-display text-lg font-medium tracking-tight text-encre">
            Tendance Marrakech
          </span>
          <span className="eyebrow mt-1">Immobilier</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-encre transition-colors hover:text-majorelle"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher label={tSwitcher('switchTo')} />

          {/* Menu mobile sans JavaScript : details/summary */}
          <details className="relative md:hidden">
            <summary
              className="-m-2 flex cursor-pointer list-none rounded-sm p-2 text-encre [&::-webkit-details-marker]:hidden"
              aria-label={t('openMenu')}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </summary>
            <nav
              className="absolute right-0 top-full z-50 mt-4 flex w-56 flex-col border border-encre/10 bg-blanc p-2"
              aria-label="Navigation mobile"
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-sm px-3 py-2.5 text-sm text-encre transition-colors hover:bg-chaux"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
