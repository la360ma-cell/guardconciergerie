const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./i18n.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
          ignoreBuildErrors: true,
    },
    images: {
          formats: ['image/avif', 'image/webp'],
          remotePatterns: [
            { protocol: 'https', hostname: '**' },
                ],
    },
    experimental: {
          serverActions: {
                  allowedOrigins: ['localhost:3000', process.env.NEXT_PUBLIC_SITE_URL?.replace('https://', '') || ''],
          },
    },
}

module.exports = withNextIntl(nextConfig)
