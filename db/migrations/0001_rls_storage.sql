-- Custom SQL migration file, put your code below! -----

-- ============================================================================
-- TMI — Infrastructure Supabase : FK auth, séquence de référence, triggers,
-- RLS, bucket Storage.
--
-- Phase 1 : un seul éditeur (admin). Les policies « marketplace »
-- (proprietaire/agent) sont ÉCRITES mais COMMENTÉES en fin de fichier ;
-- les activer quand NEXT_PUBLIC_MARKETPLACE_MODE passera à true (Phase 2).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. profiles ↔ auth.users
-- ----------------------------------------------------------------------------
ALTER TABLE "profiles"
  ADD CONSTRAINT "profiles_id_auth_users_fk"
  FOREIGN KEY ("id") REFERENCES auth.users(id) ON DELETE CASCADE;
--> statement-breakpoint

-- Création automatique du profil à l'inscription (rôle par défaut : acheteur)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NULLIF(NEW.raw_user_meta_data ->> 'full_name', ''),
    NULLIF(NEW.raw_user_meta_data ->> 'avatar_url', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
--> statement-breakpoint

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
--> statement-breakpoint

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
--> statement-breakpoint

-- ----------------------------------------------------------------------------
-- 2. Référence auto-incrémentée TMI-0042
-- ----------------------------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.property_reference_seq;
--> statement-breakpoint

ALTER TABLE "properties"
  ALTER COLUMN "reference"
  SET DEFAULT 'TMI-' || lpad(nextval('public.property_reference_seq')::text, 4, '0');
--> statement-breakpoint

-- ----------------------------------------------------------------------------
-- 3. updated_at automatique
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
--> statement-breakpoint

DROP TRIGGER IF EXISTS properties_set_updated_at ON public.properties;
--> statement-breakpoint

CREATE TRIGGER properties_set_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint

DROP TRIGGER IF EXISTS guides_set_updated_at ON public.guides;
--> statement-breakpoint

CREATE TRIGGER guides_set_updated_at
  BEFORE UPDATE ON public.guides
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint

-- ----------------------------------------------------------------------------
-- 4. Helper RLS : l'utilisateur courant est-il admin ?
--    SECURITY DEFINER pour éviter la récursion RLS sur profiles.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;
--> statement-breakpoint

GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;
--> statement-breakpoint

-- ----------------------------------------------------------------------------
-- 5. Activation RLS sur toutes les tables
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.quartiers ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.property_media ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.combo_content ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.slug_redirects ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint

-- ----------------------------------------------------------------------------
-- 6. profiles
-- ----------------------------------------------------------------------------
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin());
--> statement-breakpoint

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());
--> statement-breakpoint

CREATE POLICY "profiles_update_own_or_admin" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_admin())
  WITH CHECK (id = auth.uid() OR public.is_admin());
--> statement-breakpoint

-- Personne ne peut s'auto-promouvoir via l'API : le privilège UPDATE est
-- retiré au niveau table puis re-accordé colonne par colonne (un REVOKE de
-- colonne seul serait inopérant tant que le UPDATE table subsiste, les
-- privilèges de colonnes étant additifs). role reste modifiable uniquement
-- par service_role ou en SQL direct.
REVOKE UPDATE ON public.profiles FROM anon, authenticated;
--> statement-breakpoint

GRANT UPDATE (full_name, phone, avatar_url) ON public.profiles TO authenticated;
--> statement-breakpoint

-- ----------------------------------------------------------------------------
-- 7. Contenu public en lecture
--    Biens : les statuts vendu/loue restent lisibles (pages conservées, SEO).
--    Drafts et archives : admin uniquement.
-- ----------------------------------------------------------------------------
CREATE POLICY "quartiers_public_read" ON public.quartiers
  FOR SELECT
  USING (published OR public.is_admin());
--> statement-breakpoint

