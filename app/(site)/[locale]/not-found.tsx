import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  const t = useTranslations('notFound');

  return (
    <section className="container flex min-h-[60svh] flex-col items-start justify-center py-20">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-3xl text-encre sm:text-4xl">{t('title')}</h1>
      <p className="mt-4 max-w-md text-pierre">{t('description')}</p>
      <Button asChild className="mt-8">
        <Link href="/">{t('backHome')}</Link>
      </Button>
    </section>
  );
}
