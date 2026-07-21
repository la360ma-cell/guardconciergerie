-- ============================================================================
-- Vérification RLS (DoD §14) — À EXÉCUTER SUR UNE BASE DE TEST/STAGING.
-- Le script modifie temporairement des données (un bien passe en draft,
-- un lead de test est créé) puis nettoie derrière lui.
--
-- Usage : psql "$DATABASE_URL" -f db/verify-rls.sql
-- Prérequis : migrations appliquées, seed exécuté, un utilisateur auth admin
-- (remplacer les emails ci-dessous si besoin).
--
-- Attendu :
--   anon        → 7 biens, adresse_privee refusée, INSERT lead OK, 0 lead lu,
--                 aucune écriture possible ailleurs
--   acheteur    → 7 biens, ne peut pas modifier son rôle, peut modifier son nom
--   admin       → 8 biens (draft inclus), lit et met à jour les leads
-- ============================================================================

UPDATE properties SET status='draft' WHERE reference='TMI-0006';

-- === ANON ===
SET ROLE anon;
SELECT 'anon: biens visibles = ' || count(*) || ' (attendu 7)' FROM properties;
-- Les deux requêtes suivantes DOIVENT échouer (permission denied) :
-- SELECT adresse_privee FROM properties LIMIT 1;
-- SELECT * FROM properties LIMIT 1;
INSERT INTO leads (name, phone, source, locale)
VALUES ('[TEST RLS] anon', '+212600000000', 'whatsapp', 'fr');
SELECT 'anon: leads lisibles = ' || count(*) || ' (attendu 0)' FROM leads;
RESET ROLE;

-- === ACHETEUR (remplacer l'email par un compte non-admin existant) ===
SELECT id AS buyer_id FROM auth.users WHERE email = 'buyer@example.com' \gset
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', :'buyer_id', false);
SELECT 'acheteur: biens visibles = ' || count(*) || ' (attendu 7)' FROM properties;
-- DOIT échouer (permission denied, colonne role non modifiable) :
-- UPDATE profiles SET role='admin' WHERE id = auth.uid();
UPDATE profiles SET full_name = full_name WHERE id = auth.uid();
SELECT 'acheteur: leads lisibles = ' || count(*) || ' (attendu 0)' FROM leads;
RESET ROLE;

-- === ADMIN (remplacer par ADMIN_EMAIL) ===
SELECT id AS admin_id FROM auth.users WHERE email = 'la360.ma@gmail.com' \gset
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', :'admin_id', false);
SELECT 'admin: biens visibles = ' || count(*) || ' (attendu 8)' FROM properties;
SELECT 'admin: leads lisibles = ' || count(*) || ' (attendu ≥ 1)' FROM leads;
UPDATE leads SET status='contacte' WHERE name = '[TEST RLS] anon';
RESET ROLE;

-- === Nettoyage ===
UPDATE properties SET status='published' WHERE reference='TMI-0006';
DELETE FROM leads WHERE name = '[TEST RLS] anon';
SELECT '— Vérification RLS terminée —';
