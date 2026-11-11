import { mkdir, writeFile, unlink } from 'fs/promises'
import path from 'path'
import { randomBytes } from 'crypto'

// ── Stockage local (serveur Hostinger) ──────────────────────────────────────
// Les fichiers sont écrits HORS du dossier de l'application, pour survivre aux
// redéploiements depuis GitHub. Par défaut : <dossier parent de l'app>/uploads
// (sur Hostinger : ~/domains/guard-conciergerie.com/uploads).
// Surchargeable avec la variable d'environnement UPLOAD_DIR.
export const UPLOAD_DIR = path.resolve(
  process.env.UPLOAD_DIR || path.join(process.cwd(), '..', 'uploads'),
)

// Dossiers autorisés : "media" = images du site (publiques),
// "leads" = photos envoyées par les clients (réservées à l'admin).
export type UploadFolder = 'media' | 'leads'
export const UPLOAD_FOLDERS: UploadFolder[] = ['media', 'leads']

const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB

const EXT_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
}

function slugify(filename: string): string {
  return (
    filename
      .replace(/\.[^.]+$/, '')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-zA-Z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'image'
  )
}

export async function uploadFile(
  file: File,
  options: { folder?: UploadFolder; allowSvg?: boolean } = {},
): Promise<{
  url: string
  filename: string
  path: string
  size: number
  mimeType: string
}> {
  const folder: UploadFolder = options.folder || 'media'
  const allowed = Object.keys(EXT_BY_TYPE).filter(t => options.allowSvg || t !== 'image/svg+xml')

  if (!allowed.includes(file.type)) {
    throw new Error(`Type de fichier invalide: ${file.type}`)
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`Fichier trop volumineux (max ${MAX_FILE_SIZE / 1024 / 1024}MB)`)
  }

  const ext = EXT_BY_TYPE[file.type]
  const name = `${Date.now()}-${randomBytes(6).toString('hex')}-${slugify(file.name)}.${ext}`
  const dir = path.join(UPLOAD_DIR, folder)

  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()))

  // Format avec paramètres : fonctionne directement sur Hostinger (sans réécriture d'URL)
  const url = `/api/files?folder=${folder}&name=${encodeURIComponent(name)}`

  return {
    url,
    filename: file.name,
    path: url,
    size: file.size,
    mimeType: file.type,
  }
}

export async function deleteFile(fileUrl: string): Promise<void> {
  // Fichiers stockés sur le serveur :
  // /api/files?folder=<dossier>&name=<nom>  ou  /api/files/<dossier>/<nom>
  let folder = ''
  let name = ''
  const pathMatch = fileUrl.match(/^\/api\/files\/(media|leads)\/([^/?]+)$/)
  if (pathMatch) {
    folder = pathMatch[1]
    name = pathMatch[2]
  } else if (fileUrl.startsWith('/api/files?')) {
    const params = new URLSearchParams(fileUrl.slice('/api/files?'.length))
    folder = params.get('folder') || ''
    name = params.get('name') || ''
  }
  if (UPLOAD_FOLDERS.includes(folder as UploadFolder) && name) {
    try {
      await unlink(path.join(UPLOAD_DIR, folder, path.basename(name)))
    } catch { /* ignore */ }
    return
  }

  // Ancien format local : /uploads/<nom>
  if (fileUrl.startsWith('/uploads/')) {
    try {
      const legacyDir = path.resolve('./public/uploads')
      await unlink(path.join(legacyDir, path.basename(fileUrl)))
    } catch { /* ignore */ }
  }
}
