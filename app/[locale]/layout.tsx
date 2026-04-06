import type { Metadata } from 'next'
import { Inter, Cormorant_Garamond } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { Providers } from '@/components/ui/Providers'
import { notFound } from 'next/navigation'
import { buildAppearanceStyles, buildGoogleFontsUrl } from '@/lib/appearance'
import ScrollToTop from '@/components/ui/ScrollToTop'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})


const locales = ['fr', 'en']

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  try {
    if (!process.env.DATABASE_URL) throw new Error('no db')
    const { prisma } = await import('@/lib/prisma')
    const seo = await prisma.sEOConfig.findUnique({
      where: { page_locale: { page: 'home', locale } },
    })
    return {
      title: seo?.title || 'Guard Conciergerie Luxury Care',
      description: seo?.description || 'Conciergerie de luxe à Marrakech',
      keywords: seo?.keywords || '',
      openGraph: {
        title: seo?.title || 'Guard Conciergerie Luxury Care',
        description: seo?.description || '',
        images: seo?.ogImage ? [seo.ogImage] : [],
        locale: locale === 'fr' ? 'fr_FR' : 'en_US',
        type: 'website',
      },
      alternates: {
        canonical: seo?.canonical ?? undefined,
        languages: { 'fr': '/', 'en': '/en' },
      },
    }
  } catch {
    return {
      title: locale === 'fr'
        ? 'Guard Conciergerie Luxury Care | Conciergerie de Luxe à Marrakech'
        : 'Guard Conciergerie Luxury Care | Luxury Concierge in Marrakech',
      description: locale === 'fr'
        ? 'Conciergerie de luxe & gestion locative premium à Marrakech.'
        : 'Luxury concierge & premium rental management in Marrakech.',
    }
  }
}

async function getAppearanceSettings(): Promise<Record<string, string>> {
  try {
    if (!process.env.DATABASE_URL) return {}
    const { prisma } = await import('@/lib/prisma')
    // Fetch appearance + buttons categories so all CSS overrides are generated
    const rows = await prisma.siteSettings.findMany({
      where: { category: { in: ['appearance', 'buttons', 'sections'] } },
    })
    return Object.fromEntries(rows.map(r => [r.key, r.value]))
  } catch {
    return {}
  }
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!locales.includes(locale)) notFound()

  const messages = await getMessages()
  const appearanceSettings = await getAppearanceSettings()
  const cssVars = buildAppearanceStyles(appearanceSettings)
  const googleFontsUrl = buildGoogleFontsUrl(appearanceSettings)

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        {googleFontsUrl && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href={googleFontsUrl} rel="stylesheet" />
          </>
        )}
        <style dangerouslySetInnerHTML={{ __html: cssVars }} />
        {appearanceSettings.appearance_custom_element_css && (
          <style dangerouslySetInnerHTML={{ __html: appearanceSettings.appearance_custom_element_css }} />
        )}
      </head>
      <body className={`${inter.variable} ${cormorant.variable} font-sans`}>
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <Providers>
              {children}
              <ScrollToTop />
            </Providers>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
