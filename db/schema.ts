import { sql } from 'drizzle-orm';
import {
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid
} from 'drizzle-orm/pg-core';

/* -------------------------------------------------------------------------- */
/*  Enums                                                                     */
/* -------------------------------------------------------------------------- */

// `agent` et `proprietaire` existent dès la Phase 1 (marketplace-ready) mais
// aucune UI ne les expose tant que NEXT_PUBLIC_MARKETPLACE_MODE=false.
export const userRoleEnum = pgEnum('user_role', [
  'admin',
  'agent',
  'proprietaire',
  'acheteur'
]);

export const propertyTypeEnum = pgEnum('property_type', [
  'villa',
  'riad',
  'appartement',
  'studio',
  'maison',
  'terrain',
  'ferme',
  'duplex',
  'penthouse',
  'local_commercial'
]);

export const transactionEnum = pgEnum('transaction_type', [
  'vente',
  'location'
]);

export const propertyStatusEnum = pgEnum('property_status', [
  'draft',
  'published',
  'sous_offre',
  'vendu',
  'loue',
  'archive'
]);

export const currencyEnum = pgEnum('currency', ['MAD', 'EUR']);

export const mediaKindEnum = pgEnum('media_kind', ['image', 'video']);

export const leadSourceEnum = pgEnum('lead_source', [
  'formulaire',
  'whatsapp',
  'telephone'
]);

export const leadStatusEnum = pgEnum('lead_status', [
  'nouveau',
  'contacte',
  'qualifie',
  'converti',
  'perdu'
]);

export const guideCategoryEnum = pgEnum('guide_category', [
  'acheter_au_maroc',
  'quartiers',
  'investissement',
  'renovation',
  'vivre_a_marrakech'
]);

export const partnerCategoryEnum = pgEnum('partner_category', [
  'notaire',
  'architecte',
  'architecte_interieur',
  'conciergerie',
  'artisan',
  'mobilier'
]);

/* -------------------------------------------------------------------------- */
/*  Constantes partagées                                                      */
/* -------------------------------------------------------------------------- */

export const PROPERTY_FEATURES = [
  'piscine',
  'jardin',
  'terrasse',
  'rooftop',
  'hammam',
  'cheminee',
  'garage',
  'ascenseur',
  'climatisation',
  'chauffage',
  'meuble',
  'gardien',
  'puits',
  'titre_foncier',
  'vue_atlas'
] as const;

export type PropertyFeature = (typeof PROPERTY_FEATURES)[number];

export type QuartierFaqItem = {
  q_fr: string;
  a_fr: string;
  q_en: string;
  a_en: string;
};

// Statuts visibles publiquement : les biens vendus/loués restent en ligne
// (bandeau « Vendu par TMI », preuve sociale + conservation du SEO).
export const PUBLIC_PROPERTY_STATUSES = [
  'published',
  'sous_offre',
  'vendu',
  'loue'
] as const;

/* -------------------------------------------------------------------------- */
/*  profiles — miroir de auth.users (FK ajoutée en SQL, cf. migration RLS)    */
/* -------------------------------------------------------------------------- */

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(), // = auth.users.id
  role: userRoleEnum('role').notNull().default('acheteur'),
  fullName: text('full_name'),
  phone: text('phone'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow()
});

/* -------------------------------------------------------------------------- */
/*  quartiers                                                                 */
/* -------------------------------------------------------------------------- */

export const quartiers = pgTable(
  'quartiers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull(),
    nameFr: text('name_fr').notNull(),
    nameEn: text('name_en').notNull(),
    // 2–3 phrases, affichées sur les cartes et en « quartier en bref »
    introFr: text('intro_fr'),
    introEn: text('intro_en'),
    // Éditorial long (markdown, objectif ≥ 600 mots)
    contentFr: text('content_fr'),
    contentEn: text('content_en'),
    faq: jsonb('faq')
      .$type<QuartierFaqItem[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    lat: doublePrecision('lat'),
    lng: doublePrecision('lng'),
    coverUrl: text('cover_url'),
    position: integer('position').notNull().default(0),
    published: boolean('published').notNull().default(false)
  },
  (table) => ({
    slugIdx: uniqueIndex('quartiers_slug_idx').on(table.slug),
    publishedPositionIdx: index('quartiers_published_position_idx').on(
      table.published,
      table.position
    )
  })
);

