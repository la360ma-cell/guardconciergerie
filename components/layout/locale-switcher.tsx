'use client';

import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

type Props = {
  label: string;
};

export function LocaleSwitcher({ label }: Props) {
  const locale = useLocale();
  const pathname = usePathname();
  const otherLocale = locale === 'fr' ? 'en' : 'fr';

  return (
    <Link
      href={pathname}
      locale={otherLocale}
      aria-label={label}
      className="eyebrow rounded-sm px-2 py-2 text-encre transition-colors hover:text-majorelle"
    >
      {otherLocale === 'fr' ? 'FR' : 'EN'}
    </Link>
  );
}
