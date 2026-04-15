'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Upload, X, CheckCircle, AlertCircle, Loader2, Phone, User, MapPin, Home, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormField {
  id: number
  name: string
  labelFr: string
  labelEn: string
  type: string
  required: boolean
  options?: string | null
  placeholder_fr?: string | null
  placeholder_en?: string | null
  conditionalOn?: string | null
  conditionalValue?: string | null
}

interface DynamicFormProps {
  locale: string
  formFields: FormField[]
  settings: Record<string, string>
  variant?: 'hero' | 'section'
}

// Paires de champs côte à côte (dans l'ordre d'affichage)
const FIELD_PAIRS: [string, string][] = [
  ['name', 'phone'],
  ['city', 'propertyType'],
]

// Icône lucide par champ
const FIELD_ICONS: Record<string, React.ElementType> = {
  name: User,
  phone: Phone,
  city: MapPin,
  propertyType: Home,
}

export default function DynamicForm({ locale, formFields, settings, variant = 'section' }: DynamicFormProps) {
  const t = useTranslations('form')
  const [files, setFiles] = useState<File[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const previewUrlsRef = useRef<string[]>([])
  const previewUrls = useMemo(() => {
    previewUrlsRef.current.forEach(url => URL.revokeObjectURL(url))
    const urls = files.map(f => URL.createObjectURL(f))
    previewUrlsRef.current = urls
    return urls
  }, [files])
  useEffect(() => () => { previewUrlsRef.current.forEach(url => URL.revokeObjectURL(url)) }, [])

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm()
  const watchedValues = watch()

  const isFieldVisible = (field: FormField) => {
    if (!field.conditionalOn || !field.conditionalValue) return true
    return watchedValues[field.conditionalOn] === field.conditionalValue
  }

  const onDrop = useCallback((accepted: File[]) => {
    setFiles(prev => [...prev, ...accepted.slice(0, 10 - prev.length)])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 10,
    disabled: files.length >= 10,
  })

  const onSubmit = async (data: Record<string, string>) => {
    setIsLoading(true); setError(null)
    try {
      const fd = new FormData()
      Object.entries(data).forEach(([k, v]) => { if (v) fd.append(k, v as string) })
      if (data.otherCity) fd.set('city', data.otherCity)
      files.forEach(f => fd.append('photos', f))
      const res = await fetch('/api/leads', { method: 'POST', body: fd })
      if (!res.ok) throw new Error()
      setSubmitted(true); reset(); setFiles([])
    } catch { setError(t('error')) }
    finally { setIsLoading(false) }
  }

  const btnLabel = locale === 'fr' ? settings.form_button_fr || t('submit') : settings.form_button_en || t('submit')

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className={cn('rounded-2xl p-8 text-center', variant === 'hero'
          ? 'bg-white dark:bg-obsidian-900 shadow-luxury dark:shadow-luxury-dark border border-gray-100 dark:border-gray-800'
          : 'bg-obsidian-50 dark:bg-obsidian-900'
        )}>
        <div className="w-14 h-14 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={28} className="text-green-500" />
        </div>
        <h3 className="font-display text-xl font-medium text-obsidian-950 dark:text-white mb-2">
          {locale === 'fr' ? settings.form_confirmation_fr?.split('.')[0] || t('success_title') : settings.form_confirmation_en?.split('.')[0] || t('success_title')}
        </h3>
        <p className="text-obsidian-500 dark:text-obsidian-300 text-sm">
          {locale === 'fr' ? settings.form_confirmation_fr || t('success_text') : settings.form_confirmation_en || t('success_text')}
        </p>
        <button onClick={() => setSubmitted(false)} className="mt-5 text-sm text-gold-600 dark:text-gold-400 hover:underline">
          {locale === 'fr' ? 'Nouvelle demande' : 'New request'}
        </button>
      </motion.div>
    )
  }

  // ── Rendu d'un champ individuel ─────────────────────────────────────────
  const renderField = (field: FormField) => {
    const label = locale === 'fr' ? field.labelFr : field.labelEn
    const placeholder = (locale === 'fr' ? field.placeholder_fr : field.placeholder_en) || ''
    const required = field.required
    const Icon = FIELD_ICONS[field.name]
    const fieldId = `field-${field.name}`

    let options: { valueFr: string; valueEn: string }[] = []
    if (field.options) { try { options = JSON.parse(field.options) } catch {} }

    // Label commun
    const labelEl = (
      <label htmlFor={fieldId} className="block text-[10px] font-bold tracking-widest uppercase text-obsidian-400 dark:text-obsidian-500 mb-1">
        {label}{required && <span className="text-gold-500 ml-0.5">*</span>}
      </label>
    )

    // ── FILE ──────────────────────────────────────────────────────────────
    if (field.type === 'file') return (
      <div key={field.name} className="col-span-2">
        {labelEl}
        <div {...getRootProps()} className={cn(
          'border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all',
          isDragActive ? 'border-gold-500 bg-gold-50/60' : 'border-gray-200 dark:border-gray-700 hover:border-gold-400',
          files.length >= 10 && 'opacity-50 cursor-not-allowed'
        )}>
          <input {...getInputProps()} />
          <Upload size={16} className={cn("mx-auto mb-1", variant === 'hero' ? "text-gold-400" : "text-obsidian-300")} />
          <p className={cn("text-xs", variant === 'hero' ? "text-gold-400" : "text-obsidian-400")}>{t('upload_text')}</p>
          <p className={cn("text-[10px] mt-0.5", variant === 'hero' ? "text-gold-300" : "text-obsidian-300")}>{t('upload_formats')}</p>
        </div>
        {files.length > 0 && (
          <div className="mt-2 grid grid-cols-4 gap-1.5">
            {files.map((file, i) => (
              <div key={i} className="relative group aspect-square">
                <img src={previewUrls[i]} alt={file.name} className="w-full h-full object-cover rounded-lg" />
                <button type="button" onClick={() => setFiles(p => p.filter((_, j) => j !== i))}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full hidden group-hover:flex items-center justify-center">
                  <X size={8} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )

    // ── SELECT ────────────────────────────────────────────────────────────
    if (field.type === 'select') return (
      <div key={field.name}>
        {labelEl}
        <div className="relative">
          {Icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-300 dark:text-obsidian-500 pointer-events-none flex items-center">
              <Icon size={13} strokeWidth={1.8} />
            </span>
          )}
          <select
            id={fieldId}
            aria-required={required}
            {...register(field.name, { required: required ? t('required') : false })}
            className={cn(
              'w-full rounded-xl border border-gray-200 dark:border-gray-700',
              'bg-white dark:bg-obsidian-950 text-obsidian-800 dark:text-white text-sm',
              'py-2.5 pr-8 outline-none appearance-none',
              'focus:border-gold-400 focus:ring-1 focus:ring-gold-400/30 transition-colors',
              Icon ? 'pl-9' : 'pl-3'
            )}
          >
            <option value="">{locale === 'fr' ? 'Sélectionner...' : 'Select...'}</option>
            {options.map((o, i) => (
              <option key={i} value={locale === 'fr' ? o.valueFr : o.valueEn}>
                {locale === 'fr' ? o.valueFr : o.valueEn}
              </option>
            ))}
          </select>
          {/* Custom chevron */}
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-obsidian-300">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
        </div>
        {errors[field.name] && <p className="text-red-400 text-[10px] mt-1">{errors[field.name]?.message as string}</p>}
      </div>
    )

    // ── TEXTAREA ──────────────────────────────────────────────────────────
    if (field.type === 'textarea') return (
      <div key={field.name} className="col-span-2">
        {labelEl}
        <textarea
          id={fieldId}
          aria-required={required}
          {...register(field.name, { required: required ? t('required') : false })}
          placeholder={placeholder}
          rows={2}
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-obsidian-950 text-obsidian-800 dark:text-white text-sm px-3 py-2.5 outline-none resize-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/30 transition-colors placeholder:text-obsidian-300"
        />
        {errors[field.name] && <p className="text-red-400 text-[10px] mt-1">{errors[field.name]?.message as string}</p>}
      </div>
    )

    // ── INPUT TEXT / TEL / EMAIL ───────────────────────────────────────────
    return (
      <div key={field.name}>
        {labelEl}
        <div className="relative">
          {Icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-300 dark:text-obsidian-500 pointer-events-none flex items-center">
              <Icon size={13} strokeWidth={1.8} />
            </span>
          )}
          <input
            id={fieldId}
            aria-required={required}
            {...register(field.name, {
              required: required ? t('required') : false,
              ...(field.type === 'tel' && {
                pattern: { value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, message: t('phone_invalid') }
              })
            })}
            type={field.type}
            placeholder={placeholder}
            className={cn(
              'w-full rounded-xl border border-gray-200 dark:border-gray-700',
              'bg-white dark:bg-obsidian-950 text-obsidian-800 dark:text-white text-sm',
              'py-2.5 outline-none',
              'focus:border-gold-400 focus:ring-1 focus:ring-gold-400/30 transition-colors',
              'placeholder:text-obsidian-300 dark:placeholder:text-obsidian-600',
              Icon ? 'pl-9 pr-3' : 'px-3'
            )}
          />
        </div>
        {errors[field.name] && <p className="text-red-400 text-[10px] mt-1">{errors[field.name]?.message as string}</p>}
      </div>
    )
  }

  // ── Groupement en paires ─────────────────────────────────────────────────
  const visibleFields = formFields.filter(f => isFieldVisible(f))
  const done = new Set<string>()

  const rows = visibleFields.map(field => {
    if (done.has(field.name)) return null
    const pair = FIELD_PAIRS.find(p => p[0] === field.name)
    if (pair) {
      const other = visibleFields.find(f => f.name === pair[1])
      if (other && !done.has(other.name)) {
        done.add(field.name); done.add(other.name)
        return (
          <div key={`pair-${pair[0]}`} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {renderField(field)}
            {renderField(other)}
          </div>
        )
      }
    }
    done.add(field.name)
    return <div key={field.name}>{renderField(field)}</div>
  }).filter(Boolean)

  return (
    <div className={cn('rounded-2xl', variant === 'hero'
      ? 'bg-white dark:bg-obsidian-900 shadow-luxury dark:shadow-luxury-dark border border-gray-100 dark:border-gray-800 p-4 lg:h-full lg:overflow-y-auto flex flex-col'
      : 'p-0'
    )}>
      {/* Header */}
      {variant === 'hero' && (
        <div className="flex items-start justify-between mb-3 pb-3 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="font-display text-[17px] font-semibold text-obsidian-950 dark:text-white leading-tight">
              {locale === 'fr' ? 'Évaluation gratuite' : 'Free assessment'}
            </h2>
            <p className="text-[11px] text-obsidian-400 mt-0.5">
              {locale === 'fr' ? 'Réponse sous 24h garantie' : 'Response within 24h guaranteed'}
            </p>
          </div>
          <div className="flex items-center gap-0.5 mt-0.5">
            {[1,2,3,4,5].map(i => <Star key={i} size={11} className="text-gold-400 fill-gold-400" />)}
          </div>
        </div>
      )}

      {/* Champs */}
      <form onSubmit={handleSubmit(onSubmit)} className={cn(variant === 'hero' ? 'flex flex-col gap-3' : '')}>
        {rows}

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-xs">
            <AlertCircle size={13} /> {error}
          </div>
        )}

        <button type="submit" disabled={isLoading}
          className="w-full mt-1 py-2.5 rounded-full bg-obsidian-950 dark:bg-white text-white dark:text-obsidian-950 text-sm font-semibold tracking-wide hover:bg-gold-600 dark:hover:bg-gold-400 dark:hover:text-white disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? <><Loader2 size={14} className="animate-spin" />{t('submitting')}</> : btnLabel}
        </button>
      </form>
    </div>
  )
}
