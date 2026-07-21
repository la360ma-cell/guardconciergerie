import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // /admin et /api restent hors i18n ; les fichiers statiques sont exclus.
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)']
};
