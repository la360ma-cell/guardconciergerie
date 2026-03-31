# Guard Conciergerie Luxury Care — Guide d'installation

## Prérequis
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

## Installation

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configurer les variables d'environnement
```bash
cp .env.example .env
```
Éditez `.env` avec vos valeurs :
```env
DATABASE_URL="postgresql://user:password@localhost:5432/guard_conciergerie"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="générez-une-clé-secrète"
RESEND_API_KEY="votre-clé-resend"
NOTIFICATION_EMAIL="votre-email@domaine.com"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 3. Créer la base de données PostgreSQL
```sql
CREATE DATABASE guard_conciergerie;
```

### 4. Générer le client Prisma
```bash
npm run db:generate
```

### 5. Appliquer le schéma
```bash
npm run db:push
```

### 6. Alimenter avec les données initiales
```bash
npm run db:seed
```

### 7. Démarrer le serveur de développement
```bash
npm run dev
```

## Accès

| URL | Description |
|-----|-------------|
| http://localhost:3000 | Site public (FR) |
| http://localhost:3000/en | Site public (EN) |
| http://localhost:3000/admin/login | Admin panel |

## Identifiants Admin par défaut
- Email: `admin@guardconciergerie.com`
- Mot de passe: `Admin@Guard2024!`

> ⚠️ Changez le mot de passe après la première connexion !

## Build production
```bash
npm run build
npm start
```

## Structure des dossiers
```
/app
  /[locale]         → Pages publiques (FR/EN)
    /admin          → Panel d'administration
  /api              → Routes API REST
/components
  /site             → Composants du site public
  /admin            → Composants du panel admin
  /ui               → Composants partagés
/lib                → Utilitaires (auth, email, upload...)
/messages           → Traductions FR + EN
/prisma             → Schéma et seed de la BDD
/public             → Assets statiques + uploads
/types              → Types TypeScript
```

## Génération du NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

## Déploiement (recommandé : Vercel + Supabase)
1. Push sur GitHub
2. Connecter à Vercel
3. Configurer les variables d'env
4. Déployer

## Support email (Resend)
1. Créer un compte sur resend.com
2. Vérifier votre domaine
3. Générer une clé API
4. Ajouter dans `.env`
