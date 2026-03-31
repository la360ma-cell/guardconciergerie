import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const intlMiddleware = createMiddleware({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'as-needed',
})

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // Protect admin routes
  if (pathname.includes('/admin') && !pathname.includes('/admin/login')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      const locale = pathname.startsWith('/en') ? 'en' : 'fr'
      const loginUrl = locale === 'en' ? '/en/admin/login' : '/admin/login'
      return NextResponse.redirect(new URL(loginUrl, req.url))
    }
  }

  const response = intlMiddleware(req)
  response.headers.set('x-pathname', pathname)
  return response
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
