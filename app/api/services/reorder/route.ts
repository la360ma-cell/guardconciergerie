import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/api-auth'

export async function PUT(req: NextRequest) {
  try {
    if (!await isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const items: { id: number; order: number }[] = await req.json()
    await Promise.all(items.map(item => prisma.service.update({ where: { id: item.id }, data: { order: item.order } })))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Services reorder error:', error)
    return NextResponse.json({ error: 'Failed to reorder' }, { status: 500 })
  }
}