CREATE POLICY "properties_public_read" ON public.properties
  FOR SELECT
  USING (
    status IN ('published', 'sous_offre', 'vendu', 'loue')
    OR public.is_admin()
  );
--> statement-breakpoint

-- adresse_privee ne doit jamais transiter par l'API publique (anon key).
-- SELECT est retiré au niveau table puis re-accordé sur la liste explicite
-- des colonnes publiques (un REVOKE de colonne seul serait inopérant).
-- ⚠ Maintenance : toute nouvelle colonne publique de properties doit être
-- ajoutée à ce GRANT (par défaut, une nouvelle colonne est donc privée).
-- L'admin lit adresse_privee côté serveur (connexion directe / service_role).
REVOKE SELECT ON public.properties FROM anon, authenticated;
--> statement-breakpoint

GRANT SELECT (
  id, slug, reference, type, transaction, status,
  title_fr, title_en, description_fr, description_en,
  price, currency, price_on_request,
  surface_habitable, surface_terrain, chambres, sdb, etages,
  annee_construction, features, quartier_id, ville, lat, lng,
  exclusivite, featured, video_url, visite_virtuelle_url,
  meta_title_fr, meta_title_en, meta_description_fr, meta_description_en,
  owner_id, published_at, created_at, updated_at, views_count
) ON public.properties TO anon, authenticated;
--> statement-breakpoint

CREATE POLICY "property_media_public_read" ON public.property_media
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_id
        AND (
          p.status IN ('published', 'sous_offre', 'vendu', 'loue')
          OR public.is_admin()
        )
    )
  );
--> statement-breakpoint

CREATE POLICY "guides_public_read" ON public.guides
  FOR SELECT
  USING (
    (published_at IS NOT NULL AND published_at <= now())
    OR public.is_admin()
  );
--> statement-breakpoint

CREATE POLICY "partners_public_read" ON public.partners
  FOR SELECT
  USING (published OR public.is_admin());
--> statement-breakpoint

CREATE POLICY "combo_content_public_read" ON public.combo_content
  FOR SELECT
  USING (true);
--> statement-breakpoint

CREATE POLICY "slug_redirects_public_read" ON public.slug_redirects
  FOR SELECT
  USING (true);
--> statement-breakpoint

-- ----------------------------------------------------------------------------
-- 8. leads : INSERT public (anonyme), lecture/gestion admin uniquement
-- ----------------------------------------------------------------------------
CREATE POLICY "leads_public_insert" ON public.leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);
--> statement-breakpoint

CREATE POLICY "leads_admin_select" ON public.leads
  FOR SELECT TO authenticated
  USING (public.is_admin());
--> statement-breakpoint

CREATE POLICY "leads_admin_update" ON public.leads
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
--> statement-breakpoint

CREATE POLICY "leads_admin_delete" ON public.leads
  FOR DELETE TO authenticated
  USING (public.is_admin());
--> statement-breakpoint

-- ----------------------------------------------------------------------------
-- 9. Écriture globale : admin uniquement (Phase 1)
-- ----------------------------------------------------------------------------
CREATE POLICY "quartiers_admin_write" ON public.quartiers
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
--> statement-breakpoint

CREATE POLICY "properties_admin_write" ON public.properties
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
--> statement-breakpoint

CREATE POLICY "property_media_admin_write" ON public.property_media
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
--> statement-breakpoint

CREATE POLICY "guides_admin_write" ON public.guides
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
--> statement-breakpoint

CREATE POLICY "partners_admin_write" ON public.partners
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
--> statement-breakpoint

CREATE POLICY "combo_content_admin_write" ON public.combo_content
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
--> statement-breakpoint

CREATE POLICY "slug_redirects_admin_write" ON public.slug_redirects
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
--> statement-breakpoint

