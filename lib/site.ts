export const siteConfig = {
  name: 'Tendance Marrakech Immobilier',
  shortName: 'TMI',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '',
  // Phase 1 : false. Les rôles et policies marketplace existent en base,
  // mais aucune UI vendeur n'est exposée tant que ce flag est éteint.
  marketplaceMode: process.env.NEXT_PUBLIC_MARKETPLACE_MODE === 'true'
} as const;
