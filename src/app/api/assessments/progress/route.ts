import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Load saved progress
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const credentialEmail = searchParams.get('credentialEmail')
    const surveyId = searchParams.get('surveyId')
    const assessmentType = searchParams.get('assessmentType')

    if (!credentialEmail || !assessmentType) {
      return NextResponse.json(
        { error: 'credentialEmail and assessmentType are required' },
        { status: 400 }
      )
    }

    // Find in-progress response for this user
    const response = await prisma.response.findFirst({
      where: {
        credentialEmail: credentialEmail.toLowerCase().trim(),
        ...(surveyId ? { surveyId } : {}),
        isComplete: false,
        survey: {
          assessmentType: assessmentType === 'OCAI' ? 'OCAI' : 'BALDRIGE'
        }
      },
      orderBy: {
        lastSavedAt: 'desc'
      }
    })

    if (!response) {
      return NextResponse.json({
        hasProgress: false,
        progress: null
      })
    }

    return NextResponse.json({
      hasProgress: true,
      progress: {
        responseId: response.id,
        surveyId: response.surveyId,
        progressData: response.progressData,
        lastSavedAt: response.lastSavedAt
      }
    })

  } catch (error) {
    console.error('Error loading progress:', error)
    return NextResponse.json(
      { error: 'Failed to load progress' },
      { status: 500 }
    )
  }
}

// POST - Save progress
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      credentialEmail,
      surveyId,
      progressData,
      demographics,
      nowScores,
      preferredScores,
      isComplete,
      ipHash
    } = body

    if (!credentialEmail || !surveyId) {
      return NextResponse.json(
        { error: 'credentialEmail and surveyId are required' },
        { status: 400 }
      )
    }

    // Check if response already exists
    let response = await prisma.response.findFirst({
      where: {
        credentialEmail: credentialEmail.toLowerCase().trim(),
        surveyId,
        isComplete: false
      }
    })

    const responseData = {
      credentialEmail: credentialEmail.toLowerCase().trim(),
      surveyId,
      demographics: demographics || {},
      nowScores: nowScores || {},
      preferredScores: preferredScores || {},
      progressData: progressData || {},
      isComplete: isComplete || false,
      lastSavedAt: new Date(),
      ipHash: ipHash || 'unknown',
      consentGiven: true,
      anonymousMode: false
    }

    if (response) {
      // Update existing response
      response = await prisma.response.update({
        where: { id: response.id },
        data: responseData
      })
    } else {
      // Create new response
      response = await prisma.response.create({
        data: responseData
      })
    }

    return NextResponse.json({
      success: true,
      responseId: response.id,
      message: isComplete ? 'Assessment completed' : 'Progress saved'
    })

  } catch (error) {
    console.error('Error saving progress:', error)
    return NextResponse.json(
      { error: 'Failed to save progress' },
      { status: 500 }
    )
  }
}

