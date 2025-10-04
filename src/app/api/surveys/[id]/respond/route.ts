import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { responseCreateSchema, ocaiScoresSchema } from '@/lib/validations'
import { checkRateLimit, getClientIP, hashIP } from '@/lib/security'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: surveyId } = await params
    const clientIP = getClientIP(request)
    
    // Check rate limiting
    const rateLimit = checkRateLimit(clientIP)
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    // Get survey details
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
      include: { organization: true },
    })

    if (!survey) {
      return NextResponse.json({ error: 'Survey not found' }, { status: 404 })
    }

    // Check if survey is open
    if (survey.status !== 'OPEN') {
      return NextResponse.json({ error: 'Survey is not open' }, { status: 400 })
    }

    // Check if survey is within open/close dates
    const now = new Date()
    if (survey.openAt && now < survey.openAt) {
      return NextResponse.json({ error: 'Survey is not yet open' }, { status: 400 })
    }
    if (survey.closeAt && now > survey.closeAt) {
      return NextResponse.json({ error: 'Survey is closed' }, { status: 400 })
    }

    const body = await request.json()
    const validatedData = responseCreateSchema.parse(body)

    // Validate OCAI scores sum to 100
    const nowScoresValid = ocaiScoresSchema.parse(validatedData.nowScores)
    const preferredScoresValid = ocaiScoresSchema.parse(validatedData.preferredScores)

    // Hash IP for privacy
    const ipHash = hashIP(clientIP)

    // Create response
    const response = await prisma.response.create({
      data: {
        surveyId,
        userId: null, // Anonymous response
        demographics: validatedData.demographics,
        nowScores: nowScoresValid,
        preferredScores: preferredScoresValid,
        ipHash,
      },
    })

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error creating response:', error)
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    })
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }
    
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
