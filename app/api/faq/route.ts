import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/api-auth'

export async function GET(req: NextRequest) {
  try {
    const authenticated = await isAuthenticated(req)
    const faqs = await prisma.fAQ.findMany({
      ...(authenticated ? {} : { where: { active: true } }),
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(faqs)
  } catch (error) {
    console.error('FAQ fetch error:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!await isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { questionFr, questionEn, answerFr, answerEn, order, active } = body
    if (!questionFr && !questionEn) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 })
    }
    const faq = await prisma.fAQ.create({
      data: {
        questionFr: questionFr || '',
        questionEn: questionEn || '',
        answerFr: answerFr || '',
        answerEn: answerEn || '',
        order: order ?? 0,
        active: active !== false,
      },
    })
    return NextResponse.json(faq, { status: 201 })
  } catch (error) {
    console.error('FAQ POST error:', error)
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!await isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { id, questionFr, questionEn, answerFr, answerEn, order, active } = body
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

    const faq = await prisma.fAQ.update({
      where: { id },
      data: {
        ...(questionFr !== undefined && { questionFr }),
        ...(questionEn !== undefined && { questionEn }),
        ...(answerFr !== undefined && { answerFr }),
        ...(answerEn !== undefined && { answerEn }),
        ...(order !== undefined && { order }),
        ...(active !== undefined && { active }),
      },
    })
    return NextResponse.json(faq)
  } catch (error) {
    console.error('FAQ PUT error:', error)
    return NextResponse.json({ error: 'Failed to update FAQ' }, { status: 500 })
  }
}
