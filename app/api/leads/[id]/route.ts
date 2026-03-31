import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/api-auth'
import { deleteFile } from '@/lib/upload'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const lead = await prisma.lead.findUnique({ where: { id: Number(params.id) } })
  if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Parse photos from JSON string to array, flatten extraFields
  let photos: string[] = []
  try { photos = JSON.parse(lead.photos || '[]') } catch {}
  let extra: Record<string, string> = {}
  try { extra = JSON.parse(lead.extraFields || '{}') } catch {}
  return NextResponse.json({ ...lead, photos, ...extra })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const lead = await prisma.lead.update({
    where: { id: Number(params.id) },
    data: { status: body.status, notes: body.notes },
  })

  return NextResponse.json(lead)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const lead = await prisma.lead.findUnique({ where: { id: Number(params.id) } })
  if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Delete photos
  const photos: string[] = JSON.parse(lead.photos || '[]')
  for (const photo of photos) {
    await deleteFile(photo)
  }

  await prisma.lead.delete({ where: { id: Number(params.id) } })
  return NextResponse.json({ success: true })
}
