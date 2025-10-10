import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/get-user-id';

// Generate unique assessment ID for organization
async function generateAssessmentId(organizationId: string | null): Promise<string> {
  const year = new Date().getFullYear();
  const orgPrefix = organizationId ? organizationId.substring(0, 6).toUpperCase() : 'INDV';

  // Count existing submissions for this organization this year
  const startOfYear = new Date(year, 0, 1);
  const count = await prisma.baldrigeSubmission.count({
    where: {
      organizationId: organizationId,
      createdAt: {
        gte: startOfYear,
      },
    },
  });

  const sequenceNumber = String(count + 1).padStart(3, '0');
  return `BLD-${orgPrefix}-${year}-${sequenceNumber}`;
}

// POST /api/baldrige/submit
// Submit completed Baldrige assessment
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Authentication required',
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { surveyId } = body;

    // Normalize surveyId to null if undefined or empty string
    const normalizedSurveyId = surveyId || null;

    // Get total question count (ALL questions including Organizational Profile)
    const totalQuestions = await prisma.baldrigeQuestion.count();

    // Get user's answered questions count with non-empty responses
    const answeredQuestions = await prisma.baldrigeResponse.count({
      where: {
        userId: userId,
        surveyId: normalizedSurveyId,
        responseText: {
          not: '',
        },
      },
    });

    console.log(
      `User ${userId} attempting submission: ${answeredQuestions}/${totalQuestions} questions answered`
    );

    if (answeredQuestions < totalQuestions) {
      return NextResponse.json(
        {
          success: false,
          message: `Assessment incomplete. Please answer all questions before submitting. ${answeredQuestions}/${totalQuestions} questions completed.`,
          data: {
            answeredQuestions,
            totalQuestions,
            remainingQuestions: totalQuestions - answeredQuestions,
          },
        },
        { status: 400 }
      );
    }

    // Get user details with organization
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        organizationId: true,
        accessKeyUsed: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    // Generate unique assessment ID
    const assessmentId = await generateAssessmentId(user.organizationId);

    // Create submission record
    const submission = await prisma.baldrigeSubmission.create({
      data: {
        assessmentId,
        userId: user.id,
        organizationId: user.organizationId,
        surveyId: normalizedSurveyId,
        accessKey: user.accessKeyUsed,
        submittedAt: new Date(),
        isCompleted: true,
        totalQuestions,
        answeredQuestions,
        metadata: {
          userName: user.name,
          userEmail: user.email,
          submissionTimestamp: new Date().toISOString(),
        },
      },
    });

    // Mark assessment as completed
    const existingProgress = await prisma.baldrigeProgress.findFirst({
      where: {
        userId: userId,
        surveyId: normalizedSurveyId,
      },
    });

    if (existingProgress) {
      await prisma.baldrigeProgress.update({
        where: { id: existingProgress.id },
        data: {
          isCompleted: true,
          completedAt: new Date(),
        },
      });
    } else {
      await prisma.baldrigeProgress.create({
        data: {
          userId: userId,
          surveyId: normalizedSurveyId,
          completedQuestions: [],
          isCompleted: true,
          completedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message:
        'Thank you for completing the Baldrige Excellence Framework Assessment! Your responses have been successfully submitted.',
      data: {
        submissionId: submission.id,
        assessmentId: submission.assessmentId,
        submittedAt: submission.submittedAt,
        totalQuestions,
        answeredQuestions,
        completionRate: 100,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error('Error submitting assessment:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit assessment',
      },
      { status: 500 }
    );
  }
}
