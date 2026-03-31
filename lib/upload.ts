import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/svg+xml']

// ── Cloudinary upload (production) ───────────────────────────────────────────
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

// ── Local upload (development) ────────────────────────────────────────────────
async function uploadToLocal(file: File): Promise<string> {
  const { writeFile, mkdir } = await import('fs/promises')
  const { existsSync } = await import('fs')

  const UPLOAD_DIR = process.env.UPLOAD_DIR || './public/uploads'
  const uploadPath = path.resolve(UPLOAD_DIR)
  if (!existsSync(uploadPath)) {
    await mkdir(uploadPath, { recursive: true })
  }

  const ext = path.extname(file.name).toLowerCase() || '.jpg'
  const filename = `${uuidv4()}${ext}`
  const filePath = path.join(uploadPath, filename)

  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(filePath, buffer)

  return `/uploads/${filename}`
}

// ── Main export ───────────────────────────────────────────────────────────────
export async function uploadFile(file: File): Promise<{ url: string; filename: string; path: string; size: number; mimeType: string }> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Type de fichier invalide: ${file.type}`)
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`Fichier trop volumineux (max ${MAX_FILE_SIZE / 1024 / 1024}MB)`)
  }

  // Use Cloudinary in production if configured, otherwise local storage
  const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_UPLOAD_PRESET
  const url = useCloudinary
    ? await uploadToCloudinary(file)
    : await uploadToLocal(file)

  return {
    url,
    filename: file.name,
    path: url,
    size: file.size,
    mimeType: file.type,
  }
}

export async function deleteFile(filename: string): Promise<void> {
  // Local delete only — Cloudinary files are managed via dashboard
  if (filename.startsWith('/uploads/')) {
    const { unlink } = await import('fs/promises')
    const UPLOAD_DIR = process.env.UPLOAD_DIR || './public/uploads'
    const filePath = path.join(path.resolve(UPLOAD_DIR), path.basename(filename))
    try { await unlink(filePath) } catch { /* ignore */ }
  }
}
