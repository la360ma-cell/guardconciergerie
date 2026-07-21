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

Scripts : `dev`, `build`, `start`, `lint`, `typecheck`, `db:generate`, `db:migrate`, `db:seed`.

## Base de données (Supabase + Drizzle)

1. Créer un projet sur [supabase.com](https://supabase.com), récupérer :
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (Settings → API) ;
   - `DATABASE_URL` (Settings → Database → Connection string, **Session pooler** pour les migrations).
2. Appliquer les migrations : `npm run db:migrate`
   — crée le schéma complet, la RLS, les triggers (profil auto à l'inscription, `updated_at`), la séquence de référence `TMI-0042` et le bucket Storage `properties` (lecture publique, écriture admin).
3. Créer le compte admin : Dashboard → Authentication → *Add user* avec l'email de `ADMIN_EMAIL`.
4. Seeder les données de démo : `npm run db:seed`
   — 10 quartiers réels, 8 biens `[DÉMO]`, 2 guides `[DÉMO]` ; idempotent (ré-exécutable). Le seed promeut automatiquement `ADMIN_EMAIL` en `role=admin` si le compte auth existe.

**Marketplace-ready** : les rôles `proprietaire`/`agent` et leurs policies RLS sont écrits dans `db/migrations/0001_rls_storage.sql` (section 11, commentée). Activation en Phase 2 en les décommentant — aucun changement de schéma requis.

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
| M1 | Schéma Drizzle, migrations, RLS, Storage, seed | ✅ |
| M2 | Pages publiques biens (hubs, programmatique, fiche, filtres, maillage) | ⏳ |
| M3 | Couche SEO (metadata, JSON-LD, sitemaps, OG, redirections) | ⏳ |
| M4 | Quartiers & guides | ⏳ |
| M5 | Admin (CRUD, checklist publication, leads) | ⏳ |
| M6 | Conversion (formulaires, WhatsApp, Resend, GA4) | ⏳ |
| M7 | QA finale (Lighthouse, a11y, rich results, README) | ⏳ |

Le README sera complété en M7 (setup Supabase pas à pas, déploiement Vercel, checklist de mise en ligne).
