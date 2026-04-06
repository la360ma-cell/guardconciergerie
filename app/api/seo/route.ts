import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/api-auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = searchParams.get('page')
    const locale = searchParams.get('locale')

    const where: { page?: string; locale?: string } = {}
    if (page) where.page = page
    if (locale) where.locale = locale

    const seo = await prisma.sEOConfig.findMany({ where })
    return NextResponse.json(seo)
  } catch (error) {
    console.error('SEO GET error:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!await isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { page, locale, title, description, keywords, ogImage } = body
    if (!page || !locale) return NextResponse.json({ error: 'page and locale are required' }, { status: 400 })

    const seo = await prisma.sEOConfig.upsert({
      where: { page_locale: { page, locale } },
      update: { title, description, keywords, ogImage },
      create: { page, locale, title, description, keywords, ogImage },
    })
    return NextResponse.json(seo)
  } catch (error) {
    console.error('SEO PUT error:', error)
    return NextResponse.json({ error: 'Failed to save SEO config' }, { status: 500 })
  }
}
