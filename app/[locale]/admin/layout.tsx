import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export default async function AdminLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const pathname = headers().get('x-pathname') || ''
  const isLoginPage = pathname.includes('/admin/login')

  const session = await getServerSession(authOptions)

  if (!session && !isLoginPage) {
    const loginPath = locale === 'en' ? '/en/admin/login' : '/admin/login'
    redirect(loginPath)
  }

  if (!session) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-obsidian-950 flex">
      <AdminSidebar locale={locale} />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[260px]">
        <AdminHeader locale={locale} session={session} />
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
