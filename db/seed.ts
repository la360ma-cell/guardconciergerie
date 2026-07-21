/**
 * Seed de démonstration — idempotent (ré-exécutable sans doublons).
 *
 *   npm run db:seed
 *
 * - 10 quartiers réels (intros courtes réelles, éditorial long à enrichir)
 * - 8 biens [DÉMO] (mix types/transactions, 2 featured, 1 prix sur demande, 1 vendu)
 * - 2 guides [DÉMO]
 * - Promotion admin du compte ADMIN_EMAIL s'il existe déjà dans auth.users
 *   (sinon, instructions affichées — voir README)
 *
 * Tout contenu factuel non vérifié est marqué [À COMPLÉTER].
 */
import 'dotenv/config';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';
import {
  guides,
  properties,
  propertyMedia,
  quartiers,
  type NewGuide,
  type NewProperty,
  type NewQuartier
} from './schema';

/* -------------------------------------------------------------------------- */
/*  Quartiers                                                                 */
/* -------------------------------------------------------------------------- */

const contentPlaceholderFr = (nom: string) => `## Vivre à ${nom}

[À COMPLÉTER — éditorial long (≥ 600 mots) : histoire du quartier, ambiance, types de biens, profils d'acheteurs, commerces et points d'intérêt, accès.]

## Le marché immobilier

[À COMPLÉTER — typologie des biens, niveaux de prix constatés, dynamique du marché.]
`;

const contentPlaceholderEn = (nom: string) => `## Living in ${nom}

[À COMPLÉTER — long-form editorial (≥ 600 words): history, atmosphere, property types, buyer profiles, amenities and points of interest, access.]

## The property market

[À COMPLÉTER — property typology, observed price levels, market dynamics.]
`;

