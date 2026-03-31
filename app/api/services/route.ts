import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/api-auth'

export async function GET(req: NextRequest) {
  try {
    const authenticated = await isAuthenticated(req)
    const services = await prisma.service.findMany({
      // Admin sees all items (including inactive); public sees only active
      ...(authenticated ? {} : { where: { active: true } }),
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(services)
  } catch (error) {
    console.error('Services fetch error:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!await isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { titleFr, titleEn, descFr, descEn, icon, order, active } = body
    if (!titleFr && !titleEn) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    const service = await prisma.service.create({
      data: {
        titleFr: titleFr || '',
        titleEn: titleEn || '',
        descFr: descFr || '',
        descEn: descEn || '',
        icon: icon || 'Star',
        order: order ?? 0,
        active: active !== false,
      },
    })
    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Services POST error:', error)
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!await isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { id, titleFr, titleEn, descFr, descEn, icon, order, active } = body
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

    const service = await prisma.service.update({
      where: { id },
      data: {
        ...(titleFr !== undefined && { titleFr }),
        ...(titleEn !== undefined && { titleEn }),
        ...(descFr !== undefined && { descFr }),
        ...(descEn !== undefined && { descEn }),
        ...(icon !== undefined && { icon }),
        ...(order !== undefined && { order }),
        ...(active !== undefined && { active }),
      },
    })
    return NextResponse.json(service)
  } catch (error) {
    console.error('Services PUT error:', error)
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 })
  }
}
