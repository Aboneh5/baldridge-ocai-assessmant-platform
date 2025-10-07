import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashIP, getClientIP } from '@/lib/security'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { demographics, nowScores, preferredScores, userId, consentGiven } = body

    // Verify survey exists and is open
    const survey = await prisma.survey.findUnique({
      where: { id },
      include: { organization: true },
    })

    if (!survey) {
      return NextResponse.json(
        { error: 'Survey not found' },
        { status: 404 }
      )
    }

    if (survey.status !== 'OPEN') {
      return NextResponse.json(
        { error: 'Survey is not currently open' },
        { status: 403 }
      )
    }

    // Hash the user's IP for privacy
    const clientIP = getClientIP(request)
    const ipHash = hashIP(clientIP)

    // Create the response
    const response = await prisma.response.create({
      data: {
        surveyId: id,
        userId: userId || null,
        demographics: demographics || {},
        nowScores,
        preferredScores,
        ipHash,
        consentGiven: consentGiven || false,
        consentTimestamp: consentGiven ? new Date() : null,
        consentVersion: survey.organization?.consentVersion || '1.0',
      },
    })

    return NextResponse.json({
      success: true,
      responseId: response.id,
    })
  } catch (error) {
    console.error('Error submitting response:', error)
    return NextResponse.json(
      { error: 'Failed to submit response' },
      { status: 500 }
    )
  }
}
