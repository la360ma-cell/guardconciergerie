import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import { mockSettings } from '@/lib/mock-data'

export const dynamic = 'force-dynamic'

async function getData() {
  if (!process.env.DATABASE_URL) return { settings: mockSettings }
  try {
    const { prisma } = await import('@/lib/prisma')
    const settings = await prisma.siteSettings.findMany()
    return { settings: Object.fromEntries(settings.map(s => [s.key, s.value])) }
  } catch {
    return { settings: mockSettings }
  }
}

export default async function PrivacyPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const { settings } = await getData()
  const isFr = locale !== 'en'

  return (
    <div className="min-h-screen bg-white dark:bg-obsidian-950 flex flex-col">
      <Header locale={locale} settings={settings} />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Page Title */}
        <div className="mb-12 border-b border-obsidian-100 dark:border-white/10 pb-8">
          <p className="text-xs tracking-[0.3em] uppercase text-gold-500 font-medium mb-3">
            {isFr ? 'Vos données' : 'Your data'}
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-light text-obsidian-950 dark:text-white">
            {isFr ? 'Politique de confidentialité' : 'Privacy Policy'}
          </h1>
          <p className="mt-3 text-sm text-obsidian-500 dark:text-obsidian-400">
            {isFr
              ? `Dernière mise à jour : ${settings.privacy_last_updated_fr || 'mars 2025'}`
              : `Last updated: ${settings.privacy_last_updated_en || 'March 2025'}`}
          </p>
        </div>

        <div className="prose prose-obsidian dark:prose-invert max-w-none space-y-10 text-obsidian-700 dark:text-obsidian-300">

          {/* Section 1 */}
          <section>
            <h2 className="font-display text-2xl font-light text-obsidian-950 dark:text-white mb-4">
              {isFr ? '1. Introduction' : '1. Introduction'}
            </h2>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {isFr
                ? settings.privacy_s1_fr || `Guard Conciergerie Luxury Care (« nous ») s'engage à protéger la vie privée des utilisateurs de son site web. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations personnelles conformément au Règlement Général sur la Protection des Données (RGPD) et à la législation marocaine en vigueur.`
                : settings.privacy_s1_en || `Guard Conciergerie Luxury Care ("we") is committed to protecting the privacy of users of its website. This privacy policy explains how we collect, use and protect your personal information in accordance with the General Data Protection Regulation (GDPR) and applicable Moroccan legislation.`}
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="font-display text-2xl font-light text-obsidian-950 dark:text-white mb-4">
              {isFr ? '2. Données collectées' : '2. Data Collected'}
            </h2>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {isFr
                ? settings.privacy_s2_fr || 'Nous collectons uniquement les données nécessaires à la fourniture de nos services :\n• Nom et prénom\n• Adresse email\n• Numéro de téléphone\n• Type et localisation du bien immobilier\n• Message et informations complémentaires\n• Données de navigation (cookies techniques)'
                : settings.privacy_s2_en || 'We only collect data necessary for the provision of our services:\n• First and last name\n• Email address\n• Phone number\n• Property type and location\n• Message and additional information\n• Browsing data (technical cookies)'}
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="font-display text-2xl font-light text-obsidian-950 dark:text-white mb-4">
              {isFr ? '3. Finalités du traitement' : '3. Purposes of Processing'}
            </h2>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {isFr
                ? settings.privacy_s3_fr || "Vos données sont utilisées pour :\n• Répondre à vos demandes de contact et d'évaluation\n• Vous proposer nos services de conciergerie et de gestion locative\n• Améliorer notre site web et nos services\n• Respecter nos obligations légales et réglementaires"
                : settings.privacy_s3_en || "Your data is used for:\n• Responding to your contact and evaluation requests\n• Offering our concierge and rental management services\n• Improving our website and services\n• Complying with our legal and regulatory obligations"}
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-display text-2xl font-light text-obsidian-950 dark:text-white mb-4">
              {isFr ? '4. Base légale du traitement' : '4. Legal Basis for Processing'}
            </h2>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {isFr
                ? settings.privacy_s4_fr || 'Le traitement de vos données repose sur votre consentement explicite lors de la soumission du formulaire de contact, et sur notre intérêt légitime à répondre à vos demandes et à améliorer nos services.'
                : settings.privacy_s4_en || 'The processing of your data is based on your explicit consent when submitting the contact form, and on our legitimate interest in responding to your requests and improving our services.'}
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="font-display text-2xl font-light text-obsidian-950 dark:text-white mb-4">
              {isFr ? '5. Conservation des données' : '5. Data Retention'}
            </h2>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {isFr
                ? settings.privacy_s5_fr || 'Vos données personnelles sont conservées pendant une durée maximale de 3 ans à compter du dernier contact. Au-delà de cette période, elles sont supprimées ou anonymisées, sauf obligation légale contraire.'
                : settings.privacy_s5_en || 'Your personal data is retained for a maximum period of 3 years from the last contact. Beyond this period, it is deleted or anonymized, unless there is a contrary legal obligation.'}
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="font-display text-2xl font-light text-obsidian-950 dark:text-white mb-4">
              {isFr ? '6. Partage des données' : '6. Data Sharing'}
            </h2>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {isFr
                ? settings.privacy_s6_fr || "Nous ne vendons, ne louons et ne partageons pas vos données personnelles avec des tiers à des fins commerciales. Vos données peuvent uniquement être transmises à des prestataires techniques (hébergeur, service d'emailing) dans le strict cadre de la fourniture de nos services."
                : settings.privacy_s6_en || 'We do not sell, rent or share your personal data with third parties for commercial purposes. Your data may only be passed on to technical service providers (hosting, email service) strictly within the framework of providing our services.'}
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="font-display text-2xl font-light text-obsidian-950 dark:text-white mb-4">
              {isFr ? '7. Vos droits' : '7. Your Rights'}
            </h2>
            <p className="text-sm leading-relaxed whitespace-pre-line mb-4">
              {isFr
                ? settings.privacy_s7_fr || "Conformément au RGPD, vous disposez des droits suivants :\n• Droit d'accès — obtenir une copie de vos données\n• Droit de rectification — corriger des données inexactes\n• Droit à l'effacement — demander la suppression de vos données\n• Droit à la portabilité — recevoir vos données dans un format structuré\n• Droit d'opposition — vous opposer au traitement\n• Droit à la limitation — limiter le traitement dans certains cas"
                : settings.privacy_s7_en || "In accordance with the GDPR, you have the following rights:\n• Right of access — obtain a copy of your data\n• Right of rectification — correct inaccurate data\n• Right to erasure — request deletion of your data\n• Right to portability — receive your data in a structured format\n• Right to object — object to the processing\n• Right to restriction — restrict processing in certain cases"}
            </p>
            <p className="text-sm leading-relaxed">
              {isFr
                ? `Pour exercer ces droits, contactez-nous à : `
                : `To exercise these rights, contact us at: `}
              <a href={`mailto:${settings.contact_email || 'contact@guardconciergerie.com'}`} className="text-gold-500 hover:text-gold-600 underline">
                {settings.contact_email || 'contact@guardconciergerie.com'}
              </a>
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="font-display text-2xl font-light text-obsidian-950 dark:text-white mb-4">
              {isFr ? '8. Sécurité' : '8. Security'}
            </h2>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {isFr
                ? settings.privacy_s8_fr || 'Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, toute divulgation, altération ou destruction. Notre site utilise le protocole HTTPS pour sécuriser les échanges de données.'
                : settings.privacy_s8_en || 'We implement appropriate technical and organizational measures to protect your data against unauthorized access, disclosure, alteration or destruction. Our website uses the HTTPS protocol to secure data exchanges.'}
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="font-display text-2xl font-light text-obsidian-950 dark:text-white mb-4">
              {isFr ? '9. Cookies' : '9. Cookies'}
            </h2>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {isFr
                ? settings.privacy_s9_fr || "Notre site utilise uniquement des cookies techniques essentiels au bon fonctionnement du site (gestion des sessions, préférences de langue, thème). Ces cookies ne sont pas utilisés à des fins publicitaires ou de traçage comportemental."
                : settings.privacy_s9_en || "Our website uses only technical cookies essential to the proper functioning of the site (session management, language preferences, theme). These cookies are not used for advertising or behavioral tracking purposes."}
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="font-display text-2xl font-light text-obsidian-950 dark:text-white mb-4">
              {isFr ? '10. Modifications' : '10. Changes'}
            </h2>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {isFr
                ? settings.privacy_s10_fr || 'Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les modifications seront publiées sur cette page avec une date de mise à jour. Nous vous encourageons à consulter régulièrement cette page.'
                : settings.privacy_s10_en || 'We reserve the right to modify this privacy policy at any time. Changes will be posted on this page with an updated date. We encourage you to regularly review this page.'}
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="font-display text-2xl font-light text-obsidian-950 dark:text-white mb-4">
              {isFr ? '11. Contact DPO' : '11. DPO Contact'}
            </h2>
            <p className="text-sm leading-relaxed">
              {isFr
                ? `Pour toute question relative à la protection de vos données personnelles, vous pouvez contacter notre responsable de la protection des données à :`
                : `For any questions regarding the protection of your personal data, you can contact our data protection officer at:`}
            </p>
            <div className="mt-3 p-4 rounded-xl bg-obsidian-50 dark:bg-obsidian-900 border border-obsidian-100 dark:border-white/10 text-sm space-y-1">
              <p className="font-medium text-obsidian-900 dark:text-white">{settings.site_name || 'Guard Conciergerie Luxury Care'}</p>
              <p>{isFr ? settings.contact_address_fr || 'Guéliz, Marrakech, Maroc' : settings.contact_address_en || 'Gueliz, Marrakech, Morocco'}</p>
              <p>
                <a href={`mailto:${settings.contact_email || 'contact@guardconciergerie.com'}`} className="text-gold-500 hover:text-gold-600 underline">
                  {settings.contact_email || 'contact@guardconciergerie.com'}
                </a>
              </p>
              <p>
                <a href={`tel:${settings.contact_phone || '+212 6XX XXX XXX'}`} className="text-gold-500 hover:text-gold-600">
                  {settings.contact_phone || '+212 6XX XXX XXX'}
                </a>
              </p>
            </div>
          </section>

        </div>
      </main>

      <Footer locale={locale} settings={settings} />
    </div>
  )
}
