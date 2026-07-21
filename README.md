# Tendance Marrakech Immobilier (TMI)

Plateforme immobilière premium pour Marrakech — vente et location de villas, riads, appartements et biens de caractère. Positionnement : **curateur, pas annonceur**. Priorité absolue : le SEO (longue traîne FR + EN).

**Phase 1** : vitrine de curateur (un seul éditeur), architecture *marketplace-ready* — les rôles et policies tiers existent en base derrière le flag `NEXT_PUBLIC_MARKETPLACE_MODE`.

## Stack

- [Next.js 14](https://nextjs.org/) App Router · TypeScript strict
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (design system « Galerie Marrakech »)
- [Supabase](https://supabase.com/) — Postgres, Auth, Storage
- [Drizzle ORM](https://orm.drizzle.team/) + drizzle-kit
- [next-intl](https://next-intl.dev/) — FR (défaut, sans préfixe) + EN (`/en`)
- [Zod](https://zod.dev/) — validation
- Déploiement : Vercel · Emails : Resend (optionnel) · Analytics : GA4 (optionnel)

## Démarrage

```bash
npm install
cp .env.example .env.local   # renseigner les variables (voir .env.example)
npm run dev
```

Scripts : `dev`, `build`, `start`, `lint`, `typecheck`.

## Internationalisation

- FR est la locale par défaut, servie **sans préfixe** (`/acheter`). EN est servi sous `/en` (`/en/buy`).
- Les segments de route sont localisés via `i18n/routing.ts` (`pathnames`). Les slugs de biens et de quartiers sont identiques dans les deux langues.
- Règle : pas de page EN à moitié traduite — si la traduction manque, la page EN n'existe pas.

## Design system — « Galerie Marrakech »

Tokens dans `tailwind.config.ts` : `chaux` (fond), `blanc` (surfaces), `encre` (texte/CTA), `majorelle` (accent unique, parcimonie extrême), `pierre` (texte secondaire). Typographies : **Fraunces** (display) et **Archivo** (texte/UI) via `next/font`. Motif signature : le « cartel » (classe `.cartel`).

## Avancement (plan de build)

| Module | Contenu | Statut |
|---|---|---|
| M0 | Fondations : Next 14, Tailwind + tokens, fonts, next-intl, layout, accueil squelette | ✅ |
| M1 | Schéma Drizzle, migrations, RLS, Storage, seed | ⏳ |
| M2 | Pages publiques biens (hubs, programmatique, fiche, filtres, maillage) | ⏳ |
| M3 | Couche SEO (metadata, JSON-LD, sitemaps, OG, redirections) | ⏳ |
| M4 | Quartiers & guides | ⏳ |
| M5 | Admin (CRUD, checklist publication, leads) | ⏳ |
| M6 | Conversion (formulaires, WhatsApp, Resend, GA4) | ⏳ |
| M7 | QA finale (Lighthouse, a11y, rich results, README) | ⏳ |

Le README sera complété en M7 (setup Supabase pas à pas, déploiement Vercel, checklist de mise en ligne).
