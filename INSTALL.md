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
BLOB_READ_WRITE_TOKEN="votre-token-vercel-blob"
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
2. Connecter le dépôt à Vercel
3. Dans **Storage → Blob**, créer un Blob Store et le connecter au projet
4. Vérifier que `BLOB_READ_WRITE_TOKEN` est injecté dans les variables d'environnement
5. Configurer les autres variables d'environnement
6. Déployer

## Migration depuis Cloudinary
1. Supprimer `CLOUDINARY_CLOUD_NAME` et `CLOUDINARY_UPLOAD_PRESET` des variables de production
2. Déployer cette version
3. Dans `/fr/admin/appearance`, téléverser à nouveau les logos et les images de chaque section
4. Sauvegarder l'apparence puis vérifier les pages FR et EN
5. Les nouvelles photos envoyées avec les formulaires seront stockées dans Vercel Blob

Les anciennes URL Cloudinary déjà enregistrées en base ne peuvent pas être converties automatiquement : les fichiers originaux doivent être téléversés à nouveau.

## Support email (Resend)
1. Créer un compte sur resend.com
2. Vérifier votre domaine
3. Générer une clé API
4. Ajouter dans `.env`

