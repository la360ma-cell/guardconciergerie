import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

/**
 * Vérifie si la requête provient d'un admin connecté.
 * Utilise getToken (JWT) — fiable dans les Route Handlers App Router.
 */
export async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  return !!token
}