const quartierRows: NewQuartier[] = [
  {
    slug: 'hivernage',
    nameFr: 'Hivernage',
    nameEn: 'Hivernage',
    introFr:
      "Quartier hôtelier et résidentiel chic aux portes de la médina, l'Hivernage aligne palaces, résidences de standing et avenues bordées de palmiers. On y vit à pied, entre la Koutoubia, les jardins et une vie nocturne feutrée.",
    introEn:
      'A polished hotel-and-residential district at the gates of the medina, Hivernage lines up grand hotels, upscale residences and palm-shaded avenues. Life here is walkable — the Koutoubia, the gardens and a discreet nightlife are all close by.',
    contentFr: contentPlaceholderFr("l'Hivernage"),
    contentEn: contentPlaceholderEn('Hivernage'),
    lat: 31.6167,
    lng: -8.0125,
    coverUrl: '/images/demo/placeholder-1.svg',
    position: 1,
    published: true
  },
  {
    slug: 'gueliz',
    nameFr: 'Guéliz',
    nameEn: 'Gueliz',
    introFr:
      "Cœur moderne de Marrakech dessiné au début du XXe siècle, Guéliz concentre commerces, galeries, cafés et bureaux. C'est le quartier des appartements : immeubles Art déco réhabilités et résidences récentes avec ascenseur.",
    introEn:
      'The modern heart of Marrakech, laid out in the early twentieth century, Gueliz gathers shops, galleries, cafés and offices. It is the apartment district par excellence: restored Art Deco buildings and recent residences with lifts.',
    contentFr: contentPlaceholderFr('Guéliz'),
    contentEn: contentPlaceholderEn('Gueliz'),
    lat: 31.634,
    lng: -8.0119,
    coverUrl: '/images/demo/placeholder-2.svg',
    position: 2,
    published: true
  },
  {
    slug: 'palmeraie',
    nameFr: 'Palmeraie',
    nameEn: 'Palmeraie',
    introFr:
      "Au nord de la ville, la Palmeraie déroule ses palmiers dattiers, ses golfs et ses domaines privés. C'est le territoire des grandes villas aux jardins matures, recherchées pour leur calme et leurs volumes.",
    introEn:
      'North of the city, the Palmeraie unrolls its date palms, golf courses and private estates. This is the land of large villas with mature gardens, prized for their calm and their generous volumes.',
    contentFr: contentPlaceholderFr('la Palmeraie'),
    contentEn: contentPlaceholderEn('the Palmeraie'),
    lat: 31.674,
    lng: -7.976,
    coverUrl: '/images/demo/placeholder-3.svg',
    position: 3,
    published: true
  },
  {
    slug: 'medina',
    nameFr: 'Médina',
    nameEn: 'Medina',
    introFr:
      "Cœur historique de Marrakech inscrit au patrimoine mondial de l'UNESCO, la médina abrite les riads traditionnels organisés autour de leurs patios. Ruelles, souks et artisanat composent un cadre de vie unique, à quelques pas de Jemaa el-Fna.",
    introEn:
      'The historic heart of Marrakech, a UNESCO World Heritage site, the medina is home to traditional riads built around their patios. Alleyways, souks and craftsmanship make for a way of life unlike any other, steps from Jemaa el-Fna.',
    contentFr: contentPlaceholderFr('la médina'),
    contentEn: contentPlaceholderEn('the medina'),
    lat: 31.6295,
    lng: -7.9811,
    coverUrl: '/images/demo/placeholder-4.svg',
    position: 4,
    published: true
  },
  {
    slug: 'agdal',
    nameFr: 'Agdal',
    nameEn: 'Agdal',
    introFr:
      "Au sud du centre, l'Agdal s'est imposé comme le quartier résidentiel moderne de Marrakech : larges avenues, résidences récentes, commerces et centres commerciaux. Un choix pragmatique pour vivre à l'année.",
    introEn:
      'South of the centre, Agdal has become the modern residential district of Marrakech: wide avenues, recent residences, shops and malls. A pragmatic choice for year-round living.',
    contentFr: contentPlaceholderFr("l'Agdal"),
    contentEn: contentPlaceholderEn('Agdal'),
    lat: 31.599,
    lng: -8.01,
    coverUrl: '/images/demo/placeholder-1.svg',
    position: 5,
    published: true
  },
  {
    slug: 'targa',
    nameFr: 'Targa',
    nameEn: 'Targa',
    introFr:
      "À l'ouest de la ville, Targa est un quartier résidentiel apprécié des familles pour ses villas, ses écoles et son rythme paisible. Les maisons avec jardin y côtoient des résidences plus récentes.",
    introEn:
      'West of the city, Targa is a residential district that families favour for its villas, its schools and its unhurried pace. Garden houses sit alongside more recent developments.',
    contentFr: contentPlaceholderFr('Targa'),
    contentEn: contentPlaceholderEn('Targa'),
    lat: 31.652,
    lng: -8.047,
    coverUrl: '/images/demo/placeholder-2.svg',
    position: 6,
    published: true
  },
  {
    slug: 'amelkis',
    nameFr: 'Amelkis',
    nameEn: 'Amelkis',
    introFr:
      "Domaine golfique sécurisé au sud-est de Marrakech, Amelkis rassemble villas contemporaines et demeures de standing autour de son parcours. Vues sur l'Atlas, calme et prestations haut de gamme en font une adresse recherchée.",
    introEn:
      'A secure golf estate south-east of Marrakech, Amelkis gathers contemporary villas and distinguished homes around its course. Atlas views, quiet and high-end amenities make it a sought-after address.',
    contentFr: contentPlaceholderFr("d'Amelkis"),
    contentEn: contentPlaceholderEn('Amelkis'),
    lat: 31.593,
    lng: -7.943,
    coverUrl: '/images/demo/placeholder-3.svg',
    position: 7,
    published: true
  },
  {
    slug: 'route-ourika',
    nameFr: "Route de l'Ourika",
    nameEn: 'Ourika Road',
    introFr:
      "Axe de campagne filant vers l'Atlas au sud de Marrakech, la route de l'Ourika égrène fermes, villas aux grands terrains et maisons d'hôtes. On y cherche l'espace, les oliviers et la vue sur les sommets.",
    introEn:
      'A countryside corridor running towards the Atlas south of Marrakech, the Ourika road is dotted with farms, villas on large plots and guest houses. People come here for space, olive trees and mountain views.',
    contentFr: contentPlaceholderFr("de la route de l'Ourika"),
    contentEn: contentPlaceholderEn('the Ourika road'),
    lat: 31.545,
    lng: -7.935,
    coverUrl: '/images/demo/placeholder-4.svg',
    position: 8,
    published: true
  },
  {
    slug: 'route-amizmiz',
    nameFr: "Route d'Amizmiz",
    nameEn: 'Amizmiz Road',
    introFr:
      "Au sud-ouest de la ville, la route d'Amizmiz traverse une campagne ouverte face à l'Atlas, autour du lac Takerkoust. Terrains agricoles, fermes et projets d'écolodges y trouvent leur terre d'élection.",
    introEn:
      'South-west of the city, the Amizmiz road crosses open countryside facing the Atlas, around Lake Takerkoust. Farmland, country estates and ecolodge projects find their natural home here.',
    contentFr: contentPlaceholderFr("de la route d'Amizmiz"),
    contentEn: contentPlaceholderEn('the Amizmiz road'),
    lat: 31.56,
    lng: -8.12,
    coverUrl: '/images/demo/placeholder-1.svg',
    position: 9,
    published: true
  },
  {
    slug: 'route-fes',
    nameFr: 'Route de Fès',
    nameEn: 'Fez Road',
    introFr:
      'Au nord-est de Marrakech, la route de Fès borde la palmeraie et accueille domaines privés et résidences sécurisées. Les villas y offrent de belles surfaces à quelques minutes du centre.',
    introEn:
      'North-east of Marrakech, the Fez road skirts the palm grove and hosts private estates and gated residences. Villas here offer generous living space just minutes from the centre.',
    contentFr: contentPlaceholderFr('de la route de Fès'),
    contentEn: contentPlaceholderEn('the Fez road'),
    lat: 31.68,
    lng: -7.93,
    coverUrl: '/images/demo/placeholder-2.svg',
    position: 10,
    published: true
  }
];

/* -------------------------------------------------------------------------- */
/*  Biens [DÉMO]                                                              */
/* -------------------------------------------------------------------------- */

type DemoProperty = Omit<NewProperty, 'quartierId'> & { quartierSlug: string };

