// Mock data used when database is not yet configured
export const mockServices = [
  { id: 1, titleFr: 'Gestion Locative', titleEn: 'Property Management', descFr: "Nous gérons votre bien de A à Z : check-in, check-out, ménage, maintenance. Vous percevez vos revenus sans contrainte.", descEn: "We manage your property from A to Z: check-in, check-out, cleaning, maintenance. You receive your income without constraints.", icon: 'Home', order: 1, active: true },
  { id: 2, titleFr: 'Conciergerie 24/7', titleEn: 'Concierge 24/7', descFr: "Service de conciergerie disponible 24h/24 pour vos voyageurs. Transferts, restaurants, activités, réservations exclusives.", descEn: "Concierge service available 24/7 for your travelers. Transfers, restaurants, activities, exclusive reservations.", icon: 'Clock', order: 2, active: true },
  { id: 3, titleFr: 'Optimisation Revenus', titleEn: 'Revenue Optimization', descFr: "Tarification dynamique, optimisation des plateformes, photographie professionnelle. Maximisez votre taux d'occupation.", descEn: "Dynamic pricing, platform optimization, professional photography. Maximize your occupancy rate and revenues.", icon: 'TrendingUp', order: 3, active: true },
  { id: 4, titleFr: 'Maintenance & Entretien', titleEn: 'Maintenance & Upkeep', descFr: "Réseau d'artisans qualifiés, interventions rapides, suivi rigoureux. Votre bien reste en parfait état en permanence.", descEn: "Network of qualified craftsmen, rapid interventions, rigorous follow-up. Your property remains in perfect condition.", icon: 'Wrench', order: 4, active: true },
  { id: 5, titleFr: 'Photographie Luxe', titleEn: 'Luxury Photography', descFr: "Séances photo professionnelles avec mise en scène luxe. Des visuels qui font la différence sur les plateformes.", descEn: "Professional photo shoots with luxury staging. Visuals that make the difference on platforms.", icon: 'Camera', order: 5, active: true },
  { id: 6, titleFr: 'Rapports & Transparence', titleEn: 'Reports & Transparency', descFr: "Tableau de bord propriétaire en temps réel. Revenus, réservations, dépenses : tout est transparent et accessible.", descEn: "Real-time owner dashboard. Revenue, bookings, expenses: everything is transparent and accessible.", icon: 'BarChart3', order: 6, active: true },
]

export const mockTestimonials = [
  { id: 1, name: 'Sophie Martin', location: 'Paris, France', textFr: "Guard Conciergerie a transformé mon riad en véritable machine à revenus. Professionnalisme irréprochable, communication parfaite. Je recommande les yeux fermés.", textEn: "Guard Conciergerie transformed my riad into a real revenue machine. Impeccable professionalism, perfect communication.", rating: 5, order: 1, active: true },
  { id: 2, name: 'Ahmed Bencherki', location: 'Casablanca, Maroc', textFr: "J'avais peur de confier mon appartement à une agence. Avec Guard, j'ai doublé mes revenus locatifs en 6 mois. Équipe exceptionnelle.", textEn: "I was afraid to entrust my apartment to an agency. With Guard, I doubled my rental income in 6 months. Exceptional team.", rating: 5, order: 2, active: true },
  { id: 3, name: 'James & Caroline', location: 'London, UK', textFr: "Notre villa à Marrakech était sous-exploitée. Guard l'a transformée en un actif qui génère de vrais revenus. Service 5 étoiles.", textEn: "Our villa in Marrakech was underutilized. Guard transformed it into an asset that generates real income. 5-star service.", rating: 5, order: 3, active: true },
]

export const mockFaqs = [
  { id: 1, questionFr: "Quels types de biens gérez-vous ?", questionEn: "What types of properties do you manage?", answerFr: "Nous gérons tous types de biens : appartements, villas, riads, maisons d'hôtes. Notre expertise couvre l'ensemble du marché locatif à Marrakech.", answerEn: "We manage all types of properties: apartments, villas, riads, guesthouses. Our expertise covers the entire rental market in Marrakech.", category: 'general', order: 1, active: true },
  { id: 2, questionFr: "Quel est votre taux de commission ?", questionEn: "What is your commission rate?", answerFr: "Notre commission est transparente et compétitive. Elle varie selon le type de bien et les services inclus. Contactez-nous pour un devis personnalisé.", answerEn: "Our commission is transparent and competitive. It varies depending on the type of property and services included.", category: 'general', order: 2, active: true },
  { id: 3, questionFr: "Comment fonctionne le suivi ?", questionEn: "How does real-time tracking work?", answerFr: "A chaque fin de mois, vous recevrez un relevé détaillé: Revenus, dépenses, réservations rien ne vous échappe.", answerEn: "Each owner has access to a private dashboard with all information: current bookings, revenues, expenses, occupancy schedule.", category: 'general', order: 3, active: true },
  { id: 4, questionFr: "Que se passe-t-il en cas de dommages ?", questionEn: "What happens in case of damage?", answerFr: "Nous effectuons un état des lieux complet à chaque départ. En cas de dommages, nous gérons le processus de réclamation et les réparations.", answerEn: "We conduct a complete property inspection at each departure. In case of damage, we manage the claims process and repairs.", category: 'general', order: 4, active: true },
  { id: 5, questionFr: "Dans quelles zones intervenez-vous ?", questionEn: "In which areas do you operate?", answerFr: "Notre activité principale est à Marrakech (Médina, Guéliz, Palmeraie, Agdal). Nous intervenons également dans d'autres villes sur demande.", answerEn: "Our main activity is in Marrakech (Medina, Gueliz, Palmeraie, Agdal). We also operate in other cities upon request.", category: 'general', order: 5, active: true },
  { id: 6, questionFr: "Comment se déroule l'onboarding ?", questionEn: "How does onboarding work?", answerFr: "En 3 étapes : visite et évaluation gratuite, signature du contrat, puis mise en ligne rapide sous 7 jours avec shooting photo inclus.", answerEn: "In 3 steps: free visit and assessment, contract signing, then quick online listing within 7 days with photo shoot included.", category: 'general', order: 6, active: true },
]

