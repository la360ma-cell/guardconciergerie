'use client'

import React from 'react'

interface FloatingWhatsAppProps {
  settings: Record<string, string>
}

export default function FloatingWhatsApp({ settings }: FloatingWhatsAppProps) {
  const enabled = settings.whatsapp_button_enabled === 'true'
  const phone = (settings.contact_whatsapp || '').replace(/[^0-9]/g, '')
  const message = settings.whatsapp_button_message || ''

  // Need at least 7 digits for a valid phone number
  if (!enabled || phone.length < 7) return null

  const href = `https://wa.me/${phone}${message ? `?text=${encodeURIComponent(message)}` : ''}`

  // ── Position ──────────────────────────────────────────────────────────────
  const position = settings.whatsapp_button_position || 'bottom-right'
  const posStyles: Record<string, React.CSSProperties> = {
    'bottom-right':  { position: 'fixed', bottom: 24, right: 24 },
    'bottom-left':   { position: 'fixed', bottom: 24, left: 24 },
    'bottom-center': { position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)' },
  }
  const posStyle = posStyles[position] || posStyles['bottom-right']

  // ── Shape ─────────────────────────────────────────────────────────────────
  const shape = settings.whatsapp_button_shape || 'circle'
  const borderRadius = { circle: '9999px', rounded: '18px', square: '8px' }[shape] || '9999px'

  // ── Size ──────────────────────────────────────────────────────────────────
  const size = settings.whatsapp_button_size || 'md'
  const { btnSize, iconSize } = (
    size === 'sm' ? { btnSize: 44,  iconSize: 20 } :
    size === 'lg' ? { btnSize: 64,  iconSize: 34 } :
                   { btnSize: 56,  iconSize: 28 }
  )

  // ── Animation ─────────────────────────────────────────────────────────────
  const animation = settings.whatsapp_button_animation || 'none'
  const animClass = (
    animation === 'pulse'  ? 'animate-pulse' :
    animation === 'bounce' ? 'animate-bounce' : ''
  )

  // ── Colors ────────────────────────────────────────────────────────────────
  const bgColor   = settings.whatsapp_button_color      || '#25D366'
  const iconColor = settings.whatsapp_button_text_color || '#FFFFFF'

  // ── Label ─────────────────────────────────────────────────────────────────
  const showLabel = settings.whatsapp_button_label === 'true'
  const labelText = settings.whatsapp_button_label_text || 'Contactez-nous'
  const isLeft    = position === 'bottom-left'

  return (
    <div
      className="z-50 flex items-center gap-2"
      style={{ ...posStyle, zIndex: 50, flexDirection: isLeft ? 'row-reverse' : 'row' }}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className={`flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-200 hover:scale-110 ${animClass}`}
        style={{
          backgroundColor: bgColor,
          borderRadius,
          width: btnSize,
          height: btnSize,
          flexShrink: 0,
        }}
      >
        <svg viewBox="0 0 24 24" fill={iconColor} width={iconSize} height={iconSize}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
      {showLabel && (
        <span
          className="px-4 py-2 text-sm font-medium shadow-lg whitespace-nowrap"
          style={{ backgroundColor: bgColor, color: iconColor, borderRadius }}
        >
          {labelText}
        </span>
      )}
    </div>
  )
}
