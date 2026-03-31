import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/api-auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const section = searchParams.get('section')

    const where: any = {}
    if (section) where.section = section

    const contents = await prisma.content.findMany({ where, orderBy: { key: 'asc' } })
    return NextResponse.json(contents)
  } catch (error) {
    console.error('Content GET error:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function PUT(req: NextRequest) {
  if (!await isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const content = await prisma.content.upsert({
    where: { key: body.key },
    update: {
      valueFr: body.valueFr,
      valueEn: body.valueEn,
      ...(body.section && { section: body.section }),
      ...(body.color      !== undefined && { color:      body.color      || null }),
      ...(body.font       !== undefined && { font:       body.font       || null }),
      ...(body.fontSize   !== undefined && { fontSize:   body.fontSize   || null }),
      ...(body.fontWeight !== undefined && { fontWeight: body.fontWeight || null }),
    },
    create: {
      key: body.key,
      valueFr: body.valueFr,
      valueEn: body.valueEn,
      section: body.section || 'general',
      type: body.type || 'text',
      color:      body.color      || null,
      font:       body.font       || null,
      fontSize:   body.fontSize   || null,
      fontWeight: body.fontWeight || null,
    },
  })
  return NextResponse.json(content)
}

export async function POST(req: NextRequest) {
  if (!await isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const updates = body.updates as Array<{
      key: string
      valueFr: string
      valueEn: string
      section?: string
      type?: string
      color?: string
      font?: string
      fontSize?: string
      fontWeight?: string
    }>

    await Promise.all(
      updates.map(item =>
        prisma.content.upsert({
          where: { key: item.key },
          update: {
            valueFr:    item.valueFr,
            valueEn:    item.valueEn,
            ...(item.section && { section: item.section }),
            color:      item.color      ?? undefined,
            font:       item.font       ?? undefined,
            fontSize:   item.fontSize   ?? undefined,
            fontWeight: item.fontWeight ?? undefined,
          },
          create: {
            key:        item.key,
            valueFr:    item.valueFr,
            valueEn:    item.valueEn,
            section:    item.section   || 'general',
            type:       item.type      || 'text',
            color:      item.color     || null,
            font:       item.font      || null,
            fontSize:   item.fontSize  || null,
            fontWeight: item.fontWeight || null,
          },
        })
      )
    )

    revalidatePath('/', 'layout')
    revalidatePath('/en', 'layout')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Content POST error:', error)
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 })
  }
}
