import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/api-auth'

// Keys that contain sensitive data — never expose publicly
const SENSITIVE_KEYS = ['smtp_pass', 'smtp_user', 'smtp_host', 'smtp_port', 'smtp_from', 'notification_email']

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const key = searchParams.get('key')
    const authenticated = await isAuthenticated(req)

    // Single key lookup
    if (key) {
      // Block sensitive keys for unauthenticated users
      if (!authenticated && SENSITIVE_KEYS.includes(key)) {
        return NextResponse.json(null)
      }
      const setting = await prisma.siteSettings.findUnique({ where: { key } })
      return NextResponse.json(setting)
    }

    // Category-based lookup — block notifications category entirely for public
    if (category === 'notifications' && !authenticated) {
      return NextResponse.json([])
    }

    const where: any = {}
    if (category) where.category = category

    const settings = await prisma.siteSettings.findMany({ where, orderBy: { key: 'asc' } })

    // Filter out sensitive keys for unauthenticated users
    if (!authenticated) {
      const filtered = settings.filter(s => !SENSITIVE_KEYS.includes(s.key))
      return NextResponse.json(filtered)
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Settings GET error:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!await isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()

    if (Array.isArray(body)) {
      // Bulk update
      await Promise.all(
        body.map((item: { key: string; value: string; category?: string }) =>
          prisma.siteSettings.upsert({
            where: { key: item.key },
            update: { value: item.value },
            create: { key: item.key, value: item.value, category: item.category || 'general' },
          })
        )
      )
      // Revalidate site pages so changes appear immediately
      revalidatePath('/', 'layout')
      revalidatePath('/en', 'layout')
      return NextResponse.json({ success: true })
    }

    const setting = await prisma.siteSettings.upsert({
      where: { key: body.key },
      update: { value: body.value },
      create: { key: body.key, value: body.value, category: body.category || 'general' },
    })
    revalidatePath('/', 'layout')
    revalidatePath('/en', 'layout')
    return NextResponse.json(setting)
  } catch (error) {
    console.error('Settings PUT error:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
