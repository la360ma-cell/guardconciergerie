import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

type Props = {
  params: { locale: string };
};

export default function HomePage({ params: { locale } }: Props) {
  setRequestLocale(locale);

  const t = useTranslations('home');

  return (
    <>
      {/* Hero — le média cinématique (image/vidéo) sera branché avec les données réelles */}
      <section className="flex min-h-[calc(100svh-4rem)] flex-col justify-end bg-encre">
        <div className="container pb-16 pt-32 sm:pb-24">
          <p className="eyebrow">{t('hero.eyebrow')}</p>
          <h1 className="mt-6 max-w-3xl text-4xl leading-[1.08] text-chaux sm:text-5xl lg:text-6xl">
            {t('hero.title')}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-chaux/70 sm:text-lg">
            {t('hero.subtitle')}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="onDark" size="lg">
              <Link href="/acheter">{t('hero.ctaBuy')}</Link>
            </Button>
            <Button asChild variant="outlineOnDark" size="lg">
              <Link href="/louer">{t('hero.ctaRent')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Sélection — alimentée par les biens `featured` à partir du module M2 */}
      <section className="container py-20 sm:py-28">
        <p className="eyebrow">{t('selection.eyebrow')}</p>
        <h2 className="mt-4 max-w-2xl text-3xl text-encre sm:text-4xl">
          {t('selection.title')}
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <PlaceholderCard key={index} />
          ))}
        </div>
        <p className="mt-8 text-sm text-pierre">{t('selection.placeholder')}</p>
      </section>

      {/* Quartiers — grille alimentée en M4 */}
      <section className="border-y border-encre/10 bg-blanc">
        <div className="container py-20 sm:py-28">
          <p className="eyebrow">{t('neighbourhoods.eyebrow')}</p>
          <h2 className="mt-4 max-w-2xl text-3xl text-encre sm:text-4xl">
            {t('neighbourhoods.title')}
          </h2>
          <p className="mt-5 max-w-xl text-pierre">
            {t('neighbourhoods.description')}
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="aspect-[4/3] rounded-sm bg-chaux" />
            ))}
          </div>
          <p className="mt-8 text-sm text-pierre">
            {t('neighbourhoods.placeholder')}
          </p>
        </div>
      </section>

      {/* Guides — alimentés en M4 */}
      <section className="container py-20 sm:py-28">
        <p className="eyebrow">{t('guides.eyebrow')}</p>
        <h2 className="mt-4 max-w-2xl text-3xl text-encre sm:text-4xl">
          {t('guides.title')}
        </h2>
        <p className="mt-5 max-w-xl text-pierre">{t('guides.description')}</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {[0, 1].map((index) => (
            <div key={index} className="cartel p-6">
              <div className="h-3 w-24 rounded-sm bg-pierre/15" />
              <div className="mt-4 h-5 w-3/4 rounded-sm bg-pierre/15" />
              <div className="mt-3 h-4 w-1/2 rounded-sm bg-pierre/10" />
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-pierre">{t('guides.placeholder')}</p>
      </section>

      {/* Réassurance */}
      <section className="border-y border-encre/10 bg-blanc">
        <div className="container py-20 sm:py-28">
          <p className="eyebrow">{t('method.eyebrow')}</p>
          <h2 className="mt-4 max-w-2xl text-3xl text-encre sm:text-4xl">
            {t('method.title')}
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {(['curation', 'guidance', 'network'] as const).map(
              (key, index) => (
                <div key={key}>
                  <p className="font-display text-sm font-medium text-majorelle">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-3 text-xl text-encre">
                    {t(`method.items.${key}.title`)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-pierre">
                    {t(`method.items.${key}.description`)}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Invitation au contact */}
      <section className="container py-20 sm:py-28">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <h2 className="max-w-xl text-3xl text-encre sm:text-4xl">
              {t('cta.title')}
            </h2>
            <p className="mt-4 max-w-md text-pierre">{t('cta.description')}</p>
          </div>
          <Button asChild size="lg">
            <Link href="/contact">{t('cta.button')}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}

/** Carte squelette au motif « cartel » — remplacée par PropertyCard en M2. */
function PlaceholderCard() {
  return (
    <div className="rounded-sm bg-blanc">
      <div className="aspect-[4/3] rounded-t-sm bg-pierre/10" />
      <div className="cartel p-5">
        <div className="h-3 w-28 rounded-sm bg-pierre/15" />
        <div className="mt-4 h-5 w-3/4 rounded-sm bg-pierre/15" />
        <div className="mt-3 h-4 w-1/3 rounded-sm bg-pierre/10" />
      </div>
    </div>
  );
}