const propertyRows: DemoProperty[] = [
  {
    slug: 'villa-palmeraie-jardins-matures-tmi0001',
    reference: 'TMI-0001',
    type: 'villa',
    transaction: 'vente',
    status: 'published',
    titleFr: '[DÉMO] Villa aux jardins matures',
    titleEn: '[DEMO] Villa with mature gardens',
    descriptionFr:
      "Dans un domaine calme de la Palmeraie, cette villa de plain-pied s'ouvre sur un jardin planté de palmiers et d'oliviers adultes. La réception traversante, prolongée par une terrasse ombragée, regarde la piscine ; la cuisine, entièrement équipée, dispose de son office. Cinq chambres en suite, dont une suite principale avec dressing et cheminée, se répartissent dans deux ailes indépendantes — une organisation idéale pour recevoir. Les matériaux sont soignés : sols en pierre, menuiseries en cèdre, salles de bains en tadelakt. Un logement de gardien, un garage double et un système d'arrosage automatique complètent l'ensemble. Le titre foncier est en règle. Une adresse rare pour qui cherche l'espace et la sérénité de la Palmeraie, à vingt minutes du centre. Bien de démonstration : les informations affichées sont fictives.",
    descriptionEn:
      'Set in a quiet Palmeraie estate, this single-storey villa opens onto a garden planted with mature palms and olive trees. The dual-aspect reception, extended by a shaded terrace, faces the pool; the fully fitted kitchen has its own scullery. Five en-suite bedrooms, including a principal suite with dressing room and fireplace, are laid out across two independent wings — ideal for entertaining. Materials are carefully chosen: stone floors, cedar joinery, tadelakt bathrooms. Staff quarters, a double garage and automatic irrigation complete the property, and the land title is in order. A rare address for anyone seeking the space and serenity of the Palmeraie, twenty minutes from the centre. Demonstration listing: all details shown are fictitious.',
    price: 12500000,
    currency: 'MAD',
    priceOnRequest: false,
    surfaceHabitable: 620,
    surfaceTerrain: 4000,
    chambres: 5,
    sdb: 5,
    etages: 1,
    anneeConstruction: 2016,
    features: [
      'piscine',
      'jardin',
      'terrasse',
      'cheminee',
      'garage',
      'climatisation',
      'gardien',
      'titre_foncier'
    ],
    quartierSlug: 'palmeraie',
    lat: 31.6772,
    lng: -7.9723,
    exclusivite: false,
    featured: true,
    publishedAt: new Date('2026-06-02T09:00:00Z')
  },
  {
    slug: 'riad-medina-patio-fontaine-tmi0002',
    reference: 'TMI-0002',
    type: 'riad',
    transaction: 'vente',
    status: 'published',
    titleFr: '[DÉMO] Riad au patio et à la fontaine',
    titleEn: '[DEMO] Riad with patio and fountain',
    descriptionFr:
      "À quelques minutes à pied de Jemaa el-Fna, dans un derb paisible, ce riad restauré s'organise autour d'un patio à fontaine planté d'un oranger. Au rez-de-chaussée : double salon avec cheminée, salle à manger et cuisine attenante. À l'étage, quatre chambres en suite ouvrent sur la galerie ; les salles d'eau mêlent tadelakt et zellige. Le rooftop, aménagé en plusieurs salons, embrasse les toits de la médina et offre un hammam traditionnel. La restauration a préservé les éléments d'origine — plafonds en bois peint, portes cloutées — tout en intégrant climatisation réversible et réseau moderne. Vendu meublé, prêt à vivre ou à exploiter en maison d'hôtes. Bien de démonstration : les informations affichées sont fictives.",
    descriptionEn:
      'A few minutes on foot from Jemaa el-Fna, in a peaceful derb, this restored riad is arranged around a fountain patio planted with an orange tree. On the ground floor: a double sitting room with fireplace, dining room and adjoining kitchen. Upstairs, four en-suite bedrooms open onto the gallery; the bathrooms combine tadelakt and zellige. The rooftop, laid out as a series of lounges, overlooks the medina and hosts a traditional hammam. The restoration preserved the original features — painted wooden ceilings, studded doors — while adding reversible air conditioning and modern services. Sold furnished, ready to live in or to run as a guest house. Demonstration listing: all details shown are fictitious.',
    price: 4800000,
    currency: 'MAD',
    priceOnRequest: false,
    surfaceHabitable: 280,
    surfaceTerrain: null,
    chambres: 4,
    sdb: 4,
    etages: 2,
    anneeConstruction: null,
    features: [
      'terrasse',
      'rooftop',
      'hammam',
      'cheminee',
      'climatisation',
      'meuble'
    ],
    quartierSlug: 'medina',
    lat: 31.6288,
    lng: -7.9838,
    exclusivite: true,
    featured: true,
    publishedAt: new Date('2026-06-10T09:00:00Z')
  },
  {
    slug: 'appartement-gueliz-terrasse-lumineuse-tmi0003',
    reference: 'TMI-0003',
    type: 'appartement',
    transaction: 'location',
    status: 'published',
    titleFr: '[DÉMO] Appartement lumineux avec terrasse',
    titleEn: '[DEMO] Light-filled apartment with terrace',
    descriptionFr:
      "En étage élevé d'une résidence récente avec ascenseur, à deux pas des commerces de Guéliz, cet appartement traversant profite d'une lumière constante. Le séjour ouvre sur une terrasse orientée sud-ouest, assez profonde pour y dîner ; la cuisine équipée est séparée. Deux chambres avec placards, dont une suite avec salle d'eau, une seconde salle de bains et une buanderie complètent le plan. Loué meublé avec goût — mobilier contemporain, tapis berbères anciens —, climatisation réversible dans toutes les pièces, place de parking en sous-sol. Résidence sécurisée avec gardien. Idéal pour une installation immédiate au cœur du Marrakech moderne, à dix minutes à pied de la gare. Bien de démonstration : les informations affichées sont fictives.",
    descriptionEn:
      'On an upper floor of a recent building with a lift, steps from the shops of Gueliz, this dual-aspect apartment enjoys steady light all day. The living room opens onto a south-west-facing terrace deep enough to dine on; the fitted kitchen is separate. Two bedrooms with wardrobes — one en suite — a second bathroom and a laundry room complete the layout. Let tastefully furnished, with contemporary pieces and vintage Berber rugs, reversible air conditioning throughout and a basement parking space. Secure residence with caretaker. Ideal for settling straight into modern Marrakech, a ten-minute walk from the railway station. Demonstration listing: all details shown are fictitious.',
    price: 12000,
    currency: 'MAD',
    priceOnRequest: false,
    surfaceHabitable: 110,
    surfaceTerrain: null,
    chambres: 2,
    sdb: 2,
    etages: null,
    anneeConstruction: 2020,
    features: ['terrasse', 'ascenseur', 'climatisation', 'meuble', 'gardien'],
    quartierSlug: 'gueliz',
    lat: 31.6355,
    lng: -8.0102,
    exclusivite: false,
    featured: false,
    publishedAt: new Date('2026-06-18T09:00:00Z')
  },
  {
    slug: 'villa-amelkis-face-golf-tmi0004',
    reference: 'TMI-0004',
    type: 'villa',
    transaction: 'location',
    status: 'published',
    titleFr: '[DÉMO] Villa contemporaine face au golf',
    titleEn: '[DEMO] Contemporary villa facing the golf course',
    descriptionFr:
      "Dans le domaine sécurisé d'Amelkis, cette villa contemporaine s'aligne sur le fairway et regarde l'Atlas. Les volumes sont francs : réception de plain-pied entièrement vitrée, cuisine ouverte avec îlot, quatre suites dont une au rez-de-chaussée. Le jardin, dessiné sobrement, encadre une piscine à débordement chauffée ; le pool house sert d'été comme salon d'extérieur. Prestations complètes : domotique, climatisation par zones, chauffage au sol, personnel de maison possible. Louée meublée à l'année, elle convient à une famille comme à une résidence de fonction. Le calme du domaine, la sécurité 24 h/24 et la proximité des écoles internationales en font une des locations les plus abouties du secteur. Bien de démonstration : les informations affichées sont fictives.",
    descriptionEn:
      'Inside the secure Amelkis estate, this contemporary villa lines the fairway and looks out to the Atlas. The volumes are assured: a fully glazed ground-floor reception, an open kitchen with island, four suites including one downstairs. The soberly designed garden frames a heated infinity pool; the pool house doubles as an outdoor lounge. Specifications are complete: home automation, zoned air conditioning, underfloor heating, staff accommodation possible. Let furnished on a yearly basis, it suits a family as well as an executive posting. The estate’s calm, round-the-clock security and proximity to international schools make it one of the most accomplished rentals in the area. Demonstration listing: all details shown are fictitious.',
    price: null,
    currency: 'MAD',
    priceOnRequest: true,
    surfaceHabitable: 450,
    surfaceTerrain: 1800,
    chambres: 4,
    sdb: 4,
    etages: 2,
    anneeConstruction: 2019,
    features: [
      'piscine',
      'jardin',
      'terrasse',
      'climatisation',
      'chauffage',
      'meuble',
      'gardien',
      'vue_atlas'
    ],
    quartierSlug: 'amelkis',
    lat: 31.5945,
    lng: -7.9412,
    exclusivite: true,
    featured: false,
    publishedAt: new Date('2026-06-22T09:00:00Z')
  },
  {
    slug: 'studio-hivernage-meuble-tmi0005',
    reference: 'TMI-0005',
    type: 'studio',
    transaction: 'location',
    status: 'published',
    titleFr: "[DÉMO] Studio meublé au cœur de l'Hivernage",
    titleEn: '[DEMO] Furnished studio in the heart of Hivernage',
    descriptionFr:
      "Au pied des hôtels et des jardins de l'Hivernage, ce studio rénové optimise chaque mètre carré : pièce de vie avec coin nuit séparable, kitchenette équipée, salle d'eau en tadelakt et balcon filant sur une rue calme. La résidence, bien tenue, dispose d'un ascenseur et d'un gardien. Loué meublé — literie de qualité, rangements sur mesure, climatisation réversible —, il s'adresse à un locataire seul ou à un pied-à-terre : la Koutoubia, la médina et le Palais des Congrès sont accessibles à pied, les terrasses du quartier aussi. Disponible immédiatement, charges de copropriété raisonnables. Bien de démonstration : les informations affichées sont fictives.",
    descriptionEn:
      'At the foot of the hotels and gardens of Hivernage, this renovated studio makes every square metre count: a living space with a partitionable sleeping area, a fitted kitchenette, a tadelakt shower room and a balcony running along a quiet street. The well-kept residence has a lift and a caretaker. Let furnished — quality bedding, made-to-measure storage, reversible air conditioning — it suits a single tenant or a pied-à-terre: the Koutoubia, the medina and the conference centre are within walking distance, as are the neighbourhood’s café terraces. Available immediately, with reasonable service charges. Demonstration listing: all details shown are fictitious.',
    price: 7500,
    currency: 'MAD',
    priceOnRequest: false,
    surfaceHabitable: 42,
    surfaceTerrain: null,
    chambres: null,
    sdb: 1,
    etages: null,
    anneeConstruction: 2012,
    features: ['ascenseur', 'climatisation', 'meuble', 'gardien'],
    quartierSlug: 'hivernage',
    lat: 31.6172,
    lng: -8.0138,
    exclusivite: false,
    featured: false,
    publishedAt: new Date('2026-07-01T09:00:00Z')
  },
  {
    slug: 'maison-targa-jardin-familial-tmi0006',
    reference: 'TMI-0006',
    type: 'maison',
    transaction: 'vente',
    status: 'published',
    titleFr: '[DÉMO] Maison familiale avec jardin',
    titleEn: '[DEMO] Family house with garden',
    descriptionFr:
      "Dans une rue résidentielle de Targa, cette maison des années 2000, régulièrement entretenue, offre un plan familial efficace. Le rez-de-chaussée réunit salon avec cheminée, salle à manger et cuisine donnant sur le jardin ; à l'étage, quatre chambres et deux salles de bains, dont une suite parentale avec terrasse. Le jardin arboré accueille un coin repas ombragé et laisse la place pour une piscine (avant-projet disponible). Garage fermé, buanderie, chauffage central et double vitrage. À proximité : écoles, commerces de quartier et accès rapide au centre. Une maison saine, sans travaux majeurs, pour une installation familiale à l'année. Bien de démonstration : les informations affichées sont fictives.",
    descriptionEn:
      'On a residential street in Targa, this well-maintained house from the 2000s offers an efficient family layout. The ground floor brings together a sitting room with fireplace, a dining room and a kitchen opening onto the garden; upstairs are four bedrooms and two bathrooms, including a principal suite with terrace. The tree-lined garden holds a shaded dining corner and leaves room for a pool (preliminary design available). Closed garage, laundry room, central heating and double glazing. Nearby: schools, local shops and quick access to the centre. A sound house with no major works needed, for year-round family living. Demonstration listing: all details shown are fictitious.',
    price: 3200000,
    currency: 'MAD',
    priceOnRequest: false,
    surfaceHabitable: 240,
    surfaceTerrain: 500,
    chambres: 4,
    sdb: 2,
    etages: 2,
    anneeConstruction: 2004,
    features: ['jardin', 'terrasse', 'cheminee', 'garage', 'chauffage'],
    quartierSlug: 'targa',
    lat: 31.6508,
    lng: -8.0492,
    exclusivite: false,
    featured: false,
    publishedAt: new Date('2026-07-05T09:00:00Z')
  },
  {
    slug: 'terrain-route-amizmiz-hectare-titre-tmi0007',
    reference: 'TMI-0007',
    type: 'terrain',
    transaction: 'vente',
    status: 'published',
    titleFr: "[DÉMO] Terrain titré d'un hectare face à l'Atlas",
    titleEn: '[DEMO] Titled one-hectare plot facing the Atlas',
    descriptionFr:
      "Sur la route d'Amizmiz, à proximité du lac Takerkoust, ce terrain d'un hectare bénéficie d'un titre foncier en règle et d'un accès direct depuis une piste carrossable. Le sol, plat et dégagé, porte quelques oliviers ; un puits existant fournit l'eau, l'électricité passe en bordure de parcelle. La vue sur l'Atlas est frontale et dégagée, sans construction en premier plan. Configuration adaptée à un projet de ferme d'agrément, de maison d'hôtes ou de résidence secondaire, sous réserve des autorisations d'usage [À COMPLÉTER : zonage exact et règles de constructibilité à vérifier auprès des autorités compétentes]. Bornage récent, documents disponibles sur demande. Bien de démonstration : les informations affichées sont fictives.",
    descriptionEn:
      'On the Amizmiz road, near Lake Takerkoust, this one-hectare plot comes with a clean land title and direct access from a drivable track. The flat, open ground carries a few olive trees; an existing well supplies water and electricity runs along the edge of the parcel. The Atlas view is head-on and unobstructed, with nothing built in the foreground. The configuration suits a country retreat, a guest house or a second home, subject to the applicable permissions [À COMPLÉTER: exact zoning and building rules to be confirmed with the relevant authorities]. Recently surveyed, with documents available on request. Demonstration listing: all details shown are fictitious.',
    price: 1900000,
    currency: 'MAD',
    priceOnRequest: false,
    surfaceHabitable: null,
    surfaceTerrain: 10000,
    chambres: null,
    sdb: null,
    etages: null,
    anneeConstruction: null,
    features: ['titre_foncier', 'puits', 'vue_atlas'],
    quartierSlug: 'route-amizmiz',
    lat: 31.5624,
    lng: -8.1186,
    exclusivite: false,
    featured: false,
    publishedAt: new Date('2026-07-08T09:00:00Z')
  },
  {
    slug: 'ferme-route-ourika-oliveraie-tmi0008',
    reference: 'TMI-0008',
    type: 'ferme',
    transaction: 'vente',
    status: 'vendu',
    titleFr: '[DÉMO] Ferme et son oliveraie',
    titleEn: '[DEMO] Farm with olive grove',
    descriptionFr:
      "Sur la route de l'Ourika, cette ferme de trois hectares réunit une oliveraie en production, un potager irrigué par un puits et une maison principale de plain-pied ouverte sur l'Atlas. La bâtisse, construite en matériaux locaux, propose trois chambres, un grand séjour avec cheminée et une cuisine d'été sous pergola. Une dépendance loge le gardien ; un hangar agricole abrite le matériel. La piscine, posée au milieu des oliviers, profite d'une vue montagne sans vis-à-vis. L'ensemble a trouvé preneur rapidement — un profil de bien que nous recherchons activement pour nos clients. Confiez-nous votre recherche ou consultez les biens similaires ci-dessous. Bien de démonstration : les informations affichées sont fictives.",
    descriptionEn:
      'On the Ourika road, this three-hectare farm brings together a producing olive grove, a kitchen garden irrigated from a well, and a single-storey main house open to the Atlas. Built from local materials, the house offers three bedrooms, a large sitting room with fireplace and a summer kitchen under a pergola. An outbuilding houses the caretaker; a barn shelters the equipment. The pool, set among the olive trees, enjoys an unobstructed mountain view. The property found a buyer quickly — exactly the kind of estate we actively source for our clients. Entrust us with your search, or browse the similar properties below. Demonstration listing: all details shown are fictitious.',
    price: 6900000,
    currency: 'MAD',
    priceOnRequest: false,
    surfaceHabitable: 220,
    surfaceTerrain: 30000,
    chambres: 3,
    sdb: 2,
    etages: 1,
    anneeConstruction: 2010,
    features: ['piscine', 'jardin', 'puits', 'gardien', 'vue_atlas', 'cheminee'],
    quartierSlug: 'route-ourika',
    lat: 31.5482,
    lng: -7.9328,
    exclusivite: false,
    featured: false,
    publishedAt: new Date('2026-05-12T09:00:00Z')
  }
];

