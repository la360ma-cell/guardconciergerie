import nodemailer from 'nodemailer'

interface LeadEmailData {
  name: string
  phone: string
  city: string
  propertyType: string
  message?: string
  photosCount?: number
}

// Escape HTML to prevent injection in email templates
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

async function getEmailConfig() {
  try {
    const { prisma } = await import('@/lib/prisma')
    const rows = await prisma.siteSettings.findMany({ where: { category: 'notifications' } })
    const m = Object.fromEntries(rows.map(r => [r.key, r.value]))
    return {
      host: m.smtp_host || process.env.SMTP_HOST || '',
      port: parseInt(m.smtp_port || process.env.SMTP_PORT || '587', 10),
      user: m.smtp_user || process.env.SMTP_USER || '',
      pass: m.smtp_pass || process.env.SMTP_PASS || '',
      from: m.smtp_from || process.env.SMTP_FROM || 'Guard Conciergerie <noreply@guardconciergerie.com>',
      to: m.notification_email || process.env.NOTIFICATION_EMAIL || '',
    }
  } catch {
    return {
      host: process.env.SMTP_HOST || '',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
      from: process.env.SMTP_FROM || 'Guard Conciergerie <noreply@guardconciergerie.com>',
      to: process.env.NOTIFICATION_EMAIL || '',
    }
  }
}

function buildTransporter(cfg: { host: string; port: number; user: string; pass: string }) {
  if (!cfg.host || !cfg.user || !cfg.pass) return null
  return nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.port === 465,
    auth: { user: cfg.user, pass: cfg.pass },
  })
}

export async function sendLeadNotification(lead: LeadEmailData) {
  const cfg = await getEmailConfig()
  const transporter = buildTransporter(cfg)

  if (!transporter || !cfg.to) {
    console.log('[email] SMTP not configured — skipping lead notification')
    return
  }

  await transporter.sendMail({
    from: cfg.from,
    to: cfg.to,
    subject: `🏡 Nouveau lead — ${lead.name} (${lead.propertyType} à ${lead.city})`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body{font-family:'Helvetica Neue',Arial,sans-serif;background:#f5f5f5;margin:0;padding:20px}
            .container{max-width:600px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.1)}
            .header{background:#0a0a0a;color:white;padding:30px;text-align:center}
            .header h1{margin:0;font-size:22px;font-weight:300;letter-spacing:2px}
            .header p{margin:5px 0 0;color:#ffaa00;font-size:12px;letter-spacing:3px;text-transform:uppercase}
            .body{padding:30px}
            .badge{display:inline-block;background:#ffaa00;color:white;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;margin-bottom:20px}
            .field{margin-bottom:16px;padding:14px 16px;background:#f9f9f9;border-radius:8px;border-left:3px solid #ffaa00}
            .field-label{font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px}
            .field-value{font-size:15px;color:#0a0a0a;font-weight:500}
            .footer{background:#f9f9f9;padding:20px 30px;text-align:center;font-size:12px;color:#888}
            .cta{display:inline-block;background:#0a0a0a;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;margin-top:20px}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <p>GUARD CONCIERGERIE</p>
              <h1>Nouveau Lead Reçu</h1>
            </div>
            <div class="body">
              <div class="badge">🔔 Nouvelle demande</div>
              <div class="field"><div class="field-label">Nom</div><div class="field-value">${escapeHtml(lead.name)}</div></div>
              <div class="field"><div class="field-label">Téléphone</div><div class="field-value">${escapeHtml(lead.phone)}</div></div>
              <div class="field"><div class="field-label">Ville</div><div class="field-value">${escapeHtml(lead.city)}</div></div>
              <div class="field"><div class="field-label">Type de bien</div><div class="field-value">${escapeHtml(lead.propertyType)}</div></div>
              ${lead.message ? `<div class="field"><div class="field-label">Message</div><div class="field-value">${escapeHtml(lead.message)}</div></div>` : ''}
              ${lead.photosCount ? `<div class="field"><div class="field-label">Photos</div><div class="field-value">${lead.photosCount} photo(s)</div></div>` : ''}
              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/leads" class="cta">Voir dans l'admin →</a>
            </div>
            <div class="footer">Guard Conciergerie Luxury Care • Marrakech, Maroc<br>Email automatique.</div>
          </div>
        </body>
      </html>
    `,
  })
}

export async function sendConfirmationEmail(email: string, name: string, locale: string = 'fr') {
  const cfg = await getEmailConfig()
  const transporter = buildTransporter(cfg)
  if (!transporter) return

  const subject = locale === 'en'
    ? 'Your request has been received — Guard Conciergerie'
    : 'Votre demande a bien été reçue — Guard Conciergerie'

  const safeName = escapeHtml(name)
  const body = locale === 'en'
    ? `Hello ${safeName},<br><br>We have received your request. Our team will contact you within <strong>24 hours</strong>.<br><br>Best regards,<br><strong>The Guard Conciergerie Team</strong>`
    : `Bonjour ${safeName},<br><br>Nous avons bien reçu votre demande. Notre équipe vous contactera dans les <strong>24 heures</strong>.<br><br>Cordialement,<br><strong>L'équipe Guard Conciergerie</strong>`

  await transporter.sendMail({ from: cfg.from, to: email, subject, html: body })
}
