import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendLeadNotification } from '@/lib/email'
import { uploadFile } from '@/lib/upload'
import { isAuthenticated } from '@/lib/api-auth'

export async function GET(req: NextRequest) {
  if (!await isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get('page') || 1)
  const limit = Number(searchParams.get('limit') || 20)
  const status = searchParams.get('status')
  const search = searchParams.get('search') || ''
  const exportCsv = searchParams.get('export') === 'csv'

  const where: any = {}
  if (status) where.status = status
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { phone: { contains: search } },
      { city: { contains: search } },
      { extraFields: { contains: search } },
    ]
  }

  if (exportCsv) {
    const leads = await prisma.lead.findMany({ where, orderBy: { createdAt: 'desc' } }).catch(() => [])
    const csv = [
      ['ID', 'Nom', 'Téléphone', 'Email', 'Ville', 'Type de bien', 'Message', 'Statut', 'Date'].join(','),
      ...leads.map(l => {
        let extra: Record<string, string> = {}
        try { extra = JSON.parse(l.extraFields || '{}') } catch {}
        return [
          l.id,
          `"${l.name}"`,
          l.phone,
          `"${extra.email || ''}"`,
          l.city,
          l.propertyType,
          `"${(l.message || '').replace(/"/g, '""')}"`,
          l.status,
          l.createdAt.toISOString(),
        ].join(',')
      })
    ].join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="leads-${Date.now()}.csv"`,
      },
    })
  }

  try {
    const [rawLeads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.lead.count({ where }),
    ])

    // Flatten extraFields onto each lead object (for email, etc.)
    const leads = rawLeads.map(lead => {
      let extra: Record<string, string> = {}
      try { extra = JSON.parse(lead.extraFields || '{}') } catch {}
      return { ...lead, ...extra }
    })

    return NextResponse.json({ leads, total, page, limit })
  } catch (error) {
    console.error('Leads fetch error:', error)
    return NextResponse.json({ leads: [], total: 0, page, limit, error: 'Database error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const city = formData.get('city') as string
    const propertyType = formData.get('propertyType') as string
    const message = formData.get('message') as string | null
    const files = formData.getAll('photos') as File[]

    if (!name || !phone || !city || !propertyType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Upload photos
    const photoPaths: string[] = []
    for (const file of files.slice(0, 10)) {
      if (file instanceof File && file.size > 0) {
        const uploaded = await uploadFile(file)
        photoPaths.push(uploaded.url)
      }
    }

    // Extract extra fields
    const extraFields: Record<string, string> = {}
    const skipKeys = ['name', 'phone', 'city', 'propertyType', 'message', 'photos']
    formData.forEach((value, key) => {
      if (!skipKeys.includes(key)) {
        extraFields[key] = value as string
      }
    })

    const lead = await prisma.lead.create({
      data: {
        name,
        phone,
        city,
        propertyType,
        message: message || null,
        photos: JSON.stringify(photoPaths),
        extraFields: Object.keys(extraFields).length > 0 ? JSON.stringify(extraFields) : undefined,
      },
    })

    // Send notification email (non-blocking)
    sendLeadNotification({
      name,
      phone,
      city,
      propertyType,
      message: message || undefined,
      photosCount: photoPaths.length,
    }).catch(console.error)

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 })
  } catch (error) {
    console.error('Lead creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
