import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import type { AppPathname } from '@/i18n/routing';

export function Footer() {
  const t = useTranslations('footer');
  const tHeader = useTranslations('header');

  const columns: Array<{
    heading: string;
    links: Array<{ href: AppPathname; label: string }>;
  }> = [
    {
      heading: t('explore'),
      links: [
        { href: '/acheter', label: tHeader('buy') },
        { href: '/louer', label: tHeader('rent') },
        { href: '/quartiers', label: tHeader('neighbourhoods') },
        { href: '/guides', label: tHeader('guides') }
      ]
    },
    {
      heading: t('company'),
      links: [
        { href: '/a-propos', label: t('about') },
        { href: '/contact', label: tHeader('contact') }
      ]
    },
    {
      heading: t('legal'),
      links: [
        { href: '/mentions-legales', label: t('legalNotice') },
        { href: '/confidentialite', label: t('privacy') }
      ]
    }
  ];

  return (
    <footer className="bg-encre text-chaux">
      <div className="container grid gap-12 py-16 md:grid-cols-[2fr_1fr_1fr_1fr] md:gap-8">
        <div>
          <p className="font-display text-xl font-medium tracking-tight">
            Tendance Marrakech
          </p>
          <p className="eyebrow mt-1.5 text-chaux/50">Immobilier</p>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-chaux/70">
            {t('tagline')}
          </p>
        </div>

        {columns.map((column) => (
          <nav key={column.heading} aria-label={column.heading}>
            <p className="eyebrow text-chaux/50">{column.heading}</p>
            <ul className="mt-5 space-y-3">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-chaux/80 transition-colors hover:text-chaux"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-chaux/10">
        <div className="container flex flex-col gap-2 py-6 text-xs text-chaux/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Tendance Marrakech Immobilier.{' '}
            {t('rights')}
          </p>
          <p>Marrakech, Maroc</p>
        </div>
      </div>
    </footer>
  );
}
