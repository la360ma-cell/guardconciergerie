import { put } from '@vercel/blob'

const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/svg+xml']

// ── Cloudinary upload ────────────────────────────────────────────────────────
async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET!
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', uploadPreset)
  fd.append('folder', 'guard-conciergerie')
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: fd,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Cloudinary upload failed: ${JSON.stringify(err)}`)
  }
  const data = await res.json()
  return data.secure_url as string
}

// ── Vercel Blob upload (production fallback) ─────────────────────────────────
async function uploadToVercelBlob(file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg'
  const filename = `guard-${Date.now()}.${ext}`
  const blob = await put(filename, file, {
    access: 'public',
    contentType: file.type,
  })
  return blob.url
}

// ── Main export ──────────────────────────────────────────────────────────────
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

  let url: string
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_UPLOAD_PRESET) {
    url = await uploadToCloudinary(file)
  } else {
    // Use Vercel Blob (BLOB_READ_WRITE_TOKEN is auto-injected by Vercel)
    url = await uploadToVercelBlob(file)
  }

  return {
    url,
    filename: file.name,
    path: url,
    size: file.size,
    mimeType: file.type,
  }
}

export async function deleteFile(filename: string): Promise<void> {
  // Vercel Blob and Cloudinary files are managed via their dashboards
  // Local delete only for legacy paths
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
