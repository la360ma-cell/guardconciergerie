import { put } from '@vercel/blob'

const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/svg+xml']

// ── Vercel Blob upload ───────────────────────────────────────────────────────
async function uploadToVercelBlob(file: File): Promise<string> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not configured')
  }

  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const basename = file.name
    .replace(/\.[^.]+$/, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'image'
  const filename = `guard-conciergerie/${Date.now()}-${basename}.${ext}`
  const blob = await put(filename, file, {
    access: 'public',
    contentType: file.type,
  })
  return blob.url
}

export async function uploadFile(file: File): Promise<{
  url: string
  filename: string
  path: string
  size: number
  mimeType: string
}> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Type de fichier invalide: ${file.type}`)
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`Fichier trop volumineux (max ${MAX_FILE_SIZE / 1024 / 1024}MB)`)
  }

  const url = await uploadToVercelBlob(file)

  return {
    url,
    filename: file.name,
    path: url,
    size: file.size,
    mimeType: file.type,
  }
}

export async function deleteFile(filename: string): Promise<void> {
  // Vercel Blob files are managed via the Vercel dashboard.
  // Keep local deletion only for legacy paths.
  if (filename.startsWith('/uploads/')) {
    try {
      const { unlink } = await import('fs/promises')
      const path = await import('path')
      const UPLOAD_DIR = process.env.UPLOAD_DIR || './public/uploads'
      const filePath = path.join(path.resolve(UPLOAD_DIR), path.basename(filename))
      await unlink(filePath)
    } catch { /* ignore */ }
  }
}
