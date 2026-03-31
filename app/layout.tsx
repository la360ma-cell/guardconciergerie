import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Guard Conciergerie Luxury Care',
  description: 'Conciergerie de luxe à Marrakech',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
