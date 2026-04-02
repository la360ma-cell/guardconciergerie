'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, CheckCircle, AlertCircle, Image, Loader2, Phone, User, MapPin, Home, Star } from 'lucide-react'
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

// Champs qui doivent être groupés en paires (côte à côte)
// Format: [fieldName1, fieldName2] → s'affichent sur la même ligne
const FIELD_PAIRS: string[][] = [
  ['phone', 'fullName'],      // Téléphone | Nom complet
  ['city', 'propertyType'],   // Ville | Type de bien
]

// Icônes par champ
const FIELD_ICONS: Record<string, any> = {
  fullName: User,
  phone: Phone,
  city: MapPin,
  propertyType: Home,
}

export default function DynamicForm({ locale, formFields, settings, variant = 'section' }: DynamicFormProps) {
  const t = useTranslations('form')
  const [files, setFiles] = useState<File[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const previewUrlsRef = useRef<string[]>([])
  const previewUrls = useMemo(() => {
    previewUrlsRef.current.forEach(url => URL.revokeObjectURL(url))
    const urls = files.map(f => URL.createObjectURL(f))
    previewUrlsRef.current = urls
    return urls
  }, [files])
  useEffect(() => {
    return () => { previewUrlsRef.current.forEach(url => URL.revokeObjectURL(url)) }
  }, [])
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm()
  const watchedValues = watch()

  const isFieldVisible = (field: FormField): boolean => {
    if (!field.conditionalOn || !field.conditionalValue) return true
    return watchedValues[field.conditionalOn] === field.conditionalValue
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const remaining = 10 - files.length
    const newFiles = acceptedFiles.slice(0, remaining)
    setFiles(prev => [...prev, ...newFiles])
  }, [files.length])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 10,
    disabled: files.length >= 10,
  })

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value as string)
      })
      if (data.otherCity) formData.set('city', data.otherCity)
      files.forEach(file => formData.append('photos', file))
      const res = await fetch('/api/leads', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Submit failed')
      setSubmitted(true)
      reset()
      setFiles([])
    } catch {
      setError(t('error'))
    } finally {
      setIsLoading(false)
    }
  }

  const buttonLabel = locale === 'fr'
    ? settings.form_button_fr || t('submit')
    : settings.form_button_en || t('submit')

  const confirmationTitle = locale === 'fr'
    ? settings.form_confirmation_fr?.split('.')[0] || t('success_title')
    : settings.form_confirmation_en?.split('.')[0] || t('success_title')

  const confirmationText = locale === 'fr'
    ? settings.form_confirmation_fr || t('success_text')
    : settings.form_confirmation_en || t('success_text')

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          'rounded-2xl p-8 text-center',
          variant === 'hero'
            ? 'bg-white dark:bg-obsidian-900 shadow-luxury dark:shadow-luxury-dark border border-gray-100 dark:border-gray-800'
            : 'bg-obsidian-50 dark:bg-obsidian-900'
        )}
      >
        <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-500" />
        </div>
        <h3 className="font-display text-2xl font-medium text-obsidian-950 dark:text-white mb-2">
          {confirmationTitle}
        </h3>
        <p className="text-obsidian-500 dark:text-obsidian-300 text-sm">
          {confirmationText}
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 text-sm text-gold-600 dark:text-gold-400 hover:underline"
        >
          {locale === 'fr' ? 'Nouvelle demande' : 'New request'}
        </button>
      </motion.div>
    )
  }

  // ── Grouper les champs selon FIELD_PAIRS ─────────────────────────────────
  const visibleFields = formFields.filter(f => isFieldVisible(f))
  const renderedNames = new Set<string>()

  const renderField = (field: FormField, compact = false) => {
    const label = locale === 'fr' ? field.labelFr : field.labelEn
    const placeholder = locale === 'fr' ? field.placeholder_fr : field.placeholder_en
    const isRequired = field.required
    const Icon = FIELD_ICONS[field.name]

    let options: Array<{ valueFr: string; valueEn: string }> = []
    if (field.options) {
      try { options = JSON.parse(field.options) } catch {}
    }

    if (field.type === 'file') {
      return (
        <div key={field.name} className="col-span-2">
          <label className="block text-xs font-semibold text-obsidian-500 dark:text-obsidian-400 uppercase tracking-wider mb-1.5">
            {label}
          </label>
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all duration-200',
              isDragActive
                ? 'border-gold-500 bg-gold-50 dark:bg-gold-900/10'
                : 'border-gray-200 dark:border-gray-700 hover:border-gold-400 dark:hover:border-gold-600',
              files.length >= 10 && 'opacity-50 cursor-not-allowed'
            )}
          >
            <input {...getInputProps()} />
            <Upload size={18} className="mx-auto mb-1 text-obsidian-400 dark:text-obsidian-500" />
            <p className="text-xs text-obsidian-500 dark:text-obsidian-400">{t('upload_text')}</p>
            <p className="text-[10px] text-obsidian-400 dark:text-obsidian-500 mt-0.5">{t('upload_formats')}</p>
          </div>
          {files.length > 0 && (
            <div className="mt-2 grid grid-cols-4 gap-1.5">
              {files.map((file, i) => (
                <div key={i} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img src={previewUrls[i]} alt={file.name} className="w-full h-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={8} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }

    if (field.type === 'select') {
      return (
        <div key={field.name}>
          <label className="block text-xs font-semibold text-obsidian-500 dark:text-obsidian-400 uppercase tracking-wider mb-1.5">
            {label} {isRequired && <span className="text-gold-500">*</span>}
          </label>
          <div className="relative">
            {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-400 pointer-events-none z-10" />}
            <select
              {...register(field.name, { required: isRequired ? t('required') : false })}
              className={cn("luxury-input text-sm bg-white dark:bg-obsidian-950 text-obsidian-900 dark:text-white", Icon ? "pl-9" : "")}
            >
              <option value="">{locale === 'fr' ? 'Sélectionner...' : 'Select...'}</option>
              {options.map((opt, i) => (
                <option key={i} value={locale === 'fr' ? opt.valueFr : opt.valueEn}>
                  {locale === 'fr' ? opt.valueFr : opt.valueEn}
                </option>
              ))}
            </select>
          </div>
          {errors[field.name] && (
            <p className="text-red-500 text-[10px] mt-0.5">{errors[field.name]?.message as string}</p>
          )}
        </div>
      )
    }

    if (field.type === 'textarea') {
      return (
        <div key={field.name} className="col-span-2">
          <label className="block text-xs font-semibold text-obsidian-500 dark:text-obsidian-400 uppercase tracking-wider mb-1.5">
            {label} {isRequired && <span className="text-gold-500">*</span>}
          </label>
          <textarea
            {...register(field.name, { required: isRequired ? t('required') : false })}
            placeholder={placeholder || ''}
            rows={2}
            className="luxury-input resize-none text-sm"
          />
          {errors[field.name] && (
            <p className="text-red-500 text-[10px] mt-0.5">{errors[field.name]?.message as string}</p>
          )}
        </div>
      )
    }

    return (
      <div key={field.name}>
        <label className="block text-xs font-semibold text-obsidian-500 dark:text-obsidian-400 uppercase tracking-wider mb-1.5">
          {label} {isRequired && <span className="text-gold-500">*</span>}
        </label>
        <div className="relative">
          {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-400 pointer-events-none" />}
          <input
            {...register(field.name, {
              required: isRequired ? t('required') : false,
              ...(field.type === 'tel' && {
                pattern: {
                  value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                  message: t('phone_invalid'),
                },
              }),
            })}
            type={field.type}
            placeholder={placeholder || ''}
            className={cn("luxury-input text-sm", Icon ? "pl-9" : "")}
          />
        </div>
        {errors[field.name] && (
          <p className="text-red-500 text-[10px] mt-0.5">{errors[field.name]?.message as string}</p>
        )}
      </div>
    )
  }

  const renderRows = () => {
    const rows: JSX.Element[] = []

    for (const field of visibleFields) {
      if (renderedNames.has(field.name)) continue

      // Chercher si ce champ fait partie d'une paire
      const pair = FIELD_PAIRS.find(p => p.includes(field.name))
      if (pair) {
        const otherName = pair.find(n => n !== field.name)
        const otherField = visibleFields.find(f => f.name === otherName)
        if (otherField && !renderedNames.has(otherField.name)) {
          // Rendre les deux en grille 2 colonnes
          // Respecter l'ordre de la paire (pair[0] d'abord)
          const first = visibleFields.find(f => f.name === pair[0])
          const second = visibleFields.find(f => f.name === pair[1])
          if (first && second) {
            renderedNames.add(first.name)
            renderedNames.add(second.name)
            rows.push(
              <div key={`pair-${pair[0]}-${pair[1]}`} className="grid grid-cols-2 gap-2">
                {renderField(first)}
                {renderField(second)}
              </div>
            )
            continue
          }
        }
      }

      // Champ seul (pleine largeur)
      renderedNames.add(field.name)
      rows.push(
        <div key={field.name}>
          {renderField(field)}
        </div>
      )
    }

    return rows
  }

  return (
    <div className={cn(
      'rounded-2xl',
      variant === 'hero'
        ? 'bg-white dark:bg-obsidian-900 shadow-luxury dark:shadow-luxury-dark border border-gray-100 dark:border-gray-800 p-4 lg:h-full lg:overflow-y-auto flex flex-col'
        : 'p-0'
    )}>
      {variant === 'hero' && (
        <div className="mb-3 pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-obsidian-950 dark:text-white">
                {locale === 'fr' ? 'Évaluation gratuite' : 'Free assessment'}
              </h2>
              <p className="text-xs text-obsidian-400 dark:text-obsidian-400 mt-0.5">
                {locale === 'fr' ? 'Réponse sous 24h garantie' : 'Response within 24h guaranteed'}
              </p>
            </div>
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map(i => <Star key={i} size={10} className="text-gold-400 fill-gold-400" />)}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className={cn("", variant === 'hero' ? "flex flex-col gap-2.5" : "")}>
        {renderRows()}

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-xs">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            'btn-primary w-full py-3 rounded-full text-sm font-semibold tracking-wide transition-all duration-200',
            'bg-obsidian-950 dark:bg-white text-white dark:text-obsidian-950',
            'hover:bg-gold-600 dark:hover:bg-gold-400 dark:hover:text-white',
            'disabled:opacity-60 disabled:cursor-not-allowed',
            'flex items-center justify-center gap-2 mt-1'
          )}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {t('submitting')}
            </>
          ) : (
            buttonLabel
          )}
        </button>
      </form>
    </div>
  )
}
