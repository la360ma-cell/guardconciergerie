import React from 'react'
import Header from '@/components/site/Header'
import Hero from '@/components/site/Hero'
import About from '@/components/site/About'
import Services from '@/components/site/Services'
import WhyUs from '@/components/site/WhyUs'
import Process from '@/components/site/Process'
import Stats from '@/components/site/Stats'
import Testimonials from '@/components/site/Testimonials'
import FAQ from '@/components/site/FAQ'
import ContactSection from '@/components/site/ContactSection'
import Footer from '@/components/site/Footer'
import FloatingWhatsApp from '@/components/site/FloatingWhatsApp'
import {
  mockServices, mockTestimonials, mockFaqs, mockSettings, mockFormFields
} from '@/lib/mock-data'

export const revalidate = 60 // ISR: revalidate every 60 seconds

async function getData() {
  // If DATABASE_URL is not set, return mock data immediately
  if (!process.env.DATABASE_URL) {
    return {
      services: mockServices,
      testimonials: mockTestimonials,
      faqs: mockFaqs,
      settings: mockSettings,
      formFields: mockFormFields,
      content: {},
    }
  }

  try {
    const { prisma } = await import('@/lib/prisma')
    const [services, testimonials, faqs, settings, formFields, contents] = await Promise.all([
      prisma.service.findMany({ where: { active: true }, orderBy: { order: 'asc' } }),
      prisma.testimonial.findMany({ where: { active: true }, orderBy: { order: 'asc' } }),
      prisma.fAQ.findMany({ where: { active: true }, orderBy: { order: 'asc' } }),
      prisma.siteSettings.findMany(),
      prisma.formField.findMany({ where: { active: true }, orderBy: { order: 'asc' } }),
      prisma.content.findMany(),
    ])
    const settingsMap = Object.fromEntries(settings.map(s => [s.key, s.value]))
    const content: Record<string, string> = {}
    contents.forEach((c: any) => {
      content[`${c.key}_fr`] = c.valueFr || ''
      content[`${c.key}_en`] = c.valueEn || ''
      if (c.color) content[`${c.key}_color`] = c.color
      if (c.font) content[`${c.key}_font`] = c.font
      if (c.fontSize) content[`${c.key}_fontSize`] = c.fontSize
      if (c.fontWeight) content[`${c.key}_fontWeight`] = c.fontWeight
    })
    return { services, testimonials, faqs, settings: settingsMap, formFields, content }
  } catch {
    return {
      services: mockServices,
      testimonials: mockTestimonials,
      faqs: mockFaqs,
      settings: mockSettings,
      formFields: mockFormFields,
      content: {},
    }
  }
}

const DEFAULT_SECTIONS_ORDER = ['hero','about','services','whyus','process','stats','testimonials','faq','contact','footer']

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const { services, testimonials, faqs, settings, formFields, content } = await getData()

  // Dynamic section order & visibility from settings
  const sectionsOrder = settings.sections_order
    ? settings.sections_order.split(',').filter(Boolean)
    : DEFAULT_SECTIONS_ORDER

  const sectionComponents: Record<string, React.ReactNode> = {
    hero:         <Hero locale={locale} settings={settings} formFields={formFields} content={content} />,
    about:        <About locale={locale} settings={settings} content={content} />,
    services:     <Services locale={locale} services={services} settings={settings} content={content} />,
    whyus:        <WhyUs locale={locale} settings={settings} content={content} />,
    process:      <Process locale={locale} settings={settings} content={content} />,
    stats:        <Stats locale={locale} settings={settings} content={content} />,
    testimonials: <Testimonials locale={locale} testimonials={testimonials} settings={settings} content={content} />,
    faq:          <FAQ locale={locale} faqs={faqs} settings={settings} content={content} />,
    contact:      <ContactSection locale={locale} settings={settings} formFields={formFields} content={content} />,
    footer:       <Footer locale={locale} settings={settings} content={content} />,
  }

  return (
    <main className="min-h-screen bg-white dark:bg-obsidian-950 transition-colors duration-300">
      <Header locale={locale} settings={settings} />
      {sectionsOrder.map(name => {
        if (settings[`section_${name}_hidden`] === 'true') return null
        const comp = sectionComponents[name]
        return comp ? <React.Fragment key={name}>{comp}</React.Fragment> : null
      })}
      <FloatingWhatsApp settings={settings} />
    </main>
  )
}
