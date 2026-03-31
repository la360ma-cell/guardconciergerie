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

export default async function LegalPage({
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
            {isFr ? 'Documents légaux' : 'Legal documents'}
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-light text-obsidian-950 dark:text-white">
            {isFr ? 'Mentions légales' : 'Legal Notice'}
          </h1>
          <p className="mt-3 text-sm text-obsidian-500 dark:text-obsidian-400">
            {isFr
              ? `Dernière mise à jour : ${settings.legal_last_updated_fr || 'mars 2025'}`
              : `Last updated: ${settings.legal_last_updated_en || 'March 2025'}`}
          </p>
        </div>

        <div className="prose prose-obsidian dark:prose-invert max-w-none space-y-10 text-obsidian-700 dark:text-obsidian-300">

          {/* Section 1 */}
          <section>
            <h2 className="font-display text-2xl font-light text-obsidian-950 dark:text-white mb-4">
              {isFr ? '1. Éditeur du site' : '1. Website Publisher'}
            </h2>
            <div className="space-y-2 text-sm leading-relaxed">
              <p><strong className="text-obsidian-900 dark:text-white">{settings.site_name || 'Guard Conciergerie Luxury Care'}</strong></p>
              <p>{isFr ? 'Société à responsabilité limitée (SARL)' : 'Limited Liability Company (LLC)'}</p>
              <p>{isFr ? `Siège social : ${settings.contact_address_fr || 'Guéliz, Marrakech, Maroc'}` : `Registered office: ${settings.contact_address_en || 'Gueliz, Marrakech, Morocco'}`}</p>
              <p>{isFr ? `Téléphone : ${settings.contact_phone || '+212 6XX XXX XXX'}` : `Phone: ${settings.contact_phone || '+212 6XX XXX XXX'}`}</p>
              <p>{isFr ? `Email : ${settings.contact_email || 'contact@guardconciergerie.com'}` : `Email: ${settings.contact_email || 'contact@guardconciergerie.com'}`}</p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="font-display text-2xl font-light text-obsidian-950 dark:text-white mb-4">
              {isFr ? '2. Hébergement' : '2. Hosting'}
            </h2>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {isFr
                ? settings.legal_s2_fr || 'Ce site est hébergé par :\n\nVercel Inc.\n340 Pine Street, Suite 700, San Francisco, CA 94104, USA\nhttps://vercel.com'
                : settings.legal_s2_en || 'This website is hosted by:\n\nVercel Inc.\n340 Pine Street, Suite 700, San Francisco, CA 94104, USA\nhttps://vercel.com'}
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="font-display text-2xl font-light text-obsidian-950 dark:text-white mb-4">
              {isFr ? '3. Propriété intellectuelle' : '3. Intellectual Property'}
            </h2>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {isFr
                ? settings.legal_s3_fr || "L'ensemble des contenus présents sur ce site (textes, images, vidéos, logos, icônes) sont la propriété exclusive de Guard Conciergerie Luxury Care ou de ses partenaires. Toute reproduction, distribution, modification ou utilisation de ces contenus sans autorisation écrite préalable est strictement interdite."
                : settings.legal_s3_en || "All content on this website (text, images, videos, logos, icons) is the exclusive property of Guard Conciergerie Luxury Care or its partners. Any reproduction, distribution, modification or use of this content without prior written authorization is strictly prohibited."}
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-display text-2xl font-light text-obsidian-950 dark:text-white mb-4">
              {isFr ? '4. Limitation de responsabilité' : '4. Limitation of Liability'}
            </h2>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {isFr
                ? settings.legal_s4_fr || "Guard Conciergerie Luxury Care s'efforce de fournir des informations exactes et à jour sur ce site. Cependant, nous ne saurions garantir l'exactitude, l'exhaustivité ou l'actualité des informations diffusées. L'utilisateur reconnaît utiliser ces informations sous sa propre responsabilité."
                : settings.legal_s4_en || "Guard Conciergerie Luxury Care strives to provide accurate and up-to-date information on this website. However, we cannot guarantee the accuracy, completeness or timeliness of the information provided. The user acknowledges using this information under their own responsibility."}
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="font-display text-2xl font-light text-obsidian-950 dark:text-white mb-4">
              {isFr ? '5. Cookies' : '5. Cookies'}
            </h2>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {isFr
                ? settings.legal_s5_fr || "Ce site utilise des cookies techniques nécessaires à son bon fonctionnement. Ces cookies ne collectent pas de données personnelles à des fins de traçage. En naviguant sur ce site, vous acceptez l'utilisation de ces cookies."
                : settings.legal_s5_en || "This website uses technical cookies necessary for its proper functioning. These cookies do not collect personal data for tracking purposes. By browsing this website, you accept the use of these cookies."}
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="font-display text-2xl font-light text-obsidian-950 dark:text-white mb-4">
              {isFr ? '6. Droit applicable' : '6. Applicable Law'}
            </h2>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {isFr
                ? settings.legal_s6_fr || "Les présentes mentions légales sont régies par le droit marocain. En cas de litige, et à défaut de résolution amiable, les tribunaux compétents du ressort de Marrakech seront seuls compétents."
                : settings.legal_s6_en || "These legal notices are governed by Moroccan law. In case of dispute, and in the absence of an amicable resolution, the competent courts of the Marrakech jurisdiction shall have exclusive jurisdiction."}
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="font-display text-2xl font-light text-obsidian-950 dark:text-white mb-4">
              {isFr ? '7. Contact' : '7. Contact'}
            </h2>
            <p className="text-sm leading-relaxed">
              {isFr
                ? `Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter à l'adresse suivante : `
                : `For any questions regarding these legal notices, you can contact us at: `}
              <a href={`mailto:${settings.contact_email || 'contact@guardconciergerie.com'}`} className="text-gold-500 hover:text-gold-600 underline">
                {settings.contact_email || 'contact@guardconciergerie.com'}
              </a>
            </p>
          </section>
        </div>
      </main>

      <Footer locale={locale} settings={settings} />
    </div>
  )
}
