import { NextRequest, NextResponse } from 'next/server'
import { uploadFile } from '@/lib/upload'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/api-auth'

export async function POST(req: NextRequest) {
  if (!await isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const uploaded = await uploadFile(file)

  const media = await prisma.media.create({
    data: {
      filename: uploaded.filename,
      path: uploaded.path,
      url: uploaded.url,
      size: uploaded.size,
      mimeType: uploaded.mimeType,
    },
  })

  return NextResponse.json(media)
}

export async function GET(req: NextRequest) {
  if (!await isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const media = await prisma.media.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return NextResponse.json(media)
}
