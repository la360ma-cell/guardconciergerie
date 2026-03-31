import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/api-auth'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!await isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    await prisma.formField.delete({ where: { id: Number(params.id) } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('FormField DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete form field' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!await isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const { active, order } = body
    const field = await prisma.formField.update({
      where: { id: Number(params.id) },
      data: {
        ...(active !== undefined && { active }),
        ...(order !== undefined && { order }),
      },
    })
    return NextResponse.json(field)
  } catch (error) {
    console.error('FormField PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update form field' }, { status: 500 })
  }
}
