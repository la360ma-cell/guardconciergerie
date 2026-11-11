import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { UPLOAD_DIR, UPLOAD_FOLDERS, type UploadFolder } from '@/lib/upload'
import { isAuthenticated } from '@/lib/api-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CONTENT_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  svg: 'image/svg+xml',
}

const notFound = () => new NextResponse('Not found', { status: 404 })

// Sert les fichiers envoyés. URL publique : /api/files/<media|leads>/<nom>
// (réécrite vers /api/files?folder=...&name=... dans next.config.js)
// - media : images du site, publiques
// - leads : photos des clients, visibles uniquement par un admin connecté
export async function GET(req: NextRequest) {
  let folder = req.nextUrl.searchParams.get('folder') || ''
  let rawName = req.nextUrl.searchParams.get('name') || ''

  // Secours : adresse au format /api/files/<dossier>/<nom>
  if (!folder || !rawName) {
    const match = req.nextUrl.pathname.match(/^\/api\/files\/([^/]+)\/([^/]+)$/)
    if (match) {
      folder = match[1]
      try { rawName = decodeURIComponent(match[2]) } catch { return notFound() }
    }
  }

  if (!UPLOAD_FOLDERS.includes(folder as UploadFolder)) return notFound()

  const name = path.basename(rawName)
  if (!name || name !== rawName || name.startsWith('.')) return notFound()

  const ext = name.split('.').pop()?.toLowerCase() || ''
  const contentType = CONTENT_TYPES[ext]
  if (!contentType) return notFound()

  const isPrivate = folder === 'leads'
  if (isPrivate && !(await isAuthenticated(req))) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const baseDir = path.join(UPLOAD_DIR, folder)
  const filePath = path.join(baseDir, name)
  if (!filePath.startsWith(baseDir + path.sep)) return notFound()

  try {
    const data = await readFile(filePath)
    return new NextResponse(data, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': isPrivate ? 'private, max-age=3600' : 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
        // Empêche l'exécution de scripts si un SVG est ouvert directement
        'Content-Security-Policy': "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; sandbox",
      },
    })
  } catch {
    return notFound()
  }
}
