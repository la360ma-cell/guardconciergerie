'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react'

export default function AdminLogin({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('admin')
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError(locale === 'fr' ? 'Email ou mot de passe incorrect' : 'Invalid email or password')
      setIsLoading(false)
    } else {
      const adminPath = locale === 'en' ? '/en/admin/dashboard' : '/admin/dashboard'
      router.push(adminPath)
    }
  }

  return (
    <div className="min-h-screen bg-obsidian-950 flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="font-display text-3xl font-light tracking-[0.15em] uppercase text-white">
            Guard
          </div>
          <div className="text-[9px] tracking-[0.35em] uppercase text-gold-500 font-medium mt-1">
            Conciergerie Luxury Care
          </div>
          <div className="mt-4 text-obsidian-400 text-sm">{t('login_subtitle')}</div>
        </div>

        {/* Card */}
        <div className="bg-obsidian-900 border border-white/5 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
              <Lock size={14} className="text-gold-500" />
            </div>
            <h1 className="text-white font-medium">{t('login_title')}</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-obsidian-400 mb-1.5 tracking-wide uppercase">
                {t('email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-obsidian-950 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-500 transition-colors placeholder:text-obsidian-600"
                placeholder="admin@guardconciergerie.com"
              />
            </div>

            <div>
              <label className="block text-xs text-obsidian-400 mb-1.5 tracking-wide uppercase">
                {t('password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-obsidian-950 border border-white/10 rounded-lg px-4 py-3 pr-10 text-white text-sm focus:outline-none focus:border-gold-500 transition-colors placeholder:text-obsidian-600"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {locale === 'fr' ? 'Connexion...' : 'Signing in...'}
                </>
              ) : (
                t('login_btn')
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-obsidian-600 mt-6">
          © {new Date().getFullYear()} Guard Conciergerie Luxury Care
        </p>
      </div>
    </div>
  )
}