export const mockSettings: Record<string, string> = {
  site_name: 'Guard Conciergerie Luxury Care',
  contact_phone: '+212 6XX XXX XXX',
  contact_email: 'contact@guardconciergerie.com',
  contact_whatsapp: '+212 6XX XXX XXX',
  contact_address_fr: 'Guéliz, Marrakech, Maroc',
  contact_address_en: 'Gueliz, Marrakech, Morocco',
  social_instagram: '#',
  social_facebook: '#',
  social_tiktok: '',
  social_linkedin: '',
  social_youtube: '',
  social_twitter: '',
  stat_properties: '120+',
  stat_clients: '95%',
  stat_years: '5+',
  stat_revenue: '+40%',
  stat_properties_label_fr: 'Biens gérés',
  stat_properties_label_en: 'Managed properties',
  stat_clients_label_fr: 'Propriétaires satisfaits',
  stat_clients_label_en: 'Satisfied owners',
  stat_years_label_fr: "Années d'expertise",
  stat_years_label_en: 'Years of expertise',
  stat_revenue_label_fr: 'Revenus en plus en moyenne',
  stat_revenue_label_en: 'Average revenue increase',
  form_button_fr: 'Demander une évaluation gratuite',
  form_button_en: 'Request a free assessment',
  form_confirmation_fr: 'Merci ! Nous vous contacterons dans les 24 heures.',
  form_confirmation_en: 'Thank you! We will contact you within 24 hours.',
  whatsapp_button_enabled: 'false',
  whatsapp_button_message: 'Bonjour, je souhaite en savoir plus sur vos services de conciergerie.',
  whatsapp_button_color: '#25D366',
  whatsapp_button_text_color: '#FFFFFF',
  whatsapp_button_position: 'bottom-right',
  whatsapp_button_shape: 'circle',
  whatsapp_button_size: 'md',
  whatsapp_button_animation: 'none',
  whatsapp_button_label: 'false',
  whatsapp_button_label_text: 'Contactez-nous',
}

export const mockFormFields = [
  { id: 1, name: 'name', labelFr: 'Nom complet', labelEn: 'Full name', type: 'text', required: true, options: null, order: 1, active: true, placeholder_fr: 'Votre nom', placeholder_en: 'Your name', conditionalOn: null, conditionalValue: null },
  { id: 2, name: 'phone', labelFr: 'Téléphone', labelEn: 'Phone', type: 'tel', required: true, options: null, order: 2, active: true, placeholder_fr: '+212 6XX XXX XXX', placeholder_en: '+212 6XX XXX XXX', conditionalOn: null, conditionalValue: null },
  { id: 3, name: 'city', labelFr: 'Ville', labelEn: 'City', type: 'select', required: true, order: 3, active: true, placeholder_fr: null, placeholder_en: null, conditionalOn: null, conditionalValue: null, options: JSON.stringify([
    { valueFr: 'Marrakech', valueEn: 'Marrakech' },
    { valueFr: 'Casablanca', valueEn: 'Casablanca' },
    { valueFr: 'Agadir', valueEn: 'Agadir' },
    { valueFr: 'Autre ville', valueEn: 'Other city' },
  ])},
  { id: 4, name: 'otherCity', labelFr: 'Précisez votre ville', labelEn: 'Specify your city', type: 'text', required: false, options: null, order: 4, active: true, placeholder_fr: 'Votre ville', placeholder_en: 'Your city', conditionalOn: 'city', conditionalValue: 'Autre ville' },
  { id: 5, name: 'propertyType', labelFr: 'Type de bien', labelEn: 'Property type', type: 'select', required: true, order: 5, active: true, placeholder_fr: null, placeholder_en: null, conditionalOn: null, conditionalValue: null, options: JSON.stringify([
    { valueFr: 'Appartement', valueEn: 'Apartment' },
    { valueFr: 'Villa', valueEn: 'Villa' },
    { valueFr: 'Riad', valueEn: 'Riad' },
    { valueFr: "Maison d'hôtes", valueEn: 'Guesthouse' },
    { valueFr: 'Studio', valueEn: 'Studio' },
  ])},
  { id: 6, name: 'message', labelFr: 'Message', labelEn: 'Message', type: 'textarea', required: false, options: null, order: 6, active: true, placeholder_fr: 'Décrivez votre bien...', placeholder_en: 'Describe your property...', conditionalOn: null, conditionalValue: null },
  { id: 7, name: 'photos', labelFr: 'Photos de votre bien', labelEn: 'Property photos', type: 'file', required: false, options: null, order: 7, active: true, placeholder_fr: null, placeholder_en: null, conditionalOn: null, conditionalValue: null },
]