-- ----------------------------------------------------------------------------
-- 10. Storage : bucket `properties` (lecture publique, écriture admin)
--     Chemin : properties/{property_id}/{uuid}.webp
--     NB : si la création de policies sur storage.objects échoue (droits),
--     créer ces 4 policies à l'identique via le Dashboard Supabase > Storage.
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('properties', 'properties', true)
ON CONFLICT (id) DO UPDATE SET public = true;
--> statement-breakpoint

CREATE POLICY "storage_properties_public_read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'properties');
--> statement-breakpoint

CREATE POLICY "storage_properties_admin_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'properties' AND public.is_admin());
--> statement-breakpoint

CREATE POLICY "storage_properties_admin_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'properties' AND public.is_admin())
  WITH CHECK (bucket_id = 'properties' AND public.is_admin());
--> statement-breakpoint

CREATE POLICY "storage_properties_admin_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'properties' AND public.is_admin());
--> statement-breakpoint

-- ----------------------------------------------------------------------------
-- 11. MARKETPLACE (Phase 2) — policies écrites, DÉSACTIVÉES par commentaire.
--
-- À activer quand NEXT_PUBLIC_MARKETPLACE_MODE=true :
--   1. Décommenter le helper has_role() et les policies ci-dessous.
--   2. Aucun changement de schéma n'est nécessaire : owner_id, les rôles
--      proprietaire/agent et ces policies suffisent.
--
-- Règles : un proprietaire (ou agent) peut créer et gérer SES biens tant
-- qu'ils sont en draft ; la publication reste un acte d'admin (curation).
-- Il voit ses propres biens quel que soit leur statut, et gère les médias
-- de ses drafts.
-- ----------------------------------------------------------------------------

-- CREATE OR REPLACE FUNCTION public.has_role(required_roles user_role[])
-- RETURNS boolean
-- LANGUAGE sql
-- STABLE
-- SECURITY DEFINER
-- SET search_path = public
-- AS $$
--   SELECT EXISTS (
--     SELECT 1 FROM public.profiles
--     WHERE id = auth.uid() AND role = ANY (required_roles)
--   );
-- $$;

-- GRANT EXECUTE ON FUNCTION public.has_role(user_role[]) TO authenticated;

-- CREATE POLICY "mp_properties_owner_select" ON public.properties
--   FOR SELECT TO authenticated
--   USING (owner_id = auth.uid());

-- CREATE POLICY "mp_properties_owner_insert" ON public.properties
--   FOR INSERT TO authenticated
--   WITH CHECK (
--     owner_id = auth.uid()
--     AND status = 'draft'
--     AND public.has_role(ARRAY['proprietaire', 'agent']::user_role[])
--   );

-- CREATE POLICY "mp_properties_owner_update_draft" ON public.properties
--   FOR UPDATE TO authenticated
--   USING (owner_id = auth.uid() AND status = 'draft')
--   WITH CHECK (owner_id = auth.uid() AND status = 'draft');

-- CREATE POLICY "mp_properties_owner_delete_draft" ON public.properties
--   FOR DELETE TO authenticated
--   USING (owner_id = auth.uid() AND status = 'draft');

-- CREATE POLICY "mp_property_media_owner_all" ON public.property_media
--   FOR ALL TO authenticated
--   USING (
--     EXISTS (
--       SELECT 1 FROM public.properties p
--       WHERE p.id = property_id
--         AND p.owner_id = auth.uid()
--         AND p.status = 'draft'
--     )
--   )
--   WITH CHECK (
--     EXISTS (
--       SELECT 1 FROM public.properties p
--       WHERE p.id = property_id
--         AND p.owner_id = auth.uid()
--         AND p.status = 'draft'
--     )
--   );

-- CREATE POLICY "mp_storage_owner_insert" ON storage.objects
--   FOR INSERT TO authenticated
--   WITH CHECK (
--     bucket_id = 'properties'
--     AND EXISTS (
--       SELECT 1 FROM public.properties p
--       WHERE p.id::text = (storage.foldername(name))[1]
--         AND p.owner_id = auth.uid()
--         AND p.status = 'draft'
--     )
--   );
