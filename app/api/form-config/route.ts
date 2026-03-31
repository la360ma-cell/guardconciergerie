import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/api-auth'

export async function GET(req: NextRequest) {
  try {
    const authenticated = await isAuthenticated(req)
    const fields = await prisma.formField.findMany({
      ...(authenticated ? {} : { where: { active: true } }),
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(fields)
  } catch (error) {
    console.error('FormConfig fetch error:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!await isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { name, type, labelFr, labelEn, placeholderFr, placeholderEn, required, options, order, active, variant } = body
    if (!name) {
      return NextResponse.json({ error: 'Field name is required' }, { status: 400 })
    }
    const field = await prisma.formField.create({
      data: {
        name,
        type: type || 'text',
        labelFr: labelFr || '',
        labelEn: labelEn || '',
        placeholderFr: placeholderFr || '',
        placeholderEn: placeholderEn || '',
        required: required ?? false,
        options: options || '',
        order: order ?? 0,
        active: active !== false,
        variant: variant || 'hero',
      },
    })
    return NextResponse.json(field, { status: 201 })
  } catch (error) {
    console.error('FormConfig POST error:', error)
    return NextResponse.json({ error: 'Failed to create form field' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!await isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { id, name, type, labelFr, labelEn, placeholderFr, placeholderEn, required, options, order, active, variant } = body
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

    const field = await prisma.formField.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(type !== undefined && { type }),
        ...(labelFr !== undefined && { labelFr }),
        ...(labelEn !== undefined && { labelEn }),
        ...(placeholderFr !== undefined && { placeholderFr }),
        ...(placeholderEn !== undefined && { placeholderEn }),
        ...(required !== undefined && { required }),
        ...(options !== undefined && { options }),
        ...(order !== undefined && { order }),
        ...(active !== undefined && { active }),
        ...(variant !== undefined && { variant }),
      },
    })
    return NextResponse.json(field)
  } catch (error) {
    console.error('FormConfig PUT error:', error)
    return NextResponse.json({ error: 'Failed to update form field' }, { status: 500 })
  }
}
