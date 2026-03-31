import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/api-auth'

export async function GET(req: NextRequest) {
  if (!await isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [
    totalLeads,
    newLeads,
    contactedLeads,
    closedLeads,
    recentLeads,
    totalServices,
    totalTestimonials,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: 'new' } }),
    prisma.lead.count({ where: { status: 'contacted' } }),
    prisma.lead.count({ where: { status: 'closed' } }),
    prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.service.count({ where: { active: true } }),
    prisma.testimonial.count({ where: { active: true } }),
  ])

  return NextResponse.json({
    leads: { total: totalLeads, new: newLeads, contacted: contactedLeads, closed: closedLeads },
    recent: recentLeads,
    services: totalServices,
    testimonials: totalTestimonials,
  })
}
