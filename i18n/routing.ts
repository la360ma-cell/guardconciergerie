import { defineRouting } from 'next-intl/routing';

/**
 * FR est la locale par défaut, servie sans préfixe. EN est servi sous /en.
 * Les slugs de biens et de quartiers sont identiques dans les deux langues ;
 * seuls les segments de route sont localisés.
 */
export const routing = defineRouting({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'as-needed',
  // Pas de détection Accept-Language/cookie : `/` sert TOUJOURS le français.
  // Une redirection automatique vers /en fausserait l'indexation (Googlebot
  // se présente en anglais) ; le visiteur change de langue manuellement.
  localeDetection: false,
  pathnames: {
    '/': '/',
    '/acheter': { fr: '/acheter', en: '/buy' },
    '/louer': { fr: '/louer', en: '/rent' },
    '/quartiers': { fr: '/quartiers', en: '/neighbourhoods' },
    '/guides': '/guides',
    '/contact': '/contact',
    '/a-propos': { fr: '/a-propos', en: '/about' },
    '/mentions-legales': { fr: '/mentions-legales', en: '/legal' },
    '/confidentialite': { fr: '/confidentialite', en: '/privacy' }
  }
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;
