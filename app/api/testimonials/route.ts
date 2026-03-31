import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/api-auth'

export async function GET(req: NextRequest) {
  try {
    const authenticated = await isAuthenticated(req)
    const testimonials = await prisma.testimonial.findMany({
      ...(authenticated ? {} : { where: { active: true } }),
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(testimonials)
  } catch (error) {
    console.error('Testimonials fetch error:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!await isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { name, location, textFr, textEn, rating, order, active } = body
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        location: location || '',
        textFr: textFr || '',
        textEn: textEn || '',
        rating: rating ?? 5,
        order: order ?? 0,
        active: active !== false,
      },
    })
    return NextResponse.json(testimonial, { status: 201 })
  } catch (error) {
    console.error('Testimonials POST error:', error)
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!await isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { id, name, location, textFr, textEn, rating, order, active } = body
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(location !== undefined && { location }),
        ...(textFr !== undefined && { textFr }),
        ...(textEn !== undefined && { textEn }),
        ...(rating !== undefined && { rating }),
        ...(order !== undefined && { order }),
        ...(active !== undefined && { active }),
      },
    })
    return NextResponse.json(testimonial)
  } catch (error) {
    console.error('Testimonials PUT error:', error)
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 })
  }
}
