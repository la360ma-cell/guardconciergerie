import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { archivo, fraunces } from '@/lib/fonts';
import { siteConfig } from '@/lib/site';
import { cn } from '@/lib/utils';
import { routing, type Locale } from '@/i18n/routing';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

import '@/app/globals.css';

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale }
}: Omit<Props, 'children'>): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t('title'),
      template: `%s | ${siteConfig.name}`
    },
    description: t('description')
  };
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: Props) {
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Active le rendu statique des pages de ce segment.
  setRequestLocale(locale);

  return (
    <html lang={locale} className={cn(fraunces.variable, archivo.variable)}>
      <body className="flex min-h-screen flex-col bg-chaux font-sans text-encre antialiased">
        {/* Aucun message n'est envoyé au client : les îlots client reçoivent
            leurs libellés en props pour garder le bundle minimal. */}
        <NextIntlClientProvider locale={locale} messages={{}}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