/** 5 photos par bien (checklist de publication : ≥ 5 photos avec alt FR/EN). */
const mediaViews = [
  { fr: 'vue extérieure', en: 'exterior view' },
  { fr: 'pièce de vie', en: 'living area' },
  { fr: 'chambre', en: 'bedroom' },
  { fr: 'terrasse', en: 'terrace' },
  { fr: 'vue du jardin', en: 'garden view' }
] as const;

/* -------------------------------------------------------------------------- */
/*  Guides [DÉMO]                                                             */
/* -------------------------------------------------------------------------- */

const guideRows: Array<
  Omit<NewGuide, 'relatedQuartierId'> & { relatedQuartierSlug: string | null }
> = [
  {
    slug: 'acheter-riad-medina-guide',
    titleFr: '[DÉMO] Acheter un riad dans la médina : le guide',
    titleEn: '[DEMO] Buying a riad in the medina: the guide',
    excerptFr:
      "Patio, derb, titre ou melkia : ce qu'il faut comprendre avant d'acheter un riad dans la médina de Marrakech, et comment mener la restauration.",
    excerptEn:
      'Patio, derb, title deed or melkia: what to understand before buying a riad in the Marrakech medina, and how to approach the restoration.',
    contentFr: `Acheter un riad dans la médina de Marrakech est un projet singulier : on n'y achète pas seulement des mètres carrés, mais une architecture, un voisinage et un mode de vie. Ce guide de démonstration pose la méthode.

## Comprendre ce qu'est un riad

Un riad est une maison traditionnelle organisée autour d'un patio, souvent planté, qui distribue lumière et fraîcheur à l'ensemble des pièces. L'orientation vers l'intérieur — peu ou pas de fenêtres sur rue — définit son intimité. Les niveaux supérieurs ouvrent sur des galeries, et le toit-terrasse constitue une véritable pièce à ciel ouvert.

## Le statut juridique du bien

C'est le point décisif d'un achat en médina. Deux régimes coexistent : le **titre foncier** (bien immatriculé auprès de la conservation foncière) et la **melkia** (acte adoulaire traditionnel). [À COMPLÉTER : détail des procédures d'immatriculation, délais et coûts constatés — à valider avec un notaire.]

## Évaluer l'état du bâti

Murs en pisé ou en brique, charpentes anciennes, réseaux repris ou d'origine : l'état réel d'un riad ne se lit pas à l'œil nu. Faire établir un diagnostic par un architecte habitué à la médina est un préalable, pas une option.

## Le derb et le voisinage

L'accès (largeur du derb, distance de stationnement), la mitoyenneté et la vie du quartier pèsent autant que le bien lui-même. Visitez à différentes heures.

## Budget global et travaux

Au prix d'acquisition s'ajoutent les frais d'acte et, presque toujours, un budget de restauration. [À COMPLÉTER : ordres de grandeur des coûts de restauration au m² — à valider avec des professionnels.]

*Guide de démonstration — contenu à compléter avant publication définitive.*`,
    contentEn: `Buying a riad in the Marrakech medina is a singular project: you are not just buying square metres, but an architecture, a neighbourhood and a way of life. This demonstration guide sets out the method.

## Understanding what a riad is

A riad is a traditional house arranged around a patio, often planted, which brings light and coolness to every room. Its inward orientation — few or no windows on the street — defines its privacy. Upper floors open onto galleries, and the roof terrace is a genuine open-air room.

## The legal status of the property

This is the decisive point of any medina purchase. Two regimes coexist: the **land title** (property registered with the land registry) and the **melkia** (traditional adoulary deed). [À COMPLÉTER: registration procedures, timelines and observed costs — to be confirmed with a notary.]

## Assessing the condition of the building

Rammed-earth or brick walls, old roof structures, renewed or original services: the true condition of a riad cannot be read with the naked eye. Commissioning a survey from an architect experienced in the medina is a prerequisite, not an option.

## The derb and the neighbourhood

Access (width of the derb, distance to parking), party walls and the life of the quarter matter as much as the property itself. Visit at different times of day.

## Overall budget and works

On top of the purchase price come deed fees and, almost always, a restoration budget. [À COMPLÉTER: order of magnitude of restoration costs per m² — to be confirmed with professionals.]

*Demonstration guide — content to be completed before final publication.*`,
    coverUrl: '/images/demo/placeholder-4.svg',
    category: 'acheter_au_maroc',
    relatedType: 'riad',
    relatedQuartierSlug: 'medina',
    publishedAt: new Date('2026-06-15T09:00:00Z')
  },
  {
    slug: 'frais-etapes-achat-immobilier-maroc',
    titleFr: "[DÉMO] Frais et étapes d'un achat immobilier au Maroc",
    titleEn: '[DEMO] Costs and steps of a property purchase in Morocco',
    excerptFr:
      "De l'offre d'achat à l'inscription foncière : les étapes d'une acquisition au Maroc et les frais à anticiper, expliqués simplement.",
    excerptEn:
      'From the offer to land registration: the steps of buying property in Morocco and the costs to anticipate, plainly explained.',
    contentFr: `Une acquisition immobilière au Maroc suit un parcours balisé. Le connaître avant de s'engager évite les mauvaises surprises de calendrier comme de budget. Ce guide de démonstration en trace les grandes lignes.

## Les étapes d'une acquisition

1. **L'offre et l'accord de principe.** L'acheteur formalise son offre ; les conditions essentielles (prix, délais, meubles inclus) sont posées par écrit.
2. **Le compromis de vente.** Signé généralement chez le notaire, il engage les deux parties et s'accompagne d'un versement d'acompte séquestré. [À COMPLÉTER : pourcentage d'acompte usuel — à valider avec un notaire.]
3. **Les vérifications.** Le notaire contrôle la situation juridique du bien : titre, hypothèques éventuelles, urbanisme, conformité.
4. **L'acte de vente définitif.** Le solde du prix est versé, l'acte est signé puis enregistré.
5. **L'inscription foncière.** La mutation est inscrite à la conservation foncière ; l'acheteur devient propriétaire inscrit.

## Les frais à anticiper

Aux côtés du prix de vente, l'acheteur doit budgéter les droits d'enregistrement, la taxe de conservation foncière, les honoraires du notaire et les frais annexes. [À COMPLÉTER : taux et barèmes en vigueur — à valider avec un notaire avant toute publication.]

## Acheteurs non-résidents

Les étrangers peuvent acquérir librement la plupart des biens urbains ; les terrains à vocation agricole obéissent à un régime particulier. [À COMPLÉTER : conditions exactes et alternatives (VNA, autorisations) — à valider avec un conseil juridique.] La question du rapatriement des fonds mérite d'être traitée dès l'entrée : déclarer l'investissement à l'Office des changes protège la sortie.

*Guide de démonstration — chiffres et taux à compléter avant publication définitive.*`,
    contentEn: `A property purchase in Morocco follows a well-marked path. Knowing it before committing avoids surprises of both schedule and budget. This demonstration guide sketches the outline.

## The steps of a purchase

1. **The offer and agreement in principle.** The buyer formalises the offer; the essential terms (price, timeline, furniture included) are set down in writing.
2. **The preliminary sale agreement.** Usually signed before a notary, it binds both parties and comes with a deposit held in escrow. [À COMPLÉTER: customary deposit percentage — to be confirmed with a notary.]
3. **The checks.** The notary verifies the legal position of the property: title, any mortgages, planning, compliance.
4. **The final deed of sale.** The balance is paid, the deed is signed and then registered.
5. **Land registration.** The transfer is recorded at the land registry; the buyer becomes the registered owner.

## The costs to anticipate

Alongside the sale price, the buyer should budget for registration duties, the land registry fee, the notary's fees and ancillary costs. [À COMPLÉTER: current rates and scales — to be confirmed with a notary before publication.]

## Non-resident buyers

Foreigners may freely acquire most urban property; land of agricultural character is subject to a specific regime. [À COMPLÉTER: exact conditions and alternatives — to be confirmed with legal counsel.] The question of repatriating funds deserves attention from the outset: declaring the investment to the foreign exchange office protects the exit.

*Demonstration guide — figures and rates to be completed before final publication.*`,
    coverUrl: '/images/demo/placeholder-3.svg',
    category: 'acheter_au_maroc',
    relatedType: null,
    relatedQuartierSlug: null,
    publishedAt: new Date('2026-06-20T09:00:00Z')
  }
];

