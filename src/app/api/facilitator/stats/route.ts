import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      )
    }

    // Get stats for this organization only
    const [
      totalSurveys,
      totalResponses,
      activeAccessKeys,
      ocaiCount,
      baldrigeCount,
    ] = await Promise.all([
      prisma.survey.count({ where: { organizationId } }),
      prisma.response.count({
        where: {
          survey: {
            organizationId,
          },
        },
      }),
      prisma.accessKey.count({
        where: {
          organizationId,
          isActive: true,
        },
      }),
      prisma.survey.count({
        where: {
          organizationId,
          assessmentType: 'OCAI',
        },
      }),
      // Baldrige count - get submissions for this organization
      prisma.baldrigeSubmission.count({
        where: {
          organizationId,
        },
      }),
    ])

    return NextResponse.json({
      totalSurveys: totalSurveys + baldrigeCount, // Include Baldrige submissions
      totalResponses: totalResponses + baldrigeCount, // Include Baldrige submissions
      activeAccessKeys,
      assessmentBreakdown: {
        OCAI: ocaiCount,
        BALDRIGE: baldrigeCount,
      },
    })
  } catch (error) {
    console.error('Error fetching facilitator stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
