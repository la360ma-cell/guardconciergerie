import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/api-auth'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!await isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    await prisma.testimonial.delete({ where: { id: Number(params.id) } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Testimonial DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!await isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const { active, order } = body
    const testimonial = await prisma.testimonial.update({
      where: { id: Number(params.id) },
      data: {
        ...(active !== undefined && { active }),
        ...(order !== undefined && { order }),
      },
    })
    return NextResponse.json(testimonial)
  } catch (error) {
    console.error('Testimonial PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 })
  }
}