/* -------------------------------------------------------------------------- */
/*  Exécution                                                                 */
/* -------------------------------------------------------------------------- */

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('✗ DATABASE_URL est manquante (voir .env.example).');
    process.exit(1);
  }

  const client = postgres(url, { prepare: false, max: 1 });
  const db = drizzle(client, { schema });

  console.log('— Seed TMI —');

  /* Quartiers (upsert par slug) */
  for (const row of quartierRows) {
    await db
      .insert(quartiers)
      .values(row)
      .onConflictDoUpdate({
        target: quartiers.slug,
        set: {
          nameFr: row.nameFr,
          nameEn: row.nameEn,
          introFr: row.introFr,
          introEn: row.introEn,
          lat: row.lat,
          lng: row.lng,
          coverUrl: row.coverUrl,
          position: row.position,
          published: row.published
        }
      });
  }
  console.log(`✓ ${quartierRows.length} quartiers`);

  const quartierIdBySlug = new Map(
    (await db.select().from(quartiers)).map((q) => [q.slug, q.id])
  );

  /* Biens (upsert par slug) + médias (remplacés à chaque run) */
  for (const { quartierSlug, ...row } of propertyRows) {
    const quartierId = quartierIdBySlug.get(quartierSlug);
    if (!quartierId) throw new Error(`Quartier introuvable : ${quartierSlug}`);

    const inserted = await db
      .insert(properties)
      .values({ ...row, quartierId })
      .onConflictDoUpdate({
        target: properties.slug,
        set: { ...row, quartierId }
      })
      .returning({ id: properties.id });

    const propertyId = inserted[0].id;

    await db
      .delete(propertyMedia)
      .where(sql`${propertyMedia.propertyId} = ${propertyId}`);

    await db.insert(propertyMedia).values(
      mediaViews.map((view, index) => ({
        propertyId,
        url: `/images/demo/placeholder-${(index % 4) + 1}.svg`,
        altFr: `${row.titleFr} — ${view.fr} (photo de démonstration)`,
        altEn: `${row.titleEn} — ${view.en} (demonstration photo)`,
        position: index,
        kind: 'image' as const
      }))
    );
  }
  console.log(`✓ ${propertyRows.length} biens [DÉMO] (5 photos chacun)`);

  /* La séquence de référence repart après la plus haute référence seedée */
  await db.execute(sql`
    SELECT setval(
      'public.property_reference_seq',
      GREATEST(
        (SELECT COALESCE(MAX(SUBSTRING(reference FROM 5)::int), 0) FROM properties),
        1
      )
    )
  `);

  /* Guides (upsert par slug) */
  for (const { relatedQuartierSlug, ...row } of guideRows) {
    const relatedQuartierId = relatedQuartierSlug
      ? (quartierIdBySlug.get(relatedQuartierSlug) ?? null)
      : null;

    await db
      .insert(guides)
      .values({ ...row, relatedQuartierId })
      .onConflictDoUpdate({
        target: guides.slug,
        set: { ...row, relatedQuartierId }
      });
  }
  console.log(`✓ ${guideRows.length} guides [DÉMO]`);

  /* Promotion admin depuis ADMIN_EMAIL, si le compte auth existe déjà */
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    const result = await db.execute<{ id: string }>(sql`
      INSERT INTO public.profiles (id, role, full_name)
      SELECT u.id, 'admin', COALESCE(u.raw_user_meta_data ->> 'full_name', 'Admin TMI')
      FROM auth.users u
      WHERE u.email = ${adminEmail}
      ON CONFLICT (id) DO UPDATE SET role = 'admin'
      RETURNING id
    `);
    if (result.length > 0) {
      console.log(`✓ ${adminEmail} promu admin`);
    } else {
      console.log(
        `ℹ Aucun utilisateur auth avec l'email ${adminEmail}.\n` +
          '  Créez-le d\'abord (Dashboard Supabase > Authentication > Add user,\n' +
          '  ou première connexion), puis relancez `npm run db:seed`.'
      );
    }
  } else {
    console.log('ℹ ADMIN_EMAIL non renseignée : promotion admin ignorée.');
  }

  await client.end();
  console.log('— Seed terminé —');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
