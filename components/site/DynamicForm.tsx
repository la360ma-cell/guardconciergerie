'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, CheckCircle, AlertCircle, Image, Loader2 } from 'lucide-react'
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

export default function DynamicForm({ locale, formFields, settings, variant = 'section' }: DynamicFormProps) {
  const t = useTranslations('form')
  const [files, setFiles] = useState<File[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Stable object URLs for file previews — revoke on cleanup
  const previewUrlsRef = useRef<string[]>([])
  const previewUrls = useMemo(() => {
    // Revoke old URLs
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

      // Map field values
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value as string)
      })

      // Handle city: if otherCity is provided, use it
      if (data.otherCity) formData.set('city', data.otherCity)

      // Append photos
      files.forEach(file => formData.append('photos', file))

      const res = await fetch('/api/leads', {
        method: 'POST',
        body: formData,
      })

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

  return (
    <div className={cn(
      'rounded-2xl',
      variant === 'hero'
        ? 'bg-white dark:bg-obsidian-900 shadow-luxury dark:shadow-luxury-dark border border-gray-100 dark:border-gray-800 p-6 lg:p-8 h-full overflow-y-auto flex flex-col'
        : 'p-0'
    )}>
      {variant === 'hero' && (
        <div className="mb-6">
          <h2 className="font-display text-xl font-medium text-obsidian-950 dark:text-white">
            {locale === 'fr' ? 'Évaluation gratuite' : 'Free assessment'}
          </h2>
          <p className="text-sm text-obsidian-400 dark:text-obsidian-400 mt-1">
            {locale === 'fr' ? 'Réponse sous 24h garantie' : 'Response within 24h guaranteed'}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-4", variant === 'hero' ? "flex-1 min-h-0 overflow-y-auto pr-1" : "")}>
        {formFields.map(field => {
          if (!isFieldVisible(field)) return null

          const label = locale === 'fr' ? field.labelFr : field.labelEn
          const placeholder = locale === 'fr' ? field.placeholder_fr : field.placeholder_en
          const isRequired = field.required

          let options: Array<{ valueFr: string; valueEn: string }> = []
          if (field.options) {
            try {
              options = JSON.parse(field.options)
            } catch {}
          }

          if (field.type === 'file') {
            return (
              <div key={field.name}>
                <label className="block text-sm font-medium text-obsidian-700 dark:text-obsidian-200 mb-2">
                  {label}
                </label>
                <div
                  {...getRootProps()}
                  className={cn(
                    'border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200',
                    isDragActive
                      ? 'border-gold-500 bg-gold-50 dark:bg-gold-900/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gold-400 dark:hover:border-gold-600',
                    files.length >= 10 && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <input {...getInputProps()} />
                  <Upload size={20} className="mx-auto mb-2 text-obsidian-400 dark:text-obsidian-500" />
                  <p className="text-sm text-obsidian-500 dark:text-obsidian-400">{t('upload_text')}</p>
                  <p className="text-xs text-obsidian-400 dark:text-obsidian-500 mt-1">{t('upload_formats')}</p>
                </div>
                {files.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {files.map((file, i) => (
                      <div key={i} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                          <img
                            src={previewUrls[i]}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={10} />
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
                <label className="block text-sm font-medium text-obsidian-700 dark:text-obsidian-200 mb-1.5">
                  {label} {isRequired && <span className="text-gold-500">*</span>}
                </label>
                <select
                  {...register(field.name, { required: isRequired ? t('required') : false })}
                  className="luxury-input text-sm bg-white dark:bg-obsidian-950 text-obsidian-900 dark:text-white"
                >
                  <option value="">{locale === 'fr' ? 'Sélectionner...' : 'Select...'}</option>
                  {options.map((opt, i) => (
                    <option key={i} value={locale === 'fr' ? opt.valueFr : opt.valueEn}>
                      {locale === 'fr' ? opt.valueFr : opt.valueEn}
                    </option>
                  ))}
                </select>
                {errors[field.name] && (
                  <p className="text-red-500 text-xs mt-1">{errors[field.name]?.message as string}</p>
                )}
              </div>
            )
          }

          if (field.type === 'textarea') {
            return (
              <div key={field.name}>
                <label className="block text-sm font-medium text-obsidian-700 dark:text-obsidian-200 mb-1.5">
                  {label} {isRequired && <span className="text-gold-500">*</span>}
                </label>
                <textarea
                  {...register(field.name, { required: isRequired ? t('required') : false })}
                  placeholder={placeholder || ''}
                  rows={3}
                  className="luxury-input resize-none text-sm"
                />
                {errors[field.name] && (
                  <p className="text-red-500 text-xs mt-1">{errors[field.name]?.message as string}</p>
                )}
              </div>
            )
          }

          return (
            <div key={field.name}>
              <label className="block text-sm font-medium text-obsidian-700 dark:text-obsidian-200 mb-1.5">
                {label} {isRequired && <span className="text-gold-500">*</span>}
              </label>
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
                className="luxury-input text-sm"
              />
              {errors[field.name] && (
                <p className="text-red-500 text-xs mt-1">{errors[field.name]?.message as string}</p>
              )}
            </div>
          )
        })}

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            'btn-primary w-full py-4 rounded-full text-sm font-semibold tracking-wide transition-all duration-200',
            'bg-obsidian-950 dark:bg-white text-white dark:text-obsidian-950',
            'hover:bg-gold-600 dark:hover:bg-gold-400 dark:hover:text-white',
            'disabled:opacity-60 disabled:cursor-not-allowed',
            'flex items-center justify-center gap-2'
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