/* -------------------------------------------------------------------------- */
/*  properties                                                                */
/* -------------------------------------------------------------------------- */

export const properties = pgTable(
  'properties',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    // Format : {type}-{quartier}-{titre-court}-{ref}, ex. riad-medina-patio-fontaine-tmi0042
    slug: text('slug').notNull(),
    // Format TMI-0042 — défaut alimenté par une séquence (cf. migration RLS)
    reference: text('reference').notNull(),
    type: propertyTypeEnum('type').notNull(),
    transaction: transactionEnum('transaction').notNull(),
    status: propertyStatusEnum('status').notNull().default('draft'),
    titleFr: text('title_fr').notNull(),
    titleEn: text('title_en'),
    descriptionFr: text('description_fr'),
    descriptionEn: text('description_en'),
    // Unités entières (MAD ou EUR), jamais des centimes
    price: integer('price'),
    currency: currencyEnum('currency').notNull().default('MAD'),
    priceOnRequest: boolean('price_on_request').notNull().default(false),
    surfaceHabitable: integer('surface_habitable'), // m²
    surfaceTerrain: integer('surface_terrain'), // m²
    chambres: integer('chambres'),
    sdb: integer('sdb'),
    etages: integer('etages'),
    anneeConstruction: integer('annee_construction'),
    features: jsonb('features')
      .$type<PropertyFeature[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    quartierId: uuid('quartier_id').references(() => quartiers.id, {
      onDelete: 'restrict'
    }),
    ville: text('ville').notNull().default('Marrakech'),
    // Jamais affichée publiquement — cf. policy de colonne dans la migration RLS
    adressePrivee: text('adresse_privee'),
    // Position approximative publique
    lat: doublePrecision('lat'),
    lng: doublePrecision('lng'),
    exclusivite: boolean('exclusivite').notNull().default(false),
    featured: boolean('featured').notNull().default(false),
    videoUrl: text('video_url'),
    visiteVirtuelleUrl: text('visite_virtuelle_url'),
    // Overrides SEO optionnels
    metaTitleFr: text('meta_title_fr'),
    metaTitleEn: text('meta_title_en'),
    metaDescriptionFr: text('meta_description_fr'),
    metaDescriptionEn: text('meta_description_en'),
    // Aujourd'hui : l'admin. Prêt pour la marketplace (Phase 2).
    ownerId: uuid('owner_id').references(() => profiles.id, {
      onDelete: 'set null'
    }),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    viewsCount: integer('views_count').notNull().default(0)
  },
  (table) => ({
    slugIdx: uniqueIndex('properties_slug_idx').on(table.slug),
    referenceIdx: uniqueIndex('properties_reference_idx').on(table.reference),
    // Couvre les listings publics : transaction × type × quartier filtrés par statut
    listingIdx: index('properties_listing_idx').on(
      table.status,
      table.transaction,
      table.type,
      table.quartierId
    ),
    featuredIdx: index('properties_featured_idx').on(
      table.featured,
      table.status
    ),
    publishedAtIdx: index('properties_published_at_idx').on(table.publishedAt)
  })
);

/* -------------------------------------------------------------------------- */
/*  property_media                                                            */
/* -------------------------------------------------------------------------- */

export const propertyMedia = pgTable(
  'property_media',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    propertyId: uuid('property_id')
      .notNull()
      .references(() => properties.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    // Alt bilingues obligatoires avant publication (checklist admin)
    altFr: text('alt_fr').notNull(),
    altEn: text('alt_en').notNull(),
    position: integer('position').notNull().default(0),
    kind: mediaKindEnum('kind').notNull().default('image')
  },
  (table) => ({
    propertyPositionIdx: index('property_media_property_position_idx').on(
      table.propertyId,
      table.position
    )
  })
);

/* -------------------------------------------------------------------------- */
/*  leads                                                                     */
/* -------------------------------------------------------------------------- */

