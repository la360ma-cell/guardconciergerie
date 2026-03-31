import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Admin
  const hashedPassword = await bcrypt.hash('Admin@Guard2024!', 12)
  await prisma.admin.upsert({
    where: { email: 'admin@guardconciergerie.com' },
    update: {},
    create: {
      email: 'admin@guardconciergerie.com',
      password: hashedPassword,
      name: 'Admin Guard',
    },
  })

  // Services
  const services = [
    {
      titleFr: 'Gestion Locative',
      titleEn: 'Property Management',
      descFr: "Nous gérons votre bien de A à Z : check-in, check-out, ménage, maintenance. Vous percevez vos revenus sans contrainte.",
      descEn: "We manage your property from A to Z: check-in, check-out, cleaning, maintenance. You receive your income without constraints.",
      icon: 'Home',
      order: 1,
    },
    {
      titleFr: 'Conciergerie 24/7',
      titleEn: 'Concierge 24/7',
      descFr: "Service de conciergerie disponible 24h/24 pour vos voyageurs. Transferts, restaurants, activités, réservations exclusives.",
      descEn: "Concierge service available 24/7 for your travelers. Transfers, restaurants, activities, exclusive reservations.",
      icon: 'Clock',
      order: 2,
    },
    {
      titleFr: 'Optimisation Revenus',
      titleEn: 'Revenue Optimization',
      descFr: "Tarification dynamique, optimisation des plateformes, photographie professionnelle. Maximisez votre taux d'occupation et vos revenus.",
      descEn: "Dynamic pricing, platform optimization, professional photography. Maximize your occupancy rate and revenues.",
      icon: 'TrendingUp',
      order: 3,
    },
    {
      titleFr: 'Maintenance & Entretien',
      titleEn: 'Maintenance & Upkeep',
      descFr: "Réseau d'artisans qualifiés, interventions rapides, suivi rigoureux. Votre bien reste en parfait état en permanence.",
      descEn: "Network of qualified craftsmen, rapid interventions, rigorous follow-up. Your property remains in perfect condition at all times.",
      icon: 'Wrench',
      order: 4,
    },
    {
      titleFr: 'Photographie Luxe',
      titleEn: 'Luxury Photography',
      descFr: "Séances photo professionnelles avec mise en scène luxe. Des visuels qui font la différence sur les plateformes.",
      descEn: "Professional photo shoots with luxury staging. Visuals that make the difference on platforms.",
      icon: 'Camera',
      order: 5,
    },
    {
      titleFr: 'Rapports & Transparence',
      titleEn: 'Reports & Transparency',
      descFr: "Tableau de bord propriétaire en temps réel. Revenus, réservations, dépenses : tout est transparent et accessible.",
      descEn: "Real-time owner dashboard. Revenue, bookings, expenses: everything is transparent and accessible.",
      icon: 'BarChart3',
      order: 6,
    },
  ]

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.order },
      update: {},
      create: service,
    })
  }

  // Testimonials
  const testimonials = [
    {
      name: 'Sophie Martin',
      location: 'Paris, France',
      textFr: "Guard Conciergerie a transformé mon riad en véritable machine à revenus. Professionnalisme irréprochable, communication parfaite. Je recommande les yeux fermés.",
      textEn: "Guard Conciergerie transformed my riad into a real revenue machine. Impeccable professionalism, perfect communication. I recommend without hesitation.",
      rating: 5,
      order: 1,
    },
    {
      name: 'Ahmed Bencherki',
      location: 'Casablanca, Maroc',
      textFr: "J'avais peur de confier mon appartement à une agence. Avec Guard, j'ai doublé mes revenus locatifs en 6 mois. Équipe exceptionnelle.",
      textEn: "I was afraid to entrust my apartment to an agency. With Guard, I doubled my rental income in 6 months. Exceptional team.",
      rating: 5,
      order: 2,
    },
    {
      name: 'James & Caroline',
      location: 'London, UK',
      textFr: "Notre villa à Marrakech était sous-exploitée. Guard l'a transformée en un actif qui génère de vrais revenus. Service 5 étoiles.",
      textEn: "Our villa in Marrakech was underutilized. Guard transformed it into an asset that generates real income. 5-star service.",
      rating: 5,
      order: 3,
    },
  ]

  for (const t of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: t.order },
      update: {},
      create: t,
    })
  }

  // FAQs
  const faqs = [
    {
      questionFr: "Quels types de biens gérez-vous ?",
      questionEn: "What types of properties do you manage?",
      answerFr: "Nous gérons tous types de biens : appartements, villas, riads, maisons d'hôtes. Notre expertise couvre l'ensemble du marché locatif à Marrakech.",
      answerEn: "We manage all types of properties: apartments, villas, riads, guesthouses. Our expertise covers the entire rental market in Marrakech.",
      order: 1,
    },
    {
      questionFr: "Quel est votre taux de commission ?",
      questionEn: "What is your commission rate?",
      answerFr: "Notre commission est transparente et compétitive. Elle varie selon le type de bien et les services inclus. Contactez-nous pour un devis personnalisé.",
      answerEn: "Our commission is transparent and competitive. It varies depending on the type of property and services included. Contact us for a personalized quote.",
      order: 2,
    },
    {
      questionFr: "Comment fonctionne le suivi en temps réel ?",
      questionEn: "How does real-time tracking work?",
      answerFr: "Chaque propriétaire accède à un tableau de bord privé avec toutes les informations : réservations en cours, revenus, dépenses, planning d'occupation.",
      answerEn: "Each owner has access to a private dashboard with all information: current bookings, revenues, expenses, occupancy schedule.",
      order: 3,
    },
    {
      questionFr: "Que se passe-t-il en cas de dommages ?",
      questionEn: "What happens in case of damage?",
      answerFr: "Nous effectuons un état des lieux complet à chaque départ. En cas de dommages, nous gérons le processus de réclamation et les réparations.",
      answerEn: "We conduct a complete property inspection at each departure. In case of damage, we manage the claims process and repairs.",
      order: 4,
    },
    {
      questionFr: "Dans quelles zones intervenez-vous ?",
      questionEn: "In which areas do you operate?",
      answerFr: "Notre activité principale est à Marrakech (Médina, Guéliz, Palmeraie, Agdal). Nous intervenons également dans d'autres villes sur demande.",
      answerEn: "Our main activity is in Marrakech (Medina, Gueliz, Palmeraie, Agdal). We also operate in other cities upon request.",
      order: 5,
    },
    {
      questionFr: "Comment se déroule l'onboarding ?",
      questionEn: "How does onboarding work?",
      answerFr: "En 3 étapes : visite et évaluation gratuite, signature du contrat, puis mise en ligne rapide sous 7 jours avec shooting photo inclus.",
      answerEn: "In 3 steps: free visit and assessment, contract signing, then quick online listing within 7 days with photo shoot included.",
      order: 6,
    },
  ]

  for (const faq of faqs) {
    await prisma.fAQ.upsert({
      where: { id: faq.order },
      update: {},
      create: faq,
    })
  }

  // Form Fields
  const formFields = [
    { name: 'name', labelFr: 'Nom complet', labelEn: 'Full name', type: 'text', required: true, order: 1, placeholder_fr: 'Votre nom', placeholder_en: 'Your name' },
    { name: 'phone', labelFr: 'Téléphone', labelEn: 'Phone', type: 'tel', required: true, order: 2, placeholder_fr: '+212 6XX XXX XXX', placeholder_en: '+212 6XX XXX XXX' },
    { name: 'city', labelFr: 'Ville', labelEn: 'City', type: 'select', required: true, order: 3, options: JSON.stringify([
      { valueFr: 'Marrakech', valueEn: 'Marrakech' },
      { valueFr: 'Casablanca', valueEn: 'Casablanca' },
      { valueFr: 'Agadir', valueEn: 'Agadir' },
      { valueFr: 'Essaouira', valueEn: 'Essaouira' },
      { valueFr: 'Autre ville', valueEn: 'Other city' },
    ]) },
    { name: 'otherCity', labelFr: 'Précisez votre ville', labelEn: 'Specify your city', type: 'text', required: false, order: 4, conditionalOn: 'city', conditionalValue: 'Autre ville', placeholder_fr: 'Votre ville', placeholder_en: 'Your city' },
    { name: 'propertyType', labelFr: 'Type de bien', labelEn: 'Property type', type: 'select', required: true, order: 5, options: JSON.stringify([
      { valueFr: 'Appartement', valueEn: 'Apartment' },
      { valueFr: 'Villa', valueEn: 'Villa' },
      { valueFr: 'Riad', valueEn: 'Riad' },
      { valueFr: "Maison d'hôtes", valueEn: 'Guesthouse' },
      { valueFr: 'Studio', valueEn: 'Studio' },
      { valueFr: 'Autre', valueEn: 'Other' },
    ]) },
    { name: 'message', labelFr: 'Message', labelEn: 'Message', type: 'textarea', required: false, order: 6, placeholder_fr: 'Décrivez votre bien...', placeholder_en: 'Describe your property...' },
    { name: 'photos', labelFr: 'Photos de votre bien', labelEn: 'Property photos', type: 'file', required: false, order: 7 },
  ]

  for (const field of formFields) {
    await prisma.formField.upsert({
      where: { name: field.name },
      update: {},
      create: field as any,
    })
  }

  // Site Settings
  const settings = [
    { key: 'site_name', value: 'Guard Conciergerie Luxury Care', category: 'general' },
    { key: 'site_tagline_fr', value: 'La conciergerie de luxe à Marrakech', category: 'general' },
    { key: 'site_tagline_en', value: 'Luxury concierge in Marrakech', category: 'general' },
    { key: 'contact_email', value: 'contact@guardconciergerie.com', category: 'contact' },
    { key: 'contact_phone', value: '+212 6XX XXX XXX', category: 'contact' },
    { key: 'contact_whatsapp', value: '+212 6XX XXX XXX', category: 'contact' },
    { key: 'contact_address_fr', value: 'Guéliz, Marrakech, Maroc', category: 'contact' },
    { key: 'contact_address_en', value: 'Gueliz, Marrakech, Morocco', category: 'contact' },
    { key: 'social_instagram', value: 'https://instagram.com/guardconciergerie', category: 'social' },
    { key: 'social_facebook', value: 'https://facebook.com/guardconciergerie', category: 'social' },
    { key: 'social_tiktok', value: '', category: 'social' },
    { key: 'social_linkedin', value: '', category: 'social' },
    { key: 'social_youtube', value: '', category: 'social' },
    { key: 'social_twitter', value: '', category: 'social' },
    { key: 'stat_properties', value: '120+', category: 'stats' },
    { key: 'stat_clients', value: '95%', category: 'stats' },
    { key: 'stat_years', value: '5+', category: 'stats' },
    { key: 'stat_revenue', value: '+40%', category: 'stats' },
    { key: 'stat_properties_label_fr', value: 'Biens gérés', category: 'stats' },
    { key: 'stat_properties_label_en', value: 'Managed properties', category: 'stats' },
    { key: 'stat_clients_label_fr', value: 'Propriétaires satisfaits', category: 'stats' },
    { key: 'stat_clients_label_en', value: 'Satisfied owners', category: 'stats' },
    { key: 'stat_years_label_fr', value: "Années d'expertise", category: 'stats' },
    { key: 'stat_years_label_en', value: 'Years of expertise', category: 'stats' },
    { key: 'stat_revenue_label_fr', value: 'Revenus en plus en moyenne', category: 'stats' },
    { key: 'stat_revenue_label_en', value: 'Average revenue increase', category: 'stats' },
    { key: 'notification_email', value: 'admin@guardconciergerie.com', category: 'notifications' },
    { key: 'smtp_host', value: '', category: 'notifications' },
    { key: 'smtp_port', value: '587', category: 'notifications' },
    { key: 'smtp_user', value: '', category: 'notifications' },
    { key: 'smtp_pass', value: '', category: 'notifications' },
    { key: 'smtp_from', value: 'Guard Conciergerie <noreply@guardconciergerie.com>', category: 'notifications' },
    { key: 'whatsapp_button_enabled',    value: 'false',                                                                  category: 'whatsapp' },
    { key: 'whatsapp_button_message',    value: 'Bonjour, je souhaite en savoir plus sur vos services de conciergerie.', category: 'whatsapp' },
    { key: 'whatsapp_button_color',      value: '#25D366',                                                                category: 'whatsapp' },
    { key: 'whatsapp_button_text_color', value: '#FFFFFF',                                                                category: 'whatsapp' },
    { key: 'whatsapp_button_position',   value: 'bottom-right',                                                           category: 'whatsapp' },
    { key: 'whatsapp_button_shape',      value: 'circle',                                                                 category: 'whatsapp' },
    { key: 'whatsapp_button_size',       value: 'md',                                                                     category: 'whatsapp' },
    { key: 'whatsapp_button_animation',  value: 'none',                                                                   category: 'whatsapp' },
    { key: 'whatsapp_button_label',      value: 'false',                                                                  category: 'whatsapp' },
    { key: 'whatsapp_button_label_text', value: 'Contactez-nous',                                                         category: 'whatsapp' },
    // ── Buttons ──────────────────────────────────────────────────────────────
    { key: 'btn_shape',                  value: 'pill',                          category: 'buttons' },
    { key: 'btn_primary_bg',             value: '',                              category: 'buttons' },
    { key: 'btn_primary_text',           value: '',                              category: 'buttons' },
    { key: 'btn_primary_hover_bg',       value: '',                              category: 'buttons' },
    { key: 'btn_secondary_bg',           value: '',                              category: 'buttons' },
    { key: 'btn_secondary_text',         value: '',                              category: 'buttons' },
    { key: 'btn_secondary_border',       value: '',                              category: 'buttons' },
    { key: 'btn_secondary_hover_bg',     value: '',                              category: 'buttons' },
    { key: 'btn_font_weight',            value: 'medium',                        category: 'buttons' },
    { key: 'btn_text_header_fr',         value: 'Nous contacter',               category: 'buttons' },
    { key: 'btn_text_header_en',         value: 'Get in touch',                  category: 'buttons' },
    { key: 'btn_text_hero_primary_fr',   value: 'Demander une évaluation',      category: 'buttons' },
    { key: 'btn_text_hero_primary_en',   value: 'Request an Assessment',        category: 'buttons' },
    { key: 'btn_text_hero_secondary_fr', value: 'Découvrir nos services',       category: 'buttons' },
    { key: 'btn_text_hero_secondary_en', value: 'Discover our services',        category: 'buttons' },
    { key: 'btn_text_services_fr',       value: 'Demander un devis gratuit',    category: 'buttons' },
    { key: 'btn_text_services_en',       value: 'Request a free quote',          category: 'buttons' },
    { key: 'btn_text_process_fr',        value: 'Démarrer maintenant',          category: 'buttons' },
    { key: 'btn_text_process_en',        value: 'Get started now',               category: 'buttons' },
    // ── Form ─────────────────────────────────────────────────────────────────
    { key: 'form_confirmation_fr', value: 'Merci ! Nous vous contacterons dans les 24 heures.', category: 'form' },
    { key: 'form_confirmation_en', value: 'Thank you! We will contact you within 24 hours.', category: 'form' },
    { key: 'form_button_fr', value: 'Demander une évaluation gratuite', category: 'form' },
    { key: 'form_button_en', value: 'Request a free assessment', category: 'form' },
  ]

  for (const setting of settings) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
  }

  // SEO
  const seoConfigs = [
    {
      page: 'home',
      locale: 'fr',
      title: 'Guard Conciergerie Luxury Care | Conciergerie de Luxe à Marrakech',
      description: 'Guard Conciergerie, le spécialiste de la gestion locative et conciergerie de luxe à Marrakech. Confiez votre bien à des experts. Service 5 étoiles.',
      keywords: 'conciergerie luxe marrakech, gestion locative marrakech, airbnb management marrakech, garde bien marrakech',
    },
    {
      page: 'home',
      locale: 'en',
      title: 'Guard Conciergerie Luxury Care | Luxury Concierge in Marrakech',
      description: 'Guard Conciergerie, the specialist in luxury rental management and concierge services in Marrakech. Entrust your property to experts. 5-star service.',
      keywords: 'luxury concierge marrakech, property management marrakech, airbnb management marrakech, vacation rental marrakech',
    },
  ]

  for (const seo of seoConfigs) {
    await prisma.sEOConfig.upsert({
      where: { page_locale: { page: seo.page, locale: seo.locale } },
      update: {},
      create: seo,
    })
  }

  // Content
  const contents = [
    { key: 'hero_title_fr', valueFr: 'Votre bien entre les meilleures mains', valueEn: '', section: 'hero' },
    { key: 'hero_title_en', valueFr: '', valueEn: 'Your property in the best hands', section: 'hero' },
    { key: 'hero_subtitle_fr', valueFr: 'Conciergerie de luxe & gestion locative premium à Marrakech. Nous maximisons vos revenus, vous profitez de la tranquillité.', valueEn: '', section: 'hero' },
    { key: 'hero_subtitle_en', valueFr: '', valueEn: 'Luxury concierge & premium rental management in Marrakech. We maximize your revenues, you enjoy peace of mind.', section: 'hero' },
    { key: 'about_title_fr', valueFr: 'L\'excellence au service de votre patrimoine', valueEn: '', section: 'about' },
    { key: 'about_title_en', valueFr: '', valueEn: 'Excellence at the service of your heritage', section: 'about' },
    { key: 'about_text_fr', valueFr: 'Guard Conciergerie Luxury Care est née d\'une passion pour l\'immobilier d\'exception et d\'un engagement total envers nos propriétaires. Basée à Marrakech, notre équipe d\'experts gère votre bien avec le plus grand soin, en alliant technologie de pointe et service humain de qualité.', valueEn: '', section: 'about' },
    { key: 'about_text_en', valueFr: '', valueEn: 'Guard Conciergerie Luxury Care was born from a passion for exceptional real estate and a total commitment to our owners. Based in Marrakech, our team of experts manages your property with the greatest care, combining cutting-edge technology with quality human service.', section: 'about' },
  ]

  for (const content of contents) {
    await prisma.content.upsert({
      where: { key: content.key },
      update: {},
      create: content as any,
    })
  }

  console.log('✅ Database seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
