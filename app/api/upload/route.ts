import { NextRequest, NextResponse } from 'next/server'
import { uploadFile } from '@/lib/upload'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/api-auth'

export async function POST(req: NextRequest) {
  const startedAt = Date.now()
  const requestId = req.headers.get('x-vercel-id')

  if (!await isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log(JSON.stringify({
      level: 'info',
      message: 'Upload started',
      route: '/api/upload',
      requestId,
      filename: file.name,
      mimeType: file.type,
      size: file.size,
    }))

    const uploaded = await uploadFile(file)

    console.log(JSON.stringify({
      level: 'info',
      message: 'Blob upload completed',
      route: '/api/upload',
      requestId,
      durationMs: Date.now() - startedAt,
    }))

    const media = await prisma.media.create({
      data: {
        filename: uploaded.filename,
        path: uploaded.path,
        url: uploaded.url,
        size: uploaded.size,
        mimeType: uploaded.mimeType,
      },
    })

    console.log(JSON.stringify({
      level: 'info',
      message: 'Upload completed',
      route: '/api/upload',
      requestId,
      mediaId: media.id,
      durationMs: Date.now() - startedAt,
    }))

    return NextResponse.json(media)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)

    console.error(JSON.stringify({
      level: 'error',
      message: 'Upload failed',
      route: '/api/upload',
      requestId,
      error: errorMessage,
      durationMs: Date.now() - startedAt,
    }))

    return NextResponse.json(
      { error: 'Upload failed', details: errorMessage },
      { status: 500 },
    )
  }
}

export async function GET(req: NextRequest) {
  if (!await isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const media = await prisma.media.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return NextResponse.json(media)
}