export const leads = pgTable(
  'leads',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    propertyId: uuid('property_id').references(() => properties.id, {
      onDelete: 'set null'
    }),
    name: text('name').notNull(),
    phone: text('phone').notNull(),
    email: text('email'),
    message: text('message'),
    source: leadSourceEnum('source').notNull(),
    locale: text('locale').notNull().default('fr'),
    pageUrl: text('page_url'),
    status: leadStatusEnum('status').notNull().default('nouveau'),
    internalNote: text('internal_note'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  (table) => ({
    statusCreatedIdx: index('leads_status_created_idx').on(
      table.status,
      table.createdAt
    )
  })
);

/* -------------------------------------------------------------------------- */
/*  guides                                                                    */
/* -------------------------------------------------------------------------- */

export const guides = pgTable(
  'guides',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull(),
    titleFr: text('title_fr').notNull(),
    titleEn: text('title_en'),
    excerptFr: text('excerpt_fr'),
    excerptEn: text('excerpt_en'),
    contentFr: text('content_fr'),
    contentEn: text('content_en'),
    coverUrl: text('cover_url'),
    category: guideCategoryEnum('category').notNull(),
    // Maillage interne : un guide peut cibler un type de bien et/ou un quartier
    relatedType: propertyTypeEnum('related_type'),
    relatedQuartierId: uuid('related_quartier_id').references(
      () => quartiers.id,
      { onDelete: 'set null' }
    ),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  (table) => ({
    slugIdx: uniqueIndex('guides_slug_idx').on(table.slug),
    categoryIdx: index('guides_category_idx').on(table.category),
    relatedQuartierIdx: index('guides_related_quartier_idx').on(
      table.relatedQuartierId
    )
  })
);

/* -------------------------------------------------------------------------- */
/*  partners — Phase 2 : table créée, aucune UI                               */
/* -------------------------------------------------------------------------- */

export const partners = pgTable(
  'partners',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    category: partnerCategoryEnum('category').notNull(),
    bioFr: text('bio_fr'),
    bioEn: text('bio_en'),
    logoUrl: text('logo_url'),
    published: boolean('published').notNull().default(false)
  },
  (table) => ({
    slugIdx: uniqueIndex('partners_slug_idx').on(table.slug)
  })
);

/* -------------------------------------------------------------------------- */
/*  combo_content — blocs éditoriaux des pages programmatiques (§6.5)         */
/*  Rend indexable un combo transaction × type × quartier avec < 2 biens.     */
/* -------------------------------------------------------------------------- */

export const comboContent = pgTable(
  'combo_content',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    transaction: transactionEnum('transaction').notNull(),
    type: propertyTypeEnum('type').notNull(),
    quartierId: uuid('quartier_id')
      .notNull()
      .references(() => quartiers.id, { onDelete: 'cascade' }),
    // Intro unique ≥ 120 mots — jamais un gabarit à variables
    introFr: text('intro_fr'),
    introEn: text('intro_en'),
    faq: jsonb('faq')
      .$type<QuartierFaqItem[]>()
      .notNull()
      .default(sql`'[]'::jsonb`)
  },
  (table) => ({
    comboIdx: uniqueIndex('combo_content_combo_idx').on(
      table.transaction,
      table.type,
      table.quartierId
    )
  })
);

/* -------------------------------------------------------------------------- */
/*  slug_redirects — 301 automatiques quand un slug de bien change (§5)       */
/* -------------------------------------------------------------------------- */

export const slugRedirects = pgTable(
  'slug_redirects',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    oldSlug: text('old_slug').notNull(),
    newSlug: text('new_slug').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  (table) => ({
    oldSlugIdx: uniqueIndex('slug_redirects_old_slug_idx').on(table.oldSlug)
  })
);

/* -------------------------------------------------------------------------- */
/*  Types inférés                                                             */
/* -------------------------------------------------------------------------- */

export type Profile = typeof profiles.$inferSelect;
export type Quartier = typeof quartiers.$inferSelect;
export type NewQuartier = typeof quartiers.$inferInsert;
export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
export type PropertyMedia = typeof propertyMedia.$inferSelect;
export type NewPropertyMedia = typeof propertyMedia.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type Guide = typeof guides.$inferSelect;
export type NewGuide = typeof guides.$inferInsert;
export type Partner = typeof partners.$inferSelect;
export type ComboContent = typeof comboContent.$inferSelect;
export type SlugRedirect = typeof slugRedirects.$inferSelect;
