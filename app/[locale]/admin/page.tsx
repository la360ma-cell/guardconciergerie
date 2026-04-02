import { redirect } from 'next/navigation'

export default function AdminPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const prefix = locale === 'en' ? '/en/admin' : '/admin'
  redirect(`${prefix}/dashboard`)
}
